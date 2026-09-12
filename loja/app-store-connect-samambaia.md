# App Store Connect — conteúdo pronto para colar (Samambaia)

App: **Samambaia** · Bundle ID `com.dablab.samambaia` · versão **1.0.0 (1)**, já enviada.

Este documento sai da especificação do produto que você escreveu e do app como ele
foi de fato implementado (Expo SDK 55, SQLite local, sem backend). Cada campo
abaixo é para copiar e colar — o texto já está no formato que a App Store aceita,
sem markdown, porque os campos dela não renderizam `#` nem `**`.

---

## 1. App Information

| Campo | Valor |
| --- | --- |
| **Nome** | `Samambaia: regar plantas` |
| **Subtítulo** | `Quem precisa de água hoje` |
| **Categoria primária** | Lifestyle |
| **Categoria secundária** | Productivity |
| **Copyright** | `© 2026 Alexandre Siqueira` |
| **Bundle ID** | `com.dablab.samambaia` |

**Sobre o nome:** "Samambaia" sozinho tem 9 caracteres e é mais limpo, mas ninguém
que procure "regar plantas" na busca encontraria o app. O nome é o campo de maior
peso na indexação da Apple, então vale gastar os 24 caracteres. Se preferir a marca
pura, troque para `Samambaia` e mova "regar plantas" para o subtítulo.

**Sobre a categoria:** é uma decisão de posicionamento, não uma regra. Os apps de
cuidado de plantas costumam ficar em **Lifestyle**, que é onde quem procura esse
tipo de coisa navega. Mas a natureza do seu app é lembrete e acompanhamento, o que
o aproxima de **Productivity**. Fui de Lifestyle como primária por descoberta.

---

## 2. Version Information

### Texto promocional (145/170 caracteres)

Este é o único campo que dá para alterar sem enviar build novo — bom para usar em
campanha ou ajuste de mensagem depois.

```
Cadastre cada planta uma vez e diga de quantos em quantos dias ela bebe água. O app avisa às 9h no dia certo. Sem conta, sem nuvem, sem cobrança.
```

### Descrição (1487/4.000 caracteres)

```
Você rega a samambaia da sala e, dois dias depois, já não lembra se regou a da varanda. Aí vem a dúvida de sempre: rego de novo e corro o risco de afogar, ou espero e deixo secar?

O Samambaia existe para acabar com essa dúvida.

Você cadastra cada planta uma vez: uma foto, o nome e de quantos em quantos dias ela bebe água. Pronto. A lista mostra todas as suas plantas em ordem, da que precisa de água hoje até a que ainda tem duas semanas de folga.

No dia em que uma planta precisa ser regada, o app avisa às 9 da manhã. Você rega, abre o app, toca em Reguei hoje, e a próxima data já fica marcada sozinha.

COMO FUNCIONA

- Cadastre a planta com foto, nome e a frequência em dias
- A lista fica sempre ordenada pela mais urgente
- Um toque em Reguei hoje recalcula a próxima rega
- Aviso no celular às 9h do dia certo
- Planta atrasada aparece destacada, para você recuperar o atraso

SEUS DADOS SÃO SEUS

Não tem login. Não tem conta. Não tem nuvem.

Tudo o que você cadastra fica guardado no seu próprio aparelho, inclusive as fotos. O app não tem servidor, não manda nada para lugar nenhum e funciona sem internet.

DE GRAÇA, DE VERDADE

Sem assinatura, sem compra dentro do app e sem anúncio. Tudo está disponível desde o primeiro toque.

PARA QUEM TEM PLANTAS DENTRO DE CASA

Samambaia, jiboia, zamioculca, costela-de-adão, espada-de-são-jorge, suculenta, cacto, orquídea. Qualquer planta que tenha um intervalo de rega serve, porque quem decide o intervalo de cada uma é você.
```

### Keywords (95/100 bytes)

```
rega,jardim,vaso,cuidar,lembrete,horta,suculenta,cacto,orquidea,folhagem,jardinagem,bonsai,muda
```

Sem espaço depois das vírgulas — espaço consome byte à toa. Não repeti nenhuma
palavra que já está no Nome ou no Subtítulo (samambaia, regar, plantas, água,
hoje), porque esses campos já entram na indexação e repetir desperdiça bytes.
Tirei os acentos de "orquídea" pelo mesmo motivo: cada acento custa 2 bytes.

### Notas da versão / What's New (225/4.000 caracteres)

