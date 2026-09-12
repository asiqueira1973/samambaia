const { withAppBuildGradle } = require('expo/config-plugins');

/**
 * O `expo prebuild` reescreve o android/app/build.gradle e deixa o build de
 * release assinado com a chave de debug, que a Play Store recusa.
 *
 * Este plugin injeta a signingConfig de release seguindo a mesma convenção dos
 * outros apps Android da Dab Lab: um `keystore.properties` não versionado com
 * os campos storeFile, storePassword, keyAlias e keyPassword.
 *
 * A diferença é onde o arquivo mora. Nos projetos Kotlin ele fica na raiz do
 * projeto Gradle; aqui a pasta android/ é gerada pelo prebuild e some a cada
 * execução, então o arquivo fica um nível acima, na raiz do repositório, onde
 * sobrevive. Sem ele, o release continua usando a chave de debug — o que
 * permite testar o pipeline sem a chave de publicação.
 */
const LOADER = `def keystorePropertiesFile = rootProject.file("../keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
`;

const RELEASE_SIGNING_CONFIG = `
        release {
            if (keystoreProperties['storeFile']) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
`;

const DEBUG_SIGNING = 'signingConfig signingConfigs.debug';
const CONDITIONAL_SIGNING =
  "signingConfig keystoreProperties['storeFile'] ? signingConfigs.release : signingConfigs.debug";

/** Posição de `needle` depois de `from`, ou erro com contexto suficiente para arrumar. */
function requireIndex(text, needle, from, what) {
  const index = text.indexOf(needle, from);
  if (index === -1) {
    throw new Error(
      `[with-android-signing] não encontrei ${what} em app/build.gradle. ` +
        `O template do Expo provavelmente mudou — ajuste o plugin, porque sem ele ` +
        `o build de release sai assinado com a chave de debug e a Play recusa.`
    );
  }
  return index;
}

module.exports = function withAndroidSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let gradle = config.modResults.contents;

    if (gradle.includes('keystore.properties')) {
      return config;
    }

    gradle = `${LOADER}\n${gradle}`;

    // 1. Acrescenta a signingConfig de release logo depois do bloco de debug.
    const signingConfigsIndex = requireIndex(gradle, 'signingConfigs {', 0, 'o bloco signingConfigs');
    const debugConfigEnd = requireIndex(
      gradle,
      "keyPassword 'android'\n        }\n",
      signingConfigsIndex,
      'o fim da signingConfig de debug'
    ) + "keyPassword 'android'\n        }\n".length;
    gradle = gradle.slice(0, debugConfigEnd) + RELEASE_SIGNING_CONFIG + gradle.slice(debugConfigEnd);

    // 2. Faz o buildType de release usar a chave de publicação quando existir.
    //    Busca posicional em vez de regex: o primeiro `release {` do arquivo é o
    //    da signingConfigs acima, e o primeiro `signingConfig signingConfigs.debug`
    //    é o do buildType de debug — os dois alvos errados.
    const buildTypesIndex = requireIndex(gradle, 'buildTypes {', 0, 'o bloco buildTypes');
    const releaseBuildTypeIndex = requireIndex(
      gradle,
      'release {',
      buildTypesIndex,
      'o buildType de release'
    );
    const signingLineIndex = requireIndex(
      gradle,
      DEBUG_SIGNING,
      releaseBuildTypeIndex,
      'a linha de assinatura do buildType de release'
    );
    gradle =
      gradle.slice(0, signingLineIndex) +
      CONDITIONAL_SIGNING +
      gradle.slice(signingLineIndex + DEBUG_SIGNING.length);

    config.modResults.contents = gradle;
    return config;
  });
};
