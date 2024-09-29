import React from 'react'
import { Box, Button, link } from '@mui/material'
import GradientText from '../ui/gradient';

const Header = () => {
    return (
        <Box
            width="100%"
            height="60px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="0 16px"
            color="#fff"
            position="fixed"
            top={0}
            left={0}
            boxShadow={2}
            zIndex="appBar"
        >
            <GradientText>
                Book Stock
            </GradientText>
            {/* <Button variant="outlined" component={link} href="/login">Login</Button>
            <Button variant="outlined" component={link} href="/signup">Sign Up</Button> */}
        </Box>
    )
}

export default Header;