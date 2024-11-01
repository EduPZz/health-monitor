import { View, Text, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import registerStyle from "./registerStyle";
import { useState } from "react";
import Feather from '@expo/vector-icons/Feather';

const Register = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');

    return (
        <KeyboardAvoidingView
            style={cadastroStyle.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={registerStyle.topSection}>
                    <Image style={{ width: 100, height: 100, margin: 50 }} source={require("../../../assets/health-icon.png")} />
                </View>

                <View style={registerStyle.containerAction}>
                    <View style={{ width: '100%' }}>
                        <Text style={registerStyle.registerTitle}>Cadastro</Text>
                        <Text style={registerStyle.inputTitle}>E-mail</Text>
                    </View>

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

                    <View style={{ width: '100%' }}>
                        <Text style={registerStyle.inputTitle}>Senha</Text>
                    </View>

                    <View style={[registerStyle.blocoInput, { flexDirection: 'row', justifyContent: "space-between" }]}>
                        <TextInput
                            style={registerStyle.input}
                            placeholder="Escolha uma senha"
                            value={senha}
                            onChangeText={setSenha}
                            placeholderTextColor="#555"
                            secureTextEntry={true}
                        />
                        <Feather name="eye" size={24} color="black" />
                    </View>

                    <View style={{ width: '100%' }}>
                        <Text style={registerStyle.inputTitle}>Confirmar Senha</Text>
                    </View>

                    <View style={[registerStyle.blocoInput, { flexDirection: 'row', justifyContent: "space-between" }]}>
                        <TextInput
                            style={registerStyle.input}
                            placeholder="Confirme sua senha"
                            value={confirmaSenha}
                            onChangeText={setConfirmaSenha}
                            placeholderTextColor="#555"
                            secureTextEntry={true}
                        />
                        <Feather name="eye" size={24} color="black" />
                    </View>

                    <TouchableOpacity style={registerStyle.registerButtom}>
                        <Text style={registerStyle.textButtom}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Register;
