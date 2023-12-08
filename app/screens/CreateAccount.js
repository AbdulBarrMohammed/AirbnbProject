import React, { useState, useRef } from 'react';
import { View, Text, Button, TextInput, StyleSheet,TouchableOpacity, Alert} from 'react-native';
import { auth }  from '../../firebase';
import {firebase} from '../../firebase';

const CreateAccount = ({ navigation, route }) => {
    const userEmail = route.params?.userEmail;
    const userPassword = route.params?.userPassword;

    //initializing state for user name and user email and password errors
    const [name, setName] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');




    // handle when account is created
    const handleCreateAccountPress = () => {
        // get the current date of which the user creates account
        setEmailError('');
        setPasswordError('');
        setGeneralError('');
        const currentDate = new Date();
        const creationDate = `${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()}`; // Convert to ISO string for consistency

        // firebase autheication creation with email and password
        auth.createUserWithEmailAndPassword(userEmail, userPassword)
            .then((userCredentials) => {
                const user = userCredentials.user;
                return user.updateProfile({
                    displayName: name,
                });
            })
            .then(() => {
                console.log('Profile updated!');
                // Pass the username to the Profile screen
                navigation.navigate('Profile', { userName: name });

            })
            .then(() => {
                //sets name,c reation date , email for respective user in firestore
                //const userDoc = db.collection('users').doc(auth.currentUser.uid);
                const userDoc = firebase.firestore().collection('users').doc(auth.currentUser.uid);
                return userDoc.set({
                    name: name,
                    creationDate: creationDate,
                    userEmail: userEmail
                }, { merge: true });

            })
            .catch((error) => {
                //console.error('Error in account creation:', error);

                if (error.code === 'auth/invalid-email') {
                    setEmailError('Invalid email format');
                    // Displays an alert for invalid email format
                    Alert.alert('Error', 'Invalid email format');
                } else if (error.code === 'auth/weak-password') {
                    setPasswordError('Weak password. Please choose a stronger password.');
                    // Displays an alert for weak password
                    Alert.alert('Error', 'Weak password. Please choose a stronger password.');
                } else {
                    // Handles any  other errors as needed
                    setGeneralError('An error occurred during account creation');
                    // Displays a general error alert
                    Alert.alert('Error', 'An error occurred during account creation');
                }
            });
    };

    const handleFinishButtonPress = () => {
        if (!name.trim()) {
            // Checks if the name is not empty or only contains whitespace
            Alert.alert('Error', 'Please enter your username before creating an account.');
        } else {
            // User has entered a valid username, proceed with account creation
            handleCreateAccountPress();
        }
    };

    return (
        <View>
            <View style={styles.signUpContainer}>
                        <TextInput
                        value={name}
                        onChangeText={setName}
                         style={styles.TextInput} placeholder = "Enter Profile name" />

            </View>
            <TouchableOpacity style={styles.finish} onPress={handleFinishButtonPress} >
                    <Text style={styles.btnText}>Finish Creating Account</Text>
             </TouchableOpacity>

        </View>


    );
};


const styles = StyleSheet.create({
    signUpContainer: {
        backgroundColor: 'white',
        width: '90%',
        height: '20%',
        marginLeft: 20,
        marginRight: 80,
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,

    },
    TextInput: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    date: {
        paddingLeft: 23,
        paddingTop: 10,
    },
    finish: {
        width: '90%',
        height: '15%',
        marginLeft: 20,
        marginRight: 80,
        backgroundColor: '#E1306C',
        justifyContent: 'center',
        alignItems: 'center',



    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',

    }

  });

export default CreateAccount;
