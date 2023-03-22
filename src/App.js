import logo from './logo.svg';
import './App.css';
import { doc, getDoc, setDoc } from "firebase/firestore";
import {db} from "./firebase";
import { Paper, Container, Typography, Divider} from '@mui/material';
import {NuevoCorreo} from './NuevoCorreo';
import Tabla from './Tabla';
import MUIDataTable from 'mui-datatables';

const funcion = async () => {

  // funcion generalizada que reciba un parametro la bd y la data
  // funcion para obtener la data de la bd
  // await getDoc(doc(db, "topics", "1")).then((doc) => {
  //   if (doc.exists()) {
  //     console.log("Document data:", doc.data());
  //   } else {
  //     // doc.data() will be undefined in this case
  //     console.log("No such document!");
  //   }
  // }).catch((error) => {
  //   console.log("Error getting document:", error);
  // })

  // funcion para guardar la data en la bd
  await setDoc(doc(db, "topics", "1"), {
    name: "Los Angeles",
    state: "CA",
    country: "USA"
  }).then(() => console.log("Document successfully written!"));
}

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
]

const columns = [
  { name: 'id', label: 'ID' },
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
  { name: 'age', label: 'Age' },
];

const roles = [
  {IdRol: 1, Nombre: 'Rol 1'},
  {IdRol: 2, Nombre: 'Rol 2'},
  {IdRol: 3, Nombre: 'Rol 3'},
]

roles.forEach(reg => {
  reg.label = reg.Nombre;
  reg.value = reg.IdRol;
});

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
          <button
          onClick={funcion}
          >
            Agregar
          </button>
      </header> */}
      <Container maxWidth={'xl'}>
        <Paper elevation={3} >
          <Typography variant='h2'>Newsletter App</Typography>
          <Divider></Divider>
          <MUIDataTable
            elevation={0}
            title={"Employee List"}
            data={rows}
            columns={columns}
          ></MUIDataTable>
        </Paper>
      </Container>
      <Tabla/>
      <NuevoCorreo/>
    </div>
  );
}

export default App;
