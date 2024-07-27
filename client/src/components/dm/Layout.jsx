
// import React, { useState, useEffect } from 'react';
// import { InputBase, Avatar, Box, IconButton, List, ListItem, ListItemAvatar, ListItemText, AppBar, Toolbar } from '@mui/material';
// import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
// import { Link } from 'react-router-dom';

// export default function Component() {
//   return (
//     <Box display="flex" flexDirection="column" height="100vh">
//       <AppBar position="sticky">
//         <Toolbar>
//           <Box display="flex" alignItems="center" width="100%">
//             <IconButton edge="start">
//               <SearchIcon />
//             </IconButton>
//             <InputBase
//               placeholder="Search conversations..."
//               sx={{ ml: 1, flex: 1 }}
//             />
//             <IconButton edge="end">
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>
//       <Box flex={1} overflow="auto">
//         <List>
//           <Link to="#">
//             <ListItem button component="a">
//               <ListItemAvatar>
//                 <Avatar src="/placeholder-user.jpg">AC</Avatar>
//               </ListItemAvatar>
//               <ListItemText
//                 primary="Acme Inc"
//                 secondary={
//                   <React.Fragment>
//                     <Box component="span" display="block" fontSize="small" color="textSecondary">
//                       2:39 PM
//                     </Box>
//                     <Box component="span" display="block" color="textSecondary" noWrap>
//                       Hey everyone, we just had a fantastic quarter! 🎉
//                     </Box>
//                   </React.Fragment>
//                 }
//               />
//             </ListItem>
//           </Link>
//           <Link to="#" >
//             <ListItem button component="a">
//               <ListItemAvatar>
//                 <Avatar src="/placeholder-user.jpg">JP</Avatar>
//               </ListItemAvatar>
//               <ListItemText
//                 primary="Jared Palmer"
//                 secondary={
//                   <React.Fragment>
//                     <Box component="span" display="block" fontSize="small" color="textSecondary">
//                       1:45 PM
//                     </Box>
//                     <Box component="span" display="block" color="textSecondary" noWrap>
//                       Awesome, can't wait to hear more!
//                     </Box>
//                   </React.Fragment>
//                 }
//               />
//             </ListItem>
//           </Link>
//           <Link to="#">
//             <ListItem button component="a">
//               <ListItemAvatar>
//                 <Avatar src="/placeholder-user.jpg">CN</Avatar>
//               </ListItemAvatar>
//               <ListItemText
//                 primary="Shadcn"
//                 secondary={
//                   <React.Fragment>
//                     <Box component="span" display="block" fontSize="small" color="textSecondary">
//                       12:30 PM
//                     </Box>
//                     <Box component="span" display="block" color="textSecondary" noWrap>
//                       Sounds good, let's schedule a meeting.
//                     </Box>
//                   </React.Fragment>
//                 }
//               />
//             </ListItem>
//           </Link>
//         </List>
//       </Box>
//     </Box>
//   );
// }
