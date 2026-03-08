import { getUserId } from '@/utils/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr'];
const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8:00 - 17:00
const API_URL = "http://localhost:3000";

const getDayIndex = (dateStr: string) => {
    const day = new Date(dateStr).getDay(); // 0=So, 1=Mo...
    return day - 1; // Mo=0, Fr=4
};

const Stundenplan = () => {
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
         const load = async () => {                              // 👈 async machen
            const userId = await getUserId();                   // 👈
            fetch(`${API_URL}/entries?userId=${userId}`)   
                .then(r => r.json())
                .then(data => { setEntries(data); setLoading(false); })
                .catch(() => setLoading(false));
         };
         load();                                              // 👈 aufrufen
    }, []);

    const getEntriesForSlot = (dayIndex: number, hour: number) => {
        return entries.filter(e => {
            const d = getDayIndex(e.datum);
            const [h, m] = (e.zeitVon ?? '0:0').split(':').map(Number);
            const startHour = h + m / 60;
            return d === dayIndex && startHour >= hour && startHour < hour + 1;
        });
    };

  const getEntryHeight = (zeitVon: string, zeitBis: string) => {
    const [hStart, mStart] = zeitVon.split(':').map(Number);
    const [hEnd, mEnd] = zeitBis.split(':').map(Number);
    const durationHours = (hEnd + mEnd / 60) - (hStart + mStart / 60); // z.B. 2.0 Stunden
    return durationHours * 70; // 70 = Höhe einer Stunden-Zeile in styles.cell
};  

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} stickyHeaderIndices={[2]}>
                <Image
                    source={require("../../assets/images/HAW_Logo.jpg")}
                    style={styles.hawLogo}
                    resizeMode='contain'
                />
                <Text style={styles.title}>Stundenplan</Text>

                {loading ? <ActivityIndicator color="#002E99" /> : (
                    <ScrollView horizontal>
                        <View style={styles.grid}>
                            <View style={styles.stickyHeader}>
                            <View style={styles.timeCell} />
                            {DAYS.map(d => (
                                <View key={d} style={styles.dayHeader}>
                                    <Text style={styles.dayHeaderText}>{d}</Text>
                                </View>
                            ))}
                            </View>

                            {/* Time Rows */}
                            <ScrollView>
                                {HOURS.map(hour => (
                                 <View key={hour} style={styles.row}>
                                    <View style={styles.timeCell}>
                                        <Text style={styles.timeText}>{hour}:00</Text>
                                    </View>
                                    {DAYS.map((_, dayIndex) => {
                                        const slots = getEntriesForSlot(dayIndex, hour);
                                        return (
                                            <View key={dayIndex} style={styles.cell}>
                                                {slots.map((e, i) => (
                                                    <View key={i} style={styles.eventCard}>
                                                        <Text style={styles.eventTitle} numberOfLines={2}>{e.title}</Text>
                                                        {e.raum ? <Text style={styles.eventSub}>{e.raum}</Text> : null}
                                                        {e.zeitVon ? <Text style={styles.eventSub}>{e.zeitVon}{e.zeitBis ? ` - ${e.zeitBis}` : ''}</Text> : null}
                                                    </View>
                                                ))}
                                            </View>
                                        );
                                    })}
                                </View>
                            ))}
                            </ScrollView>
                        </View>
                    </ScrollView>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Stundenplan;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: 'white' },
    container: { padding: 20 },
    hawLogo: { width: 120, height: 50, alignSelf: 'flex-end' },
    title: { fontSize: 20, fontWeight: '500', color: '#3a38ac', marginTop: 20, marginBottom: 16 },
    grid: { flexDirection: 'column' },
    row: { flexDirection: 'row' },
    timeCell: {
        width: 50,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stickyHeader: {
    flexDirection: 'row',
    position: 'sticky' as any, // Web
    top: 0,
    backgroundColor: 'white',
    zIndex: 10,
},
    timeText: { color: '#6A8FAD', fontSize: 12 },
    dayHeader: {
        width: 90,
        height: 36,
        backgroundColor: '#9FBDDB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 2,
    },
    dayHeaderText: { color: '#002E99', fontWeight: '600' },
    cell: {
        width: 90,
        height: 70,
        marginHorizontal: 2,
        justifyContent: 'center',
    },
    eventCard: {
        backgroundColor: '#9FBDDB',
        borderRadius: 8,
        padding: 4,
        marginBottom: 2,
    },
    eventTitle: { color: '#002E99', fontSize: 11, fontWeight: '600' },
    eventSub: { color: '#002E99', fontSize: 10, opacity: 0.8 },
});