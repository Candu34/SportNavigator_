import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Ionicons, Feather } from "@expo/vector-icons";
import validate from "react-native-email-validator";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "expo-router";


const RegisterPage = () => {
  useWarmUpBrowser();
  const [email, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { onRegister } = useAuth();
  const router = useRouter();

  const handleMailChange = (text: string) => {
    setMail(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
  };

  const handleSubmit = async () => {
    if (!validate(email)) {
      return Alert.alert('Invalid email');
    }

    if (password.length < 8) {
      return Alert.alert('Password should be at least 8 characters');
    }

    try {
      const result = await onRegister(email, password, firstName, lastName);
      if (result.error) {
        Alert.alert('Registration failed', result.msg);
      } else {
        console.log('Registration successful');
        router.replace('/(tabs)'); // Redirect to the tabs page after successful registration
      }
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Registration failed', error.message);
    }
  };

  return (
    <View style={[styles.container, { marginBottom: 30 }]}>
      <TextInput
        autoCapitalize="none"
        placeholder="First Name"
        value={firstName}
        style={[defaultStyles.inputField, { marginBottom: 15, fontFamily: 'pop' }]}
        onChangeText={handleFirstNameChange}
      />
      <TextInput
        autoCapitalize="none"
        placeholder="Last Name"
        value={lastName}
        style={[defaultStyles.inputField, { marginBottom: 15, fontFamily: 'pop' }]}
        onChangeText={handleLastNameChange}
      />
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        value={email}
        style={[defaultStyles.inputField, { marginBottom: 15, fontFamily: 'pop' }]}
        onChangeText={handleMailChange}
      />
      <TextInput
        autoCapitalize="none"
        secureTextEntry={true}
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        style={[defaultStyles.inputField, { marginBottom: 30, fontFamily: 'pop' }]}
      />
      <TouchableOpacity style={defaultStyles.btn} onPress={handleSubmit}>
        <Text style={defaultStyles.btnText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.seperatorView}>
        <View style={{ borderBottomColor: '#000', borderBottomWidth: StyleSheet.hairlineWidth, flex: 1 }} />
        {/* <Text style={styles.separator}>or</Text> */}
        {/* <View style={{ borderBottomColor: '#000', borderBottomWidth: StyleSheet.hairlineWidth, flex: 1 }} /> */}
      </View>
      <View style={{ gap: 20 }}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => router.navigate('/(modals)/login')}>
          <Feather name="log-in" size={24} style={defaultStyles.btnIcon} />
          <Text style={styles.btnOutlineText}>Have allready an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 26,
  },
  seperatorView: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 30,
  },
  separator: {
    fontFamily: 'pop-sb',
    color: Colors.grey,
    marginLeft: 5,
    marginRight: 5,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'pop-sb',
  },
});

export default RegisterPage;