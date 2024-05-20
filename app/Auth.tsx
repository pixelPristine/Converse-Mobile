import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { db } from "./firebase-config"; // Adjust the import path as needed
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
// import Cookies from 'universal-cookie';
import AsyncStorage from "@react-native-async-storage/async-storage";

// const cookies = new Cookies();

interface AuthProps {
  setIsAuth: any;
  setIsGuest: any;
  oogabooga: () => void;
}

const Auth = ({ setIsAuth, setIsGuest, oogabooga }: AuthProps) => {
  const [newSignupName, setNewSignupName] = useState("");
  const [newSignupPass, setNewSignupPass] = useState("");
  const [newSignupConf, setNewSignupConf] = useState("");
  const [Failure, setFailure] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const SignupRef = collection(db, "UserLogins");
  const [Signups, setSignups] = useState<any[]>([]);

  useEffect(() => {
    const queryMessages = query(SignupRef);
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let Info: any = [];
      snapshot.forEach((doc) => {
        Info.push({ ...doc.data(), id: doc.id });
      });

      setSignups(Info);
    });

    return () => unsubscribe();
  }, []);

  const handleSignUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    let dup = false;

    for (let index = 0; index < Signups.length; index++) {
      if (Signups[index].name === newSignupName) {
        setDuplicate(true);
        dup = true;
        break;
      }
    }

    if (
      dup ||
      newSignupName === "" ||
      newSignupPass === "" ||
      newSignupConf === "" ||
      newSignupPass !== newSignupConf
    ) {
      setFailure(true);
      return;
    }

    await addDoc(SignupRef, {
      name: newSignupName,
      password: newSignupPass,
    });

    // cookies.set('User-Name', newSignupName);
    await AsyncStorage.setItem("User-Name", newSignupName);

    setNewSignupName("");
    setNewSignupPass("");
    setNewSignupConf("");
    setIsAuth(true);
  };

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (newSignupName === "" || newSignupPass === "") {
      setFailure(true);
      return;
    }

    for (let index = 0; index < Signups.length; index++) {
      if (
        Signups[index].name === newSignupName &&
        Signups[index].password === newSignupPass
      ) {
        // cookies.set('User-Name', newSignupName);
        await AsyncStorage.setItem("User-Name", newSignupName);
        setIsAuth(true);
        return;
      }
    }

    setFailure(true);
  };

  const GuestNameRef: any = useRef(null);
  const TriggerGuestSignIn = async () => {
    if (GuestNameRef.current?.value !== "") {
      //   cookies.set('Guest-Name', GuestNameRef.current?.value);
      await AsyncStorage.setItem("Guest-Name", GuestNameRef.current?.value);
      setIsGuest(true);
    }
  };

  return (
    <View style={styles.authContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Create Account</Text>
        <TextInput
          style={styles.inputField}
          onChangeText={setNewSignupName}
          value={newSignupName}
          placeholder="Name"
        />
        <TextInput
          style={styles.inputField}
          onChangeText={setNewSignupPass}
          value={newSignupPass}
          placeholder="Password"
          secureTextEntry
        />
        <TextInput
          style={styles.inputField}
          onChangeText={setNewSignupConf}
          value={newSignupConf}
          placeholder="Confirm Password"
          secureTextEntry
        />
        {Failure && (
          <Text style={styles.errorMessage}>Failure. Check fields again</Text>
        )}
        {duplicate && (
          <Text style={styles.errorMessage}>
            Name Unavailable. Try something else
          </Text>
        )}
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.heading}>Sign in</Text>
        <TextInput
          style={styles.inputField}
          onChangeText={setNewSignupName}
          value={newSignupName}
          placeholder="Account Name"
        />
        <TextInput
          style={styles.inputField}
          onChangeText={setNewSignupPass}
          value={newSignupPass}
          placeholder="Password"
          secureTextEntry
        />
        {Failure && (
          <Text style={styles.errorMessage}>Failure. Check fields again</Text>
        )}
        <Button title="Sign In" onPress={handleSignIn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%", // Set width to 100% to fit the screen
  },
  formContainer: {
    width: "100%", // Set width to 100% to fit the screen
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  inputField: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    width: "100%", // Set width to 100% to
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Auth;
