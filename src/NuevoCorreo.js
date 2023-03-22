import React from 'react';
import T from 'prop-types';
import {Paper, Container, Typography, Divider,TextField,Grid,Switch,FormControlLabel,Button} from '@mui/material';
import Select from 'react-select';
import MUIDataTable from 'mui-datatables';


// usar tabla normal de material ui

export class NuevoCorreo extends React.Component {
  render() {
    
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

// crea el state local
// crear el metodo set state local  
// hacer una funcion que reciba el id del rol y el correo y lo guarde en la base de datos
// recibir la info que se subira
// meter el store local y todas las variables que se vayan necesitando en el store
// crear el metodo set state local 

    return (
    <Container maxWidth={'xl'}>
        <Paper elevation={3} >
          <Typography variant='h2'>Nuevo correo</Typography>
          <Divider></Divider>
          <TextField
              label="Titulo"
              margin="normal"
              onChange={() => {}}
              // value={variable}
              fullWidth
            />
          <Divider></Divider>
            <Select
              value={''}
              onChange={() => {}}
              options={roles}
              // isMulti={multiple}
              //disabled={inhabilitado}
              // error={campoValido}
              isSearchable
              placeholder='placeholder'
              
            />
          <Divider></Divider>
          <TextField
              label="Aqui va el correo"
              margin="normal"
              onChange={() => {}}
              // value={'lo que trae de la base de datos'}
              fullWidth
            />
          <MUIDataTable
            elevation={0}
            title={"Employee List"}
            data={rows}
            columns={columns}
          ></MUIDataTable>
            <Grid
                item
                xs={12}
              >
                <FormControlLabel
                  style={{margin: 0}}
                  control={
                    <Switch
                      // onChange={(e) => onInputChange(3, e)}
                      // value={almacen.valor}
                      // checked={almacen.valor}
                    />
                  }
                  labelPlacement="top"
                  label="Enviar correo"
                />
            </Grid>
            <Grid
                item
                container
                xs={12}
                justify="flex-end"
              >
                <Grid
                  container
                  item
                  sm={12}
                  md={6}
                  justify="center"
                >
                  <Button
                    color="primary"
                    name="btnEliminar"
                    onClick={() => {}}
                    fullWidth
                  > 
                    Cerrar
                  </Button>
                </Grid>
                <Grid
                  container
                  item
                  sm={12}
                  md={6}
                  justify="center"
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    name="btnGuardar"
                    onClick={() => {}}
                    fullWidth
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
        </Paper>
      </Container>
    );
  }
}

NuevoCorreo.propTypes = {
  titulo: T.string,
};

          {/* aqui va luego un text field */}
          {/* un seleccionador (que sea para buscar pref) y se pueda agregar? */}
          {/* otro text field acompañado de un agregar */}
          {/* una tabla para mostrar lo guardado */}
          {/* un swtich para ver si se guarda como borrador? */}
          {/* un cancelar y un enviar */}

export default NuevoCorreo;