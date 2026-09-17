## Purpose

Apresentar ensaios e registros fotográficos marcantes do casal através de uma galeria imersiva, responsiva e cinematográfica com carrossel horizontal de fotos de grande escala, títulos em vermelho bordô e visualização ampliada (lightbox), respeitando a identidade dark e gótica do casamento.

## ADDED Requirements

### Requirement: Exibição em Carrossel Horizontal de Grande Escala
O sistema DEVE apresentar a galeria de fotos como um carrossel horizontal contínuo e fluido, com imagens em proporções ampliadas (destaque vertical e horizontal em grande formato), permitindo navegação suave através de arraste por toque no mobile ou controles direcionais no desktop, substituindo grades estáticas densas de formato comercial.

#### Scenario: Visualização do carrossel horizontal
- **WHEN** o convidado navega até a seção da Galeria
- **THEN** as fotografias são exibidas em linha horizontal com grande impacto visual e altura generosa
- **THEN** o usuário pode deslizar suavemente entre as imagens do ensaio

### Requirement: Composição com Acervo Original do Ensaio Pré-Wedding
O sistema DEVE compor a galeria a partir das 11 fotografias autênticas do casal localizadas no diretório `public/pre-wedding/`, mantendo suas proporções, enquadramentos e metadados organizados em `gallery.json`.

#### Scenario: Carregamento das fotos pré-wedding
- **WHEN** a galeria é renderizada na página
- **THEN** todas as fotografias da pasta `public/pre-wedding/` são apresentadas com títulos poéticos em tom bordô e legendas evocativas

### Requirement: Estilização Gótica sem Elementos Tech Modernos
As imagens DEVEM contar com acabamento solene sem o uso de cantos redondos em pílula, botões flutuantes de aplicativo ou ícones de olho. Os títulos e legendas DEVEM ser renderizados em vermelho bordeaux (`text-primary`) e tipografia serifada clássica Cormorant Garamond, integrados à fotografia sem poluição visual.

#### Scenario: Apresentação dos títulos das fotos
- **WHEN** a foto é exibida no carrossel
- **THEN** o título é apresentado em tipografia serifada na cor vermelho bordô (`text-primary`)
- **THEN** nenhum ícone de olho ou preview de e-commerce é exibido sobre a fotografia

### Requirement: Visualização Ampliada em Lightbox Modal
O sistema DEVE permitir a ampliação de qualquer foto do carrossel em um modal lightbox com fundo escurecido, controles de navegação e suporte a teclado.

#### Scenario: Abertura e navegação no lightbox
- **WHEN** o convidado clica sobre uma foto no carrossel
- **THEN** a imagem se expande em modal escurecido mantendo navegação e atalho Escape

### Requirement: Desempenho e Carregamento Otimizado
O sistema DEVE utilizar carregamento otimizado com `next/image` e renderização progressiva no carrossel, preservando a fluidez da rolagem.

#### Scenario: Carregamento do carrossel
- **WHEN** o carrossel é inicializado
- **THEN** as imagens são carregadas sem travamentos de scroll
