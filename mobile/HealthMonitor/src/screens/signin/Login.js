import { View, Text, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import loginStyle from "./loginStyle";
import { useState } from "react";
import Feather from '@expo/vector-icons/Feather';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    return (
        <KeyboardAvoidingView
            style={loginStyle.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={loginStyle.topSection}>
                    <Image style={{ width: 100, height: 100, margin: 50 }} source={require("../../../assets/health-icon.png")} />
                </View>

                <View style={loginStyle.containerAction}>
                    <View style={{ width: '100%' }}>
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

                    <View style={{ width: '100%' }}>
                        <Text style={loginStyle.inputTitle}>Senha</Text>
                    </View>

                    <View style={[loginStyle.blocoInput, { flexDirection: 'row', justifyContent: "space-between" }]}>
                        <TextInput
                            style={loginStyle.input}
                            placeholder="Sua senha mais segura"
                            value={senha}
                            onChangeText={setSenha}
                            placeholderTextColor="#555"
                            secureTextEntry={true}
                        />
                        <Feather name="eye" size={24} color="black" />
                    </View>

                    <View style={{ width: '100%', flexDirection: 'row-reverse' }}>
                        <Text style={loginStyle.textEmphasis}>Esqueceu a senha?</Text>
                    </View>

                    <TouchableOpacity style={loginStyle.loginButtom}>
                        <Text style={loginStyle.textButtom}>Login</Text>
                    </TouchableOpacity>

                    <Text style={loginStyle.textEmphasis}>Não tem uma conta? Cadastre-se</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;
