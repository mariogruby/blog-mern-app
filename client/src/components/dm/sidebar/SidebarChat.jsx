import React from 'react';
import { Box } from '@mui/material';
import SearchInput from './SearchInput';
import Chats from './Chats';

export default function SidebarChat({ onChatSelect }) {
    return (
        <Box display="flex" flexDirection="column" height={600}>
            <SearchInput />
            <Box flex={1} overflow="auto">
                <Chats onChatSelect={onChatSelect} />
            </Box>
        </Box>
    );
}



//! INITIAL CODE SNIPPET
// import React from 'react';
// import { Box } from '@mui/material';
// import SearchInput from '../search/SearchInput';
// import Chats from '../conversation/Chats';

// export default function SidebarChat() {
//     return (
//         <Box display="flex" flexDirection="column" height="90%">
//             <SearchInput />
//             <Box flex={1} overflow="auto">
//                 <Chats />
//             </Box>
//         </Box>
//     );
// }
