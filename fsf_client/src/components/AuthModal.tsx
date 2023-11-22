import React from "react";
import * as Yup from 'yup';
import {
  Modal, Box, ToggleButtonGroup,
  ToggleButton, Alert,
  Snackbar
} from "@mui/material";
import { useFormik } from "formik";

import { User } from "../interfaces";
import { useStoreActions } from "../store/typedHooks";
import { LoginBox } from "./LoginBox";
import { SignupBox } from "./SignupBox";

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
            setSuccess('Successfully logged in!');
            setUser(user);
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
      onClose={() => { }}
      aria-labelledby="user_authentication_modal"
      aria-describedby="consists of login, signup form"
    >
      <React.Fragment>
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
              <LoginBox loginFormik={loginFormik} /> :
              <SignupBox signupFormik={signupFormik} />
            }
          </Box>
        </Box>
        <Snackbar open={Boolean(error) || Boolean(success)} autoHideDuration={3000}>
          <Alert severity={error ? "error" : "success"} sx={{ width: { xs: '100%', md: '20%' } }}>
            {error ? error : success}
          </Alert>
        </Snackbar>
      </React.Fragment>
    </Modal >
  );
}