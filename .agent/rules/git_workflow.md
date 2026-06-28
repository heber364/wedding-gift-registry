---
description: Define o fluxo de trabalho do Git, gerenciamento de branches e estratégia de commits.
globs: *
---

# Fluxo de Trabalho do Git e Organização do Projeto

Sempre que estiver atuando neste projeto, você **DEVE** seguir rigorosamente o seguinte fluxo de versionamento:

## 1. Isolamento de Features (Criação de Branch)
- **Nunca** faça alterações diretamente na branch principal (`main` ou `dev`).
- Sempre que for iniciar o desenvolvimento de uma nova funcionalidade, correção ou alteração, **crie uma nova branch**.
- A ideia é ter sempre o projeto dividido entre a branch principal (estável) e a sua branch de feature ativa.

## 2. Commits Intermediários e Atômicos
- Se a tarefa for complexa e composta por várias etapas, você deve **fazer commits entre cada etapa** concluída dentro da mesma branch.
- Não acumule todo o trabalho de um dia inteiro para fazer apenas um commit no final. Salve o progresso gradativamente com mensagens claras.

## 3. Finalização e Merge
- Quando a tarefa ou funcionalidade estiver completamente finalizada (todas as etapas concluídas na sua branch), faça o **merge** dessa branch para a branch principal.
- Após o merge, volte sempre à branch principal para criar uma **nova branch** sempre que for iniciar a próxima tarefa.

### Resumo do Ciclo:
1. `git checkout -b feature/nome-da-tarefa`
2. Desenvolve Etapa 1 -> `git commit`
3. Desenvolve Etapa 2 -> `git commit`
4. Finaliza tarefa -> Faz o merge para a principal (`main`/`dev`)
5. Inicia nova tarefa repetindo o passo 1.
