import { BlueDataCard } from '@/components/BlueDataCard';
import { getUserId } from '@/utils/auth';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const API_URL = "http://10.0.2.2:3000";


const Important = () => {
      type Entry = {
        _id: string;
        title: string;
        dozent?: string;
        raum?: string;
        datum: string;
        zeitVon?: string;
        zeitBis?: string;
        notizen?: string;
        wichtig: boolean;
        wiederholung?: 'nie' | 'wöchentlich' | '2-wöchentlich';
    };

    const [entries, setEntries] = useState<Entry[]>([]);

    const unmarkWichtig = (id: string, title: string) => {
        Alert.alert('Achtung!', `"${title}" wirklich aus wichtigen Terminen entfernen?`, [
            { text: 'Abbrechen', style: 'cancel' },
            {
                text: 'Entfernen', style: 'destructive', onPress: () => {
                    fetch(`${API_URL}/entries/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ wichtig: false }),
                    })
                        .then(() => setEntries(prev => prev.filter(e => e._id !== id)))
                        .catch(console.error);
                }
            },
        ]);
    };

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                const userId = await getUserId();
                const res = await fetch(`${API_URL}/entries?userId=${userId}`);
                const data = await res.json();
                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0);
                setEntries(data.filter((e: Entry) => e.wichtig && new Date(e.datum) >= todayStart));
            };
            load();
        }, [])
    );

    return (
         <ScrollView style={styles.container}>
            <View style={{ paddingTop: 65 }}>
                    <Image
                        source={require("../../assets/images/HAW_Logo.jpg")} 
                        style= {styles.hawLogo}
                        resizeMode='contain'
                    />
                    <Text style={styles.title}>Wichtige Termine</Text>


                    {entries.length === 0 ? (
                <Text style={{ marginTop: 16 }}>Keine wichtigen Termine 🎉</Text>
            ) : (
                entries.map((ev) => (
                    <BlueDataCard
                        key={ev._id}
                        title={ev.title}
                        subtitle={[
                            `Dozent: ${ev.dozent ?? '-'}`,
                            `Raum: ${ev.raum ?? '-'}`,
                            `Zeit: ${ev.zeitVon ?? '??'} - ${ev.zeitBis ?? '??'} Uhr`,
                            ...(ev.wiederholung && ev.wiederholung !== 'nie' ? [`${ev.wiederholung}`] : []),
                        ]}
                    >
                        <Text style={{ color: '#002E99' }}>Notizen:</Text>
                        <Text style={{ color: '#002E99' }}>{ev.notizen?.trim() ? ev.notizen : '-'}</Text>
                        <TouchableOpacity style={styles.unmarkBtn} onPress={() => unmarkWichtig(ev._id, ev.title)}>
                            <Text style={styles.unmarkBtnText}>Aus "Wichtige Termine" entfernen</Text>
                        </TouchableOpacity>
                    </BlueDataCard>
                ))
            )}
            </View>
                </ScrollView>

    )
}

export default Important

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'white'
    },
     hawLogo: {
        width:120,
        height:50,
        alignSelf:'flex-end'

    },
    title: {
        fontSize: 20,
        fontWeight: "500",
        marginTop: 20,
        textAlign: 'left',
        color: '#3a38ac'
    },
    unmarkBtn: {
        backgroundColor: '#002E99',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    unmarkBtnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
})