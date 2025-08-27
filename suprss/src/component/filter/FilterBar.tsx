import { Stack } from "@mui/material";
import FilterDropdown from "./FilterDropdown";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  return (
    <Stack id={"filters"} direction="row" spacing={1} flexWrap="wrap" paddingBottom={1} justifyContent="center" alignItems="center">
      <FilterDropdown
        label={t('filters.source')}
        options={sources}
        selected={selectedSources}
        onChange={setSelectedSources}
      />

      <FilterDropdown
        label={t('filters.category')}
        options={categories}
        selected={selectedCategories}
        onChange={setSelectedCategories}
      />

      <FilterDropdown
        label={t('filters.readStatus')}
        options={[t('filters.read'), t('filters.unread')]}
        selected={readState}
        onChange={setReadState}
        multiple={false}
      />

      <FilterDropdown
        label={t('filters.favorites')}
        options={[t('filters.onlyFavorites'), t('filters.all')]}
        selected={favorites}
        onChange={setFavorites}
        multiple={false}
      />

      <FilterDropdown
        label={t('filters.sort')}
        options={[t('filters.newest'), t('filters.oldest')]}
        selected={sort}
        onChange={setSort}
        multiple={false}
      />

    </Stack>
  );
};

export default FilterBar;