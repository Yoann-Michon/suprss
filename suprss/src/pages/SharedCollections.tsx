import { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Button,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { useThemeColors } from '../component/ThemeModeContext';
import { useTranslation } from 'react-i18next';

const mockCollections = [
  { id: 1, name: 'AI Watch', role: 'owner', users: ['alice', 'bob', 'carol'] },
  { id: 2, name: 'Crypto Tracker', role: 'reader', users: ['alice', 'zoe'] },
  { id: 3, name: 'Web3 & Networks', role: 'owner', users: ['dave', 'emma'] },
  { id: 4, name: 'Green Economy', role: 'reader', users: ['luc', 'you'] },
  { id: 5, name: 'Quant Finance', role: 'owner', users: ['julien'] },
  { id: 6, name: 'Data Science', role: 'reader', users: ['leo', 'alex'] },
  { id: 7, name: 'Cloud News', role: 'owner', users: ['sarah'] },
  { id: 8, name: 'UX/UI Inspiration', role: 'reader', users: ['lina'] },
];

const SharedCollectionsPage = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [tabIndex, setTabIndex] = useState(0);
  const [ownerCollections, setOwnerCollections] = useState<any[]>([]);
  const [readerCollections, setReaderCollections] = useState<any[]>([]);
  const [visibleOwnerCount, setVisibleOwnerCount] = useState(4);
  const [visibleReaderCount, setVisibleReaderCount] = useState(4);

  useEffect(() => {
    const owners = mockCollections.filter((c) => c.role === 'owner');
    const readers = mockCollections.filter((c) => c.role === 'reader');
    setOwnerCollections(owners);
    setReaderCollections(readers);
  }, []);

  const handleTabChange = (_: any, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const renderCollectionCard = (collection: any) => (
    <Box
      key={collection.id}
      sx={{ flex: '1 1 280px', maxWidth: '100%', minWidth: '260px', p:1 }}
    >
      <Card
        elevation={3}
        sx={{
          backgroundColor: colors.background.paper,
          borderRadius: 3,
          transition: 'transform 0.2s, box-shadow 0.2s',
          height: '100%',
          '&:hover': {
            transform: 'translateY(-3px)',
          },
        }}
      >
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6" color={colors.text.primary} fontWeight={600}>
              {collection.name}
            </Typography>
            <Chip
              label={collection.role === 'owner' ? t('sharedCollections.owner') : t('sharedCollections.reader')}
              size="small"
              sx={{
                alignSelf: 'start',
                backgroundColor:
                  collection.role === 'owner' ? colors.primary : colors.background.paper,
                color:
                  collection.role === 'owner' ? colors.background.paper : colors.text.secondary,
                fontWeight: 500,
              }}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <GroupIcon fontSize="small" sx={{ color: colors.icon }} />
              <Tooltip title={collection.users.join(', ')}>
                <Typography
                  variant="body2"
                  color={colors.text.secondary}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t('sharedCollections.userCount', { count: collection.users.length })}
                </Typography>
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100%',
        p: 2,
        backgroundColor: colors.background.default,
      }}
    >
      <Tabs
        orientation="vertical"
        value={tabIndex}
        onChange={handleTabChange}
        sx={{
          borderRight: `1px solid ${colors.border}`,
          minWidth: 200,
          mr: 4,
        }}
      >
        <Tab
          label={t('sharedCollections.ownedCollections')}
          sx={{
            alignItems: 'flex-start',
            color: colors.text.secondary,
            '&.Mui-selected': {
              color: colors.primary,
              fontWeight: 600,
            },
          }}
        />
        <Tab
          label={t('sharedCollections.sharedWithMe')}
          sx={{
            alignItems: 'flex-start',
            color: colors.text.secondary,
            '&.Mui-selected': {
              color: colors.primary,
              fontWeight: 600,
            },
          }}
        />
      </Tabs>

      <Box sx={{ flex: 1 }}>
        {tabIndex === 0 && (
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight="bold" color={colors.text.primary}>
              {t('sharedCollections.collectionsYouOwn')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {ownerCollections.slice(0, visibleOwnerCount).map(renderCollectionCard)}
            </Box>
            {visibleOwnerCount < ownerCollections.length && (
              <Box textAlign="center">
                <Button
                  variant="outlined"
                  onClick={() => setVisibleOwnerCount((prev) => prev + 4)}
                  sx={{ mt: 1, color: colors.primary, borderColor: colors.primary }}
                >
                  {t('sharedCollections.loadMore')}
                </Button>
              </Box>
            )}
          </Stack>
        )}

        {tabIndex === 1 && (
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight="bold" color={colors.text.primary}>
              {t('sharedCollections.collectionsSharedWithYou')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {readerCollections.slice(0, visibleReaderCount).map(renderCollectionCard)}
            </Box>
            {visibleReaderCount < readerCollections.length && (
              <Box textAlign="center">
                <Button
                  variant="outlined"
                  onClick={() => setVisibleReaderCount((prev) => prev + 4)}
                  sx={{ mt: 1, color: colors.primary, borderColor: colors.primary }}
                >
                  {t('sharedCollections.loadMore')}
                </Button>
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default SharedCollectionsPage;