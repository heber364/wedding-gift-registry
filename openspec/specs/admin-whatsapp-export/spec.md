## ADDED Requirements

### Requirement: Admin WhatsApp Export Button
O painel de administração MUST possuir um botão para exportar a lista de presentes atual para a área de transferência, formatada para o WhatsApp.

#### Scenario: Exporting filtered list
- **WHEN** o administrador possui filtros ativos na tabela de presentes e clica no botão de exportar para WhatsApp
- **THEN** o sistema gera um texto formatado em estilo WhatsApp com base APENAS nos presentes filtrados
- **THEN** o sistema copia o texto para a área de transferência
- **THEN** o sistema exibe um Toast de sucesso informando que a cópia foi realizada

### Requirement: Export Format
O texto gerado MUST ser agrupado por categorias de presentes, com o nome do presente em negrito e o link do produto na mesma linha ou na linha seguinte.

#### Scenario: Text generation
- **WHEN** a função de formatação é chamada com a lista de presentes
- **THEN** o texto resultante separa os presentes por categoria
- **THEN** cada presente aparece indicando o nome em negrito (ex: `*Nome* - Link`)
