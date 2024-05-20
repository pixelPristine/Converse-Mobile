import React, { useEffect, useState } from "react";
import { TextInput, View, Image, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "./firebase-config";

interface UserSearchProps {
  setRoom: (arg: string) => void;
  user: string | null;
  setIsSearch: (arg: boolean) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ setRoom, user, setIsSearch }) => {
  const [chats, setChats] = useState<any[]>([]);
  const [inputRoom, setInputRoom] = useState<string>("");

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

  const handleGoPress = () => {
    if(inputRoom != ""){
        setRoom(inputRoom);
        setIsSearch(false);
    }
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Search"
        style={styles.input}
        value={inputRoom}
        onChangeText={(text) => setInputRoom(text)}
      />
      <Button title="Go" onPress={handleGoPress} />

      <View style={styles.searchResults}>
        {chats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.searchResultEntry}
            onPress={() => {
              setRoom(chat.room);
              setIsSearch(false);
            }}
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
      width: "100%", // Set width to 100% to fit the screen
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
      maxWidth: "80%", // Add maxWidth to limit width to 80% of the screen
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