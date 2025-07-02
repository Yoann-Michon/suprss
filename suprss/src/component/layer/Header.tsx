import { Settings, Logout } from "@mui/icons-material";
import {
    Box,
    Avatar,
    IconButton,
    Tooltip,
    Divider,
    ListItemIcon,
    Menu,
    MenuItem,
} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useState, type MouseEvent } from "react";
import { useThemeMode } from "../ThemeModeContext";

const Header = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    // Correction : destructurer les propriétés du contexte
    const { darkMode, toggleDarkMode } = useThemeMode();
    
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            component="header"
            sx={{
                backgroundColor: "#1A2027",
                px: 3,
                color: "#fff",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: 200, alignSelf:"end" }}>
                <Box>
                    <IconButton
                        size="small"
                        sx={{ p: 0 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                    >
                        <NotificationsIcon sx={{ color: "#FFFFFF" }} />
                    </IconButton>
                    
                    <IconButton
                        onClick={toggleDarkMode}
                        size="small"
                        sx={{ p: 0, ml: 1 }}
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <LightModeIcon sx={{ color: "#FFFFFF" }} />
                        ) : (
                            <DarkModeIcon sx={{ color: "#3D99F5" }} />
                        )}
                    </IconButton>
                </Box>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ p: 0 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                    >
                        <Avatar
                            alt="Remy Sharp"
                            src="/static/images/avatar/1.jpg"
                            sx={{ width: 40, height: 40 }}
                        />
                    </IconButton>
                </Tooltip>
            </Box>
            
            <Divider
                orientation="horizontal"
                flexItem
                sx={{ my: 2, bgcolor: "#FFFFFF", width: "100%", alignSelf: "center" }}
            />
            
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        minWidth: 180,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem>
                    <Avatar /> Profile
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Header;