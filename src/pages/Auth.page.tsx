import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ToggleButton, Alert, Box, ToggleButtonGroup } from "@mui/material";
import { Navigate } from "react-router-dom";

import { LoginBox } from "../components/Auth/LoginBox.tsx";
import { SignupBox } from "../components/Auth/SignupBox.tsx";
import { useStoreActions, useStoreState } from "@/store/typedHooks.ts";
import supabase from "@/utils/supabase/supabase.ts";
import { UserData } from "@/interfaces/index.ts";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.default",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  borderRadius: "8px",
};

export const AuthPage = () => {
  const [alignment, setAlignment] = React.useState("login");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState({ message: "", spec: "" });
  const { user } = useStoreState((state) => state);
  const { setUser } = useStoreActions((actions) => actions);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    event.preventDefault();
    setAlignment(newAlignment);
  };

  const loginFormik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object().shape({
      email: Yup.string().email().min(6, "Too Short!").required("Required"),
      password: Yup.string().min(8).max(24).required("Required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setError("");
      setSuccess({ spec: "", message: "" });
      const loginUser = async () => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            ...values,
          });
          
          if (error) {
            throw error;
          }

          setUser(data.user);
          setSuccess({ spec: "login", message: "Successfully logged in!" });
          setSubmitting(false);
        } catch (e) {
          setError(String(e));
          setSubmitting(false);
        }
      };

      loginUser();
    },
  });

  const signupFormik = useFormik({
    initialValues: { email: "", password: "", name: "", username: "" },
    validationSchema: Yup.object().shape({
      email: Yup.string().email().min(6, "Too Short!").required("Required"),
      password: Yup.string().min(8).max(24).required("Required"),
      name: Yup.string().min(2).max(16).required("Required"),
      username: Yup.string().min(6).max(12).required("Required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setError("");
      setSuccess(() => ({ spec: "", message: "" }));

      const signUser = async () => {
        try {
          const { data: exstUsername } = await supabase
            .from("users")
            .select()
            .eq("username", values.username)
            .single();

          if (exstUsername) {
            setError("This username already exists.");
            setSubmitting(false);
            return;
          }

          const { data, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
          });
          if (error) {
            setError(error.message);
            throw error;
          }

          if (!data.user) {
            setError("There's an issue creating new user.");
            throw new Error("There's an issue creating new user.");
          }

          const newUser: UserData = {
            name: values.name,
            email: values.email,
            id: data.user.id,
            username: values.username,
            rooms_id: [],
          };

          const { error: error2 } = await supabase
            .from("users")
            .insert(newUser);

          if (error2) {
            if (data.user?.identities) {
              supabase.auth.unlinkIdentity(data.user.identities[0]);
            }
            setError(error2.message);
            throw error;
          }

          setSuccess(() => ({
            spec: "signup",
            message: "Successfully created an account!",
          }));

          setSubmitting(false);
        } catch (e) {
          // setError(()String(e));
          setSubmitting(false);
        }
      };

      signUser();
    },
  });

  // useEffect(() => {
  //   if (success.spec === "login") {
  // navigate("/");
  //   }

  // console.log(typeof loginFormik);
  // }, [success]);

  return (
    <React.Fragment>
      {user && <Navigate to="/" />}
      <Box width={{ xs: "90%", sm: 400 }} sx={{ ...style }}>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
          size="small"
          sx={{ placeSelf: "center", ".Mui-selected": { opacity: 1 } }}
        >
          <ToggleButton
            sx={{ width: 100, fontWeight: 600, opacity: 0.5 }}
            value="signup"
          >
            Signup
          </ToggleButton>
          <ToggleButton
            sx={{ width: 100, fontWeight: 600, opacity: 0.5 }}
            value="login"
          >
            Login
          </ToggleButton>
        </ToggleButtonGroup>
        <Box>
          {alignment === "login" ? (
            <LoginBox loginFormik={loginFormik} />
          ) : (
            <SignupBox signupFormik={signupFormik} />
          )}
        </Box>
      </Box>
      {/* <Snackbar open={Boolean(error) || Boolean(success)} autoHideDuration={2000} >*/}
      {error && (
        <Alert
          severity="error"
          sx={{
            width: { xs: "100%", md: "20%" },
            position: "absolute",
            bottom: 0,
            left: 0,
          }}
        >
          {error}
        </Alert>
      )}
      {success.message && (
        <Alert
          severity="success"
          sx={{
            width: { xs: "100%", md: "20%" },
            position: "absolute",
            bottom: 0,
            left: 0,
          }}
        >
          {success.message}
        </Alert>
      )}
      {/* </Snackbar> */}
    </React.Fragment>
  );
};
