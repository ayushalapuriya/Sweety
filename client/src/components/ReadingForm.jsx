import { useState } from 'react';
import { CalendarDays, Save } from 'lucide-react';
import { api, request } from '../api';
import { SLOT_LABELS, SLOT_ORDER, today } from '../utils';
import { useNotify } from '../context/NotificationContext';

export default function ReadingForm({ date, reading, onSaved, onCancel }) {
  const [form, setForm] = useState({ date: reading?.date || date, timeSlot: reading?.timeSlot || 'morning', glucoseValue: reading?.glucoseValue ?? '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const notify = useNotify();
  function validateField(field, value = form[field]) {
    if (field === 'date' && (!value || value > today())) return value ? 'Date cannot be in the future.' : 'Please select a date.';
    if (field === 'timeSlot' && !value) return 'Please select a time slot.';
    if (field === 'glucoseValue' && value === '') return 'Please enter a glucose value.';
    if (field === 'glucoseValue' && (!Number.isInteger(Number(value)) || Number(value) < 40 || Number(value) > 600)) return 'Value must be between 40 and 600 mg/dl.';
    return '';
  }
  function updateField(field, value) { setForm((current) => ({ ...current, [field]: value })); setFieldErrors((current) => ({ ...current, [field]: validateField(field, value) })); setError(''); }
  async function submit(e) {
    e.preventDefault(); setError('');
    const nextErrors = {}; ['date', 'timeSlot', 'glucoseValue'].forEach((field) => { const message = validateField(field); if (message) nextErrors[field] = message; }); setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return setError('Please fix the highlighted fields.');
    setSaving(true);
    try { await request(reading ? api.put(`/readings/${reading.id}`, form) : api.post('/readings', form)); notify(reading ? 'Reading updated successfully.' : 'Reading saved successfully.', 'success'); onSaved(); }
    catch (err) { setError(err.message); notify(err.message, 'error'); } finally { setSaving(false); }
  }
  return <form onSubmit={submit} className="reading-form">
    {error && <div className="form-error">{error}</div>}
    <label>Date <span className="input-icon"><CalendarDays size={16} /><input className={fieldErrors.date ? 'field-invalid' : ''} type="date" max={today()} value={form.date} onBlur={() => setFieldErrors((current) => ({ ...current, date: validateField('date') }))} onChange={(e) => updateField('date', e.target.value)} aria-invalid={Boolean(fieldErrors.date)} /></span>{fieldErrors.date && <small className="field-error">{fieldErrors.date}</small>}</label>
    <label>Time slot <select className={fieldErrors.timeSlot ? 'field-invalid' : ''} value={form.timeSlot} onBlur={() => setFieldErrors((current) => ({ ...current, timeSlot: validateField('timeSlot') }))} onChange={(e) => updateField('timeSlot', e.target.value)} aria-invalid={Boolean(fieldErrors.timeSlot)}>{SLOT_ORDER.map((slot) => <option key={slot} value={slot}>{SLOT_LABELS[slot]}</option>)}</select>{fieldErrors.timeSlot && <small className="field-error">{fieldErrors.timeSlot}</small>}</label>
    <label>Glucose value <div className="unit-input"><input className={fieldErrors.glucoseValue ? 'field-invalid' : ''} autoFocus type="number" min="40" max="600" step="1" placeholder="e.g. 105" value={form.glucoseValue} onBlur={() => setFieldErrors((current) => ({ ...current, glucoseValue: validateField('glucoseValue') }))} onChange={(e) => updateField('glucoseValue', e.target.value)} aria-invalid={Boolean(fieldErrors.glucoseValue)} /><span>mg/dl</span></div>{fieldErrors.glucoseValue && <small className="field-error">{fieldErrors.glucoseValue}</small>}</label>
    <div className="form-actions"><button type="button" className="button secondary" onClick={onCancel}>Cancel</button><button className="button primary" disabled={saving}><Save size={17} />{saving ? 'Saving…' : 'Save reading'}</button></div>
  </form>;
}
