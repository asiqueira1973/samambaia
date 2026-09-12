const { withAppBuildGradle } = require('expo/config-plugins');

/**
 * O `expo prebuild` reescreve o android/app/build.gradle e deixa o build de
 * release assinado com a chave de debug, que a Play Store recusa. Este plugin
 * injeta uma signingConfig de release lendo as credenciais das propriedades do
 * Gradle, que ficam fora do repositório (em ~/.gradle/gradle.properties ou em
 * variáveis passadas na linha de comando).
 *
 * Se as propriedades não existirem, o build de release continua usando a chave
 * de debug — útil para testar localmente sem precisar da chave de publicação.
 */
const SIGNING_CONFIG = `
        release {
            if (project.hasProperty('SAMAMBAIA_UPLOAD_STORE_FILE')) {
                storeFile file(SAMAMBAIA_UPLOAD_STORE_FILE)
                storePassword SAMAMBAIA_UPLOAD_STORE_PASSWORD
                keyAlias SAMAMBAIA_UPLOAD_KEY_ALIAS
                keyPassword SAMAMBAIA_UPLOAD_KEY_PASSWORD
            }
        }
`;

module.exports = function withAndroidSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let gradle = config.modResults.contents;

    if (gradle.includes('SAMAMBAIA_UPLOAD_STORE_FILE')) {
      return config;
    }

    // Acrescenta a signingConfig de release logo depois da de debug.
    gradle = gradle.replace(
      /(signingConfigs \{[\s\S]*?\n        \}\n)/,
      `$1${SIGNING_CONFIG}`
    );

    // Faz o buildType de release usar a chave de publicação quando ela existir.
    gradle = gradle.replace(
      /(buildTypes \{[\s\S]*?release \{\n)([\s\S]*?)signingConfig signingConfigs\.debug/,
      `$1$2signingConfig project.hasProperty('SAMAMBAIA_UPLOAD_STORE_FILE') ? signingConfigs.release : signingConfigs.debug`
    );

    config.modResults.contents = gradle;
    return config;
  });
};
