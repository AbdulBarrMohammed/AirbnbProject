import React, { useState, useRef } from 'react';
import { View, Text, Button, TextInput, StyleSheet,TouchableOpacity} from 'react-native';
//import { auth } from '../../firebase';
import { auth }  from '../../firebase';
//import { db } from '../../firebase';
import {firebase} from '../../firebase';




const CreateAccount = ({ navigation, route }) => {
    const userEmail = route.params?.userEmail;
    const userPassword = route.params?.userPassword;


    const [name, setName] = useState('');
   // const currentDate = new Date();
    //const formattedDate = `Registration Date: ${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;



    const handleCreateAccountPress = () => {
        const currentDate = new Date();
        const creationDate = `${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()}`; // Convert to ISO string for consistency

        auth.createUserWithEmailAndPassword(userEmail, userPassword)
            .then((userCredentials) => {
                const user = userCredentials.user;
                return user.updateProfile({
                    displayName: name,
                });
            })
            .then(() => {
                console.log('Profile updated!');
                // Pass the creation date to the next screen
                navigation.navigate('Profile', { userName: name });

            })
            .then(() => {

                //const userDoc = db.collection('users').doc(auth.currentUser.uid);
                const userDoc = firebase.firestore().collection('users').doc(auth.currentUser.uid);
                return userDoc.set({
                    name: name,
                    creationDate: creationDate,
                    userEmail: userEmail
                }, { merge: true });

            })
            .catch((error) => {
                console.error('Error in account creation:', error);
            });
    };

        //auth.createUserWithEmailAndPassword(userEmail, userPassword).then(userCredentials =>{
        //       const user = userCredentials.user;
        //        console.log(user.email);
        //    })
        //    .catch(error => alert(error.message))
        //}




    return (
        <View>
            <View style={styles.signUpContainer}>
                        <TextInput
                        value={name}
                        onChangeText={setName}
                         style={styles.TextInput} placeholder = "Enter Profile name" />

            </View>
            <TouchableOpacity style={styles.finish} onPress={handleCreateAccountPress} >
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
