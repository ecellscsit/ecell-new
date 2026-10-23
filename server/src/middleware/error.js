export const notFound = (req, res) => res.status(404).json({ message: `Not found: ${req.originalUrl}` });

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(status).json({ message: err.message || 'Server error' });
};

// wrap async controllers so errors reach errorHandler
export const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