```
Primeira versão do Samambaia.

Cadastre suas plantas com foto, nome e frequência de rega. A lista fica ordenada pela mais urgente e o app avisa às 9h no dia em que cada uma precisa de água. Tudo fica guardado no seu aparelho.
```

---

## 3. App Privacy (questionário)

**Resposta: "Data Not Collected".**

Marque que o app **não coleta nenhum dado**. Isso é verdade e é verificável no
código: não existe servidor, nem chamada de rede, nem SDK de analytics, nem
Crashlytics, nem Firebase. O que o usuário cadastra fica num SQLite dentro do
diretório do app, e as fotos são copiadas para a pasta de documentos do próprio
app.

Atenção a duas armadilhas comuns que **não** se aplicam aqui, mas que costumam
fazer a pessoa marcar coleta por engano:

- **Foto não é coleta.** O app lê uma foto que o usuário escolheu e a copia para
  dentro dele. Ela não é enviada a lugar nenhum. Isso não é "User Content
  coletado".
- **Notificação local não é identificador.** Como não há push remoto, não existe
  token de dispositivo nem nada parecido para declarar.

---

## 4. URLs obrigatórias

| Campo | Valor |
| --- | --- |
| **Support URL** | `https://suportedablab.carrd.co/` |
| **Privacy Policy URL** | o documento do Notion "Política de Privacidade — Aplicativos da Dab Lab" |
| **Marketing URL** | deixar em branco |

### Seção nova para acrescentar ao documento de Política de Privacidade

O texto genérico da Dab Lab fala em Firebase Authentication, Crashlytics/Analytics
e permissões de câmera, galeria e notificações — descrevendo os apps FlutterFlow.
**Boa parte disso não é verdade para o Samambaia**, e deixar assim faria o
documento afirmar uma coleta que não existe, contradizendo o "Data Not Collected"
do questionário. Duas fontes dizendo coisas diferentes sobre o mesmo app é atrito
garantido na revisão.

Acrescente esta seção ao documento, com a mesma numeração dele:

> ## Samambaia
>
> **1. Coleta de Dados**
>
> O Samambaia não coleta nenhum dado. O aplicativo não possui cadastro, login ou
> conta de usuário, e não se comunica com nenhum servidor. Ao contrário do que
> descrevem as seções gerais deste documento, o Samambaia não utiliza Firebase
> Authentication, Crashlytics, Analytics ou qualquer outra ferramenta de
> monitoramento ou análise de uso.
>
> **2. Uso dos Dados**
>
> As informações que você cadastra — nome da planta, frequência de rega, datas de
> rega e a foto de cada planta — existem exclusivamente para que o aplicativo
> mostre sua lista de plantas e calcule quando cada uma precisa de água. Elas não
> são usadas para nenhuma outra finalidade.
>
> **3. Armazenamento e Segurança**
>
> Todas as informações ficam gravadas apenas no seu aparelho, em um banco de dados
> local, e as fotos são copiadas para a área de armazenamento privada do
> aplicativo. Nada é enviado para a internet: o Samambaia funciona integralmente
> sem conexão. Como consequência, ao desinstalar o aplicativo, todos os dados são
> apagados junto e não há como recuperá-los.
>
> **4. Compartilhamento com Terceiros**
>
> Nenhum dado é compartilhado com terceiros, porque nenhum dado sai do seu
> aparelho. O aplicativo não exibe anúncios e não possui compras internas.
>
> **5. Permissões**
>
> O Samambaia solicita três permissões, sempre no momento em que passam a fazer
> sentido, e o aplicativo continua utilizável caso você recuse qualquer uma delas:
>
> - **Câmera** — apenas quando você escolhe fotografar uma planta na hora do
>   cadastro.
> - **Fotos** — apenas quando você escolhe uma imagem já existente na galeria. O
>   aplicativo lê somente a foto que você selecionou e faz uma cópia dela para uso
>   interno.
> - **Notificações** — solicitada ao salvar sua primeira planta, para avisar às 9h
>   do dia em que ela precisa de água. Os avisos são agendados e entregues pelo
>   próprio aparelho, sem envio de notificações remotas.
>
> **6. Contato**
>
> Dúvidas sobre esta política ou sobre o aplicativo: alexandre@dablab.com.br

---

## 5. Pricing and Availability

| Campo | Valor |
| --- | --- |
| **Preço** | Grátis (Tier 0) |
| **Disponibilidade** | All Countries or Regions |
| **In-App Purchases** | Nenhum |

O app é gratuito sem assinatura e sem cobrança interna, conforme a especificação.
Não há nada a cadastrar na aba de In-App Purchases.

---

## 6. App Review Information

