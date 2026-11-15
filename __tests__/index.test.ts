import { MockLanguageModelV4 } from "ai/test"
import { expect, test } from "vitest"

import { MessageTextAiParser } from "../src/index"

function parserReturning(obj: unknown) {
    return new MessageTextAiParser({
        model: new MockLanguageModelV4({
            doGenerate: async () => ({
                finishReason: "stop",
                usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
                content: [{ type: "text", text: JSON.stringify(obj) }],
                warnings: [],
            }),
        }) as any,
    })
}

test("returns offer for product", async () => {
    const r = await parserReturning({
        isProduct: true, title: "Ryzen 7", price: 1299.9, oldPrice: null,
        url: "https://a.co/x", coupons: ["ABC123"],
    }).parse("x")
    expect(r?.price.value).toBe(1299.9)
    expect(r?.coupons).toEqual(["ABC123"])
})

test("returns null for coupon-only", async () => {
    const r = await parserReturning({
        isProduct: false, title: null, price: null, oldPrice: null, url: null, coupons: null,
    }).parse("Cupom Aliexpress!!")
    expect(r).toBeNull()
})
