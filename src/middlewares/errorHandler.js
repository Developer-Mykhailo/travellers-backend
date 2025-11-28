import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    let errorMessage = 'An unknown error occurred';

    if (err && Array.isArray(err.errors) && err.errors.length > 0) {
      errorMessage = err.errors.map((error) => error.message).join(' && ');
    } else {
      errorMessage = err.message;
    }

    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: { message: errorMessage },
    });
    return;
  }

  const { status = 500 } = err;

  res.status(status).json({
    status,
    message: 'Something went wrong',
    data: err.message,
  });
};
