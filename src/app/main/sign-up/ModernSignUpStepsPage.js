import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import Paper from "@mui/material/Paper";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import { InputAdornment } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MailService from "src/app/auth/services/mailService";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import SphereAnimation from "../sign-in/svgAnimation/SphereAnimation";
import backgroundImg from "../sign-in/img/background.png";
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  acceptTermsConditions: yup
    .boolean()
    .oneOf([true], "Kullanım şartlarını kabul etmelisiniz"),
  name: yup.string().required("Kartın üstündeki Ad ve Soyadı giriniz"),
  email: yup
    .string()
    .email("Girdiğiniz e-posta adresi değil")
    .required("Lütfen e-posta adresinizi giriniz"),
  company: yup.string().required("Lütfen Kurum adı giriniz"),
  province: yup.string().required("Lütfen İlinizi giriniz"),
  password: yup
    .string()
    .required("Lütfen şifrenizi giriniz")
    .min(8, "Şifreniz en az 8 karekter olması gerekiyor."),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  acceptTermsConditions: yup
    .boolean()
    .oneOf([true], "Lütfen kullanım şartlarını kabul edin."),
});

function ModernSignUpStepsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState("");
  const {
    control,
    formState,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (isConfirmed) => {
    setOpen(false);

    // Eğer Evet butonuna tıklandıysa Checkbox'u işaretle
    setValue("acceptTermsConditions", isConfirmed);
  };
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true);

  useEffect(() => {
    // activeStep, formState ve diğer gerekli değişkenleri kullanarak durumu kontrol et
    let isContinueButtonDisabled = false;

    const formdeger = watch();
    if (activeStep === 0) {
      isContinueButtonDisabled = !formdeger.selectedPlan;
    } else if (activeStep === 1) {
      isContinueButtonDisabled =
        !formdeger.company ||
        !formdeger.province ||
        !formdeger.email ||
        !formdeger.password ||
        !formdeger.acceptTermsConditions;

    } else if (
      formdeger.selectedPlan === "freePlan" &&
      (activeStep === 1 || activeStep === 2)
    ) {
      setActiveStep(3);
    } else if (activeStep === 2) {
      isContinueButtonDisabled =
        !formdeger.number ||
        !formdeger.name ||
        !formdeger.expiry ||
        !formdeger.cvc;
    }
    // Eğer seçilen plan "freePlan" ise ve aktif adım 1 veya 2 ise direkt adım 3'e geç

    // Buton durumunu güncelle
    setContinueButtonDisabled(isContinueButtonDisabled);
  }, [activeStep, formState, state, setValue, getValues]);

  useEffect(() => {
    setValue("company", "Deneme Şirket");
    setValue("acceptTermsConditions", true);
    setValue("email", "asd@asd.asd");
    setValue("password", "12345678");
    setValue("province", "12345678");
    setValue("password", "12345678");
  }, [activeStep]);

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit() {
    reset(defaultValues);
  }

  const handleNext = () => {
    // Eğer şu anki adım 0 ise ve bir plan seçilmişse devam et
    const formdeger = watch();

    if (activeStep == 1) {
      MailService.mailCheck({ email: formdeger.email }).then((user) => {
        if (user.islem == "mail_var") {
          dispatch(
            showMessage({
              message: "Girdiğiniz e-posta adresi sistemde kayıtlı", //text or html
              autoHideDuration: 6000, //ms
              anchorOrigin: {
                vertical: "top", //top bottom
                horizontal: "center", //left center right
              },
              variant: "error", //success error info warning null
            })
          );
        } else {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
      });
    } else if (activeStep == 2) {
      MailService.cardCheck({ card: formdeger.number }).then((user) => {
        if (user.islem == "card_var") {
          dispatch(
            showMessage({
              message: "Girdiğiniz Kart bilgileri sistemde kayıtlı", //text or html
              autoHideDuration: 6000, //ms
              anchorOrigin: {
                vertical: "top", //top bottom
                horizontal: "center", //left center right
              },
              variant: "error", //success error info warning null
            })
          );
        } else {
          dispatch(
            showMessage({
              message: "Ödeme yaptığınız için teşekkürler :)", //text or html
              autoHideDuration: 6000, //ms
              anchorOrigin: {
                vertical: "bottom", //top bottom
                horizontal: "center", //left center right
              },
              variant: "success", //success error info warning null
            })
          );
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
      });
    } else {
      if (activeStep === 0 && !!formdeger.selectedPlan) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else if (activeStep !== 0) {
        // Diğer adımlar için devam et
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }

    const selectedPlanValue = getValues("selectedPlan");
    setSelectedPlan(selectedPlanValue);
  };

  const PayPlan = () => {
    if(selectedPlan === "smallPlan" && activeStep === 2) {
      return "100TL Öde"

    }else if(selectedPlan === "bigPlan" && activeStep === 2){
      return "200TL Öde"

    }else {
      return "Devam";
    }
  };

  const handleBack = () => {
    if (activeStep === 1) {
      // Step 2'den Step 1'e geri dönerken seçilen planı aktif et
      setValue("selectedPlan", selectedPlan);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;

    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  const steps = [
    {
      label: "Plan seçmeniz gerekiyor",
      description: (
        <div>
          <h3 className="mb-5 text-lg font-medium text-black-600 dark:text-white">
            Lütfen planınızı seçiniz
          </h3>
          <ul className="grid w-full mt-12 mb-12 gap-12 md:grid-cols-1">
            <Controller
              name="selectedPlan"
              control={control}
              rules={{ required: "Bu alan zorunludur" }}
              render={({ field, fieldState }) =>
                ["freePlan", "smallPlan", "bigPlan"].map((plan) => (
                  <>
                    <li key={plan}>
                      <input
                        type="radio"
                        id={plan}
                        name={"selectedPlan"}
                        value={plan}
                        checked={field.value == plan}
                        onChange={(e) => {
                          field.onChange(plan);
                        }}
                        className="hidden peer"
                        required
                      />
                      <label
                        htmlFor={plan}
                        className={`inline-flex px-24 py-12 items-center justify-between w-full p-5 text-black-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer ${
                          fieldState?.invalid
                            ? "border-red-500"
                            : "dark:hover:text-white dark:border-gray-700 dark:peer-checked:text-white peer-checked:border-red-600 peer-checked:text-red-600 hover:text-white hover:bg-gray-100 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            {plan === "freePlan"
                              ? "Ücretsiz Plan"
                              : plan === "smallPlan"
                              ? "100 TL Plan"
                              : "200 TL Plan"}
                          </div>
                          <div className="w-full">
                            {plan === "freePlan"
                              ? "15 gün boyunca ücretsiz"
                              : plan === "smallPlan"
                              ? "Yıl - 100 Öğrenci / 1.000 Kitap"
                              : "Yıl - 1.000 Öğrenci / 10.000 Kitap"}
                          </div>
                        </div>
                        <svg
                          className="w-16 h-16 ms-3 rtl:rotate-180"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </label>
                    </li>
                  </>
                ))
              }
            />
          </ul>
        </div>
      ),
    },
    {
      label: "Kişisel bilgiler",
      description: (
        <div className="">
          <h3 className="mb-5 text-lg font-medium text-black-600 dark:text-white">
            Lütfen kişisel bilgilerinizi giriniz
          </h3>
          <Controller
            control={control}
            name="company"
            render={({ field }) => (
              <TextField
                className="mt-12 mr-12"
                {...field}
                label="Kurum Adı"
                placeholder="Kurum Adı"
                id="company"
                error={!!errors.company}
                helperText={errors?.company?.message}
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={20}>
                        heroicons-solid:office-building
                      </FuseSvgIcon>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="province"
            render={({ field }) => (
              <TextField
                className="mt-12"
                {...field}
                label="İl"
                placeholder="İl"
                id="province"
                error={!!errors.province}
                helperText={errors?.province?.message}
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField
                {...field}
                className="mt-12 mr-12"
                label="Email"
                placeholder="Email"
                variant="outlined"
                fullWidth
                error={!!errors.email}
                helperText={errors?.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mt-12"
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

          <Controller
            name="acceptTermsConditions"
            control={control}
            render={({ field }) => (
              <FormControl
                className="items-center mt-12"
                error={!!errors.acceptTermsConditions}
                {...field}
              >
                <FormControlLabel
                  label="Kullanım şartlarını kabul ediyorum"
                  className="text-blue-600"
                  onClick={handleClickOpen}
                  control={<Checkbox size="small" checked={field.value} />}
                />
                <FormHelperText>
                  {errors?.acceptTermsConditions?.message}
                </FormHelperText>
              </FormControl>
            )}
          />
        </div>
      ),
    },
    {
      label: "Ödeme yöntemi",
      description: (
        <div className="flex flex-col flex-auto items-start">
          <h3 className="mb-5 text-lg font-medium text-black-600 dark:text-white">
            Lütfen ödeme yöntemi giriniz
          </h3>
          <div className="-ml-4">
            <Cards
              number={state.number}
              expiry={state.expiry}
              cvc={state.cvc}
              name={state.name}
              focused={state.focus}
            />
          </div>
          <div className="grid w-4/5 mt-12 mr-12 mb-12 gap-6">
            <Controller
              control={control}
              name="number"
              render={({ field }) => (
                <input
                  {...field}
                  className="form-control w-full py-12 px-12 border border-gray-200 rounded-lg cursor-pointer"
                  type="number"
                  placeholder="Card Number"
                  onChange={(e) => {
                    field.onChange(e); // Bu satırı ekleyin
                    handleInputChange(e); // handleInputChange fonksiyonunu çağırın
                  }}
                  onFocus={handleInputFocus}
                />
              )}
            />
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="form-control w-full py-12 px-12 border border-gray-200 rounded-lg cursor-pointer"
                  placeholder="Name"
                  required
                  onFocus={handleInputFocus}
                  onChange={(e) => {
                    field.onChange(e); // Bu satırı ekleyin
                    handleInputChange(e); // handleInputChange fonksiyonunu çağırın
                  }}
                />
              )}
            />
            <div className="flex gap-6">
              <Controller
                control={control}
                name="expiry"
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    className="form-control w-full py-12 px-12 border border-gray-200 rounded-lg cursor-pointer"
                    placeholder="Valid Thru"
                    pattern="\d\d/\d\d"
                    required
                    onFocus={handleInputFocus}
                    onChange={(e) => {
                      field.onChange(e); // Bu satırı ekleyin
                      handleInputChange(e); // handleInputChange fonksiyonunu çağırın
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="cvc"
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    className="form-control w-full py-12 px-12 border border-gray-200 rounded-lg cursor-pointer"
                    placeholder="CVC"
                    pattern="\d{3,4}"
                    required
                    onFocus={handleInputFocus}
                    onChange={(e) => {
                      field.onChange(e); // Bu satırı ekleyin
                      handleInputChange(e); // handleInputChange fonksiyonunu çağırın
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Onaylandı",
      description: (
        <div className="mt-14">
          <h2 className=" text-lg font-medium text-black-600 dark:text-white">
            Hesabınız Oluşturuldu
          </h2>
          <p>
            Giriş ekranında mail ve şifrenizi kullanarak giriş yapabilirsiniz
          </p>
        </div>
      ),
    },
  ];

  return (
    <div style={{backgroundImage: `url(${backgroundImg})`,backgroundSize:'cover'}} className="flex flex-col flex-auto items-center sm:justify-center min-w-0 md:p-32">
      <Paper className="flex w-full sm:w-auto min-h-full sm:min-h-auto md:w-full md:max-w-6xl rounded-0 sm:rounded-2xl sm:shadow overflow-hidden">
        <div
          className="w-full sm:w-auto py-32 px-16 sm:p-48 md:p-64 ltr:border-r-1 rtl:border-l-1"
        >
          <div className="w-full max-w-480 sm:w-480 mx-auto sm:mx-0">
            <img
              className="w-96"
              src="assets/images/demo/logo.png"
              alt="logo"
            />

            <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
              Sign up
            </Typography>
            <div className="flex items-baseline mt-2 font-medium">
              <Typography>Already have an account?</Typography>
              <Link className="ml-4" to="/sign-in">
                Sign in
              </Link>
            </div>

            <form
              name="registerForm"
              noValidate
              className="flex flex-col justify-center w-full mt-32"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Box sx={{ maxWidth: 400 }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        optional={
                          index === 2 &&
                          watch("selectedPlan") === "freePlan" ? (
                            <Typography variant="caption">Ücretsiz</Typography>
                          ) : index === 3 ? (
                            <Typography variant="caption">Son Aşama</Typography>
                          ) : null
                        }
                      >
                        {step.label}
                      </StepLabel>
                      <StepContent>
                        <Typography>{step.description}</Typography>
                        <Box sx={{ mb: 2 }}>
                          <div>
                            <Button
                              className="bg-red-400"
                              variant="contained"
                              onClick={() => {
                                if (activeStep === steps.length - 1) {
                                  navigate('/sign-in');
                                } else {
                                  handleNext();
                                }
                              }}
                              sx={{ mt: 1, mr: 1 }}
                              disabled={continueButtonDisabled}
                            >
                              {activeStep === steps.length - 1
                                ? "Giriş yap"
                                : PayPlan()}
                            </Button>
                            {activeStep !== 0 && activeStep !== 3 && (
                              <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mt: 1, mr: 1 }}
                              >
                                Geri
                              </Button>
                            )}
                          </div>
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
                {activeStep === steps.length && (
                  <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                      Reset
                    </Button>
                  </Paper>
                )}
              </Box>
              {/* <Button
                variant="contained"
                color="secondary"
                className=" w-full mt-12"
                aria-label="Register"
                disabled={
                  activeStep !== steps.length ||
                  _.isEmpty(dirtyFields) ||
                  !isValid
                }
                type="submit"
                size="large"
              >
                Create your free account
              </Button> */}
            </form>
          </div>
        </div>
        <div>
          <Dialog open={open} onClose={() => handleClose(false)}>
            <DialogTitle>Kullanım Şartları</DialogTitle>
            <DialogContent>
              {"Kullanım şartlarını kabul ediyormusunuz ?"}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(false)}>Hayır</Button>
              <Button onClick={() => handleClose(true)} autoFocus>
                Evet
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <Box
          className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
          sx={{ backgroundColor: 'primary.main' }}
        >
          <svg
            className="absolute inset-0 pointer-events-none"
            viewBox="0 0 960 540"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Box
              component="g"
              sx={{ color: 'primary.light' }}
              className="opacity-20"
              fill="none"
              stroke="currentColor"
              strokeWidth="100"
            >
              <circle r="234" cx="196" cy="23" />
              <circle r="234" cx="790" cy="491" />
            </Box>
          </svg>
          <Box
            component="svg"
            className="absolute -top-64 -right-64 opacity-20"
            sx={{ color: 'primary.light' }}
            viewBox="0 0 220 192"
            width="220px"
            height="192px"
            fill="none"
          >
            <defs>
              <pattern
                id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
          </Box>

          <div className="z-10 relative w-full max-w-2xl">
            <div className="text-7xl font-bold leading-none text-gray-100">
              <div>Welcome to</div>
              <div>our community</div>
            </div>
            <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
              Fuse helps developers to build organized and well coded dashboards full of beautiful
              and rich modules. Join us and start building your application today.
            </div>
            <div className="flex items-center mt-32">
              <AvatarGroup
                sx={{
                  '& .MuiAvatar-root': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Avatar src="assets/images/avatars/female-18.jpg" />
                <Avatar src="assets/images/avatars/female-11.jpg" />
                <Avatar src="assets/images/avatars/male-09.jpg" />
                <Avatar src="assets/images/avatars/male-16.jpg" />
              </AvatarGroup>

              <div className="ml-16 font-medium tracking-tight text-gray-400">
                More than 17k people joined us, it's your turn
              </div>
            </div>
          </div>
        </Box>
      </Paper>
    </div>
  );
}

export default ModernSignUpStepsPage;
