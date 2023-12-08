
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    ActivityIndicator,
    Button,
    TouchableOpacity,
    Dimensions, Image, Alert
  } from "react-native";
  import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
  import 'react-native-reanimated';
  import { GestureHandlerRootView } from 'react-native-gesture-handler';
  import { auth }  from '../../firebase';
  import { db } from '../../firebase';

  const Profile = ({ navigation, route }) => {
    //const userName = route.params?.userName;


    const [user, setUser] = useState(null);
    const [newUsername, setNewUsername] = useState(''); // New state for the new username

    // ... existing code ...

    const handleUpdateUsername = () => {
      const user = auth.currentUser;
      if (newUsername.trim() === '') {
        // Alert the user if the new username is empty
        Alert.alert("Error", "Please enter a username before updating.");
        return; // Exit the function early
      }
      if (user) {
        // Update username in Firebase Auth
        user.updateProfile({
          displayName: newUsername
        }).then(() => {
          console.log("Username updated in Firebase Auth");

          // Update username in Firestore
          db.collection('users').doc(user.uid).update({
            name: newUsername // Assuming 'name' is the field in Firestore
          }).then(() => {
            console.log("Username updated in Firestore");

            // Update local state
            setUser(currentUserData => ({ ...currentUserData, displayName: newUsername }));
            setNewUsername(''); // Reset the input field
          }).catch((error) => {
            console.error("Error updating username in Firestore: ", error);
          });
        }).catch((error) => {
          console.error("Error updating username in Firebase Auth: ", error);
        });
      }
    };



    const firstModalRef = useRef(null);
    const secondModalRef = useRef(null);

    const [isFirstModalVisible, setFirstModalVisible] = useState(false);
    const [isSecondModalVisible, setSecondModalVisible] = useState(false);

    const snapPoints = ["90%"];
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    function handlePresentModal() {
        setFirstModalVisible(true);
        firstModalRef.current?.present();
        //firstModalRef.current?.present();
    }

    const continueButton = () => {

        setFirstModalVisible(false);
        firstModalRef.current?.close();
        setTimeout(() => {
            setSecondModalVisible(true);
            secondModalRef.current?.present();
        }, 300);

    }
    const handleSecondModal = () => {
        setSecondModalVisible(false);
        secondModalRef.current?.close();
        //secondModalRef.current?.dismiss();
    };

    const handleCreateAccountPress = () => {
        // Close the second modal if it's open
        if (isSecondModalVisible) {
            secondModalRef.current?.close();
            setSecondModalVisible(false);
        }

        // Close the first modal if it's open
        if (isFirstModalVisible) {
            firstModalRef.current?.close();
            setFirstModalVisible(false);
        }
        navigation.navigate('CreateAccount', {userEmail: email, userPassword: password});
    };
    const handleLogin = () => {
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;

                // Fetch additional user data from Firestore
                const userDoc = db.collection('users').doc(user.uid);
                return userDoc.get({ source: 'default' });

            })
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();

                    // Update state with user info and additional data
                    setUser({
                        uid: userData.uid,
                        displayName: userData.name, // Assuming you've stored it as 'name'
                        creationDate: userData.creationDate,
                        displayEmail: userData.userEmail // Assuming you've stored it as 'creationDate'
                    });
                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    };
    function handleLogOut() {
        auth.signOut()
            .then(() => {
            console.log("User successfully logged out");
            // Update the user state to null or perform any other actions needed after logout
            setUser(null);
            // Optionally, navigate to the login screen or any other screen
             // Replace 'Login' with the name of your login screen if different
            })
            .catch((error) => {
            console.error("Error logging out: ", error);
            });
    }


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
            <View style={styles.container}>

                <View style={styles.formContainer}>
                {user && user.displayName ? (
                        <View>

                            <View style={styles.cardContainer} >
                                <Image source={require('../assets/flower.png')} style={styles.listingImage}/>
                                <Text style={styles.nameStyle}>{user.displayName}</Text>
                                <Text style={styles.emailStyle}>{user.displayEmail}</Text>
                                <Text style={styles.dateStyle}>Since {user.creationDate}</Text>

                                <TextInput
                                    value={newUsername}
                                    onChangeText={setNewUsername}
                                    style={styles.TextInput}
                                    placeholder="Enter new username"
                                />

                                <Button
                                    title="Update Username"
                                    onPress={handleUpdateUsername}
                                />

                            </View>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={handleLogOut}>
                                <Text style={styles.loginButtonText}>Log Out</Text>
                        </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handlePresentModal}>
                            <Text style={styles.loginButtonText}>Log In</Text>
                        </TouchableOpacity>
                    )}
                <BottomSheetModal
                    ref={firstModalRef}
                    index={0}
                    snapPoints={snapPoints}
                >
                    <View style={styles.signUpContainer}>
                        <TextInput
                        value={email}
                        onChangeText={setEmail}
                         style={styles.TextInput} placeholder = "Email" />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.continueBtn} onPress={continueButton}>
                            <Text style={styles.btnText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.extraButton}>
                                <Text style={styles.extraText}>Continue with Phone</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.extraButton}>
                                <Text style={styles.extraText}>Continue with Apple</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.extraButton}>
                                <Text style={styles.extraText}>Continue with Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.extraButton}>
                                <Text style={styles.extraText}>Continue with Facebook</Text>
                        </TouchableOpacity>
                    </View>

                </BottomSheetModal>
                <BottomSheetModal
                        ref={secondModalRef}
                        index={0}
                        snapPoints={snapPoints}
                        isVisible={isSecondModalVisible}
                        onDismiss={() => setSecondModalVisible(false)}
                    >
                        {/* Content of the second modal */}
                        <View>
                            <View style={styles.passwordContainer}>
                            <TextInput
                            value={password}
                            onChangeText={setPassword}
                            style={styles.TextInput} placeholder = "Password" />
                        </View>
                        <TouchableOpacity style={styles.extraButton} onPress={handleLogin}>
                                <Text style={styles.extraText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.extraButton} onPress={handleCreateAccountPress}>
                                <Text style={styles.extraText}>Create Account</Text>
                        </TouchableOpacity>
                        </View>
                    </BottomSheetModal>
            </View>
        </View>
        </BottomSheetModalProvider>
    </GestureHandlerRootView>


    );
  };

  const deviceWidth = Math.round(Dimensions.get('window').width)
  const styles = StyleSheet.create({
    nameStyle: {
        fontSize: 35,
    },
    dateStyle: {
        fontWeight: 'bold',
        fontSize: 20,

    },
    emailStyle: {
        textDecorationLine: 'underline',
        fontSize: 20,
    },
    cardContainer: {width: deviceWidth - 37,
        backgroundColor: 'white',
        height: 250,
        borderRadius: 20,

        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.75,
        elevation: 7,
        paddingHorizontal: 5,
        marginVertical: 25,
        paddingTop: 10,
        justifyContent: 'flex-start', // Align children vertically in the center
        alignItems: 'center'

        },
        imageStyle: {
        width: 100, height: 100, borderRadius: 80/ 2,
        justifyContent: 'center',
        alignItems: 'center',
        },
    continueBtn: {
        width: '90%',
        height: '28%',
        marginLeft: 20,
        marginRight: 80,
        backgroundColor: '#E1306C',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5,

    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',

    },

    extraText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    signUpContainer: {
        backgroundColor: 'white',
        width: '90%',
        height: '8%',
        marginLeft: 20,
        marginRight: 80,
        borderColor: '#e8e8e8',
        borderWidth: 3,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,

    },
    TextInput: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    headerContainer: {
      paddingTop: 60, // Adjust for your status bar height
      paddingBottom: 20,
      paddingLeft: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      alignItems: 'flex-start',
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    formContainer: {
      justifyContent: 'flex-start',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    loginButton: {
      borderWidth: 1,
      borderColor: '#000',
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    loginButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    extraButton: {
        width: '90%',
        marginLeft: 20,
        marginRight: 80,
        height: 60,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
      },

      passwordContainer: {
        backgroundColor: 'white',
        width: '90%',
        height: '20%',
        marginLeft: 20,
        marginRight: 80,
        borderColor: '#e8e8e8',
        borderWidth: 3,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,

      },
      listingImage: {
        width: 70,
        height: 70,
        borderRadius: 50, // Make the image round
        marginRight: 10,
      }


  });

export default Profile;
