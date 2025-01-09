'use client'
import { useState, useEffect, useRef } from 'react'
import { Snackbar, Alert, Box, Modal, Typography, Stack, TextField, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Camera } from "react-camera-pro"
import Header from './components/Header';
import { getRecommendations } from "./api/openai";
import { formatRecommendations } from "./api/responseFormat";
import { saveRec } from './components/saveRec';
import MagicBtn from "./components/glimmerBtn";
import { addItem, removeItem, updateInventory, deleteItem } from "./components/inventoryActions"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './css/main.css'

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
  /* RECOMMENDATIONS STATE VARS*/
  const [openReccModal, setOpenReccModal] = useState(false);
  const [recommendations, setRecommendations] = useState("")
  const [rawRec, setRawRec] = useState("")
  /* confirmation close STATE VARS*/
  const [confirmMsg, setConfirmMsg] = useState(false)


  // runs update inventory when page loads
  useEffect(() => {
    updateInventory(setInventory)
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setItemName('') // clear item name when closing the modal
  }

  const handleAddItem = (itemName, image = null) => {
    if (itemName.trim()) {
      addItem(itemName.trim(), image, setInventory)
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
      // console.log('Image URL: ', image)
      addItem(photoItemName.trim(), image, setInventory)
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

  const handleReccOpen = async () => {
    try {
      const response = await getRecommendations()
      console.log("Book Recommendations:", response)
      setRawRec(response)
      const formattedRecs = formatRecommendations(response)
      setRecommendations(formattedRecs)
      setOpenReccModal(true)
    } catch(error) {
      console.error("Error fetching recommendations:", error)
    }
  }

  const handleSaveRec = async () => {
    try {
      if (!rawRec) {
        handleSnackbarOpen("No recommendations to save!", "error")
        return;
      }
      const result = await saveRec(rawRec)
      if (result.success) {
        handleSnackbarOpen(result.message, 'success')
      } else {
        handleSnackbarOpen(result.message, 'error')
      }
    } catch (error) {
      console.error("Error saving recommendations:", error)
      handleSnackbarOpen("Failed to save recommendations", "error")
    }
  }

  const handleReccClose = () => {
    setConfirmMsg(true)
  }

  const handleConfirmClose = () => {
    setOpenReccModal(false)
    setConfirmMsg(false)
  }

  const handleCancelClose = () => {
    setConfirmMsg(false)
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

      {/* Recommendations Modal */}
      <Dialog 
        open={openReccModal} 
        onClose={handleReccClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Book Recommendations</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" 
            style={{ 
              marginTop: "10px", 
              whiteSpace: "pre-line",
            }}>
            {recommendations}
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Stack
              direction="row" 
              spacing={1}
              justifyContent="center"
              marginTop={4}
            >
              <Button
                variant="contained"
                onClick={handleReccClose}
                className='generalBtn'
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveRec}
                className='generalBtnLite'
              >
                Save
              </Button>
            </Stack>
          </div>
        </DialogContent>
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmMsg}
        onClose={handleCancelClose}
        aria-labelledby="confirm-close-title"
        aria-describedby="confirm-close-description"
      >
        <DialogTitle id="confirm-close-title" className='centeredTxt'>Book Recommendations Unsaved</DialogTitle>
        <DialogContent>
          <Typography id="confirm-close-description" className='centeredTxt'>
            Are you sure you want to close this window? Your book recommendations will be deleted once closed.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent:"center"
          }}
        >
          <Button onClick={handleCancelClose} className='darkBrownTxt'>
              Cancel
          </Button>
          <Button onClick={handleConfirmClose} className='generalBtn' variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
              },
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
              },
            }}
            onClick={handleOpenPhotoModal}
          >
            Add Item by Photo
          </Button>
          <MagicBtn
            variant="contained"
            onClick={handleReccOpen}
          />
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
                  onClick={()=> addItem(name, null, setInventory)}
                >+</Button>
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#6C584C',
                    ':hover': {
                      backgroundColor: '#A98467',
                    }
                  }}
                  onClick={()=> removeItem(name, setInventory)}
                >-</Button>
                <Button 
                  variant="contained" 
                  sx={{ 
                    backgroundColor: '#6C584C',
                    ':hover': {
                      backgroundColor: '#A98467',
                    }
                  }}
                  onClick={()=> deleteItem(name, setInventory)}
                >
                  <FontAwesomeIcon icon={faTrash}/>
                </Button>
                
              </Stack>
            </Box>
          ))
        }
      </Stack>
      </Box>
    </Box>
  )
}