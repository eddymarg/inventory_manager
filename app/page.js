'use client'
import Image from "next/image";
import {useState, useEffect, useRef} from 'react'
import {firestore} from '@/firebase'
import {Snackbar, Alert, Box, Modal, Typography, Stack, TextField, Button} from '@mui/material'
import {collection, query, getDocs, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore"
import { Camera } from "react-camera-pro"
import Header from './components/Header';

export default function Home() {
  const [inventory, setInventory] = useState([]) // sets inventory array
  const [open, setOpen] = useState(false) // sets state variable for add/del modal
  const [openPhotoModal, setOpenPhotoModal] = useState(false)
  const [itemName, setItemName] = useState('') // sets item. store name of item
  // default = empty string
  const [image, setImage] = useState(null)
  const [photoItemName, setPhotoItemName] = useState('')
  const cameraRef = useRef(null)
  // for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success') // success, error, warning, info
 
  // need to be async, because if it blocks while fetching site freezes
  const updateInventory = async () => {
    // snapshot of collection through query
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  // helper function to remove items
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  // helper function to add items
  const addItem = async (item, image = null) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1, image }, { merge: true})
    } else {
      await setDoc(docRef, { quantity: 1, image })
    }

    await updateInventory()
  }

  // runs update inventory when page loads
  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setItemName('') // clear item name when closing the modal
  }

  const handleAddItem = (itemName, image = null) => {
    if (itemName.trim()) {
      addItem(itemName.trim(), image)
      handleSnackbarOpen('Item added successfully!', 'success')
      setItemName('')
      handleClose()
    } else {
      handleSnackbarOpen('Item name is missing', 'error')
    }
  }

  const handleOpenPhotoModal = () => setOpenPhotoModal(true)
  const handleClosePhotoModal = () => {
    setOpenPhotoModal(false)
    setImage(null) // clear image when closing modal
    setPhotoItemName('')
  }

  const handleAddPhotoItem = () => {
    if (image && photoItemName.trim()) {
      // prompt for item name if needed or use default
      console.log('Image URL: ', image)
      addItem(photoItemName.trim(), image)
      handleClosePhotoModal()
      handleSnackbarOpen('Photo added as new item!', 'success')
    } else {
      console.error('Item name or image is missing')
      handleSnackbarOpen('Item name or image is missing', 'error')
    }
  }

  const takePhoto = () => {
    if (cameraRef.current) {
      const photo = cameraRef.current.takePhoto();
      setImage(photo);
      handleSnackbarOpen('Photo Taken!', 'info');
    }
  }

  const handleSnackbarOpen = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Header />

      {/* Add Item Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <TextField
            variant='outlined'
            fullWidth
            value={itemName}
            onChange={(e)=> setItemName(e.target.value)}
          />
          <Button 
            variant="outlined" 
            onClick={()=> handleAddItem(itemName)}>
                Add
            </Button>
        </Box>
      </Modal>

      {/* Photo-taking modal */}
      <Modal open={openPhotoModal} onClose={handleClosePhotoModal}>
        <Box
          position="absolute"
          top="50%" left="50%"
          width={400}
          bgcolor="white"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Typography variant="h5">Take a Photo to Add New Item</Typography>

          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              width="350px"  // Set desired camera width
              height="250px" // Set desired camera height
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              overflow="hidden"  // Ensure camera stays within the box
            >
              <Camera
                ref={cameraRef}
                aspectRatio={16 / 9}
                style={{ width: '100%', height: '100%' }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#6C584C',
                  ':hover': {
                    backgroundColor: '#A98467',
                  },
                  marginTop: '10px',
                }}
                onClick={takePhoto}
              >
                Take Photo
              </Button>
            </Box>
          </Box>

          {/* displays captured photo */}
          {image && (
            <Box 
              mt={2} 
              width="150px" 
              height="150px" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
            >
              <img src={image} alt='Taken photo' style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </Box>
          )}

          {/* enter item name */}
          <TextField
            variant='outlined'
            fullWidth
            label="Item Name"
            value={photoItemName}
            onChange={(e) => setPhotoItemName(e.target.value)}
          />

          <Stack direction="row" spacing={2}>
            {/* button to take photo */}

            {/* button to add item */}
            <Button
              variant="outlined"
              sx={{
                color: '#FFFFFF',
                backgroundColor: '#6C584C',
                ':hover': {
                  backgroundColor: '#A98467',
                },
                marginTop: '10px',
              }}
              onClick={handleAddPhotoItem}
            >
              Add Photo as New Item
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* notification handling */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center'}} //positioning of snackbar
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%'}}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Main Buttons */}
      <Box
        width="100%"
        display="flex"
        justifyContent="flex-end"
        spacing={2}
        px={2}
        sx={{
          top: 16,
          right: 16
        }}
      >
        <Stack 
          direction="row" 
          spacing={2}
          display="flex"
          justifyContent="center"
        >
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: '#6C584C',
              ':hover': {
                backgroundColor: '#A98467',
              }
            }}
            onClick={()=>{
            handleOpen()
          }}>
            Add New Item
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#6C584C',
              ':hover': {
                backgroundColor: '#A98467',
              }
            }}
            onClick={handleOpenPhotoModal}
          >
            Add Item by Photo
          </Button>
        </Stack>
      </Box>

      <Box>
        <Box 
          width="100%" 
          height="2.5vw" 
          bgcolor="#B69983" 
          display="flex"
          alignItems="center" 
          justifyContent="center">
          {/* <Typography variant="h5" color='#333'>
            Inventory Items
          </Typography> */}
        </Box>
      <Stack width="100vw" height="50vh" spacing={2} overflow="auto">
        {
          inventory.map(({name, quantity, image})=>(
            <Box 
            key={name} 
            width="100%" 
            minHeight="50px" 
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor='#f0f0f0'
            padding={5}
            >
              <Stack direction="row" spacing={2}>
                <Typography variant="h5" color='#333' textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>

                {/* display image if it exists */}
                {image && (
                  <img
                    src={image}
                    alt={name}
                    style={{ width: '50px', height: '50px', borderRadius: '5px'}}
                  />
                )}
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography variant="h5" color='#333' textAlign="center">
                  {quantity}
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#6C584C',
                    ':hover': {
                      backgroundColor: '#A98467',
                    }
                  }}
                  onClick={()=> addItem(name)}
                >+</Button>
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#6C584C',
                    ':hover': {
                      backgroundColor: '#A98467',
                    }
                  }}
                  onClick={()=> removeItem(name)}
                >-</Button>
              </Stack>
            </Box>
          ))
        }
      </Stack>
      </Box>
    </Box>
  )
}