| Campo | Valor |
| --- | --- |
| **Sign-in Required** | **Não** (desmarcado) |
| **Contato** | Alexandre Siqueira · alexandre@dablab.com.br |

Não há credencial de teste a fornecer, porque o app não tem conta nem login.

### Notes (2032/4.000 caracteres)

```
O Samambaia é um app para lembrar de regar plantas de casa. Ele não tem login, conta, cadastro nem backend, então não há credencial de teste a fornecer: basta abrir o app e usar.

Pelos itens que costumam gerar dúvida na revisão:

- PRIVACIDADE: o app não coleta dado nenhum. Não há servidor, analytics, crash reporting nem SDK de terceiros que colete informação. Tudo o que o usuário cadastra (nome da planta, frequência de rega, datas e fotos) fica gravado apenas no aparelho, num banco SQLite local. O app funciona integralmente sem internet.
- CONTA: como não existe conta, não se aplicam exclusão de conta, troca de senha nem logout.
- CÂMERA E FOTOS: são usadas somente para o usuário escolher a imagem de uma planta, sempre a partir de um toque dele na área de foto da tela Nova planta. As mensagens de permissão estão no Info.plist, em português, explicando o uso. A foto escolhida é copiada para o diretório do próprio app e nunca sai do aparelho.
- NOTIFICAÇÕES: são apenas locais, agendadas pelo próprio aparelho. Não há push remoto, servidor de notificação nem token. A permissão é pedida no momento em que o usuário salva a primeira planta, que é quando o lembrete passa a fazer sentido. O aviso dispara às 9h do dia em que a planta precisa de água, então não é algo que se possa observar durante a revisão sem esperar a data chegar; o comportamento pode ser conferido mudando a data do aparelho.
- MONETIZAÇÃO: o app é inteiramente gratuito. Não há assinatura, compra dentro do app, paywall, trial nem anúncio. Nenhuma funcionalidade fica bloqueada.
- CONTEÚDO: não há conteúdo gerado por usuário compartilhado com terceiros, chat, rede social nem conteúdo de terceiros embutido.

Como testar em um minuto: toque em + , dê um nome à planta, ajuste a frequência em dias e salve. A planta aparece na lista com a contagem de dias. Abra a planta e toque em Reguei hoje para ver a data da última rega virar hoje e a próxima ser recalculada.

Support website: https://suportedablab.carrd.co/
Contato: alexandre@dablab.com.br
```

---

## 7. App Encryption Documentation

**Resposta: "None of the algorithms mentioned above".**

O app não implementa criptografia nenhuma — na verdade ele nem faz chamada de rede.
Além disso, o `Info.plist` já traz `ITSAppUsesNonExemptEncryption = false`, então é
provável que a App Store Connect nem chegue a fazer a pergunta neste build.

---

## 8. Content Rights

**Resposta: "No, it does not contain, show, or access third-party content".**

Todo o conteúdo visual é próprio: o ícone e o desenho da samambaia foram
desenhados para este app, e a tipografia é a do sistema. As únicas imagens que
aparecem são as fotos que o próprio usuário escolhe.

---

## 9. Classificação etária (Age Rating)

**Expectativa: 4+.** A classificação oficial só sai do questionário da Apple, mas
com estas respostas o resultado deve ser 4+:

- Conteúdo gerado por usuário visível a terceiros: não (nada é compartilhado)
- Rede social, chat ou mensagens: não
- IA generativa: não
- Violência, conteúdo adulto, apostas, álcool, drogas: não
- Acesso irrestrito à web: não

---

## 10. Resultado da checagem de limites

Medido com `scripts/check_limits.py`, não estimado:

| Campo | Medida | Situação |
| --- | --- | --- |
| Nome | 24/30 caracteres | OK |
| Subtítulo | 25/30 caracteres | OK |
| Texto promocional | 145/170 caracteres | OK |
| Descrição | 1487/4.000 caracteres | OK |
| Keywords | 95/100 bytes | OK |
| Notas da versão | 225/4.000 caracteres | OK |
| Notas de revisão | 2032/4.000 caracteres | OK |

---

## 11. O que ainda falta

- **Screenshots.** Estão em `loja/screenshots/` (1242 × 2688) e o prompt para
  montar as imagens de divulgação está em `loja/prompt-claude-design.md`. Vale
  conferir qual tamanho o App Store Connect está exigindo na ficha deste app.
- **Termos de Uso.** Não é necessário: o app não tem conta nem regra de uso além do
  padrão. O "Apple's Standard License Agreement", que já vem preenchido, basta.
