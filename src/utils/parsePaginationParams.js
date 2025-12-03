const parseNumber = (number, defaultValue, maxValue = null) => {
  const isString = typeof number === 'string';
  if (!isString) return defaultValue;

  const num = parseInt(number);

  if (Number.isNaN(num)) return defaultValue;
  if (num <= 0) return defaultValue;
  if (maxValue !== null && num > maxValue) return maxValue;

  return num;
};

export const parsePaginationParams = (query) => {
  const page = parseNumber(query.page, 1);
  const perPage = parseNumber(query.perPage, 10, 100);

  return { page, perPage };
};
