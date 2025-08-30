import {
    Stack,
    Card,
    Box,
    FormControl,
    FormLabel,
    TextField,
    Button,
    Divider,
    Typography,IconButton, InputAdornment,
    Alert
} from "@mui/material";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import TwoWomen from "../../assets/two_women.webp";
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api.service";
import { useUser } from "../../context/UserContext";
import type { IUser } from "../../interfaces/User.interface";

const Register = () => {
    const { t } = useTranslation();
    const { setUser } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        // Validations
        if (!username || !email || !password || !confirmPassword) {
            setError(t('auth.register.fillAllFields') || 'Veuillez remplir tous les champs');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError(t('auth.register.passwordsDontMatch') || 'Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError(t('auth.register.passwordTooShort') || 'Le mot de passe doit contenir au moins 6 caractères');
            setLoading(false);
            return;
        }

        try {
            const user = await api<IUser>("/auth/register", {
                method: "POST",
                body: JSON.stringify({ username, email, password }),
            });
            
            setUser(user);
            // La redirection sera automatique grâce au contexte et aux routes
        } catch (err: any) {
            setError(err.message || t('auth.register.registerError') || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    const formFields = [
        { 
            id: 'username', 
            label: t('auth.register.username'), 
            type: 'text', 
            autoComplete: 'username',
            placeholder: t('auth.register.usernamePlaceholder')
        },
        { 
            id: 'email', 
            label: t('auth.email'), 
            type: 'email', 
            autoComplete: 'email',
            placeholder: t('auth.emailPlaceholder')
        },
        { 
            id: 'password', 
            label: t('auth.password'), 
            type: showPassword ? 'text' : 'password', 
            autoComplete: 'new-password',
            placeholder: t('auth.register.passwordPlaceholder')
        },
        { 
            id: 'confirmPassword', 
            label: t('auth.register.confirmPassword'), 
            type: showConfirmPassword ? 'text' : 'password', 
            autoComplete: 'new-password',
            placeholder: t('auth.register.confirmPasswordPlaceholder')
        },
    ];

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
                    height: "auto",
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
                        {t('auth.register.title')}
                    </Typography>

                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                width: "100%", 
                                maxWidth: "350px", 
                                mb: 2,
                                backgroundColor: "#2D1B1E",
                                color: "#F87171",
                                '& .MuiAlert-icon': {
                                    color: "#F87171"
                                }
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: "350px" }}>
                        {formFields.map(({ id, label, type, autoComplete, placeholder }) => (
                            <FormControl key={id} fullWidth sx={{ my: 1 }}>
                                <FormLabel htmlFor={id} sx={{ color: "#FFFFFF", mb: 0.5, alignSelf: "start", fontSize: "0.9rem" }}>
                                    {label}
                                </FormLabel>
                                <TextField
                                    id={id}
                                    name={id}
                                    type={type}
                                    placeholder={placeholder}
                                    autoComplete={autoComplete}
                                    required
                                    fullWidth
                                    disabled={loading}
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
                                        ...(id === 'password' && {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton 
                                                        onClick={togglePasswordVisibility} 
                                                        edge="end" 
                                                        sx={{ color: "#E2E8F0" }}
                                                        disabled={loading}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }),
                                        ...(id === 'confirmPassword' && {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton 
                                                        onClick={toggleConfirmPasswordVisibility} 
                                                        edge="end" 
                                                        sx={{ color: "#E2E8F0" }}
                                                        disabled={loading}
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        })
                                    }}
                                    InputLabelProps={{ sx: { color: "#E2E8F0" } }}
                                />
                            </FormControl>
                        ))}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                color: "#FFFFFF",
                                backgroundColor: "#63B3ED",
                                '&:hover': {
                                    backgroundColor: "#4299E1",
                                },
                                '&:disabled': {
                                    backgroundColor: "#4A5568",
                                    color: "#A0AEC0"
                                },
                                borderRadius: "50px",
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                mt: 2
                            }}
                        >
                            {loading ? t('auth.register.registering') || 'Inscription...' : t('auth.register.registerButton')}
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
                            {t('auth.register.orRegisterWith')}
                        </Typography>
                    </Divider>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%", maxWidth: "350px", justifyContent: "center" }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<GoogleIcon />}
                            disabled={loading}
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
                            disabled={loading}
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
                        {t('auth.register.alreadyHaveAccount')}{" "}
                        <Link to="/auth/login" style={{ textDecoration: 'none' }}>
                            <Typography component="span" sx={{ color: "#63B3ED", '&:hover': { textDecoration: 'underline' }, fontSize: "0.7rem" }}>
                                {t('auth.login.loginButton')}
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
                            {t('auth.register.stayInformedTogether')}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#FFFFFF" }}>
                            {t('auth.register.collaborativeDescription')}
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Stack>
    );
};

export default Register;