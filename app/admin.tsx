import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AdminDashboard = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Admin Dashboard</Text>
                <Text style={styles.subtitle}>Hier kommt die Admin-Verwaltung hin.</Text>

                <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
                    <Text style={styles.buttonText}>Ausloggen</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default AdminDashboard;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: 'white' },
    container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    title: { color: '#002E99', fontSize: 24, fontWeight: '700', marginBottom: 12 },
    subtitle: { color: '#6A8FAD', fontSize: 16, textAlign: 'center', marginBottom: 40 },
    button: {
        backgroundColor: '#9FBDDB',
        borderRadius: 20,
        padding: 14,
        width: '60%',
        alignItems: 'center',
    },
    buttonText: { color: '#002E99', fontSize: 16, fontWeight: '600' },
});
