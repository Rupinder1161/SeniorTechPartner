import axios from 'axios';

export function getUserMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return 'Something went wrong. Please try again.';
  if (!error.response) {
    return error.code === 'ECONNABORTED'
      ? 'The request timed out. Please try again.'
      : 'Unable to connect. Check your internet connection and try again.';
  }

  const messages: Record<number, string> = {
    401: 'Your session has expired. Please sign in again.',
    403: 'You do not have permission to do that.',
    404: 'We could not find what you were looking for.',
    408: 'The request took too long. Please try again.',
    422: 'Please check the information and try again.',
    500: 'Our service is having trouble. Please try again shortly.',
  };
  return messages[error.response.status] ?? 'We could not complete your request. Please try again.';
}