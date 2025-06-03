import {
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ToastAndroid,
} from "react-native";
import registerStyle from "./registerStyle";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/authContext";
import FirstFrom from "./FirstForm";
import SecondForm from "./SecondForm";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [step, setStep] = useState(1);

  const { signupUser } = useContext(Context);

  useEffect(() => {
    const detectedTimezone =
      Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone ?? "UTC";
    setTimezone(detectedTimezone);
  }, []);

  const onFillFirstForm = (name, email, password) => {
    setName(name);
    setEmail(email);
    setPassword(password);
    setStep(2);
  };

  const signup = async ({
    email,
    password,
    name,
    timezone,
    sex,
    birthDate,
  }) => {
    try {
      const convertedBirthDate = birthDate.toISOString();
      await signupUser({
        email,
        password,
        name,
        timezone,
        sex,
        birthDate: convertedBirthDate,
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "TabRoutes" }],
      });
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        `Não foi possível cadastrar o usuário! \n ${error.message}`,
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={registerStyle.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -10}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={registerStyle.topSection}>
          <Image
            style={{ width: 100, height: 100, margin: 50 }}
            source={require("../../../assets/health-icon.png")}
          />
        </View>
      </ScrollView>
      {step === 1 && (
        <FirstFrom onFillFirstForm={onFillFirstForm} navigation={navigation} />
      )}
      {step === 2 && (
        <SecondForm
          onSignup={signup}
          userData={{ email, password, name, timezone }}
          navigation={navigation}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default Register;
