import { useParams } from 'react-router-dom';
import { Container,Grid, Button } from '@mui/material';
import { doc, updateDoc, collection, query, where, getDoc } from "firebase/firestore";
import {db, functions} from "../firebase";


// create function recibe params for url category and userId
function NewsletterUnsubscribe() {
    const { category, userId } = useParams();

    const handleUnsubscribe = async () => {
        const documentRef = doc(db, "Category", category);
        const documentSnapshot = await getDoc(documentRef);
        const documentData = documentSnapshot.data();

        console.log("documentData", documentData);
        const categoryName = documentData.name;
        
      
        const docRef = doc(db, "UserSubscribe", userId);
        try {
          await updateDoc(docRef, {
            suscribed: false,
          });
          console.log("Document successfully updated!");
        } catch (e) {
          console.error("Error updating document: ", e);
        }
      
        document.getElementById("message").textContent = `You have successfully unsubscribed from ${categoryName}.`;
      };


  return (
    <div>
    <Container maxWidth={'md'}>
        <h1>If you want to unsubscribe from this newsletter, click the button</h1>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    name="btnGuardar"
                    onClick={handleUnsubscribe}
                    fullWidth
                    >
                    Unsubscribe 
                </Button>
                </Grid>
            <Grid item xs={12}>
                <p id="message"></p>        
            </Grid>
        </Grid>
    </Container>
  </div>
  );
}

export default NewsletterUnsubscribe;