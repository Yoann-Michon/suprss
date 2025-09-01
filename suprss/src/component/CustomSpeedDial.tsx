import AddLinkIcon from '@mui/icons-material/AddLink';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';
import { SpeedDial, SpeedDialAction } from '@mui/material';
import { useState } from 'react';

interface CustomSpeedDialProps {
  showDownload?: boolean;
  onDownloadClick?: () => void;
  onAddFromUrl?: () => void;
  onAddFromFile?: () => void;
}

const CustomSpeedDial = ({
  showDownload = false,
  onDownloadClick,
  onAddFromUrl,
  onAddFromFile,
}: CustomSpeedDialProps) => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);

  const actions = [
    {
      icon: <AddLinkIcon />,
      name: t('myFeed.actions.addFromUrl'),
      onClick: onAddFromUrl,
    },
    {
      icon: <UploadFileIcon />,
      name: t('myFeed.actions.addFromFile'),
      onClick: onAddFromFile,
    },
    ...(showDownload
      ? [
          {
            icon: <DownloadIcon />,
            name: t('myFeed.actions.download'),
            onClick: onDownloadClick,
          },
        ]
      : []),
  ];

  return (
    <SpeedDial
      ariaLabel={t('myFeed.speedDial.ariaLabel')}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        '& .MuiFab-primary': {
          transition: 'transform 0.3s ease-in-out',
          transform: hovered ? 'rotate(45deg)' : 'rotate(0deg)',
        },
      }}
      icon={<SettingsIcon />}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
};

export default CustomSpeedDial;
