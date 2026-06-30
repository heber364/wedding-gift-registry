## Context

Atualmente a lista de presentes é exibida sem um critério de ordenação focado na conversão ou na melhor experiência para os convidados. Muitos itens já comprados ou reservados podem aparecer antes de itens disponíveis, forçando o convidado a rolar a tela para achar algo que possa comprar. Além disso, não há uma priorização por valor dos presentes.

## Goals / Non-Goals

**Goals:**
- Priorizar a exibição de presentes disponíveis na lista.
- Mover os presentes já reservados ou comprados para o final da lista.
- Ordenar os presentes disponíveis do maior para o menor preço (ordem decrescente).
- Implementar essas mudanças em uma branch separada como a primeira etapa.

**Non-Goals:**
- Criar novos filtros complexos (ex: filtrar por categorias específicas ou faixas de preço customizadas) nesta etapa.
- Alterar a forma de pagamento ou reserva dos itens.

## Decisions

- **Local da ordenação:** A ordenação pode ser feita no backend (na query ao banco de dados) ou no frontend (ao receber a lista). A escolha dependerá da arquitetura atual. Se a paginação for no backend, a ordenação DEVE ser no backend. Para listas de casamento, que geralmente possuem poucas centenas de itens sem paginação, a ordenação pode até ser feita no frontend se isso simplificar, mas o ideal é que a query de busca já retorne ordenado. A decisão de implementação específica será definida nas tasks.
- **Branch de implementação:** Uma nova branch (ex: `feature/gift-list-sorting`) será criada antes de iniciar o código, conforme requisitado.

## Risks / Trade-offs

- **Risk:** Se a ordenação for feita no frontend e a lista for paginada no backend, os resultados ficarão inconsistentes entre páginas.
  - **Mitigation:** Verificar se a lista utiliza paginação. Se sim, garantir que a ordenação seja implementada na query do banco de dados (backend).
