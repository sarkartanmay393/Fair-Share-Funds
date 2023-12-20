import { LoadingButton } from "@mui/lab";
import { Box, TextField, CircularProgress } from "@mui/material";
import { FormikValues } from "formik/dist/types.js";
import { ChangeEventHandler, FormEventHandler } from "react";

interface ISignupBox extends FormikValues {
  values: FormikValues;
  errors: FormikValues;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export const SignupBox = ({ signupFormik }: { signupFormik: ISignupBox }) => {
  return (
    <Box
      onSubmit={signupFormik.handleSubmit}
      component="form"
      display="grid"
      width="100%"
      gap={1.2}
    >
      <TextField
        fullWidth
        variant="outlined"
        id="name"
        name="name"
        label="Name"
        type="text"
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
        type="email"
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
        type="password"
        value={signupFormik.values.password}
        onChange={signupFormik.handleChange}
        error={signupFormik.errors.password ? true : false}
        helperText={signupFormik.errors.password}
      />
      <LoadingButton
        loading={signupFormik.isSubmitting}
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
