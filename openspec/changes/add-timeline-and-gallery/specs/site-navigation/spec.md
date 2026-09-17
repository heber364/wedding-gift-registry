## Purpose

Prover uma navegação minimalista e centralizada no topo da página, com links âncora elegantes e transparentes, tocador de áudio flutuante e máscara de foco cinematográfico na rolagem para direcionar a atenção ao centro da tela.

## ADDED Requirements

### Requirement: Barra de Navegação Superior Minimalista e Gótica
O sistema DEVE exibir um cabeçalho de navegação no topo da página com links centralizados, sem moldura em pílula de plástico ou cantos arredondados tech (`rounded-full`), integrando-se organicamente com a tipografia Cormorant Garamond sobre a estética dark.

#### Scenario: Visualização do cabeçalho
- **WHEN** o usuário acessa a página inicial
- **THEN** o menu é exibido centralizado no topo com tipografia refinada e sem blocos ou pílulas modernas arredondadas

### Requirement: Centralização Vertical da Seção Inicial (Hero)
A primeira seção do site (`#inicio`), após a remoção da menção à lista de presentes no topo, DEVE ocupar a altura total da viewport (`min-h-screen`) com alinhamento vertical e horizontal centralizado, equilibrando o impacto visual do título, contador regressivo, data e botão de áudio.

#### Scenario: Enquadramento do Hero
- **WHEN** o visitante carrega a página inicial
- **THEN** a seção `#inicio` preenche `min-h-screen` e posiciona o bloco principal perfeitamente centralizado verticalmente na tela

### Requirement: Máscara de Desfoque Suave na Rolagem (Sem Vinheta Escura)
O sistema DEVE aplicar uma máscara óptica de desfoque sutil e leve (`backdrop-blur-sm`) exclusivamente nas extremidades superior e inferior da viewport, sem gradientes pretos ou vinhetas de escurecimento, garantindo que o texto em movimento seja suavemente desfocado nas bordas sem criar sombras pesadas.

#### Scenario: Rolagem com foco central
- **WHEN** o usuário rola o site
- **THEN** as bordas superior e inferior aplicam apenas um leve desfoque óptico gradual
- **THEN** nenhum gradiente preto ou vinheta escurecida é aplicado sobre o conteúdo
- **THEN** o terço central da tela permanece com foco e nitidez absolutos

### Requirement: Navegação por Âncoras com Scroll Suave
O sistema DEVE disponibilizar links apontando para as seções principais da página: "Início" (`#inicio`), "Nossa História" (`#historia`), "Galeria" (`#galeria`) e "Presentes" (`#presentes`), acionando rolagem suave e precisa.

#### Scenario: Clique em link de âncora
- **WHEN** o usuário clica em um dos links
- **THEN** a página rola suavemente até a seção de destino

### Requirement: Tocador de Música Flutuante fora da Página Inicial
O sistema DEVE exibir um botão flutuante e interativo do tocador de música no canto inferior direito da tela sempre que o usuário não estiver no topo da página inicial.

#### Scenario: Alternância de reprodução no botão flutuante
- **WHEN** o usuário clica no botão flutuante
- **THEN** a trilha sonora alterna entre reproduzir e pausar de forma sincronizada com o player principal

### Requirement: Navegação Responsiva para Dispositivos Móveis (Header Mobile)
O cabeçalho de navegação DEVE ser totalmente adaptado para telas móveis e smartphones (viewports `< 768px`):
- O sistema DEVE ocultar o menu horizontal longo que transborda a largura do celular e substituí-lo por uma barra superior móvel compacta com monograma do casal ("H & H") e botão acionador de menu ("MENU ✦");
- O botão acionador DEVE abrir uma sobreposição (overlay / drawer) temática gótica em tela cheia com fundo escurecido aveludado, cantoneiras decorativas e divisor medieval;
- O menu móvel DEVE listar todas as opções de navegação com tipografia de destaque Cormorant Garamond e numeração romana ou losangos heráldicos, com áreas de toque adequadas (mínimo 44px de altura);
- O sistema DEVE fechar automaticamente o menu móvel ao clicar em qualquer link (executando a rolagem suave até a seção de destino) ou ao acionar o botão de fechamento.

#### Scenario: Acesso ao cabeçalho em dispositivo móvel
- **WHEN** o visitante acessa o site em uma tela de largura reduzida (< 768px)
- **THEN** a barra superior móvel é exibida sem transbordamento horizontal e sem quebras de linha indesejadas
- **THEN** ao clicar no botão de menu, a sobreposição gótica é exibida com todos os links em tamanho confortável para toque
- **THEN** ao selecionar um dos destinos, o menu fecha suavemente e a página rola até a seção escolhida

