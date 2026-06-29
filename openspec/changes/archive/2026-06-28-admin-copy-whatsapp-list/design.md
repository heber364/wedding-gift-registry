## Context

Os administradores gerenciam a lista de presentes através da interface `/admin`. Uma necessidade comum é enviar a lista de presentes disponíveis para convidados através do WhatsApp. Como a funcionalidade não existe, o processo manual é tedioso.

## Goals / Non-Goals

**Goals:**
- Prover um botão na interface administrativa para copiar os presentes listados e formatá-los para WhatsApp.
- Respeitar os filtros atuais da tabela (presentes filtrados na view atual).
- Agrupar a lista resultante por categorias.
- Embutir o link (da aplicação principal ou da loja) ao lado ou abaixo do nome do presente na mensagem.

**Non-Goals:**
- Não iremos integrar com a API oficial do WhatsApp (não é envio automático, apenas cópia para a área de transferência).
- Não haverá funcionalidade semelhante na visão pública de convidados.

## Decisions

- **Utilização da Área de Transferência**: Vamos usar a API `navigator.clipboard.writeText()` no front-end para copiar o texto.
- **Formatação de Texto (Markdown do WhatsApp)**: O WhatsApp usa `*texto*` para negrito e `_texto_` para itálico. Vamos formatar o Título/Nome do presente em negrito e a Categoria como um cabeçalho. O link do presente será inserido como texto puro (o WhatsApp converte URLs em links clicáveis automaticamente). Formato escolhido: `*Nome do Produto* - https://site...`
- **Geração Dinâmica**: O botão processará o array `filteredAndSortedGifts` que já existe no componente `AdminDashboard`, agrupando-os por `category`.
- **Posicionamento**: Adicionar um botão na interface da tabela, especificamente ao lado da opção "Limpar todos os filtros", tornando-o de fácil acesso quando os dados já estão filtrados.

## Risks / Trade-offs

- **Tamanho do Texto** → O WhatsApp suporta mensagens de até ~65.536 caracteres. Se a lista for imensa, o usuário pode ter problemas ao colar. **Mitigação**: O texto será filtrado pelo que está visível na tabela. A opção de filtrar atende a segmentação por categoria ou disponibilidade para mensagens menores.
- **Permissões do Navegador** → A cópia depende da permissão da Clipboard API, e o botão de copiar precisa de uma interação do usuário. **Mitigação**: Informar o resultado (sucesso ou erro) visualmente com Toasts da biblioteca `sonner`.
