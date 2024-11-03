import { useState, useEffect } from 'react';

import { useNavigate  } from "react-router-dom";

import api from "../../services/api";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if(token){
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }

    if (user){
      setUser(JSON.parse(user));
      setUserProfile(JSON.parse(user).perfil);
    }

    setLoading(false);
  }, []);

  const getUser = async () => {
    try {
      const { data } = await api.post("/auth/profile");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setUserProfile(data.perfil);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLogin(email, senha, successFunc, errorFunc){
    try {
      const { data } = await api.post("/auth/login", { email: email, password: senha });
      localStorage.setItem("token", JSON.stringify(data.access_token));
      api.defaults.headers.Authorization = `Bearer ${data.access_token}`;
      setAuthenticated(true);
      setUser(getUser());
      successFunc("Logado com sucesso!");
      navigate("/");
    } catch (error) {
      errorFunc(error.response.data.message);
    }
  }

  async function handleLogout(){
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.defaults.headers.Authorization = undefined;
    navigate("/login");
  }
  
  return { authenticated, user, userProfile, handleLogin, handleLogout, loading };
}