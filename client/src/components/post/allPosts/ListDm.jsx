import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import ChatList from './ChatList';
import { toast } from 'react-toastify';
import useGetChats from '../../dm/hooks/useGetChats';
import useSendMessage from '../../dm/hooks/useSendMessage';

export default function ChatsListModal({ open, handleClose, postId }) {
    const { loading: chatsLoading, chats } = useGetChats();
    const { sendMessage, loading: sending } = useSendMessage();
    const [message, setMessage] = useState('');
    const [checkedChats, setCheckedChats] = useState({});

    // Función para manejar el cambio de checkbox
    const handleCheckboxChange = (chatId) => {
        setCheckedChats((prev) => ({
            ...prev,
            [chatId]: !prev[chatId],
        }));
    };

    // Verificar si hay algún chat seleccionado
    const isAnyChatSelected = Object.values(checkedChats).some((isChecked) => isChecked);

    const handleSendMessage = async () => {
        if (!message && !postId) return;
        const selectedChats = Object.keys(checkedChats).filter(id => checkedChats[id]);
    
        // Iterar sobre cada chat seleccionado
        for (const chatId of selectedChats) {
            // Llamar a sendMessage para cada chat seleccionado
            await sendMessage(message, postId, chatId);
        }
        
        handleClose();
        toast.success('Post sent successfully');
    };
    
    // Efecto para resetear el estado cuando se cierra el modal
    useEffect(() => {
        if (!open) {
            setMessage(''); // Limpiar el mensaje
            setCheckedChats({}); // Desmarcar todos los checkboxes
        }
    }, [open]); // Se dispara cuando el estado de 'open' cambia

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Chat List</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column">
                    <Box overflow="auto" maxHeight={200}>
                        <List dense>
                            {chats.map((chat, idx) => (
                                <ListItem key={chat._id}>
                                    <ChatList
                                        chat={chat}
                                        lastIdx={idx === chats.length - 1}
                                        isSelected={checkedChats[chat._id] || false}
                                        handleCheckboxChange={handleCheckboxChange}
                                    />
                                </ListItem>
                            ))}
                            {chatsLoading ? <p>LOADING..</p> : null}
                        </List>
                    </Box>
                    <Box mt={2}>
                        <TextField
                            label="Mensaje"
                            fullWidth
                            multiline
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSendMessage}
                    color="primary"
                    disabled={sending || !isAnyChatSelected}
                >
                    {sending ? 'Enviando...' : 'Enviar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}    