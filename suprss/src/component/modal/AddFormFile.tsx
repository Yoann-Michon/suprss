import { styled } from "@mui/material/styles";
import { Box, Button, Typography, Alert, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
}

export default function AddFeedFromFile() {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError(t('features.manageFeeds.selectFile') );
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/feed/import`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Import failed: ${response.status}`);
      }

      const importResult = await response.json();
      setResult(importResult);
      
    } catch (error) {
      setError(`${t('actions.importFeeds')} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, maxWidth: 500 }}>
      {!result && (
        <>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('documentation.faq.a3')}
          </Typography>

          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            tabIndex={-1}
            disabled={uploading}
          >
            {selectedFile ? selectedFile.name : t('features.manageFeeds.selectFile')}
            <VisuallyHiddenInput
              type="file"
              accept=".xml,.opml,.json,.csv"
              onChange={handleFileChange}
              multiple={false}
            />
          </Button>

          {selectedFile && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('common.title')}: {selectedFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Size: {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
          )}

          <Button 
            variant="contained" 
            disabled={!selectedFile || uploading}
            onClick={handleImport}
            startIcon={uploading ? <CircularProgress size={20} /> : undefined}
          >
            {uploading ? t('loading.message') : t('actions.importFeeds')}
          </Button>
        </>
      )}

      {result && (
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            {t('actions.importFeeds')} {t('auth.api.login_success')}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              {result.imported}/{result.total} feeds imported
            </Typography>
            {result.skipped > 0 && (
              <Typography variant="body2" color="text.secondary">
                {result.skipped} skipped (duplicates)
              </Typography>
            )}
          </Box>
          
          {result.errors.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2, textAlign: 'left' }}>
              <Typography variant="body2" gutterBottom>
                {result.errors.length} errors occurred:
              </Typography>
              {result.errors.slice(0, 3).map((error, index) => (
                <Typography key={index} variant="caption" display="block">
                  • {error}
                </Typography>
              ))}
              {result.errors.length > 3 && (
                <Typography variant="caption">
                  ... and {result.errors.length - 3} more
                </Typography>
              )}
            </Alert>
          )}
          
          <Button variant="outlined" onClick={resetForm}>
            {t('actions.importFeeds')} Another File
          </Button>
        </Box>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </Box>
  );
}