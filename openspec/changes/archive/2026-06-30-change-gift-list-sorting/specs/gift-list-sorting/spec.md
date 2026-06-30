## ADDED Requirements

### Requirement: Ordenação por disponibilidade
A lista de presentes DEVE exibir os itens disponíveis antes dos itens reservados ou comprados.

#### Scenario: Visualizando a lista mista
- **WHEN** o convidado acessa a página da lista de presentes que contém itens disponíveis, reservados e comprados
- **THEN** o sistema exibe todos os itens disponíveis primeiro, seguidos pelos itens reservados ou comprados no final da lista

### Requirement: Ordenação secundária por preço
Entre os presentes com o mesmo status de disponibilidade (ex: todos disponíveis), a ordenação DEVE ser do maior preço para o menor preço (decrescente).

#### Scenario: Visualizando itens disponíveis com preços diferentes
- **WHEN** o convidado visualiza a lista de itens disponíveis
- **THEN** o sistema exibe os itens do mais caro para o mais barato

#### Scenario: Visualizando itens reservados ou comprados
- **WHEN** o convidado rola até o final da lista para ver os itens já reservados ou comprados
- **THEN** o sistema também exibe estes itens do mais caro para o mais barato dentro do seu grupo
