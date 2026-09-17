## Context

O projeto adota uma estética medieval, gótica, vintage e romântica. Após análise crítica da experiência de navegação, identificou-se a necessidade de eliminar resquícios de "tech-minimalismo" (cantos redondos em pílula, glassmorphism acrílico, ícones de e-commerce e grades densas) em prol de uma linguagem mais cenográfica, cinematográfica e botânica autêntica.

A motivação e os objetivos da expansão estão descritos em `proposal.md`.

## Goals / Non-Goals

**Goals:**
- **Carrossel Horizontal de Grande Escala**: Apresentar a galeria com o acervo de pré-wedding em formato horizontal contínuo (`embla-carousel-react`), com imagens verticais e horizontais em grande destaque (65vh a 75vh de altura), títulos em vermelho bordô (`text-primary`), sem ícones de preview e com navegação fluida por toque e botões medievais.
- **Eixo Botânico Orgânico na Timeline**: Substituir conectores retos de SVG por um ativo botânico de galho de roseira/vinha espinhosa com nós florais autênticos e madeira texturizada.
- **Máscara de Foco e Profundidade de Campo (Borrão / Vinheta)**: Adicionar gradientes com leve desfoque suave no topo e no rodapé da janela para que os elementos ganhem nitidez máxima exclusivamente no terço central da tela ao rolar, eliminando sensação de sobrecarga visual.
- **Geometria Medieval Autêntica**: Substituir cantos em pílula (`rounded-full`) e efeitos de vidro fosco (`backdrop-blur`) por cantos retos góticos (`rounded-none` ou `rounded-[2px]`), filetes metálicos e fundos escuros profundos.

**Non-Goals:**
- Manter grade estática estilo e-commerce para fotos de casamento.
- Alterar o acervo de fotos já aprovado de `public/pre-wedding/`.

## Decisions

### 1. Carrossel Horizontal com Embla Carousel
- **Decisão**: Utilizar `embla-carousel-react` (já instalado no projeto) para montar a seção da galeria.
- **Configuração**:
  - Slides com largura dinâmica (`w-[85vw] sm:w-[55vw] lg:w-[42vw]`) e altura imersiva (`h-[65vh] md:h-[72vh]`).
  - Alinhamento centralizado (`align: "center"`).
  - Títulos em vermelho bordeaux (`text-primary`), subtítulo em Cormorant Garamond itálico.
  - Eliminação total do ícone `<Eye />` para deixar a fotografia respirar livremente.

### 2. Eixo Botânico Realista na Timeline
- **Decisão**: Gerar/utilizar um elemento botânico fotográfico de alta resolução representando o caule de uma roseira escura com espinhos pontiagudos e ramificações naturais, repetido ao longo da linha conectora da timeline.
- **Justificativa**: Conecta diretamente a estética visual da página com o ornamento floral histórico já presente no topo do Hero (`image-from-rawpixel-id-16379032-png.png`).

### 3. Máscara de Desfoque Óptico na Rolagem (Sem Vinheta Escura)
- **Decisão**: Remover qualquer gradiente preto ou vinheta escurecida que pesava a interface e reter exclusivamente o efeito óptico de desfoque suave (`backdrop-blur-sm`), atenuado por máscara de transparência gradual nas extremidades superior e inferior:
  - Topo: `fixed top-0 inset-x-0 h-24 sm:h-32 backdrop-blur-sm pointer-events-none z-30`
  - Base: `fixed bottom-0 inset-x-0 h-24 sm:h-32 backdrop-blur-sm pointer-events-none z-30`
- **Justificativa**: Atende diretamente ao pedido do usuário de reduzir o efeito de blur, descartar a vinheta e evitar sobrecarga visual sem escurecer os elementos.

### 4. Centralização Vertical da Seção Inicial (Hero)
- **Decisão**: Configurar a seção `#inicio` com `min-h-screen flex flex-col items-center justify-center text-center`, acomodando harmoniosamente o cabeçalho, os nomes dos noivos, contador regressivo e botão de áudio após a remoção do bloco de presentes do topo.

### 5. Depuração de Estilo: Menos Tech, Mais Gótico
- **Decisão**:
  - No `HeaderNav`: Remover a borda em pílula (`rounded-full`), adotando navegação limpa, alinhada e com tipografia pura. Em dispositivos móveis (`md:hidden`), substituir o menu horizontal por uma barra superior móvel com monograma ("H & H") e botão "MENU ✦" que expande uma sobreposição (overlay) gótica nobre em tela cheia, com cantoneiras decorativas, divisor medieval e links capitulares generosos para toque confortável (mínimo 44px).
  - Nos cartões da timeline: Cantos retos (`rounded-none`), moldura fina dupla e fundo escuro opaco com alto contraste.

### 6. Redesign Gótico e Solene da Lista de Presentes
- **Decisão**:
  - **Identidade da Seção**: Adicionar `MedievalDivider` no cabeçalho da seção `#presentes`, com subtítulo evocativo ("Tributos e Lembranças aos Noivos"). Redesenhar a placa de resumo (disponíveis / reservados) como um brasão ou pergaminho emoldurado (`rounded-none`, borda nobre).
  - **Filtros e Busca**: Transformar os controles de e-commerce genéricos em botões e campos medievais com cantos retos, acentos em carmesim bordô e brilho de brasa (`shadow-glow-primary`).
  - **Cartões de Presente (`GiftCard` e `FreeValueGiftCard`)**: Cantos retos góticos (`rounded-none`), moldura de códice antigo com cantoneiras aparentes, selos de reserva estilo sinete de cera, e preços imponentes na tipografia Cormorant Garamond.
  - **Modais (`ReservationModal` e `FreeValueModal`)**: Manter rigorosamente o mesmo acabamento cenográfico nos diálogos de checkout e reserva.

## Risks / Trade-offs

- **[Risco: Carrossel horizontal em dispositivos móveis travar a rolagem vertical da página]**
  - *Mitigação*: Configurar opções adequadas no Embla Carousel (`dragFree: false`, suporte nativo a gestos táteis com eixo horizontal isolado).
