import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUserOut = async (setIsAuth: (auth: boolean) => void, setIsGuest: (guest: boolean) => void, setRoom: (room: string) => void) => {
  try {
    await AsyncStorage.removeItem("auth-token");
    await AsyncStorage.removeItem("User-Name");
    setIsAuth(false);
    setIsGuest(false);
    setRoom("");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export default SignUserOut;
