export const fileValidator = (files, config) => {
  const { allowedFileFormats, fileSizeLimit, filesLimit } = config;
  const { length } = files;
  const { size, type } = files[0];
  let err = false;
  let result = {
    isValidFile: false,
    errVal: err
  };
  if (length === 0) {
    return result;
  } else if (length > filesLimit) {
    err =
      filesLimit > 1
        ? `Only ${filesLimit} files are allowed to upload`
        : `Only one file is allowed to upload`;
  } else if (!allowedFileFormats.includes(type)) {
    err = "File format must be either png or jpg";
  } else if (size / 1024 / 1024 > fileSizeLimit) {
    err = `File size exceeded the limit of ${fileSizeLimit}MB`;
  } else {
    result.isValidFile = true;
  }
  result.errVal = err;
  return result;
};

export const preventBrowserDefaults = e => {
  e.preventDefault();
  e.stopPropagation();
};
