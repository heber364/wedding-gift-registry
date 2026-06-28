## Context

O atual componente `InteractiveEnvelope` mostra um envelope que se abre para revelar um convite de papel digital (um cartão estilizado com textura de algodão) contendo uma mensagem dos noivos. Ao ser fechado, ele define uma flag no sessionStorage e desaparece suavemente (fade out), revelando o site da lista de presentes que está por baixo. Isso cria um processo de duas etapas: visualizar o cartão de convite e depois fechá-lo para ver a lista de presentes. O objetivo é fazer com que o próprio site funcione como o convite dentro do envelope.

## Goals / Non-Goals

**Goals:**
- Criar uma transição mais mágica e contínua onde o envelope se abre para revelar o site real da lista de presentes.
- Remover a etapa intermediária de exibição do cartão de papel digital.
- Garantir que a interação pareça suave, com o envelope efetivamente "abrindo" a janela de visualização (viewport) para o site atrás dele.

**Non-Goals:**
- Redesenhar completamente o site da lista de presentes que está por baixo.
- Alterar a aparência inicial do envelope fechado e do lacre de cera.

## Decisions

- **Remover Cartão Interno**: A `motion.div` que representa o cartão com textura de algodão será removida inteiramente do arquivo `InteractiveEnvelope.tsx`.
- **Animar Envelope para Fora/Escala**: Em vez de apenas desaparecer (fade out) quando for fechado, nós animaremos o próprio envelope. Quando o usuário clicar no lacre de cera:
  - A aba superior se abrirá.
  - O container do envelope pode aumentar de escala (zoom in) ou deslizar para longe para revelar o site por baixo.
  - Dada a estrutura atual, escalar o envelope para cima enquanto ele desaparece (ou enquanto o overlay de fundo desaparece) proporcionará um bom efeito de "desempacotamento" (unboxing).
- **Manter Session Storage**: Manteremos a lógica de `sessionStorage` para que os usuários vejam a animação do envelope apenas uma vez por sessão.

## Risks / Trade-offs

- [Risk] Problemas de desempenho ao animar um overlay fixo de grandes proporções. → Usar apenas animações de transformação (transform) e opacidade (opacity) (aceleradas por hardware).
- [Risk] A transição pode parecer brusca se o site por baixo não estiver totalmente carregado. → O próprio envelope funcionará como uma tela de carregamento inicial. Vamos garantir que a animação de saída seja longa o suficiente para uma revelação suave.
