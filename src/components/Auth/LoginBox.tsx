import { LoadingButton } from "@mui/lab";
import { Box, TextField, CircularProgress } from "@mui/material";
import { FormikValues } from "formik";
import { FormEventHandler, ChangeEventHandler } from "react";

interface ILoginBox {
  values: FormikValues;
  errors: FormikValues;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  isSubmitting: boolean;
}

export const LoginBox = ({ loginFormik }: { loginFormik: ILoginBox }) => {
  return (
    <Box
      onSubmit={loginFormik.handleSubmit}
      component="form"
      display="grid"
      width="100%"
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
      <LoadingButton
        loading={loginFormik.isSubmitting}
        variant="contained"
        type="submit"
        color="secondary"
        loadingIndicator={<CircularProgress color="inherit" size={18} />}
      >
        Submit
      </LoadingButton>
    </Box>
  );
};
