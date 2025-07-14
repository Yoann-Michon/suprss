import {
    Stack,
    Card,
    Box,
    FormControl,
    FormLabel,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Divider,
    Typography, IconButton, InputAdornment
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import TwoWomen from "../../assets/two_women.webp";
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

const Login = () => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const navigate = useNavigate();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate("/home");
    };

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
                minHeight: "100vh",
                backgroundColor: "#121417",
            }}
        >
            <Card
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "center",
                    width: { xs: "95%", sm: "80%", md: "70%" },
                    height: "60%",
                    maxHeight: "550px",
                    maxWidth: "1000px",
                    borderRadius: "50px",
                    overflow: "hidden",
                    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.3)",
                    backgroundColor: "#121A21",
                }}
            >
                <Box
                    sx={{
                        width: { xs: "100%", md: "50%" },
                        backgroundColor: "transparent",
                        padding: { xs: 3, sm: 5 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h5" sx={{ color: "#FFFFFF", my: 2, fontWeight: 'bold' }}>
                        {t('login.title')}
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: "350px" }}>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <FormLabel htmlFor="username" sx={{ color: "#FFFFFF", mb: 0.5, alignSelf: "start", fontSize: "0.9rem" }}>
                                {t('login.username')}
                            </FormLabel>
                            <TextField
                                id="username"
                                type="text"
                                name="username"
                                placeholder={t('login.usernamePlaceholder')}
                                autoComplete="username"
                                autoFocus
                                required
                                fullWidth
                                InputProps={{
                                    sx: {
                                        borderRadius: "8px",
                                        backgroundColor: "#1C262E",
                                        color: "#E2E8F0",
                                        '& fieldset': {
                                            borderColor: '#99ABC2',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#63B3ED',
                                        }, '& input': {
                                            padding: "10px",
                                            fontSize: "0.87rem"
                                        },
                                    }
                                }}
                                InputLabelProps={{ sx: { color: "#E2E8F0" } }}
                                error={false}
                                helperText={""}
                            />
                        </FormControl>

                        <FormControl fullWidth sx={{ my: 2 }}>
                            <FormLabel htmlFor="password" sx={{ color: "#FFFFFF", mb: 0.5, alignSelf: "start", fontSize: "0.9rem" }}>
                                {t('login.password')}
                            </FormLabel>
                            <TextField
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                fullWidth
                                placeholder={t('login.passwordPlaceholder')}
                                InputProps={{
                                    sx: {
                                        borderRadius: "8px",
                                        backgroundColor: "#1C262E",
                                        color: "#E2E8F0",
                                        '& fieldset': { borderColor: '#99ABC2' },
                                        '&.Mui-focused fieldset': { borderColor: '#63B3ED' },
                                        '& input': {
                                            padding: "10px",
                                            fontSize: "0.87rem"
                                        },
                                    },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                                sx={{ color: "#E2E8F0" }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </FormControl>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <FormControlLabel
                                control={<Checkbox sx={{
                                    color: "#CBD5E0",
                                    '& .MuiSvgIcon-root': {
                                        fontSize: 20,
                                    }
                                }} />}
                                label={<Typography variant="body2" sx={{ color: "#CBD5E0", fontSize: "0.8rem" }}>
                                    {t('login.rememberMe')}
                                </Typography>}
                            />
                            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                                <Typography variant="body2" sx={{ color: "#63B3ED", '&:hover': { textDecoration: 'underline' }, fontSize: "0.8rem" }}>
                                    {t('login.forgotPassword')}
                                </Typography>
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                color: "#FFFFFF",
                                backgroundColor: "#63B3ED",
                                '&:hover': {
                                    backgroundColor: "#4299E1",
                                },
                                borderRadius: "50px",
                                fontSize: "0.75rem",
                                fontWeight: "bold"
                            }}
                        >
                            {t('login.loginButton')}
                        </Button>
                    </Box>

                    <Divider sx={{
                        my: 2,
                        width: "100%",
                        maxWidth: "250px",
                        "&::before, &::after": {
                            borderColor: "#99ABC2",
                        },
                    }}>
                        <Typography variant="body1" sx={{ color: "#CBD5E0", fontSize: "0.7rem" }}>
                            {t('login.orLoginWith')}
                        </Typography>
                    </Divider>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%", maxWidth: "350px", justifyContent: "center" }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<GoogleIcon />}
                            sx={{
                                borderColor: "#FFFFFF",
                                backgroundColor: "#293642",
                                color: "#E2E8F0",
                                '&:hover': {
                                    borderColor: "#63B3ED",
                                    backgroundColor: "rgba(99, 179, 237, 0.1)",
                                },
                                borderRadius: "50px",
                                fontSize: "0.75rem",
                                fontWeight: "bold"
                            }}
                        >
                            Google
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<MicrosoftIcon />}
                            sx={{
                                borderColor: "#FFFFFF",
                                backgroundColor: "#293642",
                                color: "#E2E8F0",
                                '&:hover': {
                                    borderColor: "#63B3ED",
                                    backgroundColor: "rgba(99, 179, 237, 0.1)",
                                },
                                borderRadius: "50px",
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                            }}
                        >
                            Microsoft
                        </Button>
                    </Box>

                    <Typography variant="body1" align="center" sx={{ color: "#CBD5E0", my: 2, fontSize: "0.7rem" }}>
                        {t('login.noAccount')}{" "}
                        <Link to="/auth/register" style={{ textDecoration: 'none' }}>
                            <Typography component="span" sx={{ color: "#63B3ED", '&:hover': { textDecoration: 'underline' }, fontSize: "0.7rem" }}>
                                {t('login.signUp')}
                            </Typography>
                        </Link>
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: { xs: "100%", md: "50%" },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        position: "relative",
                        overflow: 'hidden',
                        backgroundImage: `url(${TwoWomen})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <Box sx={{ position: "absolute", top: 40, textAlign: "center", width: "80%" }}>
                        <Typography variant="h4" sx={{ color: "#FFFFFF", mb: 2, fontWeight: 'bold' }}>
                            {t('login.stayInformedTogether')}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#FFFFFF" }}>
                            {t('login.collaborativeDescription')}
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Stack>
    );
};

export default Login;