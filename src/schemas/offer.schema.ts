import { z } from "zod"

export const aiOfferSchema = z.object({
    isProduct: z
        .boolean()
        .describe(
            "true somente se a mensagem divulga um produto específico à venda; false para cupons, avisos ou outros assuntos",
        ),
    title: z.string().nullable().describe("Nome do produto, sem emojis"),
    price: z.number().positive().nullable().describe("Preço atual em reais (BRL), como número. Ex.: 1299.9"),
    oldPrice: z.number().positive().nullable().describe("Preço antigo/riscado em reais, se informado"),
    url: z.string().nullable().describe("Link do produto presente na mensagem"),
    coupons: z.array(z.string()).nullable().describe("Códigos de cupom aplicáveis ao produto, em maiúsculas"),
})

export type AiOffer = z.infer<typeof aiOfferSchema>
