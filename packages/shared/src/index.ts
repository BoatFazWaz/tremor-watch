// Example shared types that can be used across the application
export interface TremorData {
  timestamp: string;
  magnitude: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 