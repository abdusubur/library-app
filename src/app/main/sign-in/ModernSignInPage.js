import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import jwtService from "../../auth/services/jwtService";
import SphereAnimation from "./svgAnimation/SphereAnimation";
import backgroundImg from "./img/background.png";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(4, "Password is too short - must be at least 4 chars."),
});

const defaultValues = {
  email: "",
  password: "",
  remember: true,
};

function ModernSignInPage() {
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    setValue("email", "admin@fusetheme.com", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("password", "admin", { shouldDirty: true, shouldValidate: true });
  }, [setValue]);

  function onSubmit({ email, password }) {
    jwtService
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        // No need to do anything, user data will be set at app/auth/AuthContext
      })
      .catch((_errors) => {
        _errors.forEach((error) => {
          setError(error.type, {
            type: "manual",
            message: error.message,
          });
        });
      });
  }

  return (
    <div style={{backgroundImage: `url(${backgroundImg})`,backgroundSize:'cover'}} className="flex flex-col flex-auto items-center sm:justify-center min-w-0 md:p-32">
      <Paper className="flex w-full bg-[#252423] sm:w-auto min-h-full sm:min-h-auto md:w-full md:max-w-6xl rounded-0 sm:rounded-2xl sm:shadow overflow-hidden">
        <div className="w-full sm:w-auto py-32 px-16 sm:p-48 md:p-64 ltr:border-r-1 rtl:border-l-1">
          <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
            <img
              className="w-96"
              src="assets/images/demo/logo.png"
              alt="logo"
            />

            <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
              Sign in
            </Typography>
            <div className="flex items-baseline mt-2 font-medium">
              <Typography>Don't have an account?</Typography>
              <Link className="ml-4" to="/sign-up">
                Sign up
              </Link>
            </div>

            <form
              name="loginForm"
              noValidate
              className="flex flex-col justify-center w-full mt-32"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Email"
                    autoFocus
                    type="email"
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Password"
                    type="password"
                    error={!!errors.password}
                    helperText={errors?.password?.message}
                    variant="outlined"
                    required
                    fullWidth
                  />
                )}
              />

              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
                <Controller
                  name="remember"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormControlLabel
                        label="Remember me"
                        control={<Checkbox size="small" {...field} />}
                      />
                    </FormControl>
                  )}
                />

                <Link
                  className="text-md font-medium"
                  to="/pages/auth/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                variant="contained"
                color="secondary"
                className=" w-full mt-16"
                aria-label="Sign in"
                disabled={_.isEmpty(dirtyFields) || !isValid}
                type="submit"
                size="large"
              >
                Sign in
              </Button>

              <div className="flex items-center mt-32">
                <div className="flex-auto mt-px border-t" />
                <Typography className="mx-8" color="text.secondary">
                  Or continue with
                </Typography>
                <div className="flex-auto mt-px border-t" />
              </div>

              <div className="flex items-center mt-32 space-x-16">
                <Button variant="outlined" className="flex-auto">
                  <FuseSvgIcon size={20} color="action">
                    feather:facebook
                  </FuseSvgIcon>
                </Button>
                <Button variant="outlined" className="flex-auto">
                  <FuseSvgIcon size={20} color="action">
                    feather:twitter
                  </FuseSvgIcon>
                </Button>
                <Button variant="outlined" className="flex-auto">
                  <FuseSvgIcon size={20} color="action">
                    feather:github
                  </FuseSvgIcon>
                </Button>
              </div>
            </form>
          </div>
        </div>
      <SphereAnimation />
      </Paper>
    </div>
  );
}

export default ModernSignInPage;
