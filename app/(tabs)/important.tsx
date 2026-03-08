import { BlueDataCard } from '@/components/BlueDataCard';
import { getUserId } from '@/utils/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';


const API_URL = "http://localhost:3000";


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
    };

    const [entries, setEntries] = useState<Entry[]>([]);

    useEffect(
        useCallback(() => {
            const load = async () => {
                const userId = await getUserId(); // 👈
                const res = await fetch(`${API_URL}/entries?userId=${userId}`);
                const data = await res.json();
                setEntries(data.filter((e: Entry) => e.wichtig)); // 👈 nur wichtige
            };
            load();
        }, [])
    );

    return (
         <ScrollView style={styles.container}>
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
                        ]}
                    >
                        <Text style={{ color: '#002E99' }}>Notizen:</Text>
                        <Text style={{ color: '#002E99' }}>{ev.notizen?.trim() ? ev.notizen : '-'}</Text>
                    </BlueDataCard>
                ))
            )}
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
    }
})