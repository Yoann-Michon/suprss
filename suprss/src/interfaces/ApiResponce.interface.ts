export interface ApiResponse<T = any> {
  message: string;
  data: T;
  success: boolean;
}