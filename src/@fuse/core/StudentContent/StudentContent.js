import * as React from "react";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import StudentService from "src/app/requests/students";
import NavLinkAdapter from "../NavLinkAdapter";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect } from "react";
import { useRef } from "react";
import FuseSvgIcon from "../FuseSvgIcon";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import withRouter from "../withRouter";
import { gridClasses } from "@mui/system";

const schema = yup.object().shape({
  AddStudentName: yup.string().required("Lütfen boş alanları doldurun"),
  AddStudentNumber: yup.string().required("Lütfen boş alanları doldurun"),
  AddClasses: yup.string().required("Lütfen boş alanları doldurun"),
});

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

function StudentContent(props) {

  const [classes, setClasses] = useState([]);
  const pageinfocu = {
    totalRowCount: 100,
    nextCursor: "ebd80b62-fce9-5080-bd65-3d50d0c6bd12",
  };
  const PAGE_SIZE = [5, 10, 20, 50];
  const [filter, setFilter] = useState();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE[2],
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowCountState, setRowCountState] = useState(0);
  const mapPageToNextCursor = useRef({});
  const { handleSubmit, control, formState, reset } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = (data) => {
    // Sadece belirli alanları kullanarak yeni öğrenci ekleme işlemini gerçekleştir
    const newData = {
      AddStudentName: data.AddStudentName,
      AddStudentNumber: data.AddStudentNumber,
      AddClasses: data.AddClasses,
    };

    StudentService.postStudent(newData).then((res) => {});
    getRequests();
    setState({ ...state, right: false });
  };

  useEffect(() => {
    if (!isLoading && pageinfocu?.nextCursor) {
      mapPageToNextCursor.current[paginationModel.page] =
        pageinfocu?.nextCursor;
    }
  }, [paginationModel.page, isLoading, pageinfocu?.nextCursor]);

  const handlePaginationModelChange = (newPaginationModel) => {
    if (
      newPaginationModel.page === 0 ||
      mapPageToNextCursor.current[newPaginationModel.page - 1]
    ) {
      setPaginationModel(newPaginationModel);
    }
  };

  const getRequests = () => {
    setIsLoading(true);
    const gidenObje = { ...paginationModel, ...filter };

    StudentService.getStudents(gidenObje).then((response) => {
      setIsLoading(false);
      setRows(response.data.data);
      setRowCountState(response.data.count);
    });
  };

  useEffect(() => {
    getRequests();
  }, [filter, paginationModel]);

  useEffect(() => {
    StudentService.getClasses().then((res) => {
      setClasses(res.data.uniqueSiniflar);
    });
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "ogrNo", headerName: "Öğrenci No", flex: 1},
    { field: "adSoyadi", headerName: "Ad soyadı", flex: 1 },
    {
      field: "sinifi",
      headerName: "Sınıf",
      flex: 1,
      flex: "end"
    },
  ];

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div style={{ width: "400px" }} className="grid mt-24 p-24 grid-cols-1">
      <h3 className="mb-12">Yeni öğrenci </h3>
      <IconButton
        className="m-4 absolute top-6 right-2 z-999"
        onClick={toggleDrawer(anchor, false)}
        size="large"
      >
        <FuseSvgIcon color="action">heroicons-outline:x</FuseSvgIcon>
      </IconButton>
      <Controller
        name="AddStudentNumber"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            error={!!errors.addStudentNumber}
            helperText={errors?.addStudentNumber?.message}
            className="mb-16"
            label="Öğrenci No"
            id="AddStudentNumber"
            variant="outlined"
            autoFocus
            fullWidth
          />
        )}
      />
      <Controller
        name="AddStudentName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors.addStudentName}
            helperText={errors?.addStudentName?.message}
            className="mb-16"
            label="Ad Soyad"
            id="AddStudentName"
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
      <Controller
        control={control}
        name="AddClasses"
        render={({ field: { onChange } }) => (
          <FormControl variant="outlined" style={{ width: "100%" }}>
            <InputLabel className="" id="test-select-label">
              Sınıfı
            </InputLabel>
            <Select
              style={{ width: "100%" }}
              labelId="test-select-label"
              label={"Sınıfı"}
              className="mb-16"
              error={!!errors.addClasses}
              helperText={errors?.addClasses?.message}
              variant="outlined"
              onChange={(e) => {
                onChange(e.target.value);
              }}
              id="demo-simple-select-standard-label"
            >
              {classes?.map((val, i) => {
                return (
                  <MenuItem value={val} key={i}>
                    {val}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      />
      <Button
        className="rounded-4 mt-12 py-12"
        variant="contained"
        color="secondary"
        disabled={_.isEmpty(dirtyFields) || !isValid}
        onClick={handleSubmit(onSubmit)} // onSubmit fonksiyonunu çağırın
      >
        Ekle
      </Button>
    </div>
  );

  function handleRowClick(params) {
    const selectedStudentId = params.row.id;
    props.navigate(`/student/${selectedStudentId}`);
  }

  const handleClick = () => {
    reset();
    setFilter({});
    getRequests();
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full flex flex-col"
    >
      <Card className="rounded-2xl px-32 py-24 w-full">
        <div className="flex gap-8">
          <h3 className="text-xl text-white font-600 mb-12">Filtreleme</h3>
          <FuseSvgIcon className="text-48" size={22}>
            heroicons-solid:filter
          </FuseSvgIcon>
        </div>
        <div className="flex gap-12">
          <Controller
            name="StudentName"
            control={control}
            render={({ field: { value } }) => (
              <TextField
                value={value}
                label="Ad Soyad"
                id="studentLabel"
                variant="outlined"
                autoFocus
                fullWidth
                onChange={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    studentName: e.target.value,
                  }));
                }}
              />
            )}
          />
          <Controller
            name="StudentNumber"
            control={control}
            render={({ field: { value } }) => (
              <TextField
                value={value}
                type="number"
                className="rounded-4"
                label="Öğrenci No"
                id="studentLabel"
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    studentNumber: e.target.value,
                  }));
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="class"
            render={({ field: { value, ref } }) => (
              <FormControl
                className="rounded-4"
                variant="outlined"
                style={{ width: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Sınıfı
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  label={"Sınıfı"}
                  variant="outlined"
                  value={value}
                  onChange={(e) => {
                    setFilter((prev) => ({
                      ...prev,
                      classValue: e.target.value,
                    }));
                  }}
                  id="demo-simple-select-standard-label"
                >
                  {classes?.map((val, i) => {
                    return (
                      <MenuItem value={val} key={i}>
                        {val}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            )}
          />
          <button type="button" onClick={handleClick}>
            Reset
          </button>
        </div>
      </Card>
      <Grid container className="mt-12 w-full">
        <Grid item xs={12} md={12}>
          <Card component={motion.div} variants={item} className=" mb-32">
            <CardContent className="px-32 py-24">
              <div className="flex items-center justify-between">
                <div className=" mb-8">
                  {["right"].map((anchor) => (
                    <React.Fragment key={anchor}>
                      <Button
                        className="rounded-4 px-24 mb-6"
                        variant="contained"
                        color="secondary"
                        onClick={toggleDrawer(anchor, true)}
                      >
                        Ekle
                      </Button>
                      <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                      >
                        {list(anchor)}
                      </SwipeableDrawer>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={{ height: "90%", width: "100%" }}>
                <DataGrid
                  rows={rows}
                  onRowClick={handleRowClick}
                  rowCount={rowCountState}
                  autoHeight
                  columns={columns}
                  pageSizeOptions={PAGE_SIZE}
                  loading={isLoading}
                  paginationMode="server"
                  onPaginationModelChange={handlePaginationModelChange}
                  onFilterModelChange={handlePaginationModelChange}
                  paginationModel={paginationModel}
                  component={NavLinkAdapter}
                  localeText={{
                    MuiTablePagination: {
                      labelDisplayedRows: ({ from, to, count }) =>
                        `${from} - ${to}`,
                      labelRowsPerPage: "Liste",
                    },
                  }}
                  sx={{
                    [`& .${gridClasses.cell}`]: {
                      px: 5,
                      pl: 0,
                    },
                  }}
                />
              </div>
              <div className="mt-3 text-end"></div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );
}

export default withRouter(StudentContent);