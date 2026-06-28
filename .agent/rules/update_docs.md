---
description: Mantém a documentação principal do projeto sempre atualizada.
globs: *
---

# Atualização de Documentação do Projeto

Sempre que você realizar mudanças estruturais significativas, adicionar novas funcionalidades importantes, integrar novas bibliotecas relevantes (no `package.json`) ou modificar o schema do banco de dados (no `src/db/schema/`), você **DEVE** revisar e atualizar o arquivo `PROJECT_DOCS.md` na raiz do projeto para refletir essas mudanças.

## Diretrizes:
- **Stack Tecnológica**: Adicione ou remova ferramentas e bibliotecas conforme as dependências do projeto mudam.
- **Estrutura de Diretórios**: Descreva novos módulos ou pastas importantes que forem criados na arquitetura do projeto.
- **Funcionalidades Principais**: Documente brevemente novos fluxos de negócio ou recursos adicionados à aplicação.
- **Scripts Disponíveis**: Se adicionar novos comandos úteis no `package.json`, certifique-se de explicá-los na documentação.

A documentação deve ser a fonte da verdade para o estado atual do projeto. Sempre garanta que as informações em `PROJECT_DOCS.md` representam com precisão o código-fonte atual.
