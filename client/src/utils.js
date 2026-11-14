export const SLOT_LABELS = {
  morning: 'Morning (fasting)',
  after_breakfast: 'After breakfast',
  after_lunch: 'After lunch',
  after_dinner: 'After dinner'
};
export const SLOT_ORDER = Object.keys(SLOT_LABELS);
export const today = () => new Date().toISOString().slice(0, 10);
export const formatDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
