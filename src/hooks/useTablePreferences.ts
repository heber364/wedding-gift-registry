import { useState, useEffect, useRef } from 'react';
import { type FilterCondition } from "@/components/DataTableFilter";

export type SortField = 'name' | 'category' | 'price' | null;
export type SortDirection = 'asc' | 'desc';

export function useTablePreferences() {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  const [selectedGiftIds, setSelectedGiftIds] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  const [nameCondition, setNameCondition] = useState<FilterCondition>({ type: 'none', value: '' });
  const [categoryCondition, setCategoryCondition] = useState<FilterCondition>({ type: 'none', value: '' });
  const [statusCondition, setStatusCondition] = useState<FilterCondition>({ type: 'none', value: '' });
  const [priceCondition, setPriceCondition] = useState<FilterCondition>({ type: 'none', value: '' });

  const isInitialMount = useRef(true);

  // Load preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem('adminTablePreferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.sortField !== undefined) setSortField(parsed.sortField);
        if (parsed.sortDirection) setSortDirection(parsed.sortDirection);
        if (parsed.selectedGiftIds) setSelectedGiftIds(parsed.selectedGiftIds);
        if (parsed.selectedCategories) setSelectedCategories(parsed.selectedCategories);
        if (parsed.selectedStatuses) setSelectedStatuses(parsed.selectedStatuses);
        if (parsed.selectedPrices) setSelectedPrices(parsed.selectedPrices);
        if (parsed.nameCondition) setNameCondition(parsed.nameCondition);
        if (parsed.categoryCondition) setCategoryCondition(parsed.categoryCondition);
        if (parsed.statusCondition) setStatusCondition(parsed.statusCondition);
        if (parsed.priceCondition) setPriceCondition(parsed.priceCondition);
      } catch (e) {
        console.error('Failed to parse admin table preferences', e);
      }
    }
  }, []);

  // Save preferences on change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const preferences = {
      sortField,
      sortDirection,
      selectedGiftIds,
      selectedCategories,
      selectedStatuses,
      selectedPrices,
      nameCondition,
      categoryCondition,
      statusCondition,
      priceCondition,
    };
    localStorage.setItem('adminTablePreferences', JSON.stringify(preferences));
  }, [
    sortField, sortDirection, 
    selectedGiftIds, selectedCategories, selectedStatuses, selectedPrices,
    nameCondition, categoryCondition, statusCondition, priceCondition
  ]);

  const clearAllFilters = () => {
    setSelectedGiftIds([]);
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSelectedPrices([]);
    setNameCondition({ type: 'none', value: '' });
    setCategoryCondition({ type: 'none', value: '' });
    setStatusCondition({ type: 'none', value: '' });
    setPriceCondition({ type: 'none', value: '' });
  };

  const hasActiveFilters = 
    selectedGiftIds.length > 0 || 
    selectedCategories.length > 0 || 
    selectedStatuses.length > 0 || 
    selectedPrices.length > 0 ||
    nameCondition.type !== 'none' || 
    categoryCondition.type !== 'none' || 
    statusCondition.type !== 'none' || 
    priceCondition.type !== 'none';

  return {
    sortField, setSortField,
    sortDirection, setSortDirection,
    selectedGiftIds, setSelectedGiftIds,
    selectedCategories, setSelectedCategories,
    selectedStatuses, setSelectedStatuses,
    selectedPrices, setSelectedPrices,
    nameCondition, setNameCondition,
    categoryCondition, setCategoryCondition,
    statusCondition, setStatusCondition,
    priceCondition, setPriceCondition,
    clearAllFilters,
    hasActiveFilters
  };
}
