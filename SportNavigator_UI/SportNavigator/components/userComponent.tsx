import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await SecureStore.getItemAsync("user");
        if (userData) setUser(JSON.parse(userData));
      } catch {}
    };
    fetchUser();
  }, []);

  return user;
}
