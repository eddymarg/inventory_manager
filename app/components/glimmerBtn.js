import React from 'react'
import { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material'
import '../css/button.css';

const MagicBtn = ({ onClick }) => {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        try {
            await onClick()
        } finally {
            setLoading(false)
        }
    }
    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={handleClick}
            className="magic-btn"
            disabled={loading}
        >
            {loading ? (
                <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={20} color="inherit"/>
                    Loading...
                </Box>
            ):(
                "Get Book Recommendations"
            )}
        </Button>
    )
}

export default MagicBtn