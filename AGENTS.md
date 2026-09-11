# Samambaia — notas para agentes

Expo SDK 55 / React Native 0.83. A API do Expo muda bastante entre versões:
consulte `https://docs.expo.dev/versions/v55.0.0/` antes de escrever código, ou
leia os tipos em `node_modules/<pacote>/build/*.d.ts`, que são a fonte mais
confiável para a versão realmente instalada.

**A versão do SDK é intencional.** O `expo-modules-jsi`, presente a partir do
SDK 56, usa `weak let`, que só compila no Xcode 26.2+ (Swift 6.3). O Xcode desta
máquina é o 26.1.1. Ao atualizar o Xcode, dá para subir de SDK com
`npx expo install expo@latest --fix`.

## Armadilhas do ambiente

- `pod install` falha com erro de Unicode se o locale não for UTF-8. Rode
  `LANG=en_US.UTF-8 pod install` — inclusive quando chamado pelo `expo prebuild`.
- O Gradle pede o toolchain Java 17. Os JDKs do Homebrew não ficam onde ele
  procura, então o caminho está declarado em `~/.gradle/gradle.properties`.

## Convenções

- Datas de rega são `YYYY-MM-DD` em horário local, nunca timestamp (`src/lib/dates.ts`).
- Toda alteração de planta passa por `src/store/plants.tsx`, que relê o banco e
  refaz os agendamentos de notificação.
- Nada declara `fontFamily`: a tipografia é a padrão de cada sistema.
- `/ios` e `/android` são gerados pelo `expo prebuild` e não entram no Git.
