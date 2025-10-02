import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ensureMe } from '../lib/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Contacts'>;

type Contact = { id: string; name: string };

export default function ContactsScreen({ navigation }: Props) {
  const [meName, setMeName] = useState<string>('');

  useEffect(() => {
    (async () => {
      const me = await ensureMe();
      setMeName(me.name ?? '나');
    })();
  }, []);

  // 데모용 연락처 (원하면 스토리지/서버 연동으로 교체)
  const contacts: Contact[] = [
    { id: 'peer_alice', name: '앨리스' },
    { id: 'peer_bob', name: '밥' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Pressable style={styles.btn} onPress={() => navigation.navigate('Scan')}>
          <Text style={styles.btnText}>QR 스캔</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => navigation.navigate('MyQR')}>
          <Text style={styles.btnText}>내 QR</Text>
        </Pressable>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('Chat', { peerId: item.id, name: item.name })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.id}>{item.id}</Text>
          </Pressable>
        )}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 12, paddingBottom: 8 }}>
            <Text style={{ fontSize: 12, color: '#6b7280' }}>내 이름: {meName}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  btnText: { color: 'white', fontWeight: '600' },
  row: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: '600' },
  id: { fontSize: 12, color: '#6b7280', marginTop: 4 },
});
