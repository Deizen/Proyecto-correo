import React, { Component } from 'react';
import T from 'prop-types';
import {Paper, Container, Typography,TextField,Grid,Switch,FormControlLabel,Button,Chip,Tooltip,IconButton} from '@mui/material';
import Select from 'react-select';
import Archivo from '@mui/icons-material/Attachment';
import SubirArchivoIcon from '@mui/icons-material/CloudUploadOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SnackbarProvider} from 'notistack';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import Modal from './CustomModal';


export class NewNewsletter  extends Component{
    constructor(props) {
        super(props);
        this.state = {
            open:false,
          };
    }


  render() {
    const {
        sendEmail,
        title,
        email,
        nameAttachment,
        attachment,
        categorys,
        category,
        actionsNewNewsLetter: { 
            handleStepperChange, 
            handleTitleChange, 
            handleCategoryChange, 
            handleEmailChange, 
            saveCategoryDB, 
            saveNewsletter, 
            saveAtachment, 
            handleSendEmailChange,
        },
      } = this.props

  categorys.sort((a, b) => a.label.localeCompare(b.label));

// disabled={title === '' || email === '' || categoryName === '' || attachment.length === 0}


return (
    <Container maxWidth={'md'}>
        <SnackbarProvider />
          <Paper elevation={3} style={{ padding: '2rem' }}>
            <Grid item container xs={12} justify="center" spacing={3}>
                <Grid item xs={12} md={2}>
                        <Tooltip title="Regresar" placement="bottom-end">
                    <IconButton onClick={() => handleStepperChange(0)}>
                    <ArrowBackIcon style={{color: '#28950F',width:'2em', height:'2em'}}/>
                    </IconButton>
                </Tooltip>
                </Grid>
                <Grid item xs={12} md={10}>
                <Typography variant='h2' style={{ marginBottom: '2rem' }}>
                    New Newsletter
                </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  margin="normal"
                  onChange={handleTitleChange}
                  value={title}
                  fullWidth />
              </Grid>
              <Grid item container spacing={2}>
                <Grid item xs={12} md={11}> 
                    <div style={{ textAlign: "left" }}>
                        <Select
                            label="Category"
                            placeholder="Select Category"
                            onChange={handleCategoryChange}
                            options={categorys}
                            isSearchable 
                        />
                    </div>
                </Grid>
                <Grid item xs={12} md={1}>
                    <Tooltip title="New Category" placement="bottom-end"> 
                        <IconButton 
                                onClick={() => this.setState({ open: true})}
                            >
                            <AddIcon 
                                style={{ color: 'green' }}
                            />
                        </IconButton>
                    </Tooltip>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  margin="normal"
                  onChange={handleEmailChange}
                  value={email}
                  placeholder="comma delimited email"
                  fullWidth />
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={12} md={6}>
                  {attachment.length > 0 ? (
                    <div>
                      <Tooltip title={nameAttachment}>
                        <Chip
                          icon={<Archivo />}
                          label={nameAttachment.substring(0, 40)}
                          style={{ fontSize: '1em', marginRight: 8 }} />
                      </Tooltip>
                    </div>
                  ) : (
                    <div>
                      <input
                        accept="application/pdf,image/png"
                        style={{ display: 'none' }}
                        id={'subirArchivo'}
                        onChange={saveAtachment}
                        type="file" />
                      <label htmlFor={'subirArchivo'}>
                        <Tooltip title="Upload Attachment"> 
                            <SubirArchivoIcon style={{ cursor: 'pointer', paddingTop: 20, color:'green' }} />
                        </Tooltip>
                      </label>
                    </div>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    style={{ margin: 0 }}
                    control={<Switch
                      style={{ color: 'green' }}
                      onChange={handleSendEmailChange}
                      checked={sendEmail} />}
                    labelPlacement="top"
                    label="Send Email" />
                </Grid>
              </Grid>
              <Grid item container xs={12} justify="flex-end" spacing={3}>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    name="btnEliminar"
                    onClick={() => handleStepperChange(0)}
                    fullWidth
                  >
                    Close
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    name="btnGuardar"
                    onClick={saveNewsletter}
                    fullWidth
                    disabled={title === '' || email === '' || category === '' || attachment.length === 0}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          <Modal
            open={this.state.open}
            setOpen={() => this.setState({ open: !this.state.open })}
            saveCategoryDB={saveCategoryDB}
            />
        </Container>
    );
  }
}

NewNewsletter.propTypes = {
  titulo: T.string,
};

export default NewNewsletter;