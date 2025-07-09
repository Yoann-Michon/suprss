import { Stack } from "@mui/material";
import FilterDropdown from "./FilterDropdown";

interface FilterBarProps {
  sources: string[];
  categories: string[];
  selectedSources: string[];
  setSelectedSources: (val: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (val: string[]) => void;
  readState: string[];
  setReadState: (val: string[]) => void;
  favorites: string[];
  setFavorites: (val: string[]) => void;
  sort: string[];
  setSort: (val: string[]) => void;
}

const FilterBar = ({
  sources,
  categories,
  selectedSources,
  setSelectedSources,
  selectedCategories,
  setSelectedCategories,
  readState,
  setReadState,
  favorites,
  setFavorites,
  sort,
  setSort,
}: FilterBarProps) => {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" paddingBottom={1} justifyContent="center" alignItems="center">
      <FilterDropdown
        label="Source"
        options={sources}
        selected={selectedSources}
        onChange={setSelectedSources}
      />
      <FilterDropdown
        label="Category"
        options={categories}
        selected={selectedCategories}
        onChange={setSelectedCategories}
      />
      <FilterDropdown
        label="Read/Unread"
        options={["Read", "Unread"]}
        selected={readState}
        onChange={setReadState}
        multiple={false}
      />
      <FilterDropdown
        label="Favorites"
        options={["Only Favorites", "All"]}
        selected={favorites}
        onChange={setFavorites}
        multiple={false}
      />
      <FilterDropdown
        label="Sort"
        options={["Newest", "Oldest"]}
        selected={sort}
        onChange={setSort}
        multiple={false}
      />
    </Stack>
  );
};

export default FilterBar;