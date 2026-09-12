const { withXcodeProject } = require('expo/config-plugins');

/**
 * O `expo prebuild` gera o ios/Samambaia.xcodeproj sem time de assinatura, e
 * sem ele o Xcode recusa qualquer build de dispositivo com "Signing for
 * Samambaia requires a development team". Na linha de comando dá para passar o
 * time como argumento do xcodebuild, mas quem abre o projeto no Xcode esbarra
 * no erro — e, como a pasta ios/ é recriada a cada prebuild, arrumar na
 * interface não sobrevive à próxima execução.
 *
 * Este plugin fixa o time e a assinatura automática no alvo do app, seguindo a
 * mesma ideia do with-android-signing: a configuração de publicação mora no
 * repositório, não na pasta gerada.
 *
 * O Team ID fica em `extra.appleTeamId` no app.json. Ele não é segredo — vai
 * dentro de todo .ipa assinado —, ao contrário das senhas do keystore do
 * Android, que por isso ficam num arquivo fora do Git.
 */
module.exports = function withIosSigning(config) {
  return withXcodeProject(config, (config) => {
    const teamId = config.extra?.appleTeamId;
    if (!teamId) {
      throw new Error(
        '[with-ios-signing] falta `extra.appleTeamId` no app.json. Sem o Team ID ' +
          'o Xcode não assina o app para dispositivo nem para a App Store.'
      );
    }

    const project = config.modResults;

    project.addTargetAttribute('DevelopmentTeam', teamId, project.getFirstTarget());

    // As configurações do alvo do app são as únicas com PRODUCT_NAME; as do
    // projeto não têm, e as dos Pods vivem em outro arquivo.
    const configurations = project.pbxXCBuildConfigurationSection();
    for (const key of Object.keys(configurations)) {
      const buildSettings = configurations[key]?.buildSettings;
      if (!buildSettings || !buildSettings.PRODUCT_NAME) continue;
      buildSettings.DEVELOPMENT_TEAM = teamId;
      buildSettings.CODE_SIGN_STYLE = 'Automatic';
    }

    return config;
  });
};
