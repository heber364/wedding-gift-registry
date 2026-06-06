# Documentação do Projeto: Lista de Presentes (Helloisa & Héber)

## Visão Geral
Este é um aplicativo web desenvolvido para gerenciar a lista de presentes de casamento de Helloisa e Héber (data prevista: 22 de Novembro de 2026). A aplicação permite que convidados visualizem os presentes desejados, filtrem por categorias, ordenem por preço e realizem reservas de presentes. Também possui funcionalidades para administração (cadastro e edição) dos presentes.

## Stack Tecnológica
- **Framework Core**: Next.js 16.2.7 (App Router), React 19.2.4
- **Estilização**: Tailwind CSS v4, Radix UI (Componentes de UI acessíveis)
- **Banco de Dados**: PostgreSQL
- **ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Gerenciamento de Estado/API**: `@tanstack/react-query`
- **Validação e Formulários**: `zod`, `react-hook-form`, `@hookform/resolvers`
- **Animações e Ícones**: `framer-motion`, `lucide-react`, `react-icons`
- **Outros utilitários**: `date-fns`, `react-player` (para trilha sonora).

## Estrutura de Diretórios
- `src/app/`: Rotas da aplicação (Next.js App Router). Contém a página inicial (`page.tsx`) com a vitrine de presentes.
- `src/components/`: Componentes React reutilizáveis.
  - `ui/`: Componentes de interface base (provavelmente Shadcn UI/Radix).
  - `GiftCard.tsx`: Card de exibição individual de um presente.
  - `ReservationModal.tsx`: Modal para o fluxo de reserva por parte do convidado.
  - `AdminGiftForm.tsx`: Formulário de administração de presentes.
- `src/db/schema/`: Definições do schema do banco de dados utilizando Drizzle ORM (`gifts.ts`, etc).
- `src/lib/`: Código utilitário e integração com a API (`api-client-react`).
- `src/hooks/`: Hooks customizados da aplicação.
- `scripts/`: Scripts utilitários (ex: `seed-gifts.ts` para popular dados iniciais).

## Funcionalidades Principais
1. **Página Inicial (Vitrine)**: Exibe a lista de presentes em um grid com suporte a:
   - Filtros por categoria (ex: "Todos", etc).
   - Ordenação (Maior preço, Menor preço).
   - Exibição de totais (Presentes Disponíveis vs Reservados).
   - Player de música ambiente integrado.
2. **Reserva de Presentes**: Através do `ReservationModal`, convidados podem confirmar a intenção de dar um determinado presente.
3. **Gerenciamento de Presentes**: Criação, edição e exclusão de itens através de formulários administrativos (ex: `AdminGiftForm`).

## Scripts Disponíveis
- `pnpm dev`: Inicia o servidor de desenvolvimento.
- `pnpm build`: Gera a build de produção.
- `pnpm lint`: Executa o linter (ESLint).
- `pnpm db:up` / `db:down`: Gerencia os containers Docker do banco de dados PostgreSQL.
- `pnpm db:push`: Sincroniza o schema definido no Drizzle com o banco de dados.
- `pnpm db:studio`: Abre o Drizzle Studio no navegador para visualizar e editar os dados do banco.

---
**Nota:** Esta documentação deve ser mantida atualizada para refletir a arquitetura e as regras de negócio vigentes da aplicação.
