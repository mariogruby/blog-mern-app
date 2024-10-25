import React from 'react';
import { Link } from 'react-router-dom';
import useChat from '../../zustand/useChat';
import { Avatar, ListItemButton, ListItemAvatar, ListItemText, Divider, Box, Badge } from '@mui/material';
import { useSocketContext } from '../../../context/SocketContext';

export default function Chat({ chat, lastIdx }) {
  const { selectedChat, setSelectedChat } = useChat();
  const { onlineUsers } = useSocketContext();

  const isSelected = selectedChat?._id === chat._id;
  const isOnline = onlineUsers.includes(chat._id);

  return (
    <>
      <Link to="#">
        <ListItemButton
          component="a"
          sx={{
            backgroundColor: isSelected ? 'rgba(0, 0, 0, 1)' : 'transparent',
            '&:hover': {
              backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            }
          }}
          onClick={() => setSelectedChat(chat)}
        >
          <ListItemAvatar>
            <Badge
              color={isOnline ? 'success' : 'default'}
              overlap="circular"
              variant={isOnline ? 'dot' : undefined}
              sx={{
                '& .MuiBadge-dot': {
                  width: 13,
                  height: 13,
                  borderColor: 'black',
                  borderWidth: 2,
                  borderStyle: 'solid',
                }
              }}
            >
              <Avatar src={chat.userImage} />
            </Badge>
          </ListItemAvatar>

          <ListItemText
            primary={chat.username}
            secondary={chat.unreadMessagesCount > 0 ? (
              <Box component="span" display="block" fontSize="small" color="textSecondary">
                {/* Tienes {chat.unreadMessagesCount} mensaje(s) nuevo(s) */}
                {/* {chat.unreadMessagesCount > 0 && (
                  <Box>
                    Tienes {chat.unreadMessagesCount} mensaje(s) nuevo(s)
                  </Box>
                )} */}
              </Box>
            ) : null}
          />

          {/* Badge para mensajes no leídos en la posición end */}
          {chat.unreadMessagesCount > 0 && (
            <Badge
              color="error"
              badgeContent={chat.unreadMessagesCount}
              max={999}
              sx={{ marginLeft: 'auto' }} // Asegura que el Badge esté a la derecha
            />
          )}
        </ListItemButton>
      </Link>
      {!lastIdx && <Divider sx={{ my: 0, py: 0, height: 1 }} />}
    </>
  );
}


//! INITIAL CODE SNIPPET
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Avatar, IconButton, TextField, Paper, Typography, Box, ListItemButton, ListItemAvatar, ListItemText } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import SendIcon from '@mui/icons-material/Send';

// export default function ChatComponent() {
//   return (
//     <>
//       <Link to="#">
//         <ListItemButton component="a">
//           <ListItemAvatar>
//             <Avatar src="/placeholder-user.jpg">AC</Avatar>
//           </ListItemAvatar>
//           <ListItemText
//             primary="Acme Inc"
//             secondary={
//               <React.Fragment>
//                 <Box component="span" display="block" fontSize="small" color="textSecondary">
//                   2:39 PM
//                 </Box>
//                 <Box component="span" display="block" color="textSecondary" noWrap>
//                   Hey everyone, we just had a fantastic quarter! 🎉
//                 </Box>
//               </React.Fragment>
//             }
//           />
//         </ListItemButton>
//       </Link>
//     </>

//   );
// }
