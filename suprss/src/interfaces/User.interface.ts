export interface IUser {
  id?: string;
  email: string;
  password?: string;
  role?: "USER" | "ADMIN";
  username: string;
  avatarUrl?: string;
  settings?: ISettings;
}

export interface ISettings{
   language: string; 
   darkMode: "light" | "dark";
}

export interface UserContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (username: string, email: string, password: string) => Promise<void>;
  refreshUser: () => Promise<IUser | null>;
  logout: () => Promise<void>;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
}
