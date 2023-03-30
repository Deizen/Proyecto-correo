import React from 'react';
import T from 'prop-types';
import { collection, addDoc,getDocs,query,where,updateDoc,doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { httpsCallable } from 'firebase/functions';
import {db, functions} from "../firebase";
import { enqueueSnackbar } from 'notistack';
import NewsLetterList from '../components/NewsLetterList';
import NewNewsletter from '../components/NewNewsletter';


// aqui hacer las consultas a firebase
// poner las notificaciones
function sendEmailWithAttachment({to, subject, body, attachmentPath}) {
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
export class NewsletterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        stepper:0,
        title: '',
        category:{},
        email: '',
        sendEmail: false,
        nameAttachment: '',
        attachment: [],
        categorys: [],
        listData: [],
        fileUrl: '',
        file: '',
        categoryName:'',
        emailList: [],
      };

      this.handleTitleChange = this.handleTitleChange.bind(this);
      this.handleCategoryChange = this.handleCategoryChange.bind(this);
      this.handleStepperChange = this.handleStepperChange.bind(this);
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handleNameAttachmentChange = this.handleNameAttachmentChange.bind(this);
      this.handleSendEmailChange = this.handleSendEmailChange.bind(this);
      this.handleDataChange = this.handleDataChange.bind(this);
      this.saveCategorys = this.saveCategorys.bind(this);
      this.saveNewsletter = this.saveNewsletter.bind(this);
      this.saveAtachment = this.saveAtachment.bind(this);
      this.saveAtachmentDB = this.saveAtachmentDB.bind(this);
      this.getCategorys = this.getCategorys.bind(this);
      this.getListNewsLetter = this.getListNewsLetter.bind(this);
      this.notification = this.notification.bind(this);
      this.sendEmailList = this.sendEmailList.bind(this);
      this.saveCategoryName = this.saveCategoryName.bind(this);
      

      // this.handleTituloChange = this.handleTituloChange.bind(this);
      // this.handleCategoriaChange = this.handleCategoriaChange.bind(this);
      // this.handleCorreoChange = this.handleCorreoChange.bind(this);
      // this.guardarCategoria = this.guardarCategoria.bind(this);
      // this.guardarCorreo = this.guardarCorreo.bind(this); -> saveNewsletter
      // this.guardarArchivo = this.guardarArchivo.bind(this);
      // this.obtenerCategorias = this.obtenerCategorias.bind(this);
      // this.obtenerListado = this.obtenerListado.bind(this);
      // this.handleNombreArchivoChange = this.handleNombreArchivoChange.bind(this);
      // this.handleSubirArchivoChange = this.handleSubirArchivoChange.bind(this); saveAtachmentDB
      // this.handleListadoChange = this.handleListadoChange.bind(this);
      
  }


  componentWillMount() {
    this.getCategorys();
    setTimeout(() => {  this.getListNewsLetter(); }, 1000);
  }

  getCategorys = async (name) => {
    const arrCategorys =[]
    const q = query(collection(db, "Category"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const obj = {
        label: doc.data().name,
        value: doc.id,
      }
      arrCategorys.push(obj)
    });

    this.saveCategorys(arrCategorys)
  };

  getListNewsLetter = async (name) => {
    const categorys = this.state.categorys;

    const arrData =[]
    const q = query(collection(db, "NewsLetter"));
    const querySnapshot = await getDocs(q);    

    querySnapshot.forEach((doc) => {
      const cat = categorys.find(x => x.value === doc.data().category)

      const obj = {
        newsLetterId: doc.id,
        title: doc.data().title,
        category:  cat && cat.label ? cat.label:'Sin categoria',
        fileName: doc.data().fileName,
        fileUrl: doc.data().fileUrl,
        sendNewsletter: doc.data().sendNewsletter, 
      }
      arrData.push(obj)
    });
    this.handleDataChange(arrData)
  };

  notification = (msg) => {
    enqueueSnackbar(msg, {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    })
  };

  sendEmailList = async (newsLetterId) => {
    const {listData,categorys} = this.state; 
    const newsLetter = listData.find(x => x.newsLetterId === newsLetterId)
    console.log(newsLetter,'newsLetter')
    const category = categorys.find(x => x.label === newsLetter.category)
    console.log(category,'category')
    const q = query(collection(db, "UserSubscribe"), where("category", "==", category.value));
    const querySnapshot = await getDocs(q);    

    querySnapshot.forEach((doc) => {
        
        const unsubscribeLink = `https://correos-dc3de.web.app/unsubscribe/${category.value}/${doc.id}`;
        const msjBody = `Dear Subscriber,

        We have received your request to unsubscribe from our newsletter, which is categorized under ${category.label}. We are sorry to see you go, but we understand that your time and attention are valuable.

        To confirm your unsubscribe request, please click on the link below:
        ${unsubscribeLink}

        If you believe this was done in error, or if you have any feedback that you would like to share with us, please reply to this email and let us know.

        Thank you for your time and attention.`;

        const data = {
            to: doc.data().email,
            subject: newsLetter.title ,
            body: msjBody,
            attachmentPath: newsLetter.fileUrl,
        }
    
        sendEmailWithAttachment(data);  
    });

    const docRef = doc(db, "NewsLetter", newsLetterId); // get a reference to the document you want to update
    
    try {
        await updateDoc(docRef, {
            sendNewsletter: true, // update only the sendNewsletter field
        });
      
        this.notification('The newsletter was sent successfully')
      } catch (e) {
        console.error("Error updating document: ", e);
      }
  };

  handleTitleChange = (e) => {
    this.setState({
      title: e.target.value,
    });
  };

  handleStepperChange = (stepper) => {
    this.setState({
      stepper: stepper,
    });
  };
  handleNameAttachmentChange = (e) => {
    this.setState({
      nameAttachment: e,
    });
  };

  handleFileUrlChange = (e) => {
    this.setState({
      fileUrl: e,
    });
  }

  saveAtachmentDB = async (nombre,archivo) => {
    try {
      const url = `files/${nombre}`
      const storage = getStorage();
      const storageRef = ref(storage, url);

      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, archivo).then((snapshot) => {
        this.handleFileUrlChange(url)
         return url;
      });
    } catch (error) {
      console.log(error);
    }
  };


  handleCategoryChange = (e) => {
    this.setState({
      category: e.value,
    });
  };

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  saveCategorys = (e) => {
    this.setState({
      categorys: e,
    });
  };

  handleDataChange = (arrdata) => {
    this.setState({
      listData: arrdata,
    });
  };

  handleSendEmailChange = (e) => {
    this.setState({
      sendEmail: e.target.checked,
    });
  };

  saveAtachment = async (event) => {
    const {
      attachment,
    } = this.state

    const formData = new FormData();
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


    if(files.length > 0){
      for(let i = 0; i < files.length; i+=1){
        tipo = files[i].name.substring(files[i].name.lastIndexOf('.') + 1);
        tipo = tipo.toLowerCase();
        if(archivosValidos.includes(tipo.toLowerCase())){
          if(files[i].size > 5242880){
            this.notification('The file size is not valid');
          } else {
            formData.append('files',files[i]);
            attachment.push(files[i]);
            await this.saveAtachmentDB(files[i].name,files[i]);
            this.handleNameAttachmentChange(files[i].name);
          }
        } else {
            this.notification('The file type is not valid');
        }
      }
      event.target.value = null;
    }
  };
  

  saveCategoryName = (name) => {
    this.setState({
        categoryName: name,
    });
  };

  saveCategoryDB = async (name) => {
    try {
        await addDoc(collection(db, "Category"), {
          name: name,
        });
        this.saveCategoryName('')
        this.getCategorys()
    } catch (error) {
      console.log(error);
    }
  };


  saveNewsletter = async () => {
    const {
      title,
      category,
      email,
      sendEmail,
      nameAttachment,
      fileUrl,
      categorys,
    } = this.state

    const categoryName = categorys.find(x => x.value === category)  
    console.log(categoryName,'categoryName')   

    let newsLetterId = '';
    
    console.log(category,'category')

    // correo to array by spit
    const emails = email.replace(/ /g, "").split(",");
    const emailsValidos = [];
    const emailsInvalidos = [];
    emails.forEach((email) => {
        if (email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
            emailsValidos.push(email);
        } else {
            emailsInvalidos.push(email);
        }
    });

    // save newsletter
    try {
        const docRef = await addDoc(collection(db, "NewsLetter"), {
          title: title,
          category: category,
          fileName: nameAttachment,
          fileUrl: fileUrl,
          sendNewsletter: sendEmail,
        });
        newsLetterId = docRef.id;
    } catch (error) {
        console.log(error);
    }
    // send email
    emailsValidos.forEach(async (email) => {
        let userSubscribeID = '';
        try {
            const docEmail = await addDoc(collection(db, "UserSubscribe"), {
            idNewsLetter: newsLetterId,    
            email: email,
            category: category,
            suscribed: true,
            });
            userSubscribeID = docEmail.id;
            this.notification('Newsletter saved successfully');
        } catch (e) {
            console.error("Error adding document: ", e);
        }

            const unsubscribeLink = `https://correos-dc3de.web.app/unsubscribe/${category}/${userSubscribeID}`;
            const msjBody = `Dear Subscriber,

            We have received your request to unsubscribe from our newsletter, which is categorized under ${categoryName.label}. We are sorry to see you go, but we understand that your time and attention are valuable.

            To confirm your unsubscribe request, please click on the link below:
            ${unsubscribeLink}

            If you believe this was done in error, or if you have any feedback that you would like to share with us, please reply to this email and let us know.

            Thank you for your time and attention.`;

        // To send email
        if(sendEmail){
            const data = {
                to: email,
                subject: title,
                body: msjBody,
                attachmentPath: fileUrl
            }

            sendEmailWithAttachment(data);          
        }
        });

    // return list
    this.getListNewsLetter()
    this.handleStepperChange(0);
    
  };

  render() {

    const { 
      stepper,
      listData,
      categorys,
      sendEmail,
      title,
      email,
      nameAttachment,
      attachment,
      categoryName,
      category,
    } = this.state


    const actionsList = {
        handleStepperChange: this.handleStepperChange,
        sendEmailList: this.sendEmailList,
    }

    const actionsNewNewsLetter = {
        handleStepperChange: this.handleStepperChange,
        handleTitleChange: this.handleTitleChange,
        handleCategoryChange: this.handleCategoryChange,
        handleEmailChange: this.handleEmailChange,
        saveCategoryName: this.saveCategoryName,
        saveCategoryDB: this.saveCategoryDB,
        saveNewsletter: this.saveNewsletter,
        saveAtachment: this.saveAtachment,
        notification: this.notification,
        handleSendEmailChange: this.handleSendEmailChange,
        
    }
    switch (stepper) {
        case 0 :
             return (
                <NewsLetterList
                    listData={listData}
                    actionsList={actionsList}
                />
            )
        case 1 :
            return (
                <NewNewsletter
                    sendEmail={sendEmail}
                    title={title}
                    email={email}
                    nameAttachment={nameAttachment}
                    attachment={attachment}
                    categorys = {categorys}
                    categoryName = {categoryName}
                    category = {category}
                    actionsNewNewsLetter={actionsNewNewsLetter}

                />
                )
        default:
            return null

    }
  }
}


NewsletterPage.propTypes = {
  titulo: T.string,
};

export default NewsletterPage;