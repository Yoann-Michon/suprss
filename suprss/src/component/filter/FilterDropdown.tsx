import {
    Button,
    Menu,
    MenuItem,
    ListItemText,
    Checkbox,
} from "@mui/material";
import { useState } from "react";
import { ExpandMore } from "@mui/icons-material";
import { useThemeColors } from "../ThemeModeContext";

interface FilterDropdownProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    multiple?: boolean;
}

const FilterDropdown = ({
    label,
    options,
    selected,
    onChange,
    multiple = true,
}: FilterDropdownProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const colors = useThemeColors();

    const handleToggleMultiple = (option: string) => {
        onChange(
            selected.includes(option)
                ? selected.filter((s) => s !== option)
                : [...selected, option]
        );
    };

    const handleToggleSingle = (option: string) => {
        onChange([option]);
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                id={`filter_${label.toLowerCase()}`}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                endIcon={<ExpandMore />}
                sx={{
                    textTransform: "none",
                    borderRadius: 50,
                    bgcolor: colors.background.selected,
                    color: colors.text.primary,
                    fontSize: 14,
                    fontWeight: 400,
                    height: 30,
                    minWidth: 100,
                    px: 1,
                    textAlign: "center",
                    "&:hover": {
                        bgcolor: colors.background.hover,
                    },
                }}
            >
                {label}
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                PaperProps={{
                    sx: {
                        bgcolor: colors.background.paper,
                        color: colors.text.primary,
                        borderRadius: 2,
                        mt: 1,
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option}
                        onClick={() =>
                            multiple
                                ? handleToggleMultiple(option)
                                : handleToggleSingle(option)
                        }
                        dense
                    >
                        {multiple && (
                            <Checkbox
                                checked={selected.includes(option)}
                                size="small"
                                sx={{
                                    color: colors.text.secondary,
                                    "&.Mui-checked": {
                                        color: colors.text.primary,
                                    },
                                    '& .MuiSvgIcon-root': { fontSize: 15 }
                                }}
                            />
                        )}
                        <ListItemText primary={option} />
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default FilterDropdown;