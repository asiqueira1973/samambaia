const { withEntitlementsPlist } = require('expo/config-plugins');

/**
 * O plugin do expo-notifications sempre grava `aps-environment` nos
 * entitlements, que é a capability de Push Notifications. O Samambaia só usa
 * notificação local — agendada e entregue pelo próprio aparelho, sem servidor.
 *
 * Manter o entitlement obrigaria a habilitar Push no App ID e declararia na
 * loja uma capacidade que o app não tem. Este plugin roda depois dele e tira a
 * chave, para o `prebuild` não reintroduzi-la a cada execução.
 */
module.exports = function withLocalNotificationsOnly(config) {
  return withEntitlementsPlist(config, (config) => {
    delete config.modResults['aps-environment'];
    return config;
  });
};
