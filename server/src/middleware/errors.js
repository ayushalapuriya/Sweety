export function notFound(req, res) {
  res.status(404).json({ message: 'Endpoint not found.' });
}

export function errorHandler(error, req, res, next) {
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Please send valid form data.' });
  if (error.code === '23505') return res.status(409).json({ message: 'You already have a reading for this slot on this date.' });
  if (['ECONNREFUSED', '57P01', '08000', '08003', '08006'].includes(error.code)) {
    return res.status(503).json({ message: 'Database is unavailable. Start PostgreSQL and try again.' });
  }
  console.error(error);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
}
