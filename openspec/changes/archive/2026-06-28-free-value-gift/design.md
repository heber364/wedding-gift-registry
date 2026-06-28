## Context

Os convidados da lista de casamento frequentemente desejam contribuir com um valor personalizado (seja porque não acharam um presente que caiba no orçamento ou preferem dar dinheiro). Atualmente, a aplicação lida com presentes predefinidos que possuem valor fixo e são reservados unicamente por uma pessoa no banco de dados. Para acomodar doações de valores livres sem precisar reestruturar o modelo de dados atual, esta funcionalidade operará 100% no front-end e via API para integração de pagamentos, de forma totalmente "stateless" em relação ao banco de dados da aplicação.

## Goals / Non-Goals

**Goals:**
- Inserir o card de "Valor Livre" fixamente como o primeiro item no grid de presentes, abrindo um modal ao ser clicado.
- Permitir ao usuário selecionar rapidamente R$ 50, R$ 100, R$ 150 ou digitar um valor customizado.
- Permitir que o usuário digite uma mensagem para os noivos.
- Reutilizar a lógica existente de PIX e Mercado Pago já implementada na aplicação.

**Non-Goals:**
- Alterar ou criar tabelas no banco de dados para armazenar informações de contribuições de valores livres.
- Lidar com webhooks (callbacks) de pagamento para conciliação automática no sistema.

## Decisions

- **Stateless Approach**: Decidimos não salvar essas contribuições no banco de dados para evitar complexidade e manter a robustez do fluxo atual de `Gifts` (que possui relação 1-para-1 com reservas). O controle de recebimento será feito pelos noivos diretamente no banco ou conta do Mercado Pago.
- **Reaproveitamento de Componentes Shadcn**: Utilizaremos os componentes existentes (`Card`, `Dialog`, `Button`, `Input`) de `src/components/ui/` para manter a consistência visual.
- **Reaproveitamento da Geração PIX**: A aplicação já utiliza a biblioteca `qrcode-pix` no componente `ReservationModal.tsx`. Iremos isolar essa lógica ou replicá-la no novo `FreeValueModal`, garantindo que a mensagem seja inserida no campo adequado (TxId) sem adicionar novas dependências.
- **Reaproveitamento Mercado Pago**: A aplicação já possui integração com o Mercado Pago na rota `/api/gifts/[id]/checkout/route.ts`. Criaremos uma nova rota irmã (ex: `/api/checkout/free-value/route.ts`) seguindo o mesmo padrão de autenticação e payload, porém aceitando um `unit_price` dinâmico e a mensagem do usuário.

## Risks / Trade-offs

- **Risco:** Como os dados não ficam salvos, não haverá um histórico no painel administrativo da aplicação sobre as doações de valor livre.
  - *Mitigação:* As doações e mensagens serão registradas no extrato bancário ou na conta do Mercado Pago.
- **Risco:** Limitações no tamanho da mensagem no PIX (geralmente curtas).
  - *Mitigação:* Adicionar limite de caracteres no campo de mensagem do front-end.
