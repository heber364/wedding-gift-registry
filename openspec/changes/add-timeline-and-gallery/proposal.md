## Why

Atualmente, o site do casamento cumpre com excelência o papel funcional de lista de presentes interativa, contagem regressiva e pagamento integrado. No entanto, para tornar a experiência dos convidados mais imersiva, afetiva e memorável, é essencial enriquecer o site com a história e memórias visuais do casal, mantendo rigorosamente a identidade visual e a paleta de cores já estabelecida (dark, medieval, gótica e vintage). A inclusão de uma navegação minimalista no topo, Linha do Tempo alimentada por JSON e ambientada com espinhos botânicos reais, Galeria em Carrossel Horizontal cinematográfico com fotos em grande escala e títulos em vermelho bordô, ambientação fotográfica com `1.jpg` e máscara de foco suave na rolagem traz máxima sofisticação e celebra a união de Helloisa & Héber.

## What Changes

- **Header Minimalista e Gótico**: Barra de navegação centralizada no topo sem moldura de pílula plástica moderna, com links âncora elegantes (Início, Nossa História, Galeria, Presentes) com scroll suave.
- **Ambientação do Hero com Imagem do Casal (`1.jpg`)**: Aplicação da imagem real do casal em fundo de toda a primeira seção com tratamento de escurecimento (overlay dark), vinheta e leve desfoque para garantir legibilidade dos textos.
- **Linha do Tempo com Galhos e Espinhos Botânicos Reais**: Seção cronológica inspirada em trepadeiras e caules de roseiras com textura e detalhes botânicos autênticos (eliminando a sensação de vetor matemático), consumindo o conteúdo a partir de `timeline.json`.
- **Galeria de Fotos em Carrossel Horizontal Cinematográfico**: Carrossel contínuo fluido com imagens em grande formato (destaque visual com proporções autênticas), remoção de ícone de olho e apresentação dos títulos em tipografia serifada vermelho bordeaux (`text-primary`).
- **Máscara de Desfoque Óptico na Rolagem**: Aplicação de leve desfoque suave nas extremidades da viewport para manter a atenção focada no centro da tela.
- **Tocador de Música Flutuante**: Botão de áudio flutuante fixado no canto inferior direito que se revela automaticamente após a rolagem do Hero inicial.
- **Redesign Temático da Lista de Presentes**: Reestilização completa da seção de presentes, cartões (`GiftCard`, `FreeValueGiftCard`), filtros e modais para abandonar o minimalismo genérico de e-commerce e abraçar a estética gótica/medieval solene (cantos retos, molduras de códice antigo, cantoneiras decorativas e selos heráldicos).

## Capabilities

### New Capabilities
- `site-navigation`: Header minimalista e centralizado no topo com âncoras para as seções principais, tocador de áudio flutuante e máscara de foco contínuo na rolagem.
- `couple-timeline`: Componente cronológico medieval com conector de espinhos botânicos reais, integrado com imagem atmosférica escurecida de fundo e alimentado por arquivo JSON configurável.
- `photo-gallery`: Galeria cinematográfica em carrossel horizontal de grande escala com títulos em vermelho bordô e suporte a modal Lightbox ampliado.
- `gift-registry`: Reestilização gótica e medieval do módulo de presentes, cartões de códice, filtros e diálogos de reserva.

### Modified Capabilities

## Impact

- **Código Afetado**: `src/app/page.tsx`, `src/components/GiftCard.tsx`, `src/components/FreeValueGiftCard.tsx`, `src/components/ReservationModal.tsx`, `src/components/FreeValueModal.tsx`, `src/components/gallery/PhotoGallery.tsx`, `src/components/timeline/CoupleTimeline.tsx`, `src/components/HeaderNav.tsx`, `src/components/ui/ScrollFocusMask.tsx`.
- **Identidade e Cores**: Fidelidade absoluta à paleta CSS original e eliminação de elementos modernos em pílula ou vidro acrílico.
- **Dependências**: Reutilização de `embla-carousel-react`, já presente no projeto.
