import { NextResponse } from "next/server";
import OpenAI from 'openai';

const systemPrompt = `
You are a book recommendation platform specialized in taking the existing book information from the database and giving the user recommendations based on those books.

Make sure you meet these criterias:
1. Give users top 5 recommendations.
2. State the title of the book.
3. Add basic blurb of book.
4. explain why it would be a great fit for them.
`
export async function POST(req) {
    const openai = new OpenAI();
    const data = await req.json();

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt},
            ...data,
        ],
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await(const chunk of completion){
                    const conent = chunk.choices[0]?.delta?.content
                    if(content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch(error) {
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream);
}