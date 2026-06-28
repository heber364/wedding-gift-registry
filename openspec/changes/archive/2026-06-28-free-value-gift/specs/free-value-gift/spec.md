## ADDED Requirements

### Requirement: Interface de Valor Livre
O sistema DEVE prover um componente visual de card injetado fixamente na PRIMEIRA posição do grid de presentes. Ao ser clicado, este card abre um modal permitindo ao usuário selecionar valores predefinidos (R$ 50, R$ 100, R$ 150) ou inserir um valor customizado. O modal também DEVE conter um campo de texto para uma mensagem opcional.

#### Scenario: Abertura do modal
- **WHEN** o usuário clica no card de "Presente com valor livre"
- **THEN** o sistema exibe o modal contendo os botões de valores, campo customizado e campo de mensagem

#### Scenario: Preenchimento de dados
- **WHEN** o usuário seleciona o valor de R$ 100 e digita "Felicidades ao casal!"
- **THEN** o sistema armazena esses dados localmente para o momento da geração do pagamento

### Requirement: Geração de Pagamento via PIX
O sistema DEVE gerar dinamicamente o código PIX Copia e Cola (BR Code) no front-end, incorporando o valor selecionado e a mensagem (no campo TxId ou descrição), sem salvar estado no banco de dados.

#### Scenario: Exibição do código PIX
- **WHEN** o usuário finaliza o preenchimento e escolhe "Pagar via PIX"
- **THEN** o sistema exibe o QR Code e o botão Copia e Cola gerados dinamicamente com o valor e a mensagem exatos

### Requirement: Geração de Pagamento via Mercado Pago
O sistema DEVE gerar dinamicamente um link de checkout do Mercado Pago (Preference) através de uma rota de API (backend), utilizando o valor e repassando a mensagem do usuário, também sem gravar estado no banco de dados.

#### Scenario: Redirecionamento para o Checkout
- **WHEN** o usuário finaliza o preenchimento e escolhe "Pagar com Cartão"
- **THEN** o sistema faz uma requisição para a API local informando o valor e a mensagem, recebe o link de checkout gerado (`init_point`) e redireciona o usuário para o Mercado Pago
