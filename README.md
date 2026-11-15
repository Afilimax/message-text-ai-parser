# @afilimax/message-text-ai-parser

Biblioteca que usa IA ([AI SDK da Vercel](https://ai-sdk.dev)) para extrair dados de mensagens de ofertas enviadas por canais de promoções brasileiros. Diferente do [`@afilimax/message-text-parser`](../message-text-parser), que depende de parsers escritos para cada canal, aqui um modelo de linguagem interpreta mensagens de qualquer formato.

Mensagens que não divulgam um produto (por exemplo, que apenas anunciam cupons) são ignoradas e retornam `null`.

## Instalação

```bash
npm install @afilimax/message-text-ai-parser
```

Você também precisa de um provedor de modelo do AI SDK, como `@ai-sdk/openai`, `@ai-sdk/google` ou `@ai-sdk/anthropic`:

```bash
npm install @ai-sdk/openai
```

## Uso

```typescript
import { openai } from "@ai-sdk/openai"
import { MessageTextAiParser } from "@afilimax/message-text-ai-parser"

const parser = new MessageTextAiParser({
    model: openai("gpt-4.1-mini"),
})

const offer = await parser.parse(`Tênis Charged Starlight Se Under Armour

💲R$ 158,99
💳 Em 6x Sem Juros
🎟 Cupom: CARNAVAL40

🔗https://mercadolivre.com/sec/2yaVLgw`) // Offer | null

console.log(offer) /* {
  title: 'Tênis Charged Starlight Se Under Armour',
  price: { value: 158.99, oldValue: null, currency: 'BRL' },
  url: 'https://mercadolivre.com/sec/2yaVLgw',
  coupons: [ 'CARNAVAL40' ]
} */
```

### Mensagens sem produto

```typescript
await parser.parse("🔥 NOVOS CUPONS MERCADO LIVRE 🔥") // null
await parser.parse("R$ 50 OFF em compras acima de R$ 200") // null
```

## Opções

| Opção          | Tipo            | Descrição                                                        |
| -------------- | --------------- | ---------------------------------------------------------------- |
| `model`        | `LanguageModel` | Modelo do AI SDK usado na extração (obrigatório).                |
| `systemPrompt` | `string`        | Substitui o prompt de sistema padrão (opcional).                 |

O prompt padrão está exportado como `SYSTEM_PROMPT`, útil como base para customizações:

```typescript
import { SYSTEM_PROMPT } from "@afilimax/message-text-ai-parser"

const parser = new MessageTextAiParser({
    model,
    systemPrompt: `${SYSTEM_PROMPT}\n\nIgnore ofertas de lojas fora do Brasil.`,
})
```

## Retorno

`parse(text)` retorna `Promise<Offer | null>`:

```typescript
interface Offer {
    title: string
    price: { value: number; oldValue: number | null; currency: "BRL" }
    url: string
    coupons: string[] | null
}
```

Observações:

- `price.value` e `price.oldValue` são em **reais** (ex.: `158.99`), não em centavos.
- Retorna `null` quando a mensagem não é um produto ou quando faltam título, preço ou uma URL válida.
- A extração roda com `temperature: 0` e saída estruturada validada com [zod](https://zod.dev) (`aiOfferSchema`, também exportado).

## Desenvolvimento

```bash
npm run test       # testes (Vitest, com modelo mock)
npm run lint:fix   # ESLint
npm run build      # compila para dist/
```

## Licença

MIT
