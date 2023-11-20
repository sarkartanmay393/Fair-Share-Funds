import React from "react";
import { Box, Button, Modal, TextField, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { Formik, ErrorMessage, useFormik } from "formik";
import * as Yup from 'yup';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  display: 'flex',
  flexDirection: 'column',
};

function App() {
  const theme = useTheme();

  const [open, setOpen] = React.useState(true);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [alignment, setAlignment] = React.useState('signup');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  const loginFormik = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 400);
    },
  });

  const signupFormik = useFormik({
    initialValues: { email: '', password: '', name: '' },
    validationSchema: Yup.object().shape({
      email: Yup.string().email().min(6, 'Too Short!').required('Required'),
      password: Yup.string().min(8).max(24).required('Required'),
      name: Yup.string().min(2).max(16).required('Required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      console.log(values)
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 400);
    },
  });

  return (
    <Box width='100vw' height='100vh' color='white' bgcolor={theme.palette.background.default}
      display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
      <Typography fontSize={32}>Authenticated!</Typography>

      <Modal
        open={open}
        onClose={handleClose}
        keepMounted
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 500, border: '0px solid red', gap: 1, borderRadius: '8px' }}>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            sx={{ placeSelf: 'center' }}
          >
            <ToggleButton sx={{ width: 100 }} value="signup">Signup</ToggleButton>
            <ToggleButton sx={{ width: 100 }} value="login">Login</ToggleButton>
          </ToggleButtonGroup>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {alignment === 'login' ?
              <Box onSubmit={loginFormik.handleSubmit}
                component='form'
                display='grid'
                width='100%'
                gap={1}
              >
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={loginFormik.values.email}
                  onChange={loginFormik.handleChange}
                />
                <ErrorMessage name="email" component="div" />
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                />
                <ErrorMessage name="password" component="div" />
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Box> :
              <Box onSubmit={signupFormik.handleSubmit}
                component='form'
                display='grid'
                width='100%'
                gap={1}
              >
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  value={signupFormik.values.name}
                  onChange={signupFormik.handleChange}
                  error={signupFormik.errors.name ? true : false}
                />
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={signupFormik.values.email}
                  onChange={signupFormik.handleChange}
                  error={signupFormik.errors.email ? true : false}
                />
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  value={signupFormik.values.password}
                  onChange={signupFormik.handleChange}
                  error={signupFormik.errors.password ? true : false}
                />
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Box>
            }
          </Formik>
        </Box>
      </Modal >
    </Box >
  );
}

export default App;
