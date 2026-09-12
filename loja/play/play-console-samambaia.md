# Google Play Console — roteiro de preenchimento (Samambaia)

App: **Samambaia** · pacote `com.dablab.samambaia` · versão **1.0.0 (versionCode 1)**

Siga na ordem. O Play Console é uma interface pesada que trava automação de
navegador, então isto é um roteiro para você clicar — não tem como eu preencher
por você.

Cada campo abaixo é para copiar e colar. Os textos são os mesmos da App Store,
adaptados onde a plataforma muda (limites de caracteres diferentes e o
vocabulário do Android).

---

## Antes de começar: o que precisa estar pronto

| Item | Onde está |
| --- | --- |
| AAB assinado | `~/Desktop/samambaia-1.0.0-build1.aab` ⚠️ **precisa ser refeito** — ver seção 8 |
| Ícone 512 × 512 | `loja/play/icone-512.png` |
| Feature graphic 1024 × 500 | a gerar — prompt em `loja/play/prompt-claude-design-play.md` |
| Screenshots 1080 × 1920 | prints crus em `loja/play/screenshots/`; versões de marketing pelo mesmo prompt |
| Política de Privacidade | documento do Notion + a seção do Samambaia (em `loja/app-store-connect-samambaia.md`) |

---

## 1. Store listing (Ficha da loja)

**Grow users → Store presence → Store listings**, idioma **Português (Brasil)**.

### Nome do app (≤30 caracteres)

```
Samambaia: regar plantas
```

### Descrição breve (≤80 caracteres) — 71 usados

Aparece na busca e na vitrine, antes de qualquer clique. É o campo mais lido da
ficha inteira.

```
Saiba quais plantas precisam de água hoje. Um aviso às 9h no dia certo.
```

### Descrição completa (≤4.000 caracteres) — 1487 usados

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

### Ativos gráficos

| Campo | Arquivo | Regra |
| --- | --- | --- |
| App icon | `loja/play/icone-512.png` | 512 × 512, PNG **sem transparência** |
| Feature graphic | a gerar | 1024 × 500, **obrigatória** |
| Phone screenshots | `loja/play/screenshots/` | mínimo 2, ideal 4 a 8, proporção 9:16 |

Não envie screenshots de tablet: o app é só para celular.

---

## 2. Store settings

| Campo | Valor |
| --- | --- |
| **Categoria do app** | Estilo de vida |
| **Tags** | plantas, jardinagem, lembretes |
| **E-mail de contato** | alexandre@dablab.com.br |
| **Site** | https://suportedablab.carrd.co/ |
| **Telefone** | deixar em branco |

---

## 3. App content — Política de Privacidade

**Policy → App content → Privacy policy.** Cole a URL do documento do Notion.

⚠️ **Antes de colar, o documento precisa ter a seção do Samambaia.** O texto
genérico da Dab Lab afirma que os apps usam Firebase, Crashlytics e Analytics —
nada disso vale para este app, e a contradição com "nenhum dado coletado" da
seção de Data safety é atrito na revisão. A seção pronta para colar está em
`loja/app-store-connect-samambaia.md`, item 4.

---

## 4. App content — App access

**"All functionality is available without special access".**

O app não tem login, conta nem área restrita. Nada a justificar.

---

## 5. App content — Ads

**"No, my app does not contain ads".**

---

## 6. App content — Content rating (questionário IARC)

- **E-mail:** alexandre@dablab.com.br
- **Categoria:** Utilitário, produtividade, comunicação ou outro
- Todas as perguntas de conteúdo: **Não** (violência, sexo, linguagem, drogas,
  apostas, conteúdo assustador)
- **Compartilha localização do usuário:** Não
- **Permite comunicação entre usuários:** Não
- **Permite compra de bens digitais:** Não

Resultado esperado: **Livre / classificação etária mais baixa em todas as
regiões**.

---

## 7. App content — Data safety

Esta é a parte mais importante, e a resposta é curta: **nenhum dado coletado,
nenhum dado compartilhado**.

| Pergunta | Resposta |
| --- | --- |
| O app coleta ou compartilha algum dos tipos de dados obrigatórios? | **Não** |
| Todos os dados são criptografados em trânsito? | não se aplica (nada trafega) |
| Você oferece uma forma de solicitar exclusão de dados? | **Não** — não há dado em servidor; desinstalar apaga tudo |

Duas coisas que costumam fazer a pessoa marcar coleta por engano, e que **não
são coleta**:

- **A foto da planta.** O app copia para dentro dele uma imagem que você
  escolheu, e ela nunca sai do aparelho. Acesso a dado não é coleta.
- **A notificação.** É local, agendada pelo próprio aparelho. Não há token de
  push nem servidor.

Se você marcar "não coleta", a Play mostra o selo de dados na ficha — que é
verdade e ainda pesa a favor do app.

---

## 8. Target audience

- **Faixas etárias:** marcar apenas **18 e mais**
- **Seu app atrai crianças?** Não

Não marque nenhuma faixa abaixo de 13 anos: isso joga o app na política de
Famílias, que exige uma lista extra de requisitos sem nenhum ganho aqui.

---

## 9. Outras declarações

| Declaração | Resposta |
| --- | --- |
| Government apps | Não |
| Financial features | Nenhuma |
| Health apps | Não |
| News app | Não |
| COVID-19 / rastreamento | Não |
| Data safety — dados de saúde | Não |

Cuidado com a de saúde: um app de plantas não é app de saúde, mesmo falando de
"cuidado".

---

## 10. Produção — enviar o AAB

**Test and release → Production → Create new release.**

1. **Play App Signing:** aceite. O Google passa a guardar a chave final de
   assinatura, e a sua `~/keys/samambaia-upload.jks` vira a chave de upload. Se
   um dia perder a chave, dá para pedir a reemissão.
2. **Upload do AAB.**
3. **Release name:** deixe o automático (`1 (1.0.0)`).
4. **Release notes** em pt-BR:

```
Primeira versão do Samambaia.

Cadastre suas plantas com foto, nome e frequência de rega. A lista fica ordenada pela mais urgente e o app avisa às 9h no dia em que cada uma precisa de água. Tudo fica guardado no seu aparelho.
```

5. **Next** → a tela de revisão lista qualquer pendência com link para corrigir.
6. **Start rollout to production** — irreversível, e é você quem confirma. Isso
   manda para a revisão do Google, não publica na hora.

Depois de subir, confira em **Release → Setup → App signing** que a impressão
digital do certificado de upload bate com a sua:

```
SHA256: C0:3C:3F:2C:A2:D0:56:FC:2A:65:01:29:09:A8:56:C9:8F:F7:AB:BC:61:DF:AD:EC:65:60:C7:54:20:1D:EA:91
```

---

## 11. Duas pendências antes de enviar

**O AAB precisa ser refeito.** O que está no Desktop foi gerado antes da
correção das telas cortadas em aparelhos 16:9 — que é justamente o formato de
muito celular Android. Para refazer, é preciso primeiro acertar a senha no
`keystore.properties`.

**Conta pessoal cai no teste fechado.** Se a sua conta de desenvolvedor é
pessoal e foi criada depois de novembro de 2023, o Google exige um teste fechado
com 12 testadores por 14 dias antes de liberar produção. Conta de organização é
isenta. Vale conferir qual é a sua antes de planejar a data de lançamento.
