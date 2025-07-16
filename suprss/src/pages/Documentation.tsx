import {
    Box,
    Typography,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Stack,
    Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useThemeColors } from '../component/ThemeModeContext';
import { useTranslation } from 'react-i18next';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';


const Documentation = () => {
    const colors = useThemeColors();
    const { t } = useTranslation();

    const faqs = [
        {
            q: t('documentation.faq.q1'),
            a: t('documentation.faq.a1'),
        },
        {
            q: t('documentation.faq.q2'),
            a: t('documentation.faq.a2'),
        },
        {
            q: t('documentation.faq.q3'),
            a: t('documentation.faq.a3'),
        },
        {
            q: t('documentation.faq.q4'),
            a: t('documentation.faq.a4'),
        },
        {
            q: t('documentation.faq.q5'),
            a: t('documentation.faq.a5'),
        },
    ];

    return (
        <Box
            p={{ xs: 2, md: 4 }}
            sx={{
                backgroundColor: colors.background.default,
                color: colors.text.primary,
                minHeight: '100%',
            }}
        >
            <Stack spacing={2} mb={4}>
                <Typography variant="h4" fontWeight="bold">
                    {t('documentation.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t('documentation.description')}
                </Typography>
            </Stack>

            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, md: 4 },
                    backgroundColor: colors.background.paper,
                    borderRadius: 4,
                }}
            >
                <Stack direction="row" alignItems="center" gap={1} mb={2}>
                    <BookOutlinedIcon sx={{ color: colors.primary }} />
                    <Typography variant="h6">{t('documentation.introTitle')}</Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" paragraph>
                    {t('documentation.introDescription')}
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Stack direction="row" alignItems="center" gap={1} mb={2}>
                    <HelpOutlineIcon sx={{ color: colors.primary }} />
                    <Typography variant="h6">{t('documentation.faqTitle')}</Typography>
                    <Chip label="FAQ" size="small" sx={{ ml: 'auto', bgcolor: colors.background.hover }} />
                </Stack>

                <Stack spacing={2}>
                    {faqs.map((item, idx) => (
                        <Accordion key={idx} disableGutters sx={{ backgroundColor: colors.background.default, borderRadius:5 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ color: colors.text.primary }}>
                                <Typography fontWeight={500}>{item.q}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" color="text.secondary">
                                    {item.a}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Stack>
            </Paper>
            <Divider sx={{ my: 4 }} />

            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                justifyContent="space-between"
            >
                {/* Contact Card */}
                <Paper
                    elevation={2}
                    sx={{
                        flex: 1,
                        p: 3,
                        backgroundColor: colors.background.paper,
                        borderRadius: 3,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {t('documentation.contact.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('documentation.contact.description')}
                    </Typography>
                    <Box mt={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <EmailOutlinedIcon fontSize="small" sx={{ color: colors.icon }} />
                            <Typography variant="body2">
                                <strong>Email:</strong> support@suprss.app
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <AccessTimeOutlinedIcon fontSize="small" sx={{ color: colors.icon }} />
                            <Typography variant="body2">
                                <strong>{t('documentation.contact.hours')}</strong> 09:00 – 18:00 (CET)
                            </Typography>
                        </Box>
                    </Box>

                </Paper>

                {/* Privacy & GDPR Card */}
                <Paper
                    elevation={2}
                    sx={{
                        flex: 1,
                        p: 3,
                        backgroundColor: colors.background.paper,
                        borderRadius: 3,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {t('documentation.privacy.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        {t('documentation.privacy.description')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('documentation.privacy.rgpdNotice')}
                    </Typography>
                </Paper>
            </Stack>

        </Box>
    );
};

export default Documentation;
