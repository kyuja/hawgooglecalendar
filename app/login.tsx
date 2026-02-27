import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
    const API_URL = "http://localhost:3000";
    const [email, setEmail] = useState('');
    const [passwort, setPasswort] = useState('');

    const handleLogin = async () => {
        if (!email || !passwort) {
            Alert.alert('Fehler', 'Bitte alle Felder ausfüllen!');
            return;
        }
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, passwort }),
            });
            const data = await res.json();
            if (!res.ok) { Alert.alert('Fehler', data.error); return; }
            // Token speichern
            Alert.alert('Willkommen!', `Hallo ${data.user.vorname}!`);
            await SecureStore.setItemAsync('token', data.token);
            await SecureStore.setItemAsync('userId', data.user._id);

            router.push('/home');
        } catch (e: any) {
            Alert.alert('Netzwerkfehler', e?.message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
       <View style={styles.container}>
        <Image
            source={require("../assets/images/HAW_Logo.jpg")}
            style={styles.hawLogo}
            resizeMode='contain'
        />

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Login</Text>
             <TextInput
                        style={styles.input}
                        placeholder="HAW E-Mail"
                        placeholderTextColor="#6A8FAD"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
            <TextInput
                        style={[styles.input, { marginBottom: 0 }]}
                        placeholder="Passwort"
                        placeholderTextColor="#6A8FAD"
                        secureTextEntry
                        value={passwort}
                        onChangeText={setPasswort}
                    />
        </View> 

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Einloggen</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.registerLink}>Noch kein Account? Registrieren</Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: 'white' },
     registerLink: {
        color: '#6A8FAD',
        textAlign: 'center',
        marginTop: 16,
    },
    container: {
        padding: 20,
        backgroundColor: 'white',
        flex: 1,
    },
    hawLogo: {
        width: 120,
        height: 50,
        alignSelf: 'flex-end',
    },
    button: {
        backgroundColor: '#9FBDDB',
        borderRadius: 20,
        padding: 14,
        alignItems: 'center',
        marginTop: 24,
        width: '60%',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#002E99',
        fontSize: 16,
        fontWeight: '600',
    },
    card: {
    backgroundColor: '#9FBDDB',
    borderRadius: 15,
    padding: 16,
    marginTop: 20,
},
cardTitle: {
    color: '#002E99',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
},
input: {
    backgroundColor: '#C5D7EA',  // ← heller als card damit Felder sichtbar sind
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 16,
    color: '#002E99',
    marginBottom: 10,
    textAlign: 'center',
}
});