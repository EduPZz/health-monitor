import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import loginStyle from "./loginStyle";
import { useContext, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Context } from "../../context/authContext";
import { Link } from "@react-navigation/native";
import { SvgIcon } from "../../icons/SvgIcons";
import Toast from "react-native-toast-message";

const Login = ({ navigation }) => {
  const { loginUser } = useContext(Context);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const login = async () => {
    try {
      await loginUser(email, senha);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: `${error?.message || "Erro ao fazer login"}`,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={loginStyle.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -10}
    >
      <StatusBar backgroundColor="#979797ff" barStyle="dark-content" />
      <View style={{ flex: 1 }}>
        <View style={loginStyle.topSection}>
          <Image
            style={{ width: 100, height: 100, margin: 50 }}
            source={require("../../../assets/health-icon.png")}
          />
        </View>

        <View style={loginStyle.containerAction}>
          <View style={{ width: "100%" }}>
            <Text style={loginStyle.welcomeTitle}>Bem-vindo de volta</Text>
            <Text style={loginStyle.subtitle}>Faça login para entrar</Text>
          </View>
          
          <View style={{ width: "100%" }}>
            <Text style={{ ...loginStyle.inputTitle, width: "100%" }}>
              E-mail
            </Text>
            <View style={loginStyle.inputWrapper}>
              <SvgIcon name="email" color="#1976D2" size={20} />
              <TextInput
                style={loginStyle.inputWithIcon}
                placeholder="seuemail@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#555"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={{ width: "100%" }}>
            <Text style={loginStyle.inputTitle}>Senha</Text>

            <View style={loginStyle.inputWrapper}>
              <TextInput
                style={[loginStyle.input, { flex: 1 }]}
                placeholder="Sua senha mais segura"
                value={senha}
                onChangeText={setSenha}
                placeholderTextColor="#555"
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                <SvgIcon
                  name={isPasswordVisible ? "eye-hide" : "eye"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              loginStyle.loginButtom,
              { opacity: email && senha ? 1 : 0.5 },
            ]}
            onPress={login}
            disabled={!email || !senha}
          >
            <Text style={loginStyle.textButtom}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={loginStyle.textEmphasis}>
              Não tem uma conta?{" "}
              <Text style={{ color: "#1976D2" }}>Cadastrar-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
