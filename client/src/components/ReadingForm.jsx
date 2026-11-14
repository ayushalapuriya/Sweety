import { useState } from 'react';
import { CalendarDays, Save } from 'lucide-react';
import { api, request } from '../api';
import { SLOT_LABELS, SLOT_ORDER, today } from '../utils';
import { useNotify } from '../context/NotificationContext';

export default function ReadingForm({ date, reading, onSaved, onCancel }) {
  const [form, setForm] = useState({ date: reading?.date || date, timeSlot: reading?.timeSlot || 'morning', glucoseValue: reading?.glucoseValue ?? '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const notify = useNotify();
  async function submit(e) {
    e.preventDefault(); setError('');
    if (!form.date) return setError('Please select a date.');
    if (!form.timeSlot) return setError('Please select a time slot.');
    if (form.glucoseValue === '') return setError('Please enter a glucose value.');
    if (!Number.isInteger(Number(form.glucoseValue)) || Number(form.glucoseValue) < 40 || Number(form.glucoseValue) > 600) return setError('Value must be between 40 and 600 mg/dl.');
    if (form.date > today()) return setError('Date cannot be in the future.');
    setSaving(true);
    try { await request(reading ? api.put(`/readings/${reading.id}`, form) : api.post('/readings', form)); notify(reading ? 'Reading updated successfully.' : 'Reading saved successfully.', 'success'); onSaved(); }
    catch (err) { setError(err.message); notify(err.message, 'error'); } finally { setSaving(false); }
  }
  return <form onSubmit={submit} className="reading-form">
    {error && <div className="form-error">{error}</div>}
    <label>Date <span className="input-icon"><CalendarDays size={16} /><input type="date" max={today()} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></span></label>
    <label>Time slot <select value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}>{SLOT_ORDER.map((slot) => <option key={slot} value={slot}>{SLOT_LABELS[slot]}</option>)}</select></label>
    <label>Glucose value <div className="unit-input"><input autoFocus type="number" min="40" max="600" step="1" placeholder="e.g. 105" value={form.glucoseValue} onChange={(e) => setForm({ ...form, glucoseValue: e.target.value })} /><span>mg/dl</span></div></label>
    <div className="form-actions"><button type="button" className="button secondary" onClick={onCancel}>Cancel</button><button className="button primary" disabled={saving}><Save size={17} />{saving ? 'Saving…' : 'Save reading'}</button></div>
  </form>;
}
