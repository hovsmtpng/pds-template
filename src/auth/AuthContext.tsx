import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiCall } from "@/api/apiService";

const urlLobby = import.meta.env.VITE_URL_PORTAL_PUNINAR_APP_MAIN;

/* =======================
   Types
======================= */

interface UserData {
  nik: string;
  username: string;
  full_name: string;
  email: string;
  division: string;
  department: string;
  position: string;
  session_token?: string;
  [key: string]: any;
}

interface UserModule {
  role: string;
  [key: string]: any;
}

interface AuthContextValue {
  auth: UserData | null;
  modules: UserModule | null;
  userRole: any;
  login: (userData: UserData, userModule: UserModule) => Promise<void>;
  logout: () => void;
  lobby: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

/* =======================
   Context
======================= */

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* =======================
   Provider
======================= */

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<UserData | null>(null);
  const [modules, setModules] = useState<UserModule | null>(null);
  const [userRole, setUserRole] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem("user_module");
    const savedModules = localStorage.getItem("modules");
    const savedUserRole = localStorage.getItem("user_role");

    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
      if (savedModules) {
        setModules(JSON.parse(savedModules));
      }
    }

    if (savedUserRole) {
      setUserRole(JSON.parse(savedUserRole));
    }

    setLoading(false);
  }, []);

  const postMapUserAccess = async (
    userData: UserData,
    userModule: UserModule
  ) => {
    const res = await apiCall("/api/mst/post-map-users-access", "POST", {
      npk: userData.nik,
      username: userData.username,
      fullname: userData.full_name,
      email: userData.email,
      role: userModule.role,
      division: userData.division,
      department: userData.department,
      position: userData.position,
    });
    return res;
  };

  const getUserRole = async (userData: UserData) => {
    const res = await apiCall("/api/mst/get-user-role", "POST", {
      npk: userData.nik,
    });
    return res;
  };

  const login = async (userData: UserData, userModule: UserModule) => {
    localStorage.setItem("user_module", JSON.stringify(userData));
    localStorage.setItem("modules", JSON.stringify(userModule));

    await postMapUserAccess(userData, userModule);

    await getUserRole(userData).then((res: any) => {
      localStorage.setItem("user_role", JSON.stringify(res.data));
      setUserRole(res.data);
    });

    setAuth(userData);
    setModules(userModule);
  };

  const logout = () => {
    localStorage.removeItem("user_module");
    localStorage.removeItem("modules");
    localStorage.removeItem("user_role");

    setAuth(null);
    setModules(null);
    setUserRole(null);
  };

  const lobby = () => {
    logout();
    localStorage.removeItem("selected-role");
    window.location.href = urlLobby;
  };

  return (
    <AuthContext.Provider value={{ auth, modules, userRole, login, logout, lobby }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };