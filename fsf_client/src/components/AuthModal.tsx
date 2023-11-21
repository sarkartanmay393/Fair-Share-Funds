import React from "react";
import * as Yup from 'yup';
import {
  Modal, Box, ToggleButtonGroup,
  ToggleButton, TextField, Alert,
  CircularProgress, Snackbar
} from "@mui/material";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";

import { User } from "../interfaces";
import { useStoreActions } from "../store/typedHooks";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.default',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  borderRadius: '8px',
};

interface IAuthModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthModal = ({ open, setOpen }: IAuthModal) => {
  const [alignment, setAlignment] = React.useState('signup');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const { setUser } = useStoreActions((action) => action);

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
        setError('');
        setSuccess('');
        const loginUser = async () => {
          try {
            const resp = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            })
            const user = await resp.json() as User;
            if (resp.status !== 200) {
              setError('Error occured: try again.')
              return;
            }
            setUser(user);
            setSuccess('Successfully logged in!');
            setOpen(false);
          } catch (e) {
            setError(String(e));
          }
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
        setError('');
        setSuccess('');
        const signUser = async () => {
          try {
            const resp = await fetch('/api/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            })
            const user = await resp.json() as User;
            if (resp.status !== 200) {
              setError('Error occured: try again.')
              return;
            }
            setUser(user);
            setSuccess('Successfully created an account!');
            setOpen(false);
          } catch (e) {
            setError(String(e));
          }
        }

        signUser();
        setSubmitting(false);
      }, 400);
    },
  });

  return (
    <Modal
      open={open}
      onClose={() => {}}
      aria-labelledby="user_authentication_modal"
      aria-describedby="consists of login, signup form"
    >
      <>
        <Box width={{ mobile: '90%', tablet: 400 }} sx={{ ...style }}>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
            size="small"
            sx={{ placeSelf: 'center' }}
          >
            <ToggleButton sx={{ width: 100, fontWeight: 600 }} value="signup">Signup</ToggleButton>
            <ToggleButton sx={{ width: 100, fontWeight: 600 }} value="login">Login</ToggleButton>
          </ToggleButtonGroup>
          <Box>
            {alignment === 'login' ?
              <Box onSubmit={loginFormik.handleSubmit}
                component='form'
                display='grid'
                width='100%'
                gap={1.2}
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={loginFormik.values.email}
                  onChange={loginFormik.handleChange}
                  error={loginFormik.errors.email ? true : false}
                  helperText={loginFormik.errors.email}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  error={loginFormik.errors.password ? true : false}
                  helperText={loginFormik.errors.password}

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
                gap={1.2}
              >
                <TextField
                  fullWidth
                  variant='outlined'
                  id="name"
                  name="name"
                  label="Name"
                  value={signupFormik.values.name}
                  onChange={signupFormik.handleChange}
                  error={signupFormik.errors.name ? true : false}
                  helperText={signupFormik.errors.name}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  id="email"
                  name="email"
                  label="Email"
                  value={signupFormik.values.email}
                  onChange={signupFormik.handleChange}
                  error={signupFormik.errors.email ? true : false}
                  helperText={signupFormik.errors.email}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  id="password"
                  name="password"
                  label="Password"
                  value={signupFormik.values.password}
                  onChange={signupFormik.handleChange}
                  error={signupFormik.errors.password ? true : false}
                  helperText={signupFormik.errors.password}
                />
                <LoadingButton loading={signupFormik.isSubmitting} variant="contained" type="submit" color="secondary" loadingIndicator={
                  <CircularProgress color="inherit" size={18} />
                }>
                  Submit
                </LoadingButton>
              </Box>
            }
          </Box>
        </Box>
        <Snackbar open={Boolean(error) || Boolean(success)} autoHideDuration={2000}>
          <Alert severity={error ? "error" : "success"} sx={{ width: { xs: '100%', md: '20%' } }}>
            {error ? error : success}
          </Alert>
        </Snackbar>
      </>
    </Modal >
  );
}