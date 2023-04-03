var defaultFormat = "comma";
var defaultFormatSeparator = ",";

/**
 * It's used to set default global array format config
 * @param {String} format 
 * @param {String} separator 
 */
export const setDefaultArrayFormat = (format, separator) => {
  defaultFormat = format;
  defaultFormatSeparator = separator;
};

/**
 * It returns current default array format config
 */
export const defaultArrayFormatConfig = () => {
  return {
    arrayFormat: defaultFormat,
    arrayFormatSeparator: defaultFormatSeparator
  }
};