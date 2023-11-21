import React from "react";
import * as Yup from 'yup';

import { Formik, useFormik } from "formik";
import { Modal, Box, ToggleButtonGroup, ToggleButton, TextField, Button, CircularProgress, Alert, Snackbar } from "@mui/material";
import { LoadingButton } from "@mui/lab";

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

interface IAuthModal {
  forceOpen: boolean;
}

export const AuthModal = ({ forceOpen }: IAuthModal) => {
  const [open, setOpen] = React.useState(forceOpen);
  const [alignment, setAlignment] = React.useState('signup');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  const loginFormik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object().shape({
      email: Yup.string().email().min(6, 'Too Short!').required('Required'),
      password: Yup.string().min(8).max(24).required('Required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        const loginUser = async () => {
          const resp = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          })
          if (resp.status === 200) {
            handleClose();
          }
          const msg = await resp.json();
          console.log(msg)
        }

        loginUser();
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
      setTimeout(() => {
        const postUser = async () => {
          const resp = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          })
        }

        postUser();
        setSubmitting(false);
      }, 400);
    },
  });

  return (
    <Modal
      open={open}
      keepMounted
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <>
        <Box sx={{ ...style, width: 500, border: '0px solid red', gap: 1, borderRadius: '8px' }}>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            sx={{ placeSelf: 'center' }}
          >
            <ToggleButton sx={{ width: 100, fontWeight: 600 }} value="signup">Signup</ToggleButton>
            <ToggleButton sx={{ width: 100, fontWeight: 600 }} value="login">Login</ToggleButton>
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
                  error={loginFormik.errors.email ? true : false}
                />
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  error={loginFormik.errors.password ? true : false}
                />
                <LoadingButton loading={loginFormik.isSubmitting} variant="contained" type="submit" color="secondary" loadingIndicator={
                  <CircularProgress color="inherit" size={18} />
                }>
                  Submit
                </LoadingButton>
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
                <Button variant="contained" type="submit" color="secondary">
                  Submit
                </Button>
              </Box>
            }
          </Formik>
        </Box>
        <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: { xs: '100%', md: '20%' } }}>
            This is a success message!
          </Alert>
        </Snackbar>
      </>
    </Modal >
  );
}