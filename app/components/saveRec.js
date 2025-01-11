/* Logic behind saving the openai recommendation in firebase */
import { firestore } from "@/firebase";
import { setDoc, doc, collection, getDocs } from "firebase/firestore";

export const saveRec = async (rawRec) => {
    try {
        console.log('Recommendation:', rawRec)
        const collectionRef = collection(firestore, 'BookRecommendations')
        const snapshot = await getDocs(collectionRef)

        // handles duplicate saving
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

        const today = new Date()
        const formattedDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}-${today.getFullYear().toString().slice(2)}`;

        let count = 1
        snapshot.forEach((doc) => {
            const docId = doc.id;
            if (docId.startsWith(formattedDate)) {
                const docCount = parseInt(docId.split(': ')[1], 10);
                if (!isNaN(docCount) && docCount >= count) {
                    count = docCount + 1; 
                }
            }
        });

        const nextResName = `${formattedDate}: ${count}`

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