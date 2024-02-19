import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import BooksService from "src/app/requests/books";
import StudentService from "src/app/requests/students";
import TransactionService from "src/app/requests/transaction";

function BasicInfoTab(props) {
  const methods = useFormContext();
  const [classes, setClasses] = useState([]);
  const [durumu, setDurumu] = useState([]);
  const { control, formState } = methods;
  const { errors } = formState;

  useEffect(() => {
    StudentService.getClasses().then((res) => {
      setClasses(res.data.uniqueSiniflar);
    });
    TransactionService.getDurumu().then((res) => {
      setDurumu(res.data.durumu);
    });
  }, []);

  return (
    <div>
      <Controller
        name="kitapAdi"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors.kitapAdi}
            helperText={errors?.kitapAdi?.message}
            className="mb-16 rounded-4"
            label="Kitap Adı"
            id="kitapAdi"
            variant="outlined"
            autoFocus
            fullWidth
          />
        )}
      />
      <Controller
        name="adSoyadi"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors.adSoyadi}
            helperText={errors?.adSoyadi?.message}
            className="mb-16 rounded-4"
            label="Öğrenci Ad Soyadi"
            id="adSoyadi"
            variant="outlined"
            autoFocus
            fullWidth
          />
        )}
      />
      <Controller
        name="ogrNo"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="string"
            error={!!errors.ogrNo}
            helperText={errors?.ogrNo?.message}
            className="mb-16 rounded-4"
            label="Öğrenci No"
            id="ogrNo"
            variant="outlined"
            required
            fullWidth
          />
        )}
      />
      <Controller
        name="sinifi"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormControl
            className="rounded-4 mb-12"
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
              error={!!errors.sinifi}
              helperText={errors?.sinifi?.message}
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

      <Controller
        name="start"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors.start}
            helperText={errors?.start?.message}
            className="mb-16 rounded-4"
            label="Kitap Aldığı Tarih"
            id="start"
            variant="outlined"
            autoFocus
            fullWidth
          />
        )}
      />
      <Controller
        name="end"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors.end}
            helperText={errors?.end?.message}
            className="mb-16 rounded-4"
            label="Kitap Vereceği Tarih"
            id="end"
            variant="outlined"
            autoFocus
            fullWidth
          />
        )}
      />
      <Controller
        name="durumu"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormControl
            className="rounded-4 mb-12"
            variant="outlined"
            style={{ width: "100%" }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Durumu
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              label={"Durumu"}
              variant="outlined"
              value={value}
              error={!!errors.durumu}
              helperText={errors?.durumu?.message}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              id="demo-simple-select-standard-label"
            >
              {durumu?.map((val, i) => {
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
