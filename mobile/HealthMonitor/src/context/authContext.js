import createContext from "./createContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from '../api/index';

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
      console.log({ token });
      console.log(!!token);
      return !!token;
    } catch (e) {
      console.log(e);
    }
  };
};

const loginUser = (dispatch) => {
  return async (email, password) => {
    try {
      const data = await api.post("auth/login", {
        email: email,
        password: password,
      });

      await AsyncStorage.setItem("id", data.data.token);

      const id = await AsyncStorage.getItem("id");
      console.log(id);
    } catch (e) {
      console.log(e);
    }
  };
};

export const { Context, Provider } = createContext(
  reducer,
  { loginUser, isLogged },
  initialState
);
