import React from "react";
import * as Yup from 'yup';

import { Formik, ErrorMessage, useFormik } from "formik";
import { Modal, Box, ToggleButtonGroup, ToggleButton, TextField, Button } from "@mui/material";

const style = {
  width: '100%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px'
  
};


export const WhiteBoard = () => {

  return (
    <Box sx={{ ...style }}>
    </Box>
  );
}