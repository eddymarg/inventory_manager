import OpenAI from 'openai';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from "../../firebase"

const systemPrompt = `
You are a book recommendation platform specialized in taking the existing book information from the database and giving the user recommendations based on those books.

Make sure you meet these criterias:
1. Give users top 5 recommendations.
2. State the title of the book.
3. Add basic blurb of book.
4. explain why it would be a great fit for them.
`
export async function getRecommendations() {
    const db = getFirestore(app);
    const booksRef = collection(db, "inventory")
    const querySnapshot = await getDocs(booksRef);

    const bookTitles = querySnapshot.docs.map(doc => doc.data().title)

    const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt},
            { role: "user", content: `Here are the titles: ${bookTitles.join(", ")}`}
        ],
        stream: true,
    })

    const response = completion.choices[0]?.message?.content
    return response
}