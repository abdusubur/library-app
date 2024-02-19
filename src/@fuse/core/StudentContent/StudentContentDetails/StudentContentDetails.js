import { useDeepCompareEffect } from "@fuse/hooks";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import withReducer from "app/store/withReducer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import _ from "@lodash";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import {
  createStudent,
  getStudentById,
  newStudent,
  removeStudent,
  resetStudent,
  saveStudent,
  selectStudent,
} from "../store/studentSlice";
import BasicInfoTab from "./tabs/BasicInfoTab";
import PictureTab from "./tabs/PictureTab";
import { Card } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import FuseSplashScreen from "@fuse/core/FuseSplashScreen";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required("You must enter a product name")
    .min(5, "The product name must be at least 5 characters"),
});

function StudentContentDetails(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const student = useSelector(selectStudent);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noStudent, setNoStudent] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, getValues, control, onChange, formState } = methods;
  const { isValid, dirtyFields } = formState;
  console.log("isvalid :", isValid);
  const form = watch();

  function handleSaveStudent() {
    const { studentId } = routeParams;
    if (studentId == "new") {
      dispatch(createStudent(getValues())).then(() => {
        navigate("/student");
      });
    } else {
      dispatch(saveStudent(getValues())).then(() => {
        navigate("/student");
      });
    }
  }

  function handleRemoveStudent() {
    dispatch(removeStudent()).then(() => {
      navigate("/student");
    });
  }

  function updateStudentState() {
    const { studentId } = routeParams;
    if (studentId === "new") {
      /**
       * Create New Product data
       */
      dispatch(newStudent());
    } else {
      /**
       * Get Product data
       */
      dispatch(getStudentById(studentId)).then((action) => {
        if (!action.payload) {
          setNoStudent(true);
        }
      });
    }
  }

  useDeepCompareEffect(() => {
    updateStudentState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!student) {
      return;
    }
    // reset({

    // })
    console.log("Hello :",student);
    student ? reset(student.student) : reset({});
  }, [student]);

  useEffect(() => {
    return () => {
      /**
       * Reset Product on component unload
       */
      dispatch(resetStudent());
      setNoStudent(false);
    };
  }, [dispatch]);

  function handleTabChange(event, value) {
    setTabValue(value);
  }

  if (noStudent) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          Seçtiğiniz öğrenci bulunamadı!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/student"
          color="inherit"
        >
          Öğrenci sayfasına git
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while product data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (student.student &&
      routeParams.studentId !== student.student.id &&
      routeParams.studentId !== "new")
  ) {
    return <FuseSplashScreen />;
  }

  return (
    <FormProvider {...methods}>
      <>
        <Card className="px-24 flex-col flex items-end">
          <div className="flex mt-6 w-full justify-between px-16">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: " h-64 border-b-1" }}
          >
            <Tab className="h-64" label="Öğrenci Bilgileri" />
          </Tabs>
          <div className="flex gap-12 items-center">
            <Link className="whitespace-nowrap px-12" to="/student">
              <FuseSvgIcon className="text-white">
                heroicons-outline:x
              </FuseSvgIcon>
            </Link>
          </div>
          </div>
          <div className="p-16 sm:p-24 w-2xl">
            <div className={tabValue !== 0 ? "hidden" : ""}>
              <BasicInfoTab />
            </div>
          </div>
          <div className="flex gap-12 pb-16 mr-20">
            <Button
              className="whitespace-nowrap rounded-4"
              variant="contained"
              color="primary"
              onClick={handleRemoveStudent}
              startIcon={
                <FuseSvgIcon className="hidden sm:flex">
                  heroicons-outline:trash
                </FuseSvgIcon>
              }
            >
              Remove
            </Button>
            <Button
              className="whitespace-nowrap px-24 rounded-4"
              variant="contained"
              color="secondary"
              onClick={handleSaveStudent}
            >
              Save
            </Button>
          </div>
        </Card>
      </>
    </FormProvider>
  );
}

export default withReducer("studentApp", reducer)(StudentContentDetails);
