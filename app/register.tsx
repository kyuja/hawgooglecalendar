import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Register = () => {
    const [form, setForm] = useState({
        vorname: '',
        nachname: '',
        matrikelnummer: '',
        email: '',
        passwort: '',
        passwortWdh: '',
    });

    const handleRegister = async () => {
        if (form.passwort !== form.passwortWdh) {
            alert('Passwörter stimmen nicht überein!');
            return;
        }
        try {
        const res = await fetch('http://10.0.2.2:3000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) { Alert.alert('Fehler', data.error); return; }
        Alert.alert('Erfolg!', 'Account erstellt - jetzt einloggen!');
        router.push('/login');
    } catch (e: any) {
        Alert.alert('Netzwerkfehler', e?.message);
    }
};

    return (
       <View style={styles.container}>
        <Image
            source={require("../assets/images/HAW_Logo.jpg")}
            style={styles.hawLogo}
            resizeMode='contain'
        />

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Profil erstellen</Text>
            <TextInput style={styles.input} placeholder="Vorname" placeholderTextColor="#6A8FAD" value={form.vorname} onChangeText={(t) => setForm({ ...form, vorname: t })} />
            <TextInput style={styles.input} placeholder="Nachname" placeholderTextColor="#6A8FAD" value={form.nachname} onChangeText={(t) => setForm({ ...form, nachname: t })} />
            <TextInput style={styles.input} placeholder="Matrikelnummer" placeholderTextColor="#6A8FAD" keyboardType="numeric" value={form.matrikelnummer} onChangeText={(t) => setForm({ ...form, matrikelnummer: t })} />
            <TextInput style={styles.input} placeholder="HAW E-Mail" placeholderTextColor="#6A8FAD" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} />
            <TextInput style={styles.input} placeholder="Passwort" placeholderTextColor="#6A8FAD" secureTextEntry value={form.passwort} onChangeText={(t) => setForm({ ...form, passwort: t })} />
            <TextInput style={[styles.input, { marginBottom: 0 }]} placeholder="Wiederholung Passwort" placeholderTextColor="#6A8FAD" secureTextEntry value={form.passwortWdh} onChangeText={(t) => setForm({ ...form, passwortWdh: t })} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrieren</Text>
        </TouchableOpacity>
    </View>
    );
};

export default Register;

const styles = StyleSheet.create({
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