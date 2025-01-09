import { firestore } from "@/firebase";
import { setDoc, doc, collection, getDocs } from "firebase/firestore";

export const saveRec = async (rawRec) => {
    try {
        console.log('Recommendation:', rawRec)
        const collectionRef = collection(firestore, 'BookRecommendations')
        const snapshot = await getDocs(collectionRef)

        let isDuplicate = false;
        snapshot.forEach((doc) => {
            const data = doc.data()
            if(data.aiResponse === rawRec) {
                isDuplicate = true
            }
        })

        if (isDuplicate) {
            return { success: false, message: 'These recommendations have already been saved.'}
        }

        let minNumber = 0
        snapshot.forEach((doc) => {
            const id = doc.id;
            if(id.startsWith('savedResponse')) {
                const number = parseInt(id.replace('savedResponse', ''), 10)
                if(!isNaN(number) && number > minNumber) {
                    minNumber = number
                }
            }
        })

        const nextResName = `savedResponse${minNumber + 1}`

        const docRef = doc(firestore, 'BookRecommendations', nextResName)
        console.log('Document Reference:', docRef);
        await setDoc(docRef, { aiResponse: rawRec })
        console.log(`Document written with Id: ${nextResName}`)
        return { success: true, message: 'Recommendation saved successfully!'}
    } catch (error) {
        console.error('Error adding document: ', error)
        return { success: false, message: 'Failed to save recommendation.'}
    }
}