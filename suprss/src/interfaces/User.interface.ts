export interface IUser {
  id?: string;
  email: string;
  password?: string;
  role?: "USER" | "ADMIN";
  settings?: ISettings;
}

export interface ISettings{
   language: string; 
   darkMode: "light" | "dark";
}

export interface UserContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (username: string, email: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}