/* This displays the saved recommendations */

import React, { useState, useEffect } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { firestore } from "@/firebase"
import { collection, getDocs } from "firebase/firestore";
import { formatRecommendations } from '../api/responseFormat';


const SaveRecDisplay = () => {
    const [savedRec, setSavedRec] = useState([])
    const [expanded, setExpanded] = useState('panel0')

    useEffect(() => {
        const fetchRec = async () => {
            try {
                const savedRecCollection = collection(firestore, 'BookRecommendations')
                const savedRecSnapshot = await getDocs(savedRecCollection)
                const recData = savedRecSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setSavedRec(recData)
            } catch (error) {
                console.error('Error fetching recommendations:', error)
            }
        }
        
        fetchRec()
    }, [])

    const handleChange = (panel) => (event, isExpanded) => {
        if (!isExpanded) {
            const currentPanelIndex = parseInt(panel.replace('panel', ''), 10)
            if (currentPanelIndex > 0) {
                setExpanded(`panel${currentPanelIndex - 1}`)
            } else {
                setExpanded('panel0')
            }
        } else {
            setExpanded(panel)
        }
    }

    const savedFormatted = (response) =>{
        const formattingDone = formatRecommendations(response)
        console.log("Formatted Rec: ", formattingDone)
        return formattingDone
    }

    return (
        <Box display="flex" width="100%">
            <Box 
                flex="1" 
                borderRight="1px solid #ddd"
                position="sticky"
                top="0"
                overflow="hidden"
            >
                {savedRec.map((item, index) => (
                    <Accordion
                        key={item.id}
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`)}
                        className={expanded === `panel${index}` ? 'light2Brown' : ''}
                    >
                        <AccordionSummary>
                            <Typography>{item.id}</Typography>
                        </AccordionSummary>
                    </Accordion>
                ))}
            </Box>

            <Box 
                flex="3" 
                padding="30px"
                overflow="auto"
                height="100vh"
            >
                {savedRec.length === 0 ? (
                    <Typography variant="h6" align="center" className="darkBrownTxt" style={{ margin: '20px'}}>
                        There are no saved entries. Head over to the "Get Book Recommendations" button to start saving.
                    </Typography>
                ) : (
                    savedRec.map((item, index) => (
                        expanded === `panel${index}` && (
                            <Typography key={item.id}>
                                {savedFormatted(item.aiResponse)}
                            </Typography>
                        )
                    ))
                )}
            </Box>
        </Box>
    )
}

export default SaveRecDisplay