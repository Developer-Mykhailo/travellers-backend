import { SORT_ORDER_LIST } from '../constants/validation.js';

export const parseSortParams = (
  { sortBy, sortOrder },
  sortFields,
  dafaultSort,
) => {
  const parsedSortBy = sortFields.includes(sortBy) ? sortBy : dafaultSort;
  const parsedSortOrder = SORT_ORDER_LIST.includes(sortOrder)
    ? sortOrder
    : SORT_ORDER_LIST[1];

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
