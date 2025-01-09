import { firestore } from '@/firebase'
import { collection, query, getDocs, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore"

// need to be async, because if it blocks while fetching site freezes
export const updateInventory = async (setInventory) => {
    try {
        // snapshot of collection through query
        const snapshot = await getDocs(query(collection(firestore, 'inventory')))
        const inventoryList = snapshot.docs.map(doc => ({
            name: doc.id,
            ...doc.data(),
        }))
        setInventory(inventoryList)
    } catch (error) {
        console.error('Error updating inventory:', error)
    }
}

// helper function to add items
export const addItem = async (item, image = null, setInventory) => {
    try{
        const docRef = doc(collection(firestore, 'inventory'), item)
        const docSnap = await getDoc(docRef)
        
        if(docSnap.exists()){
            const { quantity, ...existingData } = docSnap.data()
            await setDoc(docRef, { quantity: quantity + 1, image: image || existingData.image }, { merge: true})
        } else {
            await setDoc(docRef, { quantity: 1, image })
        }
        await updateInventory(setInventory)
    } catch(error) {
        console.error('Error adding item: ', error)
    }
}

// helper function to remove items
export const removeItem = async (item, setInventory) => {
    try{
        const docRef = doc(collection(firestore, 'inventory'), item)
        const docSnap = await getDoc(docRef)
    
        if(docSnap.exists()){
          const { quantity, ...existingData } = docSnap.data()
            if (quantity === 1) {
                await deleteDoc(docRef)
            } else {
                await setDoc(docRef, {quantity: quantity - 1, image: existingData.image }, { merge: true})
            }
        }
    
        await updateInventory(setInventory)
    } catch(error) {
        console.error('Error removing item:', error)
    }
  }


export const deleteItem = async (item, setInventory) => {
    try {
        const docRef = doc(collection(firestore, 'inventory'), item)
        await deleteDoc(docRef);
        await updateInventory(setInventory)
    } catch (error) {
        console.error('Error deleting item:', error)
    }
}