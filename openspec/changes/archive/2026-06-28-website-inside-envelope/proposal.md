## Why

A interação atual do envelope revela um convite de papel digital, adicionando um passo extra antes que os usuários acessem a lista de presentes do casamento em si. Ao fazer com que o próprio site funcione como o convite dentro do envelope, nós podemos simplificar a experiência do usuário, criando uma transição mágica e contínua diretamente para o conteúdo principal da lista de presentes.

## What Changes

- **BREAKING**: Remover o convite de papel digital (cartão de algodão) do componente `InteractiveEnvelope`.
- Modificar a animação de abertura do envelope para revelar o site principal diretamente.
- O envelope atuará como uma sobreposição que "se abre" e faz uma transição de saída para exibir o site da lista de presentes que está por baixo.
- Ajustar o z-index, a escala e a lógica de transição do envelope para criar um efeito fluido de "desempacotamento" (unboxing) do próprio site.

## Capabilities

### New Capabilities
- `envelope-reveal`: Modificar a interação do envelope para transicionar diretamente para o site principal, substituindo o cartão interno.

### Modified Capabilities

## Impact

- `src/components/InteractiveEnvelope.tsx`: Mudanças significativas na lógica de animação, remoção da interface do cartão interno e ajuste na transição de fechamento/revelação.
- Experiência do Usuário: Os usuários aterrissarão diretamente na lista de presentes após interagirem com o lacre do envelope, reduzindo o atrito e melhorando o fluxo visual.
