import TextField from "@mui/material/TextField";
import { Search, Clear } from "@mui/icons-material";

import { InputAdornment } from "@mui/material";

export default function SearchCategory({ value, handleSearch }) {
  return (
    <>
      <form>
        <TextField
          id="outlined-basic"
          label="Search by name , email and role"
          variant="outlined"
          value={value}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <Clear
                  color="error"
                  onClick={() => {
                    handleSearch("");
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
      </form>
    </>
  );
}
