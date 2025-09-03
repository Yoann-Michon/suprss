import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import SchoolIcon from '@mui/icons-material/School';

import { useEffect, useState } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeColors } from '../ThemeModeContext';
import { useTranslation } from 'react-i18next';
import { liftWithBounce } from '../animation/Animations';
import Tutorial from '../tutorial/Introjs';
import { getSidebarSteps } from '../tutorial/TutorialSteps';

const Sidebar = () => {
    const title = 'SUPRSS';
    const colors = useThemeColors();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const { t } = useTranslation();
    const [showTutorial, setShowTutorial] = useState(false);

    const handleSelect = (path: string) => {
        navigate(path);
    };

    const nav = {
        header: [
            { id: "sidebar_home", text: t('navigation.sidebar.home'), icon: <HomeRoundedIcon />, path: '/home' },
            { id:"sidebar_flux", text:t('navigation.sidebar.flux'), icon:<RssFeedIcon/>, path:'/manage_feed' },
            { id: "sidebar_collections", text: t('navigation.sidebar.collections'), icon: <PeopleOutlineIcon />, path: '/collections' },
            { id: "sidebar_favorites", text: t('navigation.sidebar.favorites'), icon: <CollectionsBookmarkIcon />, path: '/favorite' },
        ],
        footer: [
            { id: "sidebar_tutorial", text: t('navigation.sidebar.tutorial'), icon: <SchoolIcon />, onclick: () => { localStorage.removeItem("sidebarTutorialDone"); setShowTutorial(true); } },
            { id: "sidebar_documentation", text: t('navigation.sidebar.documentation'), icon: <AutoStoriesIcon />, path: '/documentation' },
        ]
    };

    useEffect(() => {
        if (!localStorage.getItem("sidebarTutorialDone")) {
            setShowTutorial(true);
        }
    }, []);

    const handleExitTutorial = () => {
        localStorage.setItem("sidebarTutorialDone", "true");
        setShowTutorial(false);
    };

    return (
        <Stack sx={{
            px: 2,
            minWidth: 250,
            height: '100vh',
            backgroundColor: colors.background.sidebar,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: `1px solid ${colors.border}`
        }}>
            <Box>
                <Typography variant="h5" sx={{
                    color: colors.text.primary,
                    fontWeight: 'bold',
                    my: 2,
                    textAlign: 'center',
                    fontFamily: 'Baggy Regular',
                    letterSpacing: '0.5rem',
                    textTransform: 'uppercase'
                }}>
                    {title.split('').map((letter, index) => (
                        <Box key={index} component="span" sx={liftWithBounce}>
                            {letter}
                        </Box>
                    ))}
                </Typography>
                <List dense>
                    {nav.header.map((item) => (
                        <ListItem key={item.id} id={item.id} disablePadding>
                            <ListItemButton
                                onClick={() => handleSelect(item.path)}
                                sx={{
                                    backgroundColor: currentPath.startsWith(item.path) ? colors.background.selected : "transparent",
                                    borderRadius: "50px",
                                    px: 2,
                                    pl: 1,
                                    color: currentPath.startsWith(item.path) ? colors.primary : colors.text.secondary,
                                    '&:hover': {
                                        color: colors.primary,
                                        backgroundColor: "transparent",
                                    }
                                }}
                            >
                                <ListItemIcon sx={{
                                    color: currentPath.startsWith(item.path) ? colors.iconSelected : colors.icon,
                                    minWidth: '40px'
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: '14px',
                                        fontWeight: currentPath.startsWith(item.path) ? 600 : 400
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box>
                <Divider sx={{ my: 2, borderColor: colors.divider }} />
                <List dense>
                    {nav.footer.map((item) => (
                        <ListItem key={item.id} id={item.id} disablePadding>
                            <ListItemButton
                                onClick={() => item?.path ? handleSelect(item.path) : item.onclick?.()}
                                sx={{
                                    backgroundColor: currentPath === item.path ? colors.background.selected : "transparent",
                                    borderRadius: "50px",
                                    px: 2,
                                    py: 1,
                                    color: currentPath === item.path ? colors.primary : colors.text.secondary,
                                    '&:hover': {
                                        color: colors.primary,
                                        backgroundColor: "transparent",
                                    }
                                }}
                            >
                                <ListItemIcon sx={{
                                    color: currentPath === item.path ? colors.iconSelected : colors.icon,
                                    minWidth: '40px'
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: '14px',
                                        fontWeight: currentPath === item.path ? 600 : 400
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {showTutorial && (
                <Tutorial steps={getSidebarSteps(t)} start={true} onExit={handleExitTutorial} />
            )}
        </Stack>
    );
};

export default Sidebar;
