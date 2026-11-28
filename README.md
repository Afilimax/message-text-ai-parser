<a href="https://afilimax.net"><img src="https://raw.githubusercontent.com/Afilimax/.github/main/assets/npm-banner.svg" alt="Afilimax — Encontre a oferta. Gere o link. Divulgue sozinho." width="100%" /></a>

[![npm version](https://img.shields.io/npm/v/%40afilimax%2Fmessage-text-ai-parser?logo=npm)](https://www.npmjs.com/package/@afilimax/message-text-ai-parser)
[![npm downloads](https://img.shields.io/npm/dm/%40afilimax%2Fmessage-text-ai-parser?logo=npm)](https://www.npmjs.com/package/@afilimax/message-text-ai-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Afilimax/message-text-ai-parser/blob/HEAD/LICENSE)
[![Website](https://img.shields.io/badge/website-afilimax.net-7857FF)](https://afilimax.net)

# @afilimax/message-text-ai-parser

Biblioteca TypeScript que usa o AI SDK para extrair produtos, preços, URLs e cupons de mensagens de ofertas. Um modelo de linguagem interpreta diferentes formatos de mensagem, sem exigir um parser específico para cada canal.

## Recursos

- Extração de ofertas por modelo de linguagem com saída estruturada.
- Compatibilidade com os modelos suportados pelo AI SDK.
- Prompt de sistema dedicado a mensagens de promoções brasileiras.
- Identificação de mensagens sem produto, como avisos e listas de cupons.
- Extração de título, preço atual, preço anterior, URL e cupons.
- Validação da saída com Zod e URLs verificadas antes do retorno.
- Temperatura fixa em `0` para reduzir variações na extração.
- Prompt de sistema personalizável.

## Instalação

```bash
npm install @afilimax/message-text-ai-parser
```

Instale separadamente o provider do AI SDK correspondente ao modelo escolhido. Por exemplo, para usar a OpenAI:

```bash
npm install @ai-sdk/openai
```

O provider do modelo não é instalado automaticamente por este pacote.

## Como usar

Crie o parser com um `LanguageModel` do AI SDK e envie o texto da mensagem:

```typescript
import { openai } from "@ai-sdk/openai"
import { MessageTextAiParser } from "@afilimax/message-text-ai-parser"

const parser = new MessageTextAiParser({
    model: openai("gpt-4.1-mini"),
})

const offer = await parser.parse(`Wireless Gaming Mouse

Price: R$ 158,99
Coupon: SAVE40

https://mercadolivre.com/sec/2yaVLgw`)

if (offer) {
    console.log("Product:", offer.title)
    console.log("Price:", offer.price.value, offer.price.currency)
    console.log("URL:", offer.url)
    console.log("Coupons:", offer.coupons)
} else {
    console.log("No product offer found")
}
```

A chamada usa as credenciais configuradas no provider do AI SDK. Consulte a documentação do provider escolhido para definir as variáveis de ambiente necessárias.

### Ignorar mensagens sem produto

```typescript
const couponNotice = await parser.parse("New discount coupons available")
const generalNotice = await parser.parse("Channel updates and announcements")

console.log("Coupon notice:", couponNotice)
console.log("General notice:", generalNotice)
```

Esses conteúdos retornam `null`, assim como supostas ofertas sem título, preço ou URL válida.

### Personalizar o prompt

Use `SYSTEM_PROMPT` como base e acrescente as regras desejadas:

```typescript
import { SYSTEM_PROMPT } from "@afilimax/message-text-ai-parser"

const parser = new MessageTextAiParser({
    model: openai("gpt-4.1-mini"),
    systemPrompt: `${SYSTEM_PROMPT}\n\nIgnore offers from stores outside Brazil.`,
})
```

Quando `systemPrompt` é informado, ele substitui o prompt padrão; por isso, inclua `SYSTEM_PROMPT` se quiser preservar as regras originais.

## Configuração

A interface `MessageTextAiParserOptions` aceita:

| Opção | Tipo | Obrigatória | Descrição |
| :--- | :--- | :--- | :--- |
| `model` | `LanguageModel` | Sim | Modelo do AI SDK usado na extração. |
| `systemPrompt` | `string` | Não | Prompt que substitui `SYSTEM_PROMPT`. |

O pacote usa `generateText` com `Output.object`, o schema `aiOfferSchema` e `temperature: 0`.

## Referência da API

### `new MessageTextAiParser(options)`

Cria um parser com o modelo e o prompt configurados.

### `parse(text: string): Promise<Offer | null>`

Envia o texto ao modelo e converte a saída estruturada para `Offer`. Retorna `null` quando a mensagem não representa um produto ou quando faltam dados essenciais.

| Campo de `Offer` | Tipo | Descrição |
| :--- | :--- | :--- |
| `title` | `string` | Nome do produto. |
| `price.value` | `number` | Preço atual em reais, como `158.99`. |
| `price.oldValue` | `number \| null` | Preço anterior em reais, quando identificado. |
| `price.currency` | `"BRL"` | Moeda da oferta. |
| `url` | `string` | URL válida encontrada na mensagem. |
| `coupons` | `string[] \| null` | Cupons encontrados ou `null`. |

### Outras exportações

| Exportação | Finalidade |
| :--- | :--- |
| `SYSTEM_PROMPT` | Prompt padrão usado na extração. |
| `aiOfferSchema` | Schema Zod da saída intermediária do modelo. |
| `Offer` | Tipo TypeScript do retorno de `parse`. |
| `AiOffer` | Tipo TypeScript inferido de `aiOfferSchema`. |
| `MessageTextAiParserOptions` | Tipo TypeScript das opções do construtor. |

## Desenvolvimento

Instale as dependências com `npm install`. Os scripts disponíveis são:

| Comando | Finalidade |
| :--- | :--- |
| `npm run dev` | Executa `src/index.ts` com `tsx`. |
| `npm run build` | Compila o TypeScript para `dist/`. |
| `npm test` | Executa o Vitest. |
| `npm run test:cov` | Executa os testes uma vez com cobertura. |
| `npm run lint` | Verifica o código com ESLint. |
| `npm run lint:fix` | Executa o ESLint com correção automática. |
| `npm run format` | Formata os arquivos de `src/` com Prettier. |

Os testes usam um modelo simulado e não exigem credenciais de IA nem chamadas externas.

## Licença

Distribuído sob a licença [MIT](./LICENSE).

---

## Automatize sua operação de afiliados

> Use este pacote para automatizar sua operação de afiliados. Conheça a plataforma Afilimax e transforme ofertas em links e divulgação automática.

[Conheça a Afilimax](https://afilimax.net) · [Pacote no npm](https://www.npmjs.com/package/@afilimax/message-text-ai-parser) · [Repositório no GitHub](https://github.com/Afilimax/message-text-ai-parser)
