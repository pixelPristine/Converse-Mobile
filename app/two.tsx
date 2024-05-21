import React, { useEffect, useState } from "react";
import { TextInput, View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "./firebase-config";


interface UserSearchProps {
  setRoom: (arg: string) => void;
  user: string;
}

const UserSearch: React.FC<UserSearchProps> = ({ setRoom, user }) => {
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    const chatRef = collection(db, "messages");
    const queryChats = query(
      chatRef,
      where("user", "==", user),
      orderBy("room")
    );

    const unsubscribe = onSnapshot(queryChats, (snapshot) => {
      let chats: any[] = [];
      console.log("New Chat");
      snapshot.forEach((doc) => {
        chats.push({ ...doc.data(), id: doc.id });
      });

      let unique: any[] = [];
      for (let index = 0; index < chats.length; index++) {
        if (chats[index].room !== unique[unique.length - 1]?.room) {
          unique.push(chats[index]);
        }
      }
      setChats(unique);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Search"
        style={styles.input}
        onChangeText={(text) => setRoom(text)}
      />

      <View style={styles.searchResults}>
        {chats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.searchResultEntry}
            onPress={() => setRoom(chat.room)}
          >
            <Image /*source={user_icon}*/ style={styles.userIcon} />
            <Text>{chat.room}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "80%",
  },
  searchResults: {
    width: "80%",
  },
  searchResultEntry: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default UserSearch;
