import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{ headerShown: false}}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Start', headerTitleAlign: 'center',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} > </Ionicons>
                    ), 
                }} ></Tabs.Screen>
            <Tabs.Screen name='calendar' options={{
                title: 'Kalender', headerTitleAlign: 'center',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="calendar" color={color} size={size} > </Ionicons>
                ),
            }}></Tabs.Screen>

            <Tabs.Screen name='addEvent' options={{
                title: 'Erstellen', headerTitleAlign: 'center',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="add-circle" color={color} size={size} > </Ionicons>
                ),
            }}></Tabs.Screen> 

            <Tabs.Screen name='important' options={{
                title: 'Wichtig', headerTitleAlign: 'center',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="warning" color={color} size={size}> </Ionicons>
                ),
            }}></Tabs.Screen>
                        <Tabs.Screen name='profile' options={{
                title: 'Profil', headerTitleAlign: 'center',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" color={color} size={size}> </Ionicons>
                ),
            }}></Tabs.Screen>

        </Tabs>
    )
}

export default TabsLayout

const styles = StyleSheet.create({})