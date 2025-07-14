import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddLinkIcon from '@mui/icons-material/AddLink';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SpeedDial, SpeedDialAction } from '@mui/material';

const CustomSpeedDial = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const actions = [
        {
            icon: <ManageSearchIcon />,
            name: t('myFeed.actions.manageFeeds'),
            onClick: () => navigate('/my_feed/manage'),
        },
        {
            icon: <AddLinkIcon />,
            name: t('myFeed.actions.addFromUrl'),
            onClick: () => true,
        },
        {
            icon: <UploadFileIcon />,
            name: t('myFeed.actions.addFromFile'),
            onClick: () => true,
        },
    ];
    return (
        <SpeedDial
            ariaLabel={t('myFeed.speedDial.ariaLabel')}
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
    );
}

export default CustomSpeedDial;