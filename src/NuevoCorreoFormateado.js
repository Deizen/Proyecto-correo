import React from 'react';
import T from 'prop-types';
import {Paper, Container, Typography, Divider,TextField,Grid,Switch,FormControlLabel,Button,Chip,Tooltip} from '@mui/material';
import Select from 'react-select';
import { doc, getDoc, setDoc } from "firebase/firestore";
import {db} from "./firebase";
import MUIDataTable from 'mui-datatables';
import Archivo from '@mui/icons-material/Attachment';
import SubirArchivoIcon from '@mui/icons-material/CloudUploadOutlined';
import { withStyles } from '@material-ui/styles';

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  inputFile: {
    display: 'none',
  },
  uploadButton: {
    cursor: 'pointer',
  },
});
// usar tabla normal de material ui


export class NuevoCorreo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titulo: '', 
      categoria:{},
      correo: '',
      enviarCorreo: false,
      nombreArchivo: '',
      archivo: [],
      data: [],
    };
    this.handleTituloChange = this.handleTituloChange.bind(this);
    this.handleCategoriaChange = this.handleCategoriaChange.bind(this);
    this.handleCorreoChange = this.handleCorreoChange.bind(this);
    this.guardarCategoria = this.guardarCategoria.bind(this);
    this.guardarCorreo = this.guardarCorreo.bind(this);
    this.guardarArchivo = this.guardarArchivo.bind(this);
  }

  handleTituloChange = (e) => {
    this.setState({
      titulo: e.target.value,  
    });
  };

  handleArchivoChange = (e) => {
    this.setState({
      archivo: e,  
    });
  };

  handleCategoriaChange = (e) => {
    this.setState({
      categoria: e.target.value,  
    });
  };

  // handleChangeArchivo = (arc) => {
  //   this.setState({
  //     archivo: arc,
  //   });
  // };


  handleCorreoChange = (e) => {
    this.setState({
      correo: e.target.value,  
    });
  };

  handleEnviarCorreoChange = (e) => {
    console.log("handleEnviarCorreoChange", e.target.checked)
    this.setState({
      enviarCorreo: e.target.checked,  
    });
  };

  guardarArchivo = (event) => {
    const formData = new FormData();
    const arreglo = [];
    const archivosValidos = [
      'pdf', 
      'png', 
    ];
    
    let tipo = '';
    const { 
      archivo,
    } = this.state
    console.log("que viene aqui", event)
    const {
      target: {
        files,
      },
    } = event;

    let band = false;

    if(files.length > 0){
      for(let i = 0; i < files.length; i+=1){
        tipo = files[i].name.substring(files[i].name.lastIndexOf('.') + 1);
        tipo = tipo.toLowerCase();
        if(archivosValidos.includes(tipo.toLowerCase())){
          if(files[i].size > 5242880){
           console.log("archivo muy grande")
          } else {
            band = true;
            formData.append('files',files[i]);
            archivo.push(files[i]);
          }
        } else {
          console.log("archivo no valido")
        }
      }
      event.target.value = null;
    }

  };

  // handleDataChange = (e) => {
  //   this.setState({
  //     data: e.target.value,  
  //   });
  // }
   guardarCategoria = async (name) => {
    try {
      await setDoc(doc(db, "correosdb","topics"), {
        name: name,
      })
      console.log("The topic successfully written!");
    } catch (error) {
      console.log(error);
    }
  };



  guardarCorreo = () => {
    const { 
      titulo,
      categoria,
      correo,
      enviarCorreo,
      archivo,
    } = this.state
    console.log("titulo", titulo)
    console.log("categoria", categoria)
    console.log("correo", correo)
    console.log("enviarCorreo", enviarCorreo)
    console.log("archivo", archivo)

    if(enviarCorreo){
      console.log("enviar correo")
    }else {
      console.log("no enviar correo")
    }
  };

  render() {
    const { 
      titulo,
      categoria,
      correo,
      enviarCorreo,
      data,
      nombreArchivo,
      archivo,
    } = this.state

    const { classes } = this.props;
    // console.log("state", this.state)
    // console.log("props", this.props)
    
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

    return (
      <Container maxWidth={'xl'}>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant='h2'>Nuevo correo</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Titulo"
              margin="normal"
              onChange={this.handleTituloChange}
              value={titulo}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              value={''}
              onChange={() => {}}
              options={roles}
              // isMulti={multiple}
              //disabled={inhabilitado}
              // error={campoValido}
              // aqui se le agregara un key down que agregara la categoria? 
              onKeyDown={event => { 
                if (event.keyCode === 13 || event.keyCode === 9 || event.keyCode === 27) {
                  console.log("agregar categoria")
                  this.guardarCategoria(event.target.value)
                }
              }}
              isSearchable
              placeholder='placeholder'
            />
          </Grid>
          <Grid item xs={12}>
            {archivo.length > 0 ?
              <div>
                <Tooltip 
                  title = {nombreArchivo}
                >
                  <Chip
                    icon={<Archivo/>}
                    label={nombreArchivo.substring(0,40)}
                    style={{fontSize: '1em', marginRight: 8}}
                  />
                </Tooltip>
              </div>
              :
              <div>
                <input
                  accept="application/pdf,image/png"
                  style={{display: 'none'}}
                  id={'subirArchivo'}
                  onChange={this.guardarArchivo}
                  type="file"
                />
                <label htmlFor={'subirArchivo'}>
                  <SubirArchivoIcon
                    style={{cursor: 'pointer'}} 
                  />
                </label>
              </div>
            }
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Aqui va el correo"
              margin="normal"
              onChange={this.handleCorreoChange}
              value={correo}
              placeholder="Correo delimitado por comas"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              style={{margin: 0}}
              control={
                <Switch
                  onChange={this.handleEnviarCorreoChange }
                  // onChange={this.handleEnviarCorreoChange}
                  // value={almacen.valor}
                  checked={enviarCorreo}
                />
              }
              labelPlacement="top"
              label="Enviar correo"
            />
          </Grid>
          <Grid item container xs={12} justify="flex-end" spacing={3}>
            <Grid item sm={12} md={6} justify="center">
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
                    onClick={this.guardarCorreo}
                    fullWidth
                  >
                    Guardar
                  </Button>
                </Grid>
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

export default NuevoCorreo;