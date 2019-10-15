export const checkEmpty = (value) => {
  if ((
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  )) {
    return '';
  }

  return value;
};
