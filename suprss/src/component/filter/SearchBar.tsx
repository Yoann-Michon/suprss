import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useThemeColors } from "../ThemeModeContext";
import { useTranslation } from 'react-i18next';


interface SearchBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
}

const SearchBar = ({ searchText, onSearchChange }: SearchBarProps) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  return (
    <TextField
      id="search_bar"
      placeholder={t('filters.search')}
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
