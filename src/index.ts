import { generateText, Output, type LanguageModel } from "ai"

import { SYSTEM_PROMPT } from "./prompt"
import { AiOffer, aiOfferSchema } from "./schemas/offer.schema"

export interface Offer {
    title: string
    price: { value: number; oldValue: number | null; currency: "BRL" }
    url: string
    coupons: string[] | null
}

export interface MessageTextAiParserOptions {
    model: LanguageModel
    systemPrompt?: string
}

export class MessageTextAiParser {
    constructor(private readonly options: MessageTextAiParserOptions) {}

    async parse(text: string): Promise<Offer | null> {
        const { output } = await generateText({
            model: this.options.model,
            output: Output.object({ schema: aiOfferSchema }),
            system: this.options.systemPrompt ?? SYSTEM_PROMPT,
            prompt: text,
            temperature: 0,
        })

        return toOffer(output)
    }
}

function toOffer(data: AiOffer): Offer | null {
    if (!data.isProduct || !data.title || !data.price || !data.url) return null

    try {
        new URL(data.url)
    } catch {
        return null
    }

    return {
        title: data.title,
        price: { value: data.price, oldValue: data.oldPrice, currency: "BRL" },
        url: data.url,
        coupons: data.coupons && data.coupons.length > 0 ? data.coupons : null,
    }
}

export { SYSTEM_PROMPT, aiOfferSchema }
export type { AiOffer }
