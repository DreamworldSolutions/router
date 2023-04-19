const DEF_ARRAY_FORMAT = "comma";
const DEF_ARRAY_FORMAT_SEPARATOR = ",";

var arrayFormat;
var arrayFormatSeparator;

/**
 * It's used to set default global array format config
 * @param {String} format 
 * @param {String} separator 
 */
export const setDefaultArrayFormat = (format, separator) => {
  arrayFormat = format;
  arrayFormatSeparator = separator;
};

/**
 * It returns current default array format config
 */
export const defaultArrayFormatConfig = () => {
  return {
    arrayFormat: arrayFormat || DEF_ARRAY_FORMAT,
    arrayFormatSeparator: arrayFormatSeparator || DEF_ARRAY_FORMAT_SEPARATOR
  }
};