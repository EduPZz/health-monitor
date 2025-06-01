import Feather from "@expo/vector-icons/Feather";
import { TextInput, TouchableOpacity, View, Text } from "react-native";
import registerStyle from "./registerStyle";
import { useState } from "react";
import { Link } from "@react-navigation/native";

const FirstForm = ({ onFillFirstForm }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = email && password && name;

  return (
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
        onPress={() => onFillFirstForm(name, email, password)}
      >
        <Text style={registerStyle.textButtom}>Cadastrar</Text>
      </TouchableOpacity>

      <Link to={{ screen: "Login" }} style={registerStyle.textEmphasis}>
        Já tem uma conta? Entrar
      </Link>
    </View>
  );
};

export default FirstForm;
