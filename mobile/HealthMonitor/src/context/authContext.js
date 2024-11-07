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
  return async ({ password, email, name, timezone }) => {
    const { data: { tokenInformation } } = await api.post("auth/signup", {
      password,
      email,
      name,
      timezone,
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

loadAuthToken();

export const { Context, Provider } = createContext(
  reducer,
  { loginUser, isLogged, signupUser },
  initialState
);
