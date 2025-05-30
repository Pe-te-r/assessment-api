import { ApiResponse } from './type';

export function apiSuccessResponse<T>(
  message: string,
  data: T,
): ApiResponse<T> {
  return {
    status: 'success',
    message,
    data,
  };
}

export function apiErrorResponse<T>(message: string, data?: T): ApiResponse<T> {
  return {
    status: 'error',
    message,
    data: data ?? ({} as T),
  };
}
