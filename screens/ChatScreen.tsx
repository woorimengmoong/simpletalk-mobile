import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { appendChat, ensureMe, getChat, isBlocked, Message } from '../lib/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ route }: Props) {
  const { peerId, name } = route.params;
  const [meId, setMeId] = useState<string>('');
  const [blocked, setBlocked] = useState<boolean>(false);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      const me = await ensureMe();
      setMeId(me.userId);
      setBlocked(await isBlocked(peerId));
      setMsgs(await getChat(peerId));
    })();
  }, [peerId]);

  const send = async () => {
    if (!text.trim() || !meId) return;
    const m: Message = {
      id: 'm_' + Math.random().toString(36).slice(2),
      from: meId,
      to: peerId,
      text: text.trim(),
      ts: Date.now(),
    };
    await appendChat(peerId, m);
    setMsgs(prev => [m, ...prev]); // 위에서 아래로 보여주면 reverse 필요
    setText('');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <FlatList
        data={msgs}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12 }}
        inverted // 최신 메시지가 아래로 오게 하는 대신, inverted로 위에 쌓인 걸 뒤집어서 보여줌
        renderItem={({ item }) => {
          const mine = item.from === meId;
          return (
            <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <Text style={{ color: mine ? 'white' : 'black' }}>{item.text}</Text>
            </View>
          );
        }}
      />
      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={blocked ? '차단됨' : '메시지 입력'}
          editable={!blocked}
          style={styles.input}
        />
        <Button title="전송" onPress={send} disabled={blocked || !text.trim()} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 6,
    alignSelf: 'flex-start',
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
  },
  theirs: {
    backgroundColor: '#e5e7eb',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
});
