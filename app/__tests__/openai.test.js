const { getRecommendations } = require("../api/openai")
const { getDocs, collection, getFirestore } = require("firebase/firestore")
import OpenAI from "openai";

jest.mock("firebase/firestore", () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    getDocs: jest.fn(),
}));
  
jest.mock("firebase/app", () => ({
    initializeApp: jest.fn(),
}));
  

jest.mock("openai", () => {
    return jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: jest.fn(),
            },
        },
    }))
})

process.env.OPENAI_API_KEY = "fake-api-key"

describe("getRecommendations", () => {
    it("should return recommendations ater querying Firestore and OpenAI", async () => {
        getDocs.mockResolvedValue({
            docs: [{ id: "Book1"}, { id: "Book2"}],
        })

        const openaiResponse = {
            choices: [
                {
                    message: {
                        content: "*Blurb:* A great book\n*Why it's a great fit:* It's perfect for you.",
                    },
                },
            ],
        }

        OpenAI.mockImplementationOnce(() => ({
            chat: {
                completions: {
                    create: jest.fn().mockResolvedValue(openaiResponse),
                },
            },
        }))

        const result = await getRecommendations()

        expect(getDocs).toHaveBeenCalledWith(expect.anything())
        expect(collection).toHaveBeenCalledWith(expect.anything(), "inventory")

        expect(OpenAI().chat.completions.create).toHaveBeenCalledWith({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: expect.any(String) },
                { role: "user", content: "Here are the titles: Book1, Book2" },
            ],
        })
        expect(result.toBe("A great book \nIt's perfect for you."))
    })

    it("should return 'No book recommendations available.' if no books are found in firestore", async () => {
        getDocs.mockResolvedValue({ docs: [] })

        const result = await getRecommendations()

        expect(result).toBe("No book recommendations available.")
    })

    it("should return no recommendations available. if openAi does not return a valid response", async () => {
        getDocs.mockResolvedValue({
            docs: [{ id: "Book1" }],
        })

        OpenAI.mockImplementationOnce(() => ({
            chat: {
                completions: {
                    create: jest.fn().mockResolvedValue({ choices: [{}] }),
                },
            },
        }))
        const result = await getRecommendations()
    
        expect(result).toBe("No recommendations available.")
    })

})