import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useState } from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    Divider,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SideContent = () => {
    const nav = {
        header: [
            { text: 'Home', icon: <HomeRoundedIcon />, path: '/dashboard' },
            { text: 'My Feed', icon: <FormatListBulletedIcon />, path: '/my_feed' },
            { text: 'Shared Collections', icon: <PeopleOutlineIcon />, path: '/shared_collections' },
            { text: 'Collections', icon: <CollectionsBookmarkIcon />, path: '/my_collections' },
        ],
        footer: [
            { text: 'Documentation', icon: <AutoStoriesIcon />, path: '/documentation' },
        ]
    };

    const [selectedPage, setSelectedPage] = useState('Home');
    const navigate = useNavigate();

    const handleSelect = (text: string, path: string) => {
        setSelectedPage(text);
        navigate(path);
    };

    return (
        <Stack sx={{ px: 2, width: 250, height: '100vh', backgroundColor: '#121A21', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>

                <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 'bold', my: 2, textAlign: 'center' }}>
                    SUPRSS
                </Typography>

                <List dense>
                    {nav.header.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                onClick={() => handleSelect(item.text, item.path)}
                                sx={{
                                    backgroundColor: selectedPage === item.text ? "#243347" : "transparent",
                                    borderRadius: "50px",
                                    px: 2,
                                    py: 1,
                                    color: "#E2E8F0",
                                    '&:hover': {
                                        color: "#3D99F5"
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: selectedPage === item.text ? "#3D99F5" : "#99ABC2" }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box>

                <Divider sx={{ my: 2, borderColor: "#243347" }} />

                <List dense>
                    {nav.footer.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                onClick={() => handleSelect(item.text, item.path)}
                                sx={{
                                    backgroundColor: selectedPage === item.text ? "#243347" : "transparent",
                                    borderRadius: "50px",
                                    px: 2,
                                    py: 1,
                                    color: "#E2E8F0",
                                    '&:hover': {
                                        color: "#3D99F5",
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: selectedPage === item.text ? "#3D99F5" : "#99ABC2" }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Stack>
    );
};

export default SideContent;
