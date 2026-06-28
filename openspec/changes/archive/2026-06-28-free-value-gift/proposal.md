## Why

Convidados da lista de casamento frequentemente desejam contribuir com um valor personalizado (seja porque não acharam um presente que caiba no orçamento ou preferem dar dinheiro). Fornecer uma opção de contribuição de "valor livre" diretamente no front-end permite que os convidados presenteiem com qualquer quantia usando PIX ou Cartão de Crédito (Mercado Pago), melhorando a flexibilidade da lista e a experiência do convidado sem complicar o modelo de banco de dados atual.

## What Changes

- Adicionar um card especial de "Presente de Valor Livre" na UI, posicionado fixamente como o primeiro item na grade de presentes, com a mensagem descontraída: "Ficou em dúvida ou não sabe como nos presentear, ou não encontrou nada no seu orçamento, presenteie com seu coração o valor que puder".
- Introduzir um modal com opções de valor predefinidas (R$ 50, R$ 100, R$ 150) e um input para valor customizado.
- Incluir um campo de texto no modal para o convidado escrever uma mensagem pessoal.
- Implementar a geração dinâmica do código PIX (Copia e Cola) no front-end, que inclui o valor escolhido e a mensagem pessoal (como descrição/identificador da transação PIX).
- Implementar uma rota de API no Next.js para criar dinamicamente uma preferência de checkout no Mercado Pago para o valor customizado, repassando a mensagem pessoal.
- Esta funcionalidade operará de forma totalmente stateless (sem estado) em relação ao banco de dados da aplicação; não são necessárias modificações de schema.

## Capabilities

### New Capabilities
- `free-value-gift`: Permite que os convidados escolham ou digitem valores de contribuição personalizados e paguem via códigos PIX gerados dinamicamente ou links de checkout do Mercado Pago, juntamente com uma mensagem pessoal.

### Modified Capabilities

## Impact

- Frontend: Novos componentes de UI para o card de entrada e para o modal de contribuição.
- API: Nova rota de API Next.js para integração com o endpoint de preferências do Mercado Pago.
- Database: Nenhum impacto.
