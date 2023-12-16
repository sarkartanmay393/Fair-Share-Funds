import React from "react";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { ToggleButton, Alert, Box, ToggleButtonGroup } from "@mui/material";

import { LoginBox } from "../components/LoginBox";
import { SignupBox } from "../components/SignupBox";
import { useSupabaseContext } from "../provider/supabase/provider";
import { Navigate, useNavigate } from "react-router-dom";
import { useStoreActions } from "../store/typedHooks";
import { User } from "../interfaces";

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

export const AuthPage = () => {
  const [alignment, setAlignment] = React.useState('login');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const { supabase, session } = useSupabaseContext();
  const { setUser } = useStoreActions((a) => a);

  const navigate = useNavigate();

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    event.preventDefault();
    setAlignment(newAlignment);
  };

  const navigateToHome = () => navigate("/");

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
            const resp = await supabase?.auth.signInWithPassword({
              ...values
            });
            if (resp && resp.error) {
              setError(resp.error.message);
              return;
            }

            setSuccess('Successfully logged in!');
            navigateToHome();
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
            const resp = await supabase?.auth.signUp({
              email: values.email,
              password: values.password,
            });
            if (resp && resp.error) {
              setError(resp.error.message);
              return;
            }
            setSuccess('Successfully created an account!');

            const newUser: User = {
              name: values.name,
              email: values.email,
              id: resp?.data.user?.id as string,
              username: values.email.split('@')[0],
              rooms_id: null,
            };

            const { error } = await supabase!.from('users').insert(newUser);
            if (error) {
              setError(error.message);
              return;
            }

            const loginResp = await supabase?.auth.signInWithPassword({
              email: values.email,
              password: values.password
            });
            if (loginResp && loginResp.error) {
              setError(loginResp.error.message);
              return;
            }

          } catch (e) {
            setError(String(e));
          }
        }

        signUser();
        setSubmitting(false);
      }, 400);
    },
  });

  // if (session?.user.id) {
  //   navigate(-1);
  // }

  return (
    <React.Fragment>
      {session && <Navigate to='/' />}
      <Box width={{ xs: '90%', sm: 400 }} sx={{ ...style }}>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
          size="small"
          sx={{ placeSelf: 'center', '.Mui-selected': { opacity: 1 } }}
        >
          <ToggleButton sx={{ width: 100, fontWeight: 600, opacity: 0.5 }} value="signup">Signup</ToggleButton>
          <ToggleButton sx={{ width: 100, fontWeight: 600, opacity: 0.5 }} value="login">Login</ToggleButton>
        </ToggleButtonGroup>
        <Box>
          {alignment === 'login' ?
            <LoginBox loginFormik={loginFormik} /> :
            <SignupBox signupFormik={signupFormik} />
          }
        </Box>
      </Box>
      {/* <Snackbar open={Boolean(error) || Boolean(success)} autoHideDuration={2000} >*/}
      {error && <Alert severity="error" sx={{ width: { xs: '100%', md: '20%' }, position: 'absolute', bottom: 0, left: 0 }}>
        {error}
      </Alert>}
      {success && <Alert severity="success" sx={{ width: { xs: '100%', md: '20%' }, position: 'absolute', bottom: 0, left: 0 }}>
        {success}
      </Alert>}
      {/* </Snackbar> */}
    </React.Fragment>
  );
}