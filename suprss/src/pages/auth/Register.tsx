import {
    Stack,
    Card,
    Box,
    FormControl,
    FormLabel,
    TextField,
    Button,
    Divider,
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import TwoWomen from "../../assets/two_women.webp";
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';

const Register = () => {
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
                        Create your account
                    </Typography>

                    <Box component="form" noValidate sx={{ width: "100%", maxWidth: "350px" }}>
                        {[
                            { id: 'username', label: 'Username', type: 'text', autoComplete: 'username' },
                            { id: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
                            { id: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
                            { id: 'confirmPassword', label: 'Confirm Password', type: 'password', autoComplete: 'new-password' },
                        ].map(({ id, label, type, autoComplete }) => (
                            <FormControl key={id} fullWidth sx={{ my: 1 }}>
                                <FormLabel htmlFor={id} sx={{ color: "#FFFFFF", mb: 0.5, alignSelf: "start", fontSize: "0.9rem" }}>{label}</FormLabel>
                                <TextField
                                    id={id}
                                    name={id}
                                    type={type}
                                    placeholder={`Enter your ${label.toLowerCase()}`}
                                    autoComplete={autoComplete}
                                    required
                                    fullWidth
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
                                        }
                                    }}
                                    InputLabelProps={{ sx: { color: "#E2E8F0" } }}
                                />
                            </FormControl>
                        ))}

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
                                fontWeight: "bold",
                                mt: 2
                            }}
                        >
                            Register
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
                        <Typography variant="body1" sx={{ color: "#CBD5E0", fontSize: "0.7rem" }}>Or register with</Typography>
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
                        Already have an account?{" "}
                        <Link to="/auth/login" style={{ textDecoration: 'none' }}>
                            <Typography component="span" sx={{ color: "#63B3ED", '&:hover': { textDecoration: 'underline' }, fontSize: "0.7rem" }}>
                                Login
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
                            Stay informed, Together
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#FFFFFF" }}>
                            A collaborative RSS feed reader that helps you and your team stay up-to-date.
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Stack>
    );
};

export default Register;
