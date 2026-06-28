## 1. UI Components (Reaproveitando Shadcn)

- [x] 1.1 Criar o componente de card `FreeValueGiftCard` usando o `Card` existente (`src/components/ui/card.tsx`) para manter o padrão visual.
- [x] 1.2 Criar o `FreeValueModal` usando o componente `Dialog` (`src/components/ui/dialog.tsx`), implementando as opções de valores (50, 100, 150) com botões e o `Input` para valor customizado.
- [x] 1.3 Adicionar o `Input` e `Label` para o campo de texto da mensagem no `FreeValueModal`.
- [x] 1.4 Injetar o `FreeValueGiftCard` artificialmente como o PRIMEIRO item do array renderizado no grid de presentes em `src/app/page.tsx`.

## 2. Pagamento PIX (Client-side)

- [x] 2.1 Reutilizar a lógica da biblioteca `qrcode-pix` (já instalada e usada no `ReservationModal.tsx`) para gerar o BR Code no `FreeValueModal`.
- [x] 2.2 Mapear o valor selecionado e a mensagem preenchida (inserindo-a no atributo adequado, como TxId ou identificador da chave) na geração do QRCode PIX.
- [x] 2.3 Implementar a interface de exibição do QR Code e o botão de Copia e Cola, reaproveitando a estrutura visual já feita em `ReservationModal`.

## 3. Pagamento Mercado Pago (API + Redirecionamento)

- [x] 3.1 Criar a rota da API Next.js `app/api/checkout/free-value/route.ts` inspirada na rota existente (`api/gifts/[id]/checkout/route.ts`).
- [x] 3.2 Implementar a chamada REST para o Mercado Pago (`/checkout/preferences`) passando o `unit_price` dinâmico, enviando a mensagem do usuário na descrição do item.
- [x] 3.3 Conectar o botão "Pagar com Cartão" no modal do front-end à nova rota, lidando com o estado de loading (`Spinner`) e o redirecionamento (`window.location.href`) para o link de checkout retornado.
