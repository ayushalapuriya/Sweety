import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ReadingForm from './ReadingForm';
import { NotificationProvider } from '../context/NotificationContext';

describe('ReadingForm', () => {
  it('shows a required-value message before submitting', () => {
    render(<NotificationProvider><ReadingForm date="2026-11-14" onCancel={() => {}} onSaved={() => {}} /></NotificationProvider>);
    fireEvent.click(screen.getByRole('button', { name: /save reading/i }));
    expect(screen.getByText('Please enter a glucose value.')).toBeInTheDocument();
  });
});
