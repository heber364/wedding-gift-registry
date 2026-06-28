## 1. Clean Up Internal Card

- [x] 1.1 Remover a definição do fundo com textura de algodão do `InteractiveEnvelope.tsx`
- [x] 1.2 Remover a `motion.div` que representa o cartão de algodão interno do `InteractiveEnvelope.tsx`

## 2. Refactor Envelope Opening Animation

- [x] 2.1 Atualizar a animação de saída/exit do contêiner (wrapper) principal para aumentar ligeiramente de escala (scale up) enquanto desaparece (fades out), dando a sensação de "abrir" a janela de visualização (viewport)
- [x] 2.2 Ajustar o tempo (timing): quando o lacre de cera for clicado, a aba superior deve abrir e, imediatamente após (ou junto com isso), o contêiner do envelope deve aumentar de escala e a opacidade deve ir a 0.
- [x] 2.3 Modificar os fluxos de `handleOpen` ou `handleClose` para transicionar automaticamente o envelope para fora logo após a abertura da aba, em vez de esperar por um segundo clique.

## 3. Verify and Polish

- [x] 3.1 Verificar se a lógica de sessionStorage ainda funciona corretamente e ignora o envelope ao recarregar a página
- [x] 3.2 Garantir que o site da lista de presentes por baixo torne-se interativo assim que o envelope desaparecer completamente
