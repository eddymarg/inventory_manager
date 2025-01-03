import React from 'react'
import { Button } from '@mui/material'
import '../css/button.css';

const MagicBtn = ({ onClick }) => {
    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={onClick}
            className="magic-btn"
        >
            Get Book Recommendations
        </Button>
    )
}

export default MagicBtn