import React, { useState } from 'react';
import SidebarChat from './sidebar/SidebarChat';
import MessageContainer from '../dm/messages/MessageContainer';
import {
    Grid,
    Card,
    Box,
    IconButton,
    useMediaQuery
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ChatLayout() {
    const [showSidebar, setShowSidebar] = useState(true);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md')); // detect if  isMobile

    return (
        <Box marginTop={{ xs: 0, sm: 0, md: 9, lg: 9 }}>
            <Card
                sx={{
                    maxHeight: 'auto',
                    maxWidth: 1200,
                    margin: 'auto',
                    bgcolor: 'black',
                    color: 'white',
                }}
            >
                <Grid container spacing={2}>
                    {/* show chats list */}
                    {(!isMobile || showSidebar) && (
                        <Grid
                            item
                            xs={12}
                            md={4}
                            lg={3}
                            sx={{ display: { xs: showSidebar ? 'block' : 'none', md: 'block' } }}
                        >
                            <SidebarChat onChatSelect={() => isMobile && setShowSidebar(false)} />
                        </Grid>
                    )}

                    {/* back button for isMobile */}
                    {isMobile && !showSidebar && (
                        <IconButton
                        onClick={() => setShowSidebar(true)}
                        sx={{
                            display: { xs: 'block', sm: 'block', md: 'none' },
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            zIndex: 1
                        }}
                    >
                        <ArrowBackIcon sx={{ color: 'white' }} />
                    </IconButton>
                    
                    )}

                    {/* show messages */}
                    {(!isMobile || !showSidebar) && (
                        <Grid
                            item
                            xs={12}
                            md={8}
                            lg={9}
                            sx={{ display: { xs: !showSidebar ? 'block' : 'none', md: 'block' } }}
                        >
                            <MessageContainer />
                        </Grid>
                    )}
                </Grid>
            </Card>
        </Box>
    );
}

//! INITIAL CODE SNIPPET
// import React, { useState } from 'react';
// import SidebarChat from './sidebar/SidebarChat';
// import MessageContainer from '../dm/messages/MessageContainer';
// import {
//     Grid,
//     Card,
//     Box,
//     IconButton,
//     useMediaQuery
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// export default function ChatLayout() {
//     const [showSidebar, setShowSidebar] = useState(true);
//     const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md')); // detect if  isMobile

//     return (
//         <Box marginTop={{ xs: 0, sm: 5, md: 9, lg: 9 }}>
//             <Card
//                 sx={{
//                     maxHeight: 'auto',
//                     maxWidth: 1200,
//                     margin: 'auto',
//                     bgcolor: 'black',
//                     color: 'white',
//                 }}
//             >
//                 <Grid container spacing={2}>
//                     {/* show chats list */}
//                     {(!isMobile || showSidebar) && (
//                         <Grid
//                             item
//                             xs={12}
//                             md={4}
//                             lg={3}
//                             sx={{ display: { xs: showSidebar ? 'block' : 'none', md: 'block' } }}
//                         >
//                             <SidebarChat onChatSelect={() => isMobile && setShowSidebar(false)} />
//                         </Grid>
//                     )}

//                     {/* back button for isMobile */}
//                     {isMobile && !showSidebar && (
//                         <IconButton
//                             onClick={() => setShowSidebar(true)}
//                             sx={{
//                                 display: { xs: 'block', sm: 'block', md: 'none' }, 
//                                 position: 'absolute',
//                                 top: 10,
//                                 left: 10,
//                                 zIndex: 1
//                             }}
//                         >
//                             <ArrowBackIcon sx={{ color: 'white' }} />
//                         </IconButton>
//                     )}

//                     {/* show messages */}
//                     {(!isMobile || !showSidebar) && (
//                         <Grid
//                             item
//                             xs={12}
//                             md={8}
//                             lg={9}
//                             sx={{ display: { xs: !showSidebar ? 'block' : 'none', md: 'block' } }}
//                         >
//                             <MessageContainer />
//                         </Grid>
//                     )}
//                 </Grid>
//             </Card>
//         </Box>
//     );
// }
