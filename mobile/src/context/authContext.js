import createContext from "./createContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/index";

const initialState = { isAuthenticated: false };

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
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
      // Ignore error
    }
  };
};

const loginUser = (dispatch) => {
  return async (email, password) => {
    const { data } = await api.post("auth/login", {
      email,
      password,
    });

    await AsyncStorage.setItem("accessToken", data.access_token);
    await loadAuthToken();
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
  };
};

const signupUser = (dispatch) => {
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
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
  };
};

const loadAuthToken = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

const user = (onErrorToFetchUser) => {
  return async () => {
    try {
      const { data } = await api.get("auth/profile");
      return data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await AsyncStorage.removeItem("accessToken");
        onErrorToFetchUser();
      }
      onErrorToFetchUser(error);
    }
  };
};

const logout = (afterLogoutAction) => {
  return async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      afterLogoutAction();
    } catch (error) {
      console.error("Failed to Loggout", error);
    }
  };
};
loadAuthToken();

export const { Context, Provider } = createContext(
  reducer,
  { loginUser, isLogged, signupUser, user, logout },
  initialState
);
