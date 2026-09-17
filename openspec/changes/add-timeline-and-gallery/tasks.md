## 1. Refinamento da Galeria em Carrossel Horizontal

- [x] 1.1 Refatorar `PhotoGallery.tsx` utilizando `embla-carousel-react` para exibição em carrossel horizontal contínuo e fluido
- [x] 1.2 Aumentar a escala das fotografias no carrossel (altura generosa de 65vh a 75vh), permitindo destaque total aos retratos verticais e horizontais
- [x] 1.3 Remover o ícone de olho e estilizar os títulos e legendas das fotos em vermelho bordô (`text-primary`) com tipografia Cormorant Garamond
- [x] 1.4 Integrar setas de navegação direcionais vintage e suporte a arrastar por toque (touch gesture) com clique abrindo no Lightbox

## 2. Eixo Botânico Realista da Linha do Tempo

- [x] 2.1 Criar asset botânico transparente de alta resolução com galho de roseira, textura de madeira escura e espinhos reais
- [x] 2.2 Integrar o caule botânico real como espinha dorsal conectora da timeline em `CoupleTimeline.tsx`, substituindo o traço digital de SVG
- [x] 2.3 Refinar a geometria dos cartões de evento da timeline para cantos retos góticos (`rounded-none` / `rounded-[2px]`), eliminando cantos arredondados tech

## 3. Máscara de Foco na Rolagem

- [x] 3.1 Criar o componente `ScrollFocusMask.tsx`
- [x] 3.2 Integrar a máscara de foco em `src/app/page.tsx`
- [x] 3.3 Suavizar desfoque para intensidade mais sutil (`backdrop-blur-sm`) e remover completamente a vinheta / gradiente escuro de `ScrollFocusMask.tsx`

## 4. Depuração Estética do Header e Validação

- [x] 4.1 Ajustar `HeaderNav.tsx` removendo cantos em pílula plástica (`rounded-full`) e aplicando acabamento fino medieval
- [x] 4.3 Centralizar verticalmente a seção inicial Hero (`#inicio`) com `min-h-screen` e distribuição harmônica de espaçamento
- [x] 4.4 Implementar navegação responsiva mobile em `HeaderNav.tsx` com barra compacta, monograma e overlay/drawer gótico com links acessíveis para toque
- [x] 4.2 Validar responsividade em dispositivos móveis e desktop e executar compilação de produção (`npm run build`)

## 5. Redesign Gótico e Medieval da Lista de Presentes

- [x] 5.1 Atualizar o cabeçalho e sumário de estatísticas da seção `#presentes` em `src/app/page.tsx` com `MedievalDivider`, tipografia Cormorant Garamond e moldura heráldica
- [x] 5.2 Estilizar os controles de filtros (abas de categoria, busca e dropdowns de ordenação) com geometria reta e acentos em bordeaux
- [x] 5.3 Refatorar `GiftCard.tsx` com cantos retos (`rounded-none`), moldura de códice antigo, cantoneiras decorativas e selos de cera heráldicos
- [x] 5.4 Refatorar `FreeValueGiftCard.tsx` com destaque cerimonial, filigrana e acabamento nobre
- [x] 5.5 Harmonizar `ReservationModal.tsx` e `FreeValueModal.tsx` com a mesma cenografia gótica (cantos retos, cabeçalhos em Cormorant Garamond)
- [x] 5.6 Executar validação de tipos (`tsc --noEmit`), build de produção (`npm run build`) e validação do OpenSpec (`npx openspec validate`)
