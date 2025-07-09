import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useThemeColors } from "../ThemeModeContext";

interface SearchBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
}

const SearchBar = ({ searchText, onSearchChange }: SearchBarProps) => {
  const colors = useThemeColors();

  return (
    <TextField
      placeholder="Search articles..."
      variant="outlined"
      fullWidth
      size="small"
      value={searchText}
      onChange={(e) => onSearchChange(e.target.value)}
      sx={{
        mb: 2,
        bgcolor: colors.background.selected,
        borderRadius: 2,
        input: {
          color: colors.text.primary,
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            border: "none",
          },
          "&:hover fieldset": {
            border: "none",
          },
          "&.Mui-focused fieldset": {
            border: "none",
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: colors.text.secondary }} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
