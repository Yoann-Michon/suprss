import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    SpeedDial,
    SpeedDialAction,
} from '@mui/material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddLinkIcon from '@mui/icons-material/AddLink';
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from './component/ThemeModeContext';

interface Article {
    id: string;
    title: string;
    summary: string;
    date: string;
    source: string;
}

const mockArticles: Article[] = [
    {
        id: '1',
        title: 'How to use SUPRSS effectively',
        summary: 'Discover tips and tricks to get the most out of your SUPRSS feeds.',
        date: '2025-07-09',
        source: 'Tech Blog',
    },
    {
        id: '2',
        title: 'Latest updates in React 18',
        summary: 'React 18 brings exciting features. Learn what’s new and how to migrate.',
        date: '2025-07-08',
        source: 'React News',
    },
    {
        id: '3',
        title: 'Understanding Microservices Architecture',
        summary: 'A deep dive into the pros and cons of microservices.',
        date: '2025-07-07',
        source: 'Dev Journal',
    },
];

const MyFeed = () => {
    const colors = useThemeColors();
    const navigate = useNavigate();

    const actions = [
        {
            icon: <ManageSearchIcon />,
            name: 'Manage Feeds',
            onClick: () => navigate('/manage_feeds'),
        },
        {
            icon: <AddLinkIcon />,
            name: 'Add from URL',
            onClick: () => true,
        },
        {
            icon: <UploadFileIcon />,
            name: 'Add from File',
            onClick: () => true,

        },
    ];

    return (
        <Box p={{ xs: 2, md: 4 }} height="100%" sx={{ backgroundColor: colors.background.default }}>
            <Typography variant="h4" gutterBottom>
                My Feed
            </Typography>

            <Paper elevation={2} sx={{ p: 2, backgroundColor: colors.background.paper }}>
                <List>
                    {mockArticles.map(({ id, title, summary, date, source }) => (
                        <Box key={id}>
                            <ListItem alignItems="flex-start" disablePadding>
                                <ListItemButton onClick={() => navigate(`/article/${id}`)}>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" color="primary">
                                                {title}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {source} — {new Date(date).toLocaleDateString()}
                                                </Typography>
                                                {' — ' + summary}
                                            </>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                            <Divider component="li" />
                        </Box>
                    ))}
                </List>

            </Paper>

            <SpeedDial
                ariaLabel="Manage feeds actions"
                sx={{ position: 'fixed', bottom: 24, right: 24 }}
                icon={<ManageSearchIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.onClick}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
};

export default MyFeed;
