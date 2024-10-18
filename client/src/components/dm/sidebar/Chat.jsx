import React from 'react';
import { Link } from 'react-router-dom';
import useChat from '../../zustand/useChat';
import { Avatar, ListItemButton, ListItemAvatar, ListItemText, Divider, Box, Badge } from '@mui/material';
import { useSocketContext } from '../../../context/SocketContext';

export default function Chat({ chat, lastIdx }) {
  const { selectedChat, setSelectedChat } = useChat();

  const isSelected = selectedChat?._id === chat._id;
  const { onlineUsers } = useSocketContext();
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
                  width: 13,  // Ancho del dot
                  height: 13, // Altura del dot
                  minWidth: 13,
                  borderColor: 'black',  // Color del borde
                  borderWidth: 2,        // Ancho del borde
                  borderStyle: 'solid',
                }
              }}
            >
              <Avatar src={chat.userImage}></Avatar>
            </Badge>
          </ListItemAvatar>

          <ListItemText
            primary={chat.username}
            secondary={
              <React.Fragment>
                <Box component="span" display="block" fontSize="small" color="textSecondary">
                  {/* {!isOnline ?'' : 'Online'} */}
                </Box>
                {/* <Box component="span" display="block" color="textSecondary" noWrap>
                  Hey everyone, we just had a fantastic quarter! 🎉
                </Box> */}
              </React.Fragment>
            }
          />
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
