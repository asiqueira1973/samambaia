# Prompts para o Claude Design — imagens da Google Play

A Play exige três tipos de imagem. **Uma delas já está pronta** e não precisa de
design nenhum; as outras duas têm um prompt cada.

| Imagem | Tamanho | Situação |
| --- | --- | --- |
| Ícone do app | 512 × 512 px, PNG sem transparência | ✅ pronto em `loja/play/icone-512.png` |
| Feature graphic | 1024 × 500 px | prompt 1 abaixo — **obrigatória**, sem ela não dá para publicar |
| Screenshots de celular | 1080 × 1920 px (9:16), mínimo 2 | prompt 2 abaixo; os prints crus estão em `loja/play/screenshots/` |

---

## Prompt 1 — Feature graphic (1024 × 500)

> Cole no Claude Design.

Crie **um artboard de exatamente 1024 × 500 px**: a imagem de capa do Samambaia
na Google Play. Ela aparece no topo da página do app e nas vitrines da loja,
muitas vezes **sem nenhum texto por cima e em miniatura**, então precisa
funcionar sozinha e ser legível pequena.

**Conteúdo**

- Nome do app: **Samambaia**
- Frase de apoio: **Lembra quando cada planta precisa de água**
- Uma folha de samambaia estilizada, em traço branco: caule central com cinco
  pares de folíolos que encurtam conforme sobem, todos com ponta arredondada. É
  a mesma marca do ícone em `loja/play/icone-512.png` — use o arquivo como
  referência de forma.

**Composição**

- Fundo verde `#1F6B3B` inteiro.
- Nome e frase alinhados à esquerda, ocupando cerca de 60% da largura. Nome em
  torno de 96 px, peso 700; frase em torno de 34 px, peso 400, em branco com
  leve transparência.
- A folha à direita, grande, podendo sangrar para fora da borda — dá
  profundidade sem competir com o texto.
- Margem de 64 px em volta. **Nada de conteúdo essencial nas bordas:** a Play
  recorta as laterais em algumas vitrines.
- Sem moldura de celular, sem screenshot dentro, sem selo de "grátis" ou
  qualquer distintivo de loja — a Play rejeita imagens que imitam elementos da
  interface dela.

**Tipografia:** Instrument Sans, com `system-ui` como alternativa.

**Importante:** exporte em PNG ou JPEG **sem canal alpha**. A Play recusa
imagem com transparência.

---

## Prompt 2 — Screenshots da loja (1080 × 1920)

> Cole no Claude Design e arraste os três arquivos de `loja/play/screenshots/`
> para os espaços de imagem.

Crie **3 artboards de exatamente 1080 × 1920 px** (proporção 9:16, que é o que a
Google Play pede para celular). São as imagens da ficha do Samambaia, um app que
lembra quais plantas de casa já foram regadas.

Cada artboard tem a mesma estrutura: **texto de marketing em cima, screenshot do
app embaixo**. Deixe um espaço de imagem (image slot) para eu arrastar o print.

**Artboard 1 — `01-lista.png`**
- Título: **Quem precisa de água hoje**
- Apoio: Suas plantas em ordem, da mais sedenta para a que pode esperar.

**Artboard 2 — `02-detalhe.png`**
- Título: **Reguei hoje**
- Apoio: Um toque e a próxima rega já fica marcada.

**Artboard 3 — `03-cadastro.png`**
- Título: **Pronto em dez segundos**
- Apoio: Foto, nome e de quantos em quantos dias. Só isso.

**Identidade visual**

| Uso | Cor |
| --- | --- |
| Verde da marca | `#1F6B3B` |
| Verde claro | `#EAF3EC` |
| Texto escuro | `#15201A` |
| Texto de apoio | `#6C7A70` |
| Branco | `#FFFFFF` |

Tipografia: **Instrument Sans** (700 nos títulos, 400 ou 500 no apoio), com
`system-ui` como alternativa.

**Composição**

- **Fundo:** alterne para dar ritmo na fileira — artboard 1 em verde `#1F6B3B`
  com texto branco, artboard 2 em verde claro `#EAF3EC` com texto escuro,
  artboard 3 em verde `#1F6B3B` de novo. Na Play as imagens aparecem em carrossel,
  então a sequência precisa funcionar como conjunto.
- **Texto no topo:** primeiro quarto da altura. Título em torno de 72 px, apoio
  em torno de 34 px. Margem lateral de 72 px.
- **Screenshot embaixo:** centralizado, cerca de 78% da largura, cantos
  arredondados de aproximadamente 44 px, sombra suave. Pode sangrar pela borda
  de baixo.
- **Sem moldura de aparelho.** O print já mostra a tela inteira.
- O título tem que ser legível na miniatura da busca. Se ficar apertado,
  encurte o texto em vez de diminuir a fonte.

**Tom:** o app resolve um incômodo pequeno e concreto — a pessoa tem plantas em
casa e não lembra qual já regou. Nada de linguagem de bem-estar ou "conexão com
a natureza". Verde e branco, bastante respiro, sem ilustração decorativa
competindo com o print.
