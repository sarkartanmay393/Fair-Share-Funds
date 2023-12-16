import React from 'react'
import { SxProps, Theme, styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
import { Transaction } from '../../interfaces';


const DisplayInputs = (props: Transaction) => {
    
  return (
    <Box sx={{ border: '1px solid red', position: 'fixed', bottom: 80, width: '100%', display: 'flex', justifyContent: "space-between", paddingX: '15px', paddingY: "10px" }}>
        
        <Box sx={{display: "flex", gap: "20px"}}>
            <Box sx={{}}>
                <Avatar>D</Avatar>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column",  }}>
                <Typography
                sx={{ fontSize: "15px",}}
                >
                    {props.from}
                </Typography>

                <Typography
                sx={{ fontSize: "12px",}}
                >
                    {props.type} {props.to}
                </Typography>
            </Box>
        </Box>
        
        <Box sx={{display: "flex", alignItems: "center", }}>
            <Typography
            sx={{ fontSize: "15px", fontWeight: "600"}}
            >
                {props.amount} rs
            </Typography>
        </Box>
    </Box>
  )
}

export default DisplayInputs