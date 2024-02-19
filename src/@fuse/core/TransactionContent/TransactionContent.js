import * as React from "react";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
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
import TransactionService from "src/app/requests/transaction";
import BooksService from "src/app/requests/books";
import { DateTimePicker } from "@mui/x-date-pickers";

const schema = yup.object().shape({
  addBookName: yup.string().required("Lütfen boş alanları doldurun"),
});

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

function TransactionContent(props) {
  const [classes, setClasses] = useState([]);
  const pageinfocu = {
    totalRowCount: 100,
    nextCursor: "ebd80b62-fce9-5080-bd65-3d50d0c6bd12",
  };
  const PAGE_SIZE = [5, 10, 20, 50];
  const [filter, setFilter] = useState();
  const [book, setBook] = useState([]);
  const [studentByNumber, setStudentByNumber] = useState([]);
  const [bookByName, setBookByName] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE[2],
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowCountState, setRowCountState] = useState(0);
  const mapPageToNextCursor = useRef({});
  const { handleSubmit, control, formState, setValue, reset, watch } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const start = watch("start");
  const end = watch("end");

  const onSubmit = (data) => {
    // Sadece belirli alanları kullanarak yeni öğrenci ekleme işlemini gerçekleştir
    const newData = {
      // addStudentNumber: data.data.addStudentNumber,
      // addStudentName: data.data.addStudentName,
      // addClasses: data.data.addClasses,
      // addPublisher: data.data.addPublisher,
      // addWriter: data.data.addWriter,
      data: data,
    };

    TransactionService.postStudentBook(newData).then((res) => {});
    console.log("Yeni veriler :", newData);
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
    const studentById = { ...studentByNumber };
    const booksByName = { ...bookByName };

    TransactionService.getStudents(gidenObje).then((response) => {
      console.log("Giden obje :", gidenObje)
      setIsLoading(false);
      setRows(response.data.data);
      setRowCountState(response.data.count);
    });
    TransactionService.getStudentsByNumber(studentById).then((res) => {
      setValue("addStudentName", res.data.adSoyadi);
      setValue("addClasses", res.data.sinifi);
    });
    TransactionService.getBookByName(booksByName).then((res) => {
      console.log("Book NAme :", res.data);
      setValue("addWriter", res.data.yazar);
      setValue("addPublisher", res.data.yayinevi);
    });
  };

  useEffect(() => {
    getRequests();
  }, [filter, paginationModel, studentByNumber, bookByName]);

  useEffect(() => {

    StudentService.getStudents().then((res) => {
      setFilterStudent(res.data.no);
    });
    BooksService.getBookName().then((res) => {
      setBook(res.data.bookName);
    });
  }, []);

  const columns = [
    { field: "kitapAdi", headerName: "Aldığı Kitap", flex: 1 },
    { field: "ogrNo", headerName: "Öğrenci No", flex: 1 },
    { field: "adSoyadi", headerName: "Ad Soyadı", flex: 1 },
    {
      field: "sinifi",
      headerName: "Sınıf",
      flex: 1,
      flex: "end",
    },
    { field: "durumu", headerName: "Durumu", flex: 1 }
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
      <h3 className="mb-12">Yeni İşlem</h3>
      <IconButton
        className="m-4 absolute top-6 right-2 z-999"
        onClick={toggleDrawer(anchor, false)}
        size="large"
      >
        <FuseSvgIcon color="action">heroicons-outline:x</FuseSvgIcon>
      </IconButton>
      <Controller
        name="addStudentNumber"
        control={control}
        render={({ field: { value, onChange } }) => (
          <TextField
            value={value}
            error={!!errors.addStudentNumber}
            helperText={errors?.addStudentNumber?.message}
            className="mb-16 mt-12"
            label="Öğrenci No"
            id="addStudentNumber"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              if (e.target.value.length === 5) {
                onChange(e.target.value);
                setStudentByNumber((prev) => ({
                  ...prev,
                  studentNumber: e.target.value,
                }));
              } else {
                reset({
                  addStudentName: "",
                  addClasses: "",
                  addBookName: "",
                });
              }
            }}
            required
            fullWidth
          />
        )}
      />

      <Controller
        name="addStudentName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            disabled
            error={!!errors.addStudentName}
            helperText={errors?.addStudentName?.message}
            className="mb-16"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            label="Ad Soyad"
            id="addStudentName"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Controller
        name="addClasses"
        control={control}
        render={({ field }) => (
          <TextField
            disabled
            {...field}
            error={!!errors.addClasses}
            helperText={errors?.addClasses?.message}
            className="mb-16"
            label="Sınıfı"
            id="addClasses"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="addBookName"
        control={control}
        render={({ field: { onChange } }) => (
          <Autocomplete
            className="w-full mb-16"
            disablePortal
            id="addBookName"
            options={book}
            onSelect={(e) => {
              if (onChange(e.target.value)) {
                setBookByName((prev) => ({
                  ...prev,
                  bookName: e.target.value,
                }));
              }
            }}
            sx={{ width: 300 }}
            renderInput={(value) => (
              <TextField
                {...value}
                label="Kitap Adı"
                onChange={(e) => {
                  onChange(e.target.value);
                }}
              />
            )}
          />
        )}
      />

      <Controller
        name="addWriter"
        control={control}
        render={({ field }) => (
          <TextField
            disabled
            {...field}
            error={!!errors.addWriter}
            helperText={errors?.addWriter?.message}
            className="mb-16"
            label="Yazar"
            id="addWriter"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Controller
        name="addPublisher"
        control={control}
        render={({ field }) => (
          <TextField
            disabled
            {...field}
            error={!!errors.addPublisher}
            helperText={errors?.addPublisher?.message}
            className="mb-16"
            label="Yayın Evi"
            id="addPublisher"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="startDate"
        control={control}
        render={({ field: { onChange } }) => (
          <DateTimePicker
          required
            className="mt-8 mb-16 w-full"
            onChange={onChange}
            slotProps={{
              textField: {
                label: "Başlanma Tarihi",
                variant: "outlined",
              },
            }}
            maxDate={end}
          />
        )}
      />

      <Controller
        name="endDate"
        control={control}
        defaultValue=""
        render={({ field: { onChange } }) => (
          <DateTimePicker
            className="mt-8 mb-16 w-full"
            required
            onChange={onChange}
            slotProps={{
              textField: {
                label: "Bitiş Tarihi",
                variant: "outlined",
              },
            }}
            minDate={start}
          />
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
    props.navigate(`/transaction/${selectedStudentId}`);
  }

  const handleClick = () => {
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
            name="BooksName"
            control={control}
            render={({ field: { value } }) => (
              <TextField
                value={value}
                label="Kitap Adı"
                id="BooksName"
                variant="outlined"
                autoFocus
                fullWidth
                onChange={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    booksName: e.target.value,
                  }));
                }}
              />
            )}
          />
          <Controller
            name="StudentName"
            control={control}
            render={({ field: { value } }) => (
              <TextField
                value={value}
                label="Ad Soyad"
                id="studentLabel"
                variant="outlined"
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

export default withRouter(TransactionContent);
