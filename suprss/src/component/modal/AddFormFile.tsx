import { styled } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState, type ChangeEvent } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

export default function AddFeedFromFile() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          setFileContent(text);
        } else {
          setFileContent("");
        }
      };
      reader.readAsText(file);
    } else {
      setFileName(null);
      setFileContent("");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, maxWidth: 500 }}>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        tabIndex={-1}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          accept=".xml,.opml,.json,.txt"
          onChange={handleFileChange}
          multiple={false}
        />
      </Button>

      {fileName && (
        <Typography variant="body2" color="text.secondary">
          Selected: {fileName}
        </Typography>
      )}

      <Button variant="contained" disabled={!fileName}>
        Add Feed
      </Button>

      {fileContent && (
        <Box
          mt={2}
          p={2}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: 13,
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {fileContent}
        </Box>
      )}
    </Box>
  );
}
