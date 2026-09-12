# Samambaia

App de celular que lembra quais plantas de casa já foram regadas e quais ainda não.
Um código só, publicado na App Store e na Google Play.

Sem login, sem conta, sem nuvem: tudo fica num banco SQLite dentro do próprio aparelho.
Gratuito, sem assinatura e sem compras dentro do app.

## Telas

| Tela | Arquivo | O que faz |
| --- | --- | --- |
| Lista de Plantas | `src/app/index.tsx` | Todas as plantas, da mais urgente para a menos urgente, com foto, nome e quantos dias faltam |
| Cadastrar Planta | `src/app/nova.tsx` | Foto (câmera ou galeria), nome e frequência de rega em dias |
| Detalhe da Planta | `src/app/planta/[id].tsx` | Foto grande, nome, última rega e o botão "Reguei hoje" |
| Editar Planta | `src/app/editar/[id].tsx` | O mesmo formulário do cadastro, já preenchido com os dados da planta |

## Regras de negócio

- Ao cadastrar, a próxima rega é **hoje + a frequência escolhida**.
- Ao tocar em **"Reguei hoje"**, a última rega passa a ser hoje e a próxima é recalculada.
- Uma notificação local avisa **às 9h do dia em que a planta precisa de água**.
- Ao **mudar a frequência**, a próxima rega é recontada a partir da última rega —
  ou do dia do cadastro, para a planta que nunca foi regada.

As datas são guardadas como data de calendário local (`YYYY-MM-DD`), nunca como
timestamp — assim "faltam 2 dias" continua certo mesmo abrindo o app às 23h59 ou
depois de uma viagem que muda o fuso (`src/lib/dates.ts`).

## Como rodar

Os módulos nativos (SQLite, câmera, notificações, SVG) não rodam no Expo Go:
é preciso um build de desenvolvimento.

```bash
npm install
```

iOS — o CocoaPods do sistema exige locale UTF-8:

```bash
npx expo prebuild --platform ios --clean && (cd ios && LANG=en_US.UTF-8 pod install) && npx expo run:ios
```

Android — precisa do JDK 17 no `org.gradle.java.installations.paths` de `~/.gradle/gradle.properties`:

```bash
npx expo prebuild --platform android --clean && npx expo run:android
```

Verificações:

```bash
npm run typecheck && npm run lint && npx expo-doctor
```

## Estrutura

```
src/
  app/          telas (expo-router: index, nova, planta/[id])
  components/   peças visuais reaproveitadas entre telas
  db/           SQLite: conexão com migrações e o repositório de plantas
  lib/          datas, fotos, notificações, status de rega, action sheet
  store/        estado compartilhado que mantém banco e notificações em sincronia
  theme/        cores e medidas tiradas do mockup
```

`src/store/plants.tsx` é o único ponto por onde passam as alterações: toda
mutação relê o banco (a fonte da verdade) e refaz os agendamentos, para a lista
e as notificações nunca divergirem.

## Design

A paleta e as medidas saíram do mockup em `telas-do-app-samambaia/`
(verde `#1F6B3B`, texto `#15201A`, apoio `#8A9990`, bordas `#E6EAE5`).
A tipografia é a padrão do sistema — San Francisco no iOS, Roboto no Android —
por isso nenhum `fontFamily` é declarado em lugar nenhum.

O ícone do app é a mesma samambaia do mockup, gerada a partir da geometria
original; `src/components/fern-mark.tsx` desenha a mesma folha dentro do app,
usada como espaço reservado quando a planta não tem foto.

## Decisões que foram além do enunciado

- **Excluir planta** (menu `•••` na tela de detalhe). Sem isso não haveria como
  tirar do app uma planta que morreu. Apaga também a foto do aparelho.
- **Editar planta** (menu `•••` na tela de detalhe): nome, foto e frequência.
  Sem isso, corrigir um nome digitado errado exigia excluir e cadastrar de novo,
  perdendo a data da última rega. O formulário é o mesmo do cadastro
  (`src/components/plant-form.tsx`), para as duas telas não divergirem.
  Mudar só o nome ou a foto não mexe no agendamento; mudar a frequência reconta
  a próxima rega a partir da mesma âncora usada no cadastro.
- **Foto é opcional.** Sem foto, a planta aparece com a marca da samambaia.
- **Planta atrasada** ganha texto e cor próprios ("Atrasada há 3 dias", em
  âmbar). O mockup não previa o caso, que acontece sempre que o aviso é ignorado.
- **Última rega começa vazia.** O enunciado só define a data da última rega pelo
  botão "Reguei hoje", então uma planta recém-cadastrada mostra "Ainda não
  regada" — cadastrar não é o mesmo que ter regado.
- **Vários ciclos agendados por planta** (até 8, respeitando o teto de
  notificações do iOS). Se fossem agendados um de cada vez, quem não abrisse o
  app receberia um único aviso e nunca mais.
- **A permissão de notificação é pedida ao salvar a primeira planta**, não na
  abertura do app: é o momento em que o aviso passa a fazer sentido.

## Backlog

Ideias já decididas e ainda não implementadas ficam em [`BACKLOG.md`](BACKLOG.md).

## Fora de escopo nesta versão

Compartilhamento entre pessoas, identificação da planta por foto, loja dentro do
app, login, sincronização em nuvem e versão para tablet.

## Publicação

`ios.supportsTablet: false` e `orientation: portrait` deixam o app só para
telefone no iOS. Na Play Store, a exclusão de tablets é feita no catálogo de
dispositivos do Play Console, não no código.

Permissões desnecessárias que vinham do template do Expo (`RECORD_AUDIO`,
`SYSTEM_ALERT_WINDOW`) estão bloqueadas em `app.json`.

Os builds de loja saem pelo EAS:

```bash
npx eas build --platform all --profile production
```
