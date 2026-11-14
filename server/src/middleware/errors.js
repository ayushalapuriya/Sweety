export function notFound(req, res) {
  res.status(404).json({ message: 'Endpoint not found.' });
}

export function errorHandler(error, req, res, next) {
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Please send valid form data.' });
  if (error.code === '23505') return res.status(409).json({ message: 'You already have a reading for this slot on this date.' });
  if (['ECONNREFUSED', '57P01', '08000', '08003', '08006'].includes(error.code)
    || error.message?.includes('client password must be a string')
    || error.message?.includes('SASL')) {
    return res.status(503).json({ message: 'Database configuration is incomplete. Set DATABASE_URL in server/.env and restart the API.' });
  }
  if (error.code === 'CONFIG_MISSING') {
    return res.status(503).json({ message: 'Server configuration is incomplete. Add JWT_SECRET to server/.env and restart the API.' });
  }
  console.error(error);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
}
