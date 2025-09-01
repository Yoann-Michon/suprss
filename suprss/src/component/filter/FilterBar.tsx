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
  sort,
  setSort,
}: FilterBarProps) => {
  const { t } = useTranslation();
  return (
    <Stack id={"filters"} direction="row" spacing={1} flexWrap="wrap" paddingBottom={1} justifyContent="center" alignItems="center">
      <FilterDropdown
        label={t('features.filters.source')}
        options={sources}
        selected={selectedSources}
        onChange={setSelectedSources}
      />

      <FilterDropdown
        label={t('features.filters.category')}
        options={categories}
        selected={selectedCategories}
        onChange={setSelectedCategories}
      />

      <FilterDropdown
        label={t('features.filters.readStatus')}
        options={[t('features.filters.read'), t('features.filters.unread')]}
        selected={readState}
        onChange={setReadState}
        multiple={false}
      />

      <FilterDropdown
        label={t('features.filters.sort')}
        options={[t('features.filters.newest'), t('features.filters.oldest')]}
        selected={sort}
        onChange={setSort}
        multiple={false}
      />

    </Stack>
  );
};

export default FilterBar;