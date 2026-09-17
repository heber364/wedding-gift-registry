## Purpose

Reestilizar o módulo da lista de presentes, filtros e modais de reserva para abandonar o minimalismo genérico de e-commerce/SaaS e incorporar a mesma estética medieval, gótica, solene e romântica do restante do site (cantos retos, molduras de manuscrito antigo, cantoneiras decorativas, tipografia clássica Cormorant Garamond e selos heráldicos).

## ADDED Requirements

### Requirement: Cenografia e Cabeçalho Medieval da Seção de Presentes
A seção de presentes (`#presentes`) DEVE adotar elementos visuais solenes e medievais em seu cabeçalho, sumário e estrutura, incorporando divisores heráldicos (`MedievalDivider`), subtítulo evocativo ("Tributos e Lembranças aos Noivos") e acabamentos que dialoguem diretamente com o Hero, a Linha do Tempo e a Galeria.

#### Scenario: Visualização do cabeçalho da seção
- **WHEN** o convidado navega até a seção `#presentes`
- **THEN** o título é apresentado com tipografia nobre Cormorant Garamond acompanhado de divisor ornamental medieval
- **THEN** o sumário de presentes disponíveis/reservados adota acabamento de placa heráldica emoldurada com cantos retos e filetes escuros

### Requirement: Cartões de Presente em Estilo de Códice Antigo
Os cartões de presentes individuais (`GiftCard.tsx`) DEVEM abandonar os cantos arredondados modernos (`rounded-lg`/`rounded-xl`) e bordas genéricas, adotando geometria reta gótica (`rounded-none`), moldura dupla inspirada em encadernações medievais com cantoneiras ornamentadas e tipografia serifada de alto requinte para nomes e valores.

#### Scenario: Renderização do cartão de presente
- **WHEN** os presentes são listados na grade
- **THEN** cada cartão exibe cantos retos góticos (`rounded-none`) e moldura refinada com cantoneiras decorativas
- **THEN** o valor do presente é destacado na fonte serifada clássica
- **THEN** o botão de ação adota estética de convite solene com transição de brilho bordeaux (`shadow-glow-primary`)

### Requirement: Selos de Reserva e Status em Estilo Lacre Heráldico
Os marcadores de status dos presentes ("Reservado" e "Seu Presente") DEVEM ser apresentados como selos/sinetes de estilo medieval com tipografia serifada capitular, eliminando badges arredondadas modernas de lojas virtuais.

#### Scenario: Exibição de presente reservado
- **WHEN** um presente possui o status de reservado
- **THEN** a imagem é envolvida em camada com selo sóbrio e solene em fonte serifada
- **THEN** o selo não utiliza bordas arredondadas plásticas (`rounded-full`)

### Requirement: Cartão de Valor Livre com Destaque Cerimonial
O cartão de contribuição livre (`FreeValueGiftCard.tsx`) DEVE receber destaque especial na grade com filigrana decorativa, fundo sutil em veludo bordeaux (`bg-primary/10`), ícone nobre e moldura dourada/carmesim que o evidencie como uma oferenda especial e afetuosa ao casal.

#### Scenario: Visualização do cartão de valor livre
- **WHEN** a grade de presentes é exibida
- **THEN** o cartão de valor livre surge em primeiro plano com moldura distinta e acabamento de tributo de honra

### Requirement: Controles de Busca e Filtros com Geometria Medieval
As abas de categorias, o campo de busca textual e os seletores de status e ordenação DEVEM ser harmonizados com a linguagem gótica:
- Abas com botões de cantos retos, filete bordeaux e iluminação sutil de brasa quando ativas;
- Campo de busca com fundo escurecido, filete clássico e foco em carmesim;
- Seletores suspensos (`Select`) com molduras retas e sem cantos arredondados modernos.

#### Scenario: Interação com filtros e pesquisa
- **WHEN** o usuário busca ou filtra por categorias
- **THEN** os controles respondem com elegância medieval mantendo legibilidade e contraste imediatos

### Requirement: Modais de Reserva e Contribuição Alinhados à Estética
Os diálogos modais de reserva e checkout (`ReservationModal.tsx` e `FreeValueModal.tsx`) DEVEM adotar cantos retos (`rounded-none`), moldura gótica, cabeçalhos em Cormorant Garamond e botões de ação em estilo medieval, garantindo que o fechamento do presente seja uma experiência solene e temática contínua.

#### Scenario: Abertura do modal de reserva
- **WHEN** o convidado seleciona um presente para reservar
- **THEN** o modal abre com moldura gótica escura, cantos retos e tipografia temática harmônica
