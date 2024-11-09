import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import registerStyle from "./registerStyle";
import { useState, useEffect, useContext } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Context } from "../../context/authContext";
import { Link } from "@react-navigation/native";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signupUser } = useContext(Context);

  const isFormValid = email && password && name && timezone;

  useEffect(() => {
    const detectedTimezone =
      Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone ?? "UTC";
    setTimezone(detectedTimezone);
  }, []);

  const signup = async () => {
    try {
      await signupUser({email, password, name, timezone});
      navigation.reset({
        index: 0,
        routes: [{ name: "TabRoutes" }],
      });
    } catch (error) {
      console.log(error);
      ToastAndroid.show(`Não foi possível cadastrar o usuário! \n ${error.message}`, ToastAndroid.SHORT);
    }
  };

  return (
    <KeyboardAvoidingView
      style={registerStyle.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -10}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={registerStyle.topSection}>
          <Image
            style={{ width: 100, height: 100, margin: 50 }}
            source={require("../../../assets/health-icon.png")}
          />
        </View>

        <View style={registerStyle.containerAction}>
          <View style={{ width: "100%" }}>
            <Text style={registerStyle.registerTitle}>Cadastro</Text>

            <Text style={registerStyle.inputTitle}>Nome</Text>
            <View style={registerStyle.blocoInput}>
              <TextInput
                style={registerStyle.input}
                placeholder="Seu nome completo"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#555"
              />
            </View>

            <Text style={registerStyle.inputTitle}>E-mail</Text>
            <View style={registerStyle.blocoInput}>
              <TextInput
                style={registerStyle.input}
                placeholder="Seu melhor e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#555"
              />
            </View>

            <Text style={registerStyle.inputTitle}>Senha</Text>
            <View
              style={[
                registerStyle.blocoInput,
                { flexDirection: "row", justifyContent: "space-between" },
              ]}
            >
              <TextInput
                style={[registerStyle.input, { flex: 1 }]}
                placeholder="Escolha uma senha"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#555"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>

          

          <TouchableOpacity
            style={[
              registerStyle.registerButtom,
              { opacity: isFormValid ? 1 : 0.5 },
            ]}
            disabled={!isFormValid}
            onPress={signup}
          >
            <Text style={registerStyle.textButtom}>Cadastrar</Text>
          </TouchableOpacity>

          <Link to={{screen: 'Login'}} style={registerStyle.textEmphasis}>
            Já tem uma conta? Entrar
          </Link >
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
