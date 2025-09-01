import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RssFeedIcon from '@mui/icons-material/RssFeed';

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
    Box,
    Collapse,
    IconButton,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeColors } from '../ThemeModeContext';
import { useTranslation } from 'react-i18next';
import { liftWithBounce } from '../animation/Animations';
import SchoolIcon from '@mui/icons-material/School';
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
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

    const handleToggleSubMenu = (text: string) => {
        setOpenSubMenu((prev) => (prev === text ? null : text));
    };

    const handleSelect = (path: string) => {
        navigate(path);
    };

    const nav = {
        header: [
            { id: "sidebar_home", text: t('navigation.sidebar.home'), icon: <HomeRoundedIcon />, path: '/home' },
            {id:"sidebar_flux", text:t('navigation.sidebar.flux'), icon:<RssFeedIcon/>, path:'/manage_feed'},
            {
                id: "sidebar_sharedCollections",
                text: t('navigation.sidebar.sharedCollections'), icon: <PeopleOutlineIcon />, path: '/shared_collections',
                subItems: [
                    { title: t('navigation.sidebar.private'), path: '/shared_collections/1' },
                    { title: t('navigation.sidebar.shared'), path: '/shared_collections/2' },
                ]
            },
            { id: "sidebar_favorites", text: t('navigation.sidebar.favorites'), icon: <CollectionsBookmarkIcon />, path: '/my_favorites' },
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
                    {nav.header.map((item, index) => (
                        <Box key={index}>
                            <ListItem disablePadding secondaryAction={
                                item.subItems && (
                                    <IconButton
                                        id={item.id}
                                        edge="end"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleSubMenu(item.text);
                                        }}
                                        sx={{ color: colors.icon, p: 0, m: 0 }}
                                    >
                                        {openSubMenu === item.text ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                )
                            }>
                                <ListItemButton
                                    id={item.id}
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

                            {item.subItems && (
                                <Collapse in={openSubMenu === item.text} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.subItems.map((subItem, subIndex) => (
                                            <ListItem key={subIndex} disablePadding>
                                                <ListItemButton
                                                    onClick={() => handleSelect(subItem.path)}
                                                    sx={{
                                                        pl: 6,
                                                        py: 0.5,
                                                        color: currentPath === subItem.path ? colors.primary : colors.text.secondary,
                                                        '&:hover': {
                                                            color: colors.primary,
                                                            backgroundColor: "transparent",
                                                        }
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={subItem.title}
                                                        primaryTypographyProps={{
                                                            fontSize: '13px',
                                                            fontWeight: currentPath === subItem.path ? 600 : 400,
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </Box>
                    ))}
                </List>
            </Box>

            <Box>
                <Divider sx={{ my: 2, borderColor: colors.divider }} />
                <List dense>
                    {nav.footer.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                id={item.id}
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
