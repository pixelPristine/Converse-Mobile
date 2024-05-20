import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase-config';

const TestMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const messagesRef = collection(db, 'messages');

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where('room', '==', 'general'),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const fetchedMessages: any[] = [];
      snapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const renderMessages = () => {
    return messages.map((message) => (
      <View key={message.id} style={styles.messageContainer}>
        <Image style={styles.userImg} /*source={userIcon}*/ />
        <View style={styles.message}>
          <Text style={styles.user}>{message.user}</Text>
          <Text>{message.text}</Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.chatApp}>
      <ScrollView style={styles.messages}>
        {renderMessages()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  chatApp: {
    flex: 1,
    padding: 10,
  },
  messages: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  message: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  user: {
    fontWeight: 'bold',
  },
});

export default TestMessages;
