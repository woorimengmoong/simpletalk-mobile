import AsyncStorage from "@react-native-async-storage/async-storage";

// ---- Types ----
export type Me = { userId: string; name: string };
export type Contact = { id: string; name: string; note?: string };
export type Message = { id: string; from: string; to: string; text: string; ts: number };

const KEYS = {
  ME: "ST_me",
  CONTACTS: "ST_contacts",
  BLOCKS: "ST_blocks",
};

export async function getMe(): Promise<Me | undefined> {
  const raw = await AsyncStorage.getItem(KEYS.ME);
  return raw ? JSON.parse(raw) : undefined;
}

// 최초 실행 시 내 계정 자동 생성 (전화번호 없이 랜덤 ID)
export async function ensureMe(): Promise<Me> {
  let me = await getMe();
  if (!me) {
    me = { userId: "u_" + Math.random().toString(36).slice(2, 10), name: "나" };
    await AsyncStorage.setItem(KEYS.ME, JSON.stringify(me));
  }
  return me;
}

export async function setMe(me: Me) {
  await AsyncStorage.setItem(KEYS.ME, JSON.stringify(me));
}

export async function getContacts(): Promise<Contact[]> {
  const raw = await AsyncStorage.getItem(KEYS.CONTACTS);
  return raw ? JSON.parse(raw) : [];
}

export async function saveContacts(list: Contact[]) {
  await AsyncStorage.setItem(KEYS.CONTACTS, JSON.stringify(list));
}

export async function addContact(c: Contact) {
  const list = await getContacts();
  if (!list.find((x) => x.id === c.id)) {
    list.push(c);
    await saveContacts(list);
  }
}

export async function removeContact(id: string) {
  const list = await getContacts();
  const next = list.filter((c) => c.id !== id);
  await saveContacts(next);
}

export async function isBlocked(id: string) {
  const raw = await AsyncStorage.getItem(KEYS.BLOCKS);
  const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  return !!map[id];
}

export async function setBlocked(id: string, blocked: boolean) {
  const raw = await AsyncStorage.getItem(KEYS.BLOCKS);
  const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  if (blocked) map[id] = true;
  else delete map[id];
  await AsyncStorage.setItem(KEYS.BLOCKS, JSON.stringify(map));
}

export async function getChat(peerId: string): Promise<Message[]> {
  const raw = await AsyncStorage.getItem("ST_chat_" + peerId);
  return raw ? JSON.parse(raw) : [];
}

export async function saveChat(peerId: string, msgs: Message[]) {
  await AsyncStorage.setItem("ST_chat_" + peerId, JSON.stringify(msgs));
}

export async function appendChat(peerId: string, msg: Message) {
  const msgs = await getChat(peerId);
  msgs.push(msg);
  await saveChat(peerId, msgs);
}
