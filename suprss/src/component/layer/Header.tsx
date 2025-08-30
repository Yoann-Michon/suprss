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
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useState, type MouseEvent } from "react";
import { useThemeMode, useThemeColors } from "../ThemeModeContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser } from "../../context/UserContext";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const colors = useThemeColors();
  const { darkMode, toggleDarkMode } = useThemeMode();
  const { t } = useTranslation();
  const { logout } = useUser();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      component="header"
      id="header_container"
      sx={{
        px: 3,
        color: colors.text.primary,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: 50
      }}
    >
      <Box
        id="header_actions"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: 100,
          alignSelf: "end"
        }}
      >
        <IconButton
          id="header_darkmode_btn"
          onClick={toggleDarkMode}
          size="small"
          sx={{ p: 0, ml: 1 }}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <LightModeIcon sx={{ color: colors.text.secondary }} />
          ) : (
            <DarkModeIcon sx={{ color: colors.primary }} />
          )}
        </IconButton>

        <Tooltip title={t('header.tooltip')}>
          <IconButton
            id="header_avatar_btn"
            onClick={handleClick}
            size="small"
            sx={{ p: 0 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              id="user_avatar"
              alt="User Avatar"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 30, height: 30 }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider
        orientation="horizontal"
        flexItem
        sx={{
          mt: 2,
          bgcolor: colors.divider,
          width: "100%",
          alignSelf: "center"
        }}
      />

      <Menu
        anchorEl={anchorEl}
        id="menu_account"
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
            backgroundColor: colors.background.paper,
            color: colors.text.primary,
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
              bgcolor: colors.background.paper,
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          id="menu_profile"
          component={Link}
          to="/account"
          sx={{
            color: colors.text.primary,
            "&:hover": {
              color: colors.primary,
              backgroundColor: "transparent",
            },
          }}
        >
          <Avatar /> {t('header.profile')}
        </MenuItem>

        <Divider sx={{ borderColor: colors.divider }} />

        <MenuItem
          id="menu_settings"
          component={Link}
          to="/settings"
          sx={{
            color: colors.text.primary,
            "&:hover": {
              color: colors.primary,
              backgroundColor: "transparent",
            },
          }}
        >
          <ListItemIcon sx={{ color: colors.icon }}>
            <Settings fontSize="small" />
          </ListItemIcon>
          {t('header.settings')}
        </MenuItem>

        <MenuItem
          id="menu_logout"
          onClick={async () => {
            logout();
            handleClose();
          }}
          sx={{
            color: colors.text.primary,
            "&:hover": {
              color: colors.primary,
              backgroundColor: "transparent",
            },
          }}
        >
          <ListItemIcon sx={{ color: colors.icon }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('header.logout')}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;
