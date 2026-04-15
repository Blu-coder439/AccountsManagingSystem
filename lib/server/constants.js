export const VALID_PROCESS_STATUSES = new Set(['pending', 'in_progress', 'completed']);

export const VALID_TRANSACTION_TYPES = new Set(['Revenue', 'Expense', 'Receivable', 'Payable']);

export const VALID_TRANSACTION_STATUSES = new Set([
  'Cleared',
  'Processed',
  'Pending',
  'Scheduled',
  'Overdue',
  'Due Soon',
  'Open',
  'Urgent',
  'Upcoming',
]);
