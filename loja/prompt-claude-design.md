# Prompt para o Claude Design

> Cole o texto abaixo no Claude Design e arraste os três arquivos de
> `loja/screenshots/` para os espaços de imagem quando ele pedir.

---

Crie um conjunto de **3 artboards para a App Store**, cada um com exatamente
**1242 × 2688 px** (tamanho de tela de 6,5 polegadas). São as imagens de
divulgação do Samambaia, um app de celular que lembra quais plantas de casa já
foram regadas.

## O que vai em cada artboard

Cada um tem a mesma estrutura: **texto de marketing em cima, screenshot do app
embaixo**. Deixe um espaço de imagem (image slot) para eu arrastar o print.

**Artboard 1 — `01-lista.png`**
- Título: **Quem precisa de água hoje**
- Apoio: Suas plantas em ordem, da mais sedenta para a que pode esperar.

**Artboard 2 — `02-detalhe.png`**
- Título: **Reguei hoje**
- Apoio: Um toque e a próxima rega já fica marcada.

**Artboard 3 — `03-cadastro.png`**
- Título: **Pronto em dez segundos**
- Apoio: Foto, nome e de quantos em quantos dias. Só isso.

## Identidade visual

Use a paleta do próprio app:

| Uso | Cor |
| --- | --- |
| Verde da marca (fundo, destaques) | `#1F6B3B` |
| Verde escuro (variação) | `#16522C` |
| Verde claro (fundo alternativo) | `#EAF3EC` |
| Texto escuro | `#15201A` |
| Texto de apoio | `#6C7A70` |
| Branco | `#FFFFFF` |

Tipografia: **Instrument Sans** (peso 700 nos títulos, 400 ou 500 no apoio),
com `system-ui` como alternativa.

## Regras de composição

- **Fundo:** alterne para dar ritmo na fileira da loja — artboard 1 em verde
  `#1F6B3B` com texto branco, artboard 2 em verde claro `#EAF3EC` com texto
  escuro, artboard 3 em verde `#1F6B3B` de novo. Quem desliza vê a sequência
  inteira, então ela precisa funcionar como conjunto, não só isolada.
- **Texto no topo:** ocupa mais ou menos o primeiro quarto da altura. Título
  em torno de 96 px, apoio em torno de 44 px, com boa entrelinha. Margem
  lateral de 96 px dos dois lados.
- **Screenshot embaixo:** centralizado, ocupando cerca de 78% da largura do
  artboard, com cantos arredondados de aproximadamente 56 px e uma sombra
  suave. Pode sangrar para fora da borda de baixo — dá sensação de
  continuidade e ganha espaço para o texto.
- **Sem moldura de aparelho** (nada de desenho de iPhone em volta): o print já
  é a tela inteira, e a moldura só rouba espaço.
- **Nada de texto perto das bordas.** Deixe pelo menos 64 px livres em volta,
  porque a App Store recorta as pontas em algumas visualizações.
- O título precisa ser legível na miniatura da busca, onde a imagem aparece com
  menos de um terço do tamanho. Se ficar apertado, prefira encurtar o texto a
  diminuir a fonte.

## O tom

O app resolve um incômodo pequeno e concreto: a pessoa tem plantas dentro de
casa e não lembra qual já regou. Nada de linguagem de "bem-estar", "jornada" ou
"conexão com a natureza" — o texto é direto e prático, como o app. Verde e
branco, bastante respiro, sem ilustração decorativa competindo com o print.

O app é gratuito, sem assinatura e sem cobrança dentro dele, e os dados ficam só
no aparelho. Se sobrar espaço no último artboard, cabe uma linha discreta no
rodapé: *De graça. Sem conta, sem nuvem.*
