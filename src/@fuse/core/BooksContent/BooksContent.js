import * as React from "react";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Avatar,
  Box,
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
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import BooksService from "src/app/requests/books";
import withRouter from "@fuse/core/withRouter";

const schema = yup.object().shape({
  addBooksName: yup.string().required("Lütfen boş alanları doldurun"),

  addBooksIsbnNo: yup.string().required("Lütfen boş alanları doldurun"),
  addBooksWriter: yup.string().required("Lütfen boş alanları doldurun"),
  addBooksNo: yup.string().required("Lütfen boş alanları doldurun"),
  addBooksPublisher: yup.string().required("Lütfen boş alanları doldurun"),
});

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

function BooksContent(props) {
  function handleRowClick(params) {
    const selectedBookId = params.row.id;
    props.navigate(`/books/${selectedBookId}`);
  }

  const [writer, setWriter] = useState([]);
  const [publisher, setPublisher] = useState([]);
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
    const newData = {
      addBooksName: data.addBooksName,
      addBooksPicture: data.addBooksPicture,
      addBooksIsbnNo: data.addBooksIsbnNo,
      addBooksWriter: data.addBooksWriter,
      addBooksNo: data.addBooksNo,
      addBooksPublisher: data.addBooksPublisher,
    };

    BooksService.postBooks(newData).then((res) => {});
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

    BooksService.getBooks(gidenObje).then((response) => {
      setIsLoading(false);
      setRows(response.data.data);
      setRowCountState(response.data.count);
    });
  };

  useEffect(() => {
    getRequests();
  }, [filter, paginationModel]);

  useEffect(() => {
    BooksService.getWriter().then((res) => {
      setWriter(res.data.writer);
    });
    BooksService.getPublisher().then((res) => {
      setPublisher(res.data.publisher);
    });
  }, []);

  const columns = [
    {
      field: "resim",
      headerName: "Resim",
      width: 200,
      renderCell: (params) => <img src={params.value} />,
    },
    { field: "adi", headerName: "Kitap Adı", flex: 1 },
    { field: "isbnno", headerName: "ISBN Numarası", flex: 1 },
    { field: "barkodno", headerName: "Barkod Numarası", flex: 1 },
    { field: "yazar", headerName: "Yazar", flex: 1 },
    { field: "yayinevi", headerName: "Yayın evi", flex: 1 },
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
      <h3 className="mb-12">Yeni Kitap</h3>
      <IconButton
        className="m-4 absolute top-6 right-2 z-999"
        onClick={toggleDrawer(anchor, false)}
        size="large"
      >
        <FuseSvgIcon color="action">heroicons-outline:x</FuseSvgIcon>
      </IconButton>
      <div className="flex flex-auto items-end mt-12 mb-12">
        <Controller
          control={control}
          name="avatar"
          render={({ field: { onChange, value } }) => (
            <Box
              sx={{
                borderWidth: 4,
                borderStyle: "solid",
                borderColor: "background.paper",
              }}
              className="relative flex items-center justify-center w-full h-192 overflow-hidden"
            >
              <div className="absolute inset-0 bg-black bg-opacity-20 z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div>
                  <label
                    htmlFor="button-avatar"
                    className="flex p-8 cursor-pointer"
                  >
                    <input
                      accept="image/*"
                      className="hidden"
                      id="button-avatar"
                      type="file"
                      onChange={async (e) => {
                        function readFileAsync() {
                          return new Promise((resolve, reject) => {
                            const file = e.target.files[0];
                            if (!file) {
                              return;
                            }
                            const reader = new FileReader();

                            reader.onload = () => {
                              resolve(
                                `data:${file.type};base64,${btoa(
                                  reader.result
                                )}`
                              );
                            };

                            reader.onerror = reject;

                            reader.readAsBinaryString(file);
                          });
                        }

                        const newImage = await readFileAsync();

                        onChange(newImage);
                      }}
                    />
                    <FuseSvgIcon className="text-white">
                      heroicons-outline:camera
                    </FuseSvgIcon>
                  </label>
                </div>
                <div>
                  <IconButton
                    onClick={() => {
                      onChange("");
                    }}
                  >
                    <FuseSvgIcon className="text-white">
                      heroicons-solid:trash
                    </FuseSvgIcon>
                  </IconButton>
                </div>
              </div>
              <Avatar
                sx={{
                  backgroundColor: "background.default",
                  color: "text.secondary",
                }}
                className="object-cover rounded-0 w-full h-full text-64 font-bold"
                src={value}
              ></Avatar>
            </Box>
          )}
        />
      </div>
      <Controller
        name="addBooksName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors.addBooksName}
            helperText={errors?.addBooksName?.message}
            className="mb-16 rounded-4"
            label="Kitap Adi"
            id="addBooksName"
            variant="outlined"
            autoFocus
            fullWidth
          />
        )}
      />
      <Controller
        name="addBooksIsbnNo"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            error={!!errors.addBooksIsbnNo}
            helperText={errors?.addBooksIsbnNo?.message}
            className="mb-16 rounded-4"
            label="ISBN No"
            id="addBooksIsbnNo"
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="addBooksWriter"
        control={control}
        render={({ field: { onChange } }) => (
          <Autocomplete
          className="w-full mb-16"
          disablePortal
          id="addBooksWriter"
          options={writer}
          onSelect={(e) => {
            onChange(e.target.value);
          }}
          sx={{ width: 300 }}
          renderInput={(value) => (
            <TextField
              {...value}
              label="Yazar"
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
          )}
        />
        )}
      />
      <Controller
        name="addBooksNo"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            error={!!errors.addBooksNo}
            helperText={errors?.addBooksNo?.message}
            className=" mb-16 rounded-4"
            label="Barkod No"
            id="addBooksNo"
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="addBooksPublisher"
        control={control}
        render={({ field: { onChange } }) => (
          <Autocomplete
          className="w-full mb-16"
          disablePortal
          id="addBooksPulisher"
          options={publisher}
          onSelect={(e) => {
            onChange(e.target.value);
          }}
          sx={{ width: 300 }}
          renderInput={(value) => (
            <TextField
              {...value}
              label="Yayın Evi"
              onChange={(e) => {
                onChange(e.target.value);
              }}
            />
          )}
        />
        )}
      />

      {/* <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const selectedFile = e.target.files[0];
          control.setValue("addBooksPicture", selectedFile);
          console.log("File uploaded successfully:", selectedFile);
        }}
        style={{ display: "none" }}
      />

      <Button
        variant="outlined"
        onClick={() => document.querySelector('input[type="file"]').click()}
      >
        Resim Yükle
      </Button> */}

      <Button
        className="rounded-4 py-12"
        variant="contained"
        color="secondary"
        disabled={_.isEmpty(dirtyFields) || !isValid}
        onClick={handleSubmit(onSubmit)} // onSubmit fonksiyonunu çağırın
      >
        Kitap Ekle
      </Button>
    </div>
  );

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
      <Card className="rounded-xl px-32 py-24 w-full">
        <div className="flex gap-8">
          <h3 className="text-xl text-white font-600 mb-12">Filtreleme</h3>
          <FuseSvgIcon className="text-48" size={22} color="white">
            heroicons-solid:filter
          </FuseSvgIcon>
        </div>
        <form className="flex gap-12">
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
            name="IsbnNo"
            control={control}
            render={({ field: { value } }) => (
              <TextField
                type="number"
                value={value}
                className="rounded-4"
                label="ISBN No"
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    isbnNumber: e.target.value,
                  }));
                }}
              />
            )}
          />
          <Controller
            name="Writer"
            control={control}
            render={({ field: { value, ref } }) => (
              <Autocomplete
                className="w-full"
                disablePortal
                id="Writer"
                options={writer}
                onSelect={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    writerValue: e.target.value,
                  }));
                }}
                sx={{ width: 300 }}
                value={value}
                renderInput={(value) => (
                  <TextField
                    {...value}
                    label="Yazar"
                    onChange={(e) => {
                      setFilter((prev) => ({
                        ...prev,
                        writerValue: e.target.value,
                      }));
                    }}
                  />
                )}
              />
            )}
          />
          <Controller
            name="Publisher"
            control={control}
            render={({ field: { value, ref } }) => (
              <Autocomplete
                className="w-full"
                disablePortal
                id="Publisher"
                options={publisher}
                onSelect={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    publisherValue: e.target.value,
                  }));
                }}
                sx={{ width: 300 }}
                value={value}
                renderInput={(value) => (
                  <TextField
                    {...value}
                    label="Yayın Evi"
                    onChange={(e) => {
                      setFilter((prev) => ({
                        ...prev,
                        publisherValue: e.target.value,
                      }));
                    }}
                  />
                )}
              />
            )}
          />
          <button type="button" onClick={handleClick}>
            Reset
          </button>
        </form>
      </Card>
      <Grid container className="mt-12 w-full">
        <Grid item xs={12} md={12}>
          <Card component={motion.div} variants={item} className=" mb-32">
            <CardContent className="px-32 py-24">
              <div className="flex items-center justify-between">
                <div className="mr-48">
                  {["right"].map((anchor) => (
                    <React.Fragment key={anchor}>
                      <Button
                        className="rounded-4 px-24 mb-12"
                        variant="contained"
                        color="secondary"
                        onClick={toggleDrawer(anchor, true)}
                      >
                        Kitap Ekle
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
                  onRowClick={handleRowClick}
                  rowHeight={200}
                  rows={rows}
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
                  sx={{
                    [`& .${gridClasses.cell}`]: {
                      px: 5,
                      pl: 0,
                    },
                  }}
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

export default withRouter(BooksContent);
