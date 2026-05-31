export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  const statusCode =
    res.statusCode !== 200
      ? res.statusCode
      : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack:
      process.env.NODE_ENV === "production"
        ? null
        : err.stack,
  });
};