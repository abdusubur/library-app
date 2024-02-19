import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import BooksService from 'src/app/requests/books';

function BasicInfoTab(props) {
  const methods = useFormContext();
  const [writer, setWriter] = useState([]);
  const [publisher, setPublisher] = useState([]);
  const { control, formState } = methods;
  const { errors } = formState;

  useEffect(() => {
    BooksService.getWriter().then((res) => {
      setWriter(res.data.writer);
    });
    BooksService.getPublisher().then((res) => {
      setPublisher(res.data.publisher);
    });
  }, []);

  return (
    <div>
      <Controller
        name="adi"
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
        name="isbnno"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="string"
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
        name="yazar"
        control={control}
        render={({ field: { onChange,value } }) => (
          <FormControl
            className="rounded-4 mb-12"
            variant="outlined"
            style={{ width: "100%" }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Yazar
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              label={"Yazar"}
              variant="outlined"
              value={value}
              error={!!errors.addBooksWriter}
              helperText={errors?.addBooksWriter?.message}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              id="demo-simple-select-standard-label"
            >
              {writer?.map((val, i) => {
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
      <Controller
        name="barkodno"
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
        name="yayinevi"
        control={control}
        render={({ field: { onChange,value } }) => (
          <FormControl
            className="rounded-4 mb-12"
            variant="outlined"
            style={{ width: "100%" }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Yayın Evi
            </InputLabel>
            <Select
            value={value}
              labelId="demo-simple-select-standard-label"
              label={"Yayın Evi"}
              variant="outlined"
              error={!!errors.addBooksPublisher}
              helperText={errors?.addBooksPublisher?.message}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              id="demo-simple-select-standard-label"
            >
              {publisher?.map((val, i) => {
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
    </div>
  );
}

export default BasicInfoTab;
