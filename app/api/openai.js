// import { NextResponse } from "next/server";
"use server";
import OpenAI from 'openai'
import { collection, getDocs} from "firebase/firestore"
import { firestore } from "../../firebase";
import dotenv from "dotenv"
dotenv.config()

const systemPrompt = `
You are a book recommendation platform specialized in taking the existing book information from the database and giving the user new recommendations based on those books.

Make sure you meet these criterias:
1. Give users new top 5 recommendations.
2. State the title of the new book.
3. Add basic blurb of book.
4. explain why it would be a great fit for them.

separate the blurb and why it's a great fit by putting the paragraphs on new lines
`
export async function getRecommendations() {
    const booksRef = collection(firestore, "inventory") // Adjust the path to your Firestore collection name
    const querySnapshot = await getDocs(booksRef)
  
    const bookTitles = querySnapshot.docs.map(doc => doc.id) // Assuming the field name is 'title'

    // console.log("Book Titles:", bookTitles)
  
    if (!bookTitles || bookTitles.length === 0) {
      console.log("No books found in the database.")
      return "No book recommendations available."
    }
  
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here are the titles: ${bookTitles.join(", ")}` },
      ],
    })
  
    // Ensure the response is not undefined
    const response = completion?.choices?.[0]?.message?.content
    if (!response) {
      console.error("No response content received from OpenAI.")
      return "No recommendations available."
    }

    // removes weird markdown formatting
    const cleanedResponse = response
      .replace(/\*Blurb:\*/g, "")
      .replace(/\*Why it's a great fit:\*/g, "")
      .replace(/\*/g, "")
  
    return cleanedResponse
}