import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
 const context = useContext(AuthContext);
 if (!context) {
   throw new Error("useAuth must be used within an AuthProvider");
 }
  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
