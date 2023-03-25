import React from 'react';
import T from 'prop-types';
import {Paper, Container, Typography, Divider,TextField,Grid,Switch,FormControlLabel,Button,Chip,Tooltip,IconButton,Toolbar,AppBar} from '@mui/material';
import Select from 'react-select';
import { doc, getDoc, setDoc,onSnapshot, collection, addDoc,getDocs,query } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { httpsCallable } from 'firebase/functions';
import {db, functions} from "./firebase";
import MUIDataTable from 'mui-datatables';
import Archivo from '@mui/icons-material/Attachment';
import SubirArchivoIcon from '@mui/icons-material/CloudUploadOutlined';
import AgregarIcon from '@mui/icons-material/AddBoxOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SnackbarProvider,enqueueSnackbar } from 'notistack';
import { v4 as uuid } from 'uuid';


function sendEmailWithAttachment() {
  const to = "eddieisaac@gmail.com";
  const subject = "Prueba de correo";
  const body = "Prueba de correo";
  const attachmentPath = ""


  const callSendEmail = httpsCallable(functions, 'sendEmail');


  callSendEmail({to, subject, body, attachmentPath})
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

}

// usar tabla normal de material ui

export class NuevoCorreo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepper:0,
      titulo: '', 
      categoria:{},
      correo: '',
      enviarCorreo: false,
      nombreArchivo: '',
      archivo: [],
      categorias: [],
      datos: [],
      fileUrl: '',
    };
    this.handleTituloChange = this.handleTituloChange.bind(this);
    this.handleCategoriaChange = this.handleCategoriaChange.bind(this);
    this.handleStepperChange = this.handleStepperChange.bind(this);
    this.handleCorreoChange = this.handleCorreoChange.bind(this);
    this.guardarCategoria = this.guardarCategoria.bind(this);
    this.guardarCorreo = this.guardarCorreo.bind(this);
    this.guardarArchivo = this.guardarArchivo.bind(this);
    this.obtenerCategorias = this.obtenerCategorias.bind(this);
    this.obtenerListado = this.obtenerListado.bind(this);
    this.handleNombreArchivoChange = this.handleNombreArchivoChange.bind(this);
    this.handleSubirArchivoChange = this.handleSubirArchivoChange.bind(this);
    this.handleListadoChange = this.handleListadoChange.bind(this);
    this.notificacion = this.notificacion.bind(this);
  }
  
  // que show sigues en juntiza?, ya llego tu comida? junta con el chino y el de la pizza
  // che chino al rato agarrado de la mano contigo andara

  componentWillMount() {
    this.obtenerCategorias();
    this.obtenerListado();
  }

  obtenerCategorias = async (name) => {       
    const categorias =[] 
    const vcatg = collection(db, "Categoria");
    const q = query(collection(db, "Categoria"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data().name);
      const obj = {
        label: doc.data().name,
        value: doc.id,
      }
      categorias.push(obj)
    });

    this.handleCategoriasChange(categorias)
  };

  obtenerListado = async (name) => {
    const unsub = onSnapshot(doc(db, "correos", "data"), (doc) => {
    const listado =[]
      if(doc.data() != undefined){
        listado.push(doc.data())
      }

    this.handleListadoChange(listado)
});
  };

  notificacion = (mensaje) => {
    enqueueSnackbar(mensaje, {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    })
  };

  handleTituloChange = (e) => {
    this.setState({
      titulo: e.target.value,  
    });
  };

  handleStepperChange = (stepper) => {
    this.setState({
      stepper: stepper,
    });
  };
  handleNombreArchivoChange = (e) => {
    this.setState({
      nombreArchivo: e,  
    });
  };
  
  handleArchivoChange = (e) => {
    this.setState({
      archivo: e,  
    });
  };

 
  handleSubirArchivoChange = async (nombre,archivo) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `/files/${nombre}`);
      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, archivo).then((snapshot) => {
        this.notificacion("The file has been uploaded successfully")  
         return snapshot.ref.fullPath;
      });
    } catch (error) {
      console.log(error);
    }
  };
  

  handleCategoriaChange = (e) => {
    this.setState({
      categoria: e.value,  
    });
  };
  
  handleCorreoChange = (e) => {
    this.setState({
      correo: e.target.value,  
    });
  };

  handleCategoriasChange = (e) => {
    this.setState({
      categorias: e,
    });
  };

  handleListadoChange = (arrdatos) => {
    this.setState({
      datos: arrdatos,
    });
  };

  handleEnviarCorreoChange = (e) => {
    this.setState({
      enviarCorreo: e.target.checked,  
    });
  };

  guardarArchivo = (event) => {
    const { 
      archivo,
    } = this.state

    const formData = new FormData();
    const arreglo = [];
    const archivosValidos = [
      'pdf', 
      'png', 
    ];
    
    let tipo = '';
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
          } else {
            band = true;
            formData.append('files',files[i]);
            archivo.push(files[i]);
            // esta URL la mandas a la base de datos
            // tons le movere para llegar a ee punto y el del acomodo del proyecto tmb comere :D sale w provecho
            this.fileUrl = this.handleSubirArchivoChange(files[i].name,files[i]);
            console.log(this.fileUrl, 'fileUrl' )
            this.handleNombreArchivoChange(files[i].name); 
          }
        } else {
        }
      }
      event.target.value = null;
    }
  };

  
   guardarCategoria = async (name) => {
    const unique_id = uuid();
    
    try {       
        await addDoc(collection(db, "Categoria"), {
          name: name,
        });
        console.log('entro catyegoria')
      console.log("The topic successfully written!");
    } catch (error) {
      console.log(error);
    }
  };
 

  guardarCorreo = async () => {
    const { 
      titulo,
      categoria,
      correo,
      enviarCorreo,
      nombreArchivo,
      categorias,
      datos,
    } = this.state

    const unique_id = uuid();

    if(enviarCorreo){
      console.log("enviar correo") // guardar en bd y enviar correo
    }

    try {
      // preguntar si hay un archivo 
        await setDoc(doc(db, "correos",unique_id), {
          titulo: titulo,
          categoria: categoria,
          nombreArchivo: nombreArchivo,
          correo: correo, 
        })
      console.log("The topic successfully written!");
    } catch (error) {
      console.log(error);
    }
  };

  render() {

    const { 
      titulo,
      categoria,
      categorias,
      correo,
      enviarCorreo,
      nombreArchivo,
      archivo,
      stepper,
      datos,
    } = this.state

    const { valor } = this.props;
    console.log('Los pros: ', this.props)
    console.log('El valor a la lauz es: ', valor)

const { classes } = this.props;

const rows = []
datos.forEach((item) => {
  const obj = {
    titulo: item.titulo,
    categoria: 'categoria',
    nombreArchivo: item.nombreArchivo,
  }
  rows.push(obj)
})

const columns = [
  { name: 'titulo', label: 'Titulo' },
  { name: 'categoria', label: 'Categoria' },
  { name: 'nombreArchivo', label: 'Archivo' },
];

const opciones = {
  download : false,
  viewColumns : false,
  print : false,
  selectableRows: 'none',
};

categorias.sort((a, b) => a.label.localeCompare(b.label));

switch (stepper) {
  case 0 :
    return (
      <Container maxWidth={'md'} style={{padding: 8}}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant='h2' > App de Boletines </Typography>
        <Tooltip title=" New Newsletter ">
              <IconButton 
                edge="end" 
                aria-label="agregar"
                onClick={() => this.handleStepperChange(1)}
                style={{width:'2em', height:'2em',marginTop:'10px'}}
              >
                <AgregarIcon 
                  style={{color: '#28950F',width:'2em', height:'2em'}}
                />
              </IconButton> 
            </Tooltip>
        <Divider style={{marginTop:'10px'}} />
        <MUIDataTable
          style={{padding: 8,paddingTop: 16}}
          elevation={0}
          title={"Lista de correos"}
          data={rows}
          columns={columns}
          options={opciones}
        ></MUIDataTable>
      </Paper>
    </Container>
    );
  case 1 :
    return (
      <Container maxWidth={'md'}>
          <Paper elevation={3} style={{ padding: '2rem' }}>
          <Grid item container xs={12} justify="center" spacing={3}>
                <Grid item xs={12} md={2}>
                <Tooltip title="Regresar" placement="bottom-end">
            <IconButton onClick={() => this.handleStepperChange(0)}>
              <ArrowBackIcon style={{color: '#28950F',width:'2em', height:'2em'}}/>
            </IconButton>
          </Tooltip>
                </Grid>
                <Grid item xs={12} md={6}>
                <Typography variant='h2' style={{ marginBottom: '2rem' }}>
              Nuevo correo
            </Typography>
                </Grid>
              </Grid>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Titulo"
                  margin="normal"
                  onChange={this.handleTituloChange}
                  value={titulo}
                  fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Select
                  label="Categoria"
                  onChange={this.handleCategoriaChange}
                  options={categorias}
                  onKeyDown={(event) => {
                    if (event.keyCode === 13 || event.keyCode === 9 || event.keyCode === 27) {
                      this.guardarCategoria(event.target.value);
                    }
                  } }
                  isSearchable />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Correo"
                  margin="normal"
                  onChange={this.handleCorreoChange}
                  value={correo}
                  placeholder="Correo delimitado por comas"
                  fullWidth />
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={12} md={6}>
                  {archivo.length > 0 ? (
                    <div>
                      <Tooltip title={nombreArchivo}>
                        <Chip
                          icon={<Archivo />}
                          label={nombreArchivo.substring(0, 40)}
                          style={{ fontSize: '1em', marginRight: 8 }} />
                      </Tooltip>
                    </div>
                  ) : (
                    <div>
                      <input
                        accept="application/pdf,image/png"
                        style={{ display: 'none' }}
                        id={'subirArchivo'}
                        onChange={this.guardarArchivo}
                        type="file" />
                      <label htmlFor={'subirArchivo'}>
                        <SubirArchivoIcon style={{ cursor: 'pointer', paddingTop: 20 }} />
                      </label>
                    </div>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    style={{ margin: 0 }}
                    control={<Switch
                      onChange={this.handleEnviarCorreoChange}
                      checked={enviarCorreo} />}
                    labelPlacement="top"
                    label="Enviar correo" />
                </Grid>
              </Grid>
              <Grid item container xs={12} justify="flex-end" spacing={3}>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    name="btnEliminar"
                    onClick={() => this.handleStepperChange(0)}
                    fullWidth
                  >
                    Cerrar
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    name="btnGuardar"
                    onClick={sendEmailWithAttachment}
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
  default:
      return null;
  }
}
}

NuevoCorreo.propTypes = {
  titulo: T.string,
};

export default NuevoCorreo;