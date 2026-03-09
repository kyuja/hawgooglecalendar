import { BlueDataCard } from '@/components/BlueDataCard';
import { getUserId } from '@/utils/auth';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Home = () => {

    const API_URL = "http://10.0.2.2:3000"; 
    
    type Entry = {
  _id: string;
  title: string;
  dozent?: string;
  raum?: string;
  datum: string;
  zeitVon?: string;
  zeitBis?: string;
  notizen?: string;
  wiederholung?: 'nie' | 'wöchentlich' | '2-wöchentlich';
};

const [entries, setEntries] = useState<Entry[]>([]);
const [loading, setLoading] = useState(true);

const load = useCallback(async () => {
  setLoading(true);
  try {
    const userId = await getUserId();
    const res = await fetch(`${API_URL}/entries?userId=${userId}`);
    if (!res.ok) throw new Error("Entries konnten nicht geladen werden");
    const data = await res.json();
    setEntries(data);
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
}, []);

useFocusEffect(useCallback(() => { load(); }, [load]));

const handleDelete = (id: string, title: string) => {
  Alert.alert('Achtung!', `Soll der Eintrag "${title}" wirklich gelöscht werden?`, [
    { text: 'Abbrechen', style: 'cancel' },
    {
      text: 'Löschen', style: 'destructive', onPress: () => {
        fetch(`${API_URL}/entries/${id}`, { method: 'DELETE' })
          .then(() => setEntries(prev => prev.filter(e => e._id !== id)))
          .catch(console.error);
      }
    },
  ]);
};

const today = new Date();

// Lokales Datum als String (kein UTC-Problem)
const localDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const todayKey = localDateKey(today);
const todayFormatted = today.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

const isRecurringToday = (e: Entry) => {
  if (!e.wiederholung || e.wiederholung === 'nie') return false;
  const entryDate = new Date(e.datum);
  if (entryDate.getDay() !== today.getDay()) return false;
  if (entryDate > today) return false;
  if (e.wiederholung === 'wöchentlich') return true;
  if (e.wiederholung === '2-wöchentlich') {
    const diffWeeks = Math.round((today.getTime() - entryDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return diffWeeks % 2 === 0;
  }
  return false;
};

const todayEntries = entries
  .filter((e) => localDateKey(new Date(e.datum)) === todayKey || isRecurringToday(e))
  .sort((a, b) => (a.zeitVon || "").localeCompare(b.zeitVon || ""));

    const renderContent = () => {
        if (loading) return <ActivityIndicator color="#002E99" style={{ marginTop: 20 }} />;
        if (todayEntries.length === 0) return (
            <Text style={{ marginTop: 16, color: '#6A8FAD', fontSize: 13 }}>
                Heute keine Vorlesungen 🎉
            </Text>
        );
        return todayEntries.map((ev) => (
            <BlueDataCard
                key={ev._id}
                title={`${ev.zeitVon ?? "??:??"}-${ev.zeitBis ?? "??:??"} Uhr - ${ev.title}`}
                subtitle={[
                    `Dozent: ${ev.dozent ?? "-"}`,
                    ...(ev.raum ? [`Raum: ${ev.raum}`] : []),
                    ...(ev.wiederholung && ev.wiederholung !== 'nie' ? [`${ev.wiederholung}`] : []),
                ]}
                onPress={() => {}}
            >
                <Text style={{ color: '#002E99' }}>Notizen:</Text>
                <Text style={{ color: '#002E99' }}>{ev.notizen?.trim() ? ev.notizen : "-"}</Text>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(ev._id, ev.title)}>
                    <Text style={styles.deleteBtnText}>Eintrag Löschen</Text>
                </TouchableOpacity>
            </BlueDataCard>
        ));
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={{ flex: 1 }}>
            <Image
                source={require("../../assets/images/HAW_Logo.jpg")}
                style={styles.hawLogo}
                resizeMode='contain'
            />
            <Text style={styles.title}>Willkommen zu deinem Kalender</Text>
            <Text style={{ marginTop: 8, color: '#6A8FAD', fontSize: 13 }}>
                Termine für heute, den {todayFormatted}.{'\n'}
                Tippe auf einen Termin, um Details zu sehen.{'\n'}
            </Text>
             
            
            {renderContent()}
            </View>
        </ScrollView>
    )
};

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    contentContainer: {
        padding: 20,
        paddingTop: 65,
        paddingBottom: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: "500",
        marginTop: 20,
        textAlign: 'left',
        color: '#3a38ac'
    },
    contactItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'

    },
    contactName: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    hawLogo: {
        width:120,
        height:50,
        alignSelf:'flex-end'
    },
    deleteBtn: {
        backgroundColor: '#002E99',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    deleteBtnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
})


