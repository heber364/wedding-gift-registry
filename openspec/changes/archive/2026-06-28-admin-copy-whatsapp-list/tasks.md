## 1. UI Additions

- [x] 1.1 Importar ícone apropriado (ex: `MessageCircle` ou `Copy` do `lucide-react`) em `src/app/admin/page.tsx`.
- [x] 1.2 Adicionar o botão "Copiar para WhatsApp" ao lado do botão "Limpar todos os filtros" em `src/app/admin/page.tsx`.

## 2. Logic Implementation

- [x] 2.1 Criar a função utilitária local `generateWhatsAppText(gifts)` em `src/app/admin/page.tsx` para processar a lista recebida.
- [x] 2.2 Implementar a lógica de agrupamento por `category` (ex: "Cozinha", "Quarto") dentro da função de formatação.
- [x] 2.3 Formatar cada item na string final com o padrão WhatsApp: `*Nome do Presente* - https://...` (usar `productLink` ou link do site principal com ID como fallback configurado).
- [x] 2.4 Atrelar a função ao evento `onClick` do novo botão, passando a lista de presentes atual (`filteredAndSortedGifts`).
- [x] 2.5 Usar a API `navigator.clipboard.writeText` para salvar o texto e adicionar um `toast.success("Copiado!")` para feedback visual ou `toast.error("Erro ao copiar")` caso falhe.
