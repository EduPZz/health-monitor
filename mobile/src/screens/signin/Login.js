import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ToastAndroid,
} from "react-native";
import loginStyle from "./loginStyle";
import { useContext, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Context } from "../../context/authContext";
import { Link } from "@react-navigation/native";

const Login = ({ navigation }) => {
  const { loginUser } = useContext(Context);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const login = async () => {
    try {
      await loginUser(email, senha);
      navigation.reset({
        index: 0,
        routes: [{ name: "TabRoutes" }],
      });
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Não foi possível fazer o login!", ToastAndroid.SHORT);
    }
  };

  return (
    <KeyboardAvoidingView
      style={loginStyle.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -10}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={loginStyle.topSection}>
          <Image
            style={{ width: 100, height: 100, margin: 50 }}
            source={require("../../../assets/health-icon.png")}
          />
        </View>

        <View style={loginStyle.containerAction}>
          <View style={{ width: "100%" }}>
            <Text style={loginStyle.loginTitle}>Log-in</Text>
            <Text style={loginStyle.inputTitle}>E-mail</Text>
          </View>

          <View style={loginStyle.blocoInput}>
            <TextInput
              style={loginStyle.input}
              placeholder="Seu melhor e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#555"
            />
          </View>

          <View style={{ width: "100%" }}>
            <Text style={loginStyle.inputTitle}>Senha</Text>
          </View>

          <View
            style={[
              loginStyle.blocoInput,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <TextInput
              style={loginStyle.input}
              placeholder="Sua senha mais segura"
              value={senha}
              onChangeText={setSenha}
              placeholderTextColor="#555"
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            >
              <Feather
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
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
              Não tem uma conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
