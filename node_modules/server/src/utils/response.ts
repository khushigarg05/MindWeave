export function successResponse(data: unknown) {
  return {
    success: true,
    data,
  };
}

export function errorResponse(message: string) {
  return {
    success: false,
    error: message,
  };
}