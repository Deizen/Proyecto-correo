import logo from './logo.svg';
import './App.css';
import { doc, getDoc, setDoc } from "firebase/firestore";
import {db} from "./firebase";
import { Paper, Container, Typography, Divider} from '@mui/material';
import {NuevoCorreo} from './NuevoCorreo';
// import {NuevoCorreo} from './NuevoCorreoFormateado';

import Tabla from './Tabla';
import MUIDataTable from 'mui-datatables';

function App() {
  return (
    <div className="App">
      <NuevoCorreo 
        valor = {0}
      />
    </div>
  );
}

export default App;
