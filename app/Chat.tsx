import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebase-config';

interface ChatProps {
  room: string;
  IsRoomGeneral: boolean;
  guestName: string | null;
  setIsSearch: (arg: boolean) => void;
  SignUserOut: any;
}

const Chat = ({ room, IsRoomGeneral, guestName, setIsSearch, SignUserOut }: ChatProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesRef = collection(db, 'messages');
  const [messages, setMessages] = useState<any[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const queryMessages = !IsRoomGeneral
      ? query(messagesRef, where('room', '==', room), orderBy('createdAt'))
      : query(messagesRef, orderBy('createdAt'));

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const messages: any[] = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [room, IsRoomGeneral]);

  const handleSubmit = async () => {
    if (newMessage === '') return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: guestName,
      room,
    });

    setNewMessage('');
  };

  const renderMessages = () => {
    const signedInUser = AsyncStorage.getItem('User-Name');
  
    return messages.map((message) => (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          message.user === signedInUser ? styles.messageContainerSender : null,
        ]}
      >
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
      {room && (
        <View style={styles.header}>
          <Image /*source={userIcon}*/ style={styles.userImg} />
          <Text style={styles.roomName}>{room.toUpperCase()}</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => setIsSearch(true)} style={styles.button}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={SignUserOut} style={[styles.button, styles.signOutButton]}>
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messages}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {renderMessages()}
      </ScrollView>
      {room && (
        <View style={styles.newMessageForm}>
          <TextInput
            style={styles.newMessageInput}
            placeholder="Type your message here..."
            onChangeText={setNewMessage}
            value={newMessage}
          />
          <Button title="Send" onPress={handleSubmit} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chatApp: {
    flex: 1,
    padding: 10,
    width: "100%", // Set width to 100% to fit the screen
  },
  header: {
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
  roomName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#dc3545', // Red color for sign out button
  },
  messages: {
    flex: 1,
    marginBottom: 10,
    width: "100%", // Set width to 100% to fit the screen
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageContainerSender: {
    flexDirection: 'row-reverse', // Align messages from the signed-in user to the right
    backgroundColor: '#007bff', // Change the background color of the message box
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
  newMessageForm: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newMessageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
});

export default Chat;