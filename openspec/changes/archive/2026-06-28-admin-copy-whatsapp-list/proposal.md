## Why

Os administradores da lista de presentes frequentemente precisam compartilhar os itens disponíveis via WhatsApp. Atualmente, esse processo é manual e não formatado. Automatizar isso facilita a divulgação rápida e elegante da lista de presentes.

## What Changes

- Adição de um botão "Copiar para WhatsApp" no painel de administração (`/admin`).
- Formatação dos presentes disponíveis para o padrão do WhatsApp (com negrito, itálico e links embutidos junto ao nome).
- A lista gerada deve respeitar os filtros ativos na tabela no momento do clique, permitindo copiar listas específicas (ex: apenas itens de "Cozinha").
- Os presentes copiados devem ser agrupados por categoria.

## Capabilities

### New Capabilities
- `admin-whatsapp-export`: Capacidade de exportar a lista de presentes atual do painel de administração para a área de transferência do usuário, em um formato otimizado para mensagens do WhatsApp.

### Modified Capabilities

## Impact

- **UI**: Adição de um botão ao lado do botão "Limpar todos os filtros" na página `/admin/page.tsx`.
- **Lógica**: Criação de uma função utilitária para converter a lista de presentes filtrada em texto formatado para o WhatsApp, agrupada por categoria, com suporte à área de transferência (`navigator.clipboard`).
- Nenhuma alteração no backend ou banco de dados.
