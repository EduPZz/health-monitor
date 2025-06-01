import createContext from "./createContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/index";

const initialState = {};

const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const isLogged = () => {
  return async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      return !!token;
    } catch (e) {
      console.log(e);
    }
  };
};

const loginUser = () => {
  return async (email, password) => {
    const { data } = await api.post("auth/login", {
      email,
      password,
    });

    await AsyncStorage.setItem("accessToken", data.access_token);
    await loadAuthToken();
  };
};

const signupUser = () => {
  return async ({ email, password, name, timezone, sex, birthDate }) => {
    const {
      data: { tokenInformation },
    } = await api.post("auth/signup", {
      email,
      password,
      name,
      timezone,
      sex,
      birthDate,
    });

    await AsyncStorage.setItem("accessToken", tokenInformation.access_token);
    await loadAuthToken();
  };
};

const loadAuthToken = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

const user = () => {
  return async () => {
    try {
      const { data } = await api.get("auth/profile");
      console.log({ data });
      return data;
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  };
};

const loggout = (afterLoggoutAction) => {
  return async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      afterLoggoutAction();
    } catch (error) {
      console.error("Failed to Loggout", error);
    }
  };
};

loadAuthToken();

export const { Context, Provider } = createContext(
  reducer,
  { loginUser, isLogged, signupUser, user, loggout },
  initialState
);
