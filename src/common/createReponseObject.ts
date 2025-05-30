import { ApiResponse } from './type';

export function apiSuccessResponse<T>(
  message: string,
  data?: T,
): ApiResponse<T> {
  const response: ApiResponse<T> = {
    status: 'success',
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return response;
}

export function apiErrorResponse<T>(message: string, data?: T): ApiResponse<T> {
  return {
    status: 'error',
    message,
    data: data ?? ({} as T),
  };
}
