// import logo from './logo.svg';
import "./App.css";

import DataTable from "../src/components/userDetails";

import { Stack } from "@mui/system";

function App() {
  return (
    <div>
      <Stack spacing={2} m={3}>
        <DataTable />
      </Stack>
    </div>
  );
}

export default App;
