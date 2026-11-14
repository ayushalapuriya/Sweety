import { TIME_SLOTS } from '../constants.js';
import { isFutureDate } from '../utils/date.js';

export function validateReading(input) {
  const errors = [];
  const value = input.glucoseValue;
  if (value === undefined || value === null || value === '') {
    errors.push('Please enter a glucose value.');
  } else if (!Number.isInteger(Number(value)) || Number(value) < 40 || Number(value) > 600) {
    errors.push('Value must be between 40 and 600 mg/dl.');
  }
  if (!input.date || isFutureDate(input.date)) errors.push('Date cannot be in the future.');
  if (!TIME_SLOTS[input.timeSlot]) errors.push('Please select a valid time slot.');
  return errors;
}
