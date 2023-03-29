import React, { useState } from 'react';
import { Button, Modal, Box, TextField } from '@mui/material';


function CustomModal({ open, setOpen, saveCategoryDB}) {
  const [text, setText] = useState('');
  
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = () => {
    saveCategoryDB(text)
    setOpen();
  };

  const handleClose = () => {
    setOpen();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
          }}
        >
          <h2 id="modal-title" sx={{ mb: 2 }}>
            Add Category
          </h2>
          <TextField
            label="Category Name"
            value={text}
            onChange={handleTextChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" sx={{ mr: 2 }} onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default CustomModal;