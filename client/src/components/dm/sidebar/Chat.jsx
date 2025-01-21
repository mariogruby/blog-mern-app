import React from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import useChat from '../../zustand/useChat';
import {
  Avatar,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge
} from '@mui/material';
import { useSocketContext } from '../../../context/SocketContext';

export default function Chat({ chat, lastIdx, onChatSelect }) {
  const { selectedChat, setSelectedChat } = useChat();
  const { onlineUsers } = useSocketContext();

  const isSelected = selectedChat?._id === chat._id;
  const isOnline = onlineUsers.includes(chat._id);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));

  return (
    <>
      <Link to="#" onClick={() => { setSelectedChat(chat); onChatSelect(); }}>
        <ListItemButton
          component="div"
          sx={{
            backgroundColor: isSelected ? 'rgba(0, 0, 0, 1)' : 'transparent',
            '&:hover': {
              backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          <ListItemAvatar>
            <StyledBadge
              color={isOnline ? 'success' : 'default'}
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              variant={isOnline ? 'dot' : undefined}
            >
              <Avatar src={chat.userImage} />
            </StyledBadge>
          </ListItemAvatar>
          <ListItemText primary={chat.username} />
          {/* Badge for unread messages */}
          {chat.unreadMessagesCount > 0 && (
            <Badge
              color="error"
              badgeContent={chat.unreadMessagesCount}
              max={999}
              sx={{ marginLeft: 'auto' }}
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
