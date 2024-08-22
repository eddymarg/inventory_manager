import React from 'react'
import { Box} from '@mui/material'
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
        </Box>
    )
}

export default Header;