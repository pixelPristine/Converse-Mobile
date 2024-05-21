import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Auth from "../Auth";
import Chat from "../Chat";
import UserSearch from "../UserSearch";

export default function TabOneScreen() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [isGuest, setIsGuest] = useState<boolean | null>(null);
  const [guestName, setGuestName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // State for loading
  const [room, setRoom] = useState("general");
  const [isSearch, setIsSearch] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authToken = await AsyncStorage.getItem("auth-token");
      const userName = await AsyncStorage.getItem("User-Name");
      setIsAuth(authToken !== null);
      setGuestName(userName);
      setLoading(false); // Set loading to false once data is fetched
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchGuestName = async () => {
      const userName = await AsyncStorage.getItem("User-Name");
      setGuestName(userName);
    };

    fetchGuestName();
  }, [room]);

  const SignUserOut = async () => {
    await AsyncStorage.removeItem("auth-token");
    await AsyncStorage.removeItem("User-Name");
    setIsAuth(false);
    setIsSearch(true);
    setGuestName(null);
    setRoom("");
  };

  if (loading) {
    // Render loading state while async functions are executing
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }else{

  return (
    <View style={styles.container}>
      {!isAuth && (
        <Auth
          setIsAuth={setIsAuth}
          setIsGuest={setIsGuest}
          oogabooga={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
      {isAuth && !isSearch && (
        <>
          <Chat
            room={room}
            IsRoomGeneral={room === "no_room"}
            guestName={guestName}
            setIsSearch={setIsSearch}
            SignUserOut={SignUserOut}
          />
        </>
      )}
      {isAuth && isSearch && (
        <>
          <UserSearch setRoom={setRoom} user={guestName} setIsSearch={setIsSearch} />
        </>
      )}
    </View>
  );
}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});