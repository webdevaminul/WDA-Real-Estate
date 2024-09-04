export const errorHandler = (code, message) => {
  const error = new Error();
  error.statusCode = code;
  error.message = message;
  error.success = false;
  return error;
};

export const updateErrorHandler = (code, message) => {
  const error = new Error();
  error.statusCode = code;
  error.message = message;
  return error;
};
