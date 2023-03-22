import React from 'react';
import T from 'prop-types';
import {Paper, Container, Typography, Divider,TextField,Grid,Switch,FormControlLabel,Button,Chip,Tooltip,IconButton,Toolbar,AppBar} from '@mui/material';
import Select from 'react-select';
import { doc, getDoc, setDoc,onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import {db} from "./firebase";
import MUIDataTable from 'mui-datatables';
import Archivo from '@mui/icons-material/Attachment';
import SubirArchivoIcon from '@mui/icons-material/CloudUploadOutlined';
import AgregarIcon from '@mui/icons-material/AddBoxOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import grey from '@mui/material/colors/grey';
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
      stepper:0,
      titulo: '', 
      categoria:{},
      correo: '',
      enviarCorreo: false,
      nombreArchivo: '',
      archivo: [],
      categorias: [],
      datos: [],
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
  }
  
  componentWillMount() {
    this.obtenerCategorias();
    this.obtenerListado();
  }
  obtenerCategorias = async (name) => {
    const unsub = onSnapshot(doc(db, "correosdb", "topics"), (doc) => {
    console.log("Current data: ", doc.data());
    const categorias =[]
      if(doc.data() != undefined){
        categorias.push(doc.data())
      }
    categorias.forEach(reg => {
        reg.label = reg.name;
        reg.value = reg.name;
    });

    this.handleCategoriasChange(categorias)
});
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
      const storageRef = ref(storage, 'some-child');

      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, archivo).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });

      console.log("The file has been uploaded successfully");
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
            this.handleSubirArchivoChange(files[i].name,files[i]);
            this.handleNombreArchivoChange(files[i].name); 
          }
        } else {
        }
      }
      event.target.value = null;
    }

  };

  
   guardarCategoria = async (name) => {
    const { 
      categorias,
    } = this.state
    try {
      // preguntar si hay un archivo 
      if(categorias.length > 0){
        const cityRef = doc(db, 'correosdb', 'topics');
        setDoc(cityRef, { name: name }, { merge: true });
      } else {
        await setDoc(doc(db, "correosdb","topics"), {
          name: name,
        })
      }
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

    if(enviarCorreo){
      console.log("enviar correo") // guardar en bd y enviar correo
    }

    try {
      // preguntar si hay un archivo 
      if(datos.length > 0){
        const corrRef = doc(db, 'correos', 'data');
        setDoc(corrRef, 
          { titulo: titulo,
            categoria: categoria,
            nombreArchivo: nombreArchivo,
            correo: correo, }, { merge: true });
      } else {
        await setDoc(doc(db, "correos","data"), {
          titulo: titulo,
          categoria: categoria,
          nombreArchivo: nombreArchivo,
          correo: correo, 
        })
      }
      console.log("The topic successfully written!");
    } catch (error) {
      console.log(error);
    }
  };

  // mandarCorreo = async () => {
  //   const { 
  //     titulo,
  //     categoria,
  //     correo,
  //     enviarCorreo,
  //     archivo,
  //   } = this.state


  //   const transporter = nodemailer.createTransport({
  //       service: "gmail",
  //       auth: {
  //           user: "eddieisaac@gmail.com",
  //           pass: "xqokqxqujiqtuqfs",
  //       },
  //   });
  //   const html = await promisify(fs.readFile)('./app/assets/email.html');

  //   console.log(html)


  //   const template = handlebars.compile(html);

  //   // for await (const user of users) {
  //       // data for template with unsubscribe link to topic
  //       let data = {
  //           unsubscribe_url: `http://localhost:3000/#/topic/unsubscribe`,
  //       }

  //       let htmlToSend = template(data);

  //       const mailOptions = {
  //           from: '"Isaac" <deizen16@gmail.com>"',
  //           to: user.email,
  //           subject: newsletter.title,
  //           text: "Probando",
  //           html: htmlToSend,
  //           attachments: [
  //               {
  //                   filename: newsletter.content_url.split("/").pop(),
  //                   path: newsletter.content_url,
  //               },
  //           ],
  //       };

  //       transporter.sendMail(mailOptions, function (error, info) {
  //           if (error) {
  //               console.log(error);
  //           } else {
  //               console.log("Email sent: " + info.response);
  //           }
  //       });
  //   // }

  //   // update status to sent
  //   // db.newsletter.update({
  //   //     status: 'sent',
  //   // },{
  //   //     where: {
  //   //         id: id,
  //   //     }
  //   // });
  // };


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

const { classes } = this.props;
    
const rows2 = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
]

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


switch (stepper) {
  case 0 :
    return (
      <Container maxWidth={'xl'} style={{padding: 8}}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant='h2' > Newsletter App </Typography>
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
      <Container maxWidth={'xl'}>
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
  default:
      return null;
  }
}
}

NuevoCorreo.propTypes = {
  titulo: T.string,
};

export default NuevoCorreo;