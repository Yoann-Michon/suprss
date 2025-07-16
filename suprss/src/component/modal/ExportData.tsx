import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { exportFeedData, type Feed } from '../ExportData';


interface ExportDataProps {
  feeds: Feed[];
  onClose: () => void;
}

const ExportData = ({ feeds, onClose }: ExportDataProps) => {
  const { t } = useTranslation();

  const handleExport = (format: 'json' | 'csv' | 'opml') => {
    exportFeedData(feeds, format);
    onClose();
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        {t('manageFeeds.selectExportFormat')}
      </Typography>
      <Box display="flex" gap={2}>
        <Button onClick={() => handleExport('json')}>JSON</Button>
        <Button onClick={() => handleExport('csv')}>CSV</Button>
        <Button onClick={() => handleExport('opml')}>OPML</Button>
      </Box>
    </Box>
  );
};

export default ExportData;
