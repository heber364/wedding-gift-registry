## ADDED Requirements

### Requirement: Revelação do Site pelo Envelope
O sistema DEVE exibir um envelope interativo que, ao ser aberto, transiciona diretamente para o site principal (lista de presentes) sem mostrar um cartão digital intermediário.

#### Scenario: Usuário abre o envelope
- **WHEN** o usuário clica no lacre de cera do envelope
- **THEN** a aba do envelope se abre
- **THEN** o envelope aumenta de escala (zoom) e desaparece suavemente (fade out), revelando o site principal que está por baixo
- **THEN** o cartão de convite de papel digital não é exibido

### Requirement: Memória de Sessão (Session Storage)
O sistema DEVE lembrar se o usuário já visualizou a animação do envelope na sessão atual.

#### Scenario: Usuário recarrega a página
- **WHEN** o usuário recarrega a página após já ter aberto o envelope anteriormente na mesma sessão
- **THEN** o envelope interativo é ignorado e o usuário vai diretamente para o site principal
