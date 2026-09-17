## Purpose

Prover uma seção imersiva e responsiva que narra cronologicamente a história de Helloisa e Héber, consumindo os dados diretamente de um arquivo JSON editável e ambientada com espinhos e galhos botânicos realistas e fundo fotográfico escurecido.

## ADDED Requirements

### Requirement: Alimentação de Dados via Arquivo JSON
O sistema DEVE carregar todo o conteúdo textual e estrutural dos marcos da história a partir de um arquivo de dados JSON dedicado (`timeline.json`), permitindo ao casal substituir textos a qualquer momento sem editar código.

#### Scenario: Leitura dos eventos a partir do JSON
- **WHEN** a seção da Linha do Tempo é renderizada
- **THEN** o sistema lê os eventos a partir de `timeline.json`

### Requirement: Eixo Conector com Galhos e Espinhos Botânicos Realistas
A estrutura conectiva central e os marcadores da linha do tempo DEVEM utilizar textura e elementos visuais que remetam a galhos de roseira e vinhas reais com espinhos orgânicos, evitando linhas geométricas retas ou vetores SVG de aparência digital e artificial.

#### Scenario: Visualização do conector da timeline
- **WHEN** a linha do tempo é percorrida pelo usuário
- **THEN** o eixo conector exibe textura e silhueta de galhos e espinhos orgânicos naturais com nós de rosa
- **THEN** os nós de cada marco integram-se harmonicamente à ramificação de espinhos

### Requirement: Ambientação Visual com Fundo Escurecido e Tratamento de Imagem
O sistema DEVE utilizar a imagem representativa do casal como plano de fundo atmosférico com camadas de escurecimento profundo, vinheta e contraste calibrado para máxima legibilidade.

#### Scenario: Renderização do fundo atmosférico
- **WHEN** a seção é visualizada
- **THEN** o fundo fotográfico é escurecido e vinhetado, mantendo a leitura nítida de todos os textos

### Requirement: Responsividade e Geometria Medieval
O sistema DEVE apresentar a linha do tempo em formato alternado no desktop e linear lateral no mobile, utilizando bordas retas chanfradas e eliminando cantos arredondados tech (`rounded-full`) e efeitos de acrílico/vidro fosco.

#### Scenario: Geometria dos cartões da timeline
- **WHEN** os cartões de eventos são renderizados
- **THEN** os cartões adotam ângulos retos góticos e molduras com filetes escuros, sem cantos arredondados excessivos
