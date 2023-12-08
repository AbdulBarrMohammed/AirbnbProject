import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { auth }  from '../../firebase';
import { db } from '../../firebase';
import { storage } from '../../firebase';
const Details = ({ navigation, route }) => {
    //const { image, location, rating, listingId } = route.params;
    const image = route.params?.image;
    const location = route.params?.location;
    const rating = route.params?.rating;
    const listingId= route.params?.listingId;
    const host = route.params?.host;
    const description = route.params?.description;
    const reviews = route.params?.reviews;
    const dates = route.params?.dates;
    const title = route.params?.title;
    const rooms = route.params?.rooms;
    const price = route.params?.price;

    const handleBackBtn = () => {
        navigation.navigate('Explore');
    }

    const handleReserveListing = async () => {
        console.log("Image URL:", image);
        const user = auth.currentUser; // Get the current signed-in user

        if (user) {
            // Get user's UID
            const uid = user.uid;

            try {
                // Add a new document in collection "users" under their UID with the listing info
                await db.collection('users')
                    .doc(uid)
                    .collection('registeredListings')
                    .doc(listingId) // Using listingId to uniquely identify the listing
                    .set({
                        image,
                        location,
                        rating,
                        listingId,
                        host,
                        description,
                        reviews,
                        dates,
                        title,
                        rooms,
                        price
                    });

                console.log('Listing registered to Firestore!');
                // Optionally navigate back or show a success message
            } catch (error) {
                console.error("Error registering listing: ", error);
                // Optionally handle the error, such as showing an error message
            }
        } else {
            // User not signed in, handle accordingly
            console.log('User must be signed in to register a listing');
            // Optionally navigate to sign-in page or show a message
        }
    };

    return (
      <View>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.container}>
            <Text style={styles.titleStyle}>{title}</Text>
            <Text style={styles.locationStyle}>{location}</Text>
            <Text style={styles.roomStyle}>{rooms}</Text>
            <Text style={styles.reviewsStyle}>{'⭐ ' + rating + ' . ' + reviews}</Text>
            <View style={styles.separator} />
            <Text style={styles.middleText}>{'Hosted by ' + host}</Text>
            <Text style={styles.middleTextTwo}>{'Host since ' + dates}</Text>
            <View style={styles.separator} />
            <Text style={styles.descriptionStyle}>{description}</Text>
            <View style={styles.separator} />

        </View>

        <View style={styles.bottomContainer}>
            <Text style={styles.priceStyle}>{'$ ' + price}</Text>
            <TouchableOpacity style={styles.reserveBtn} onPress={handleReserveListing}>
                <Text style={styles.btnText}>Reserve</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  };


  const styles = StyleSheet.create({
    container: {
        paddingLeft: 15,
    },
    titleStyle: {
        fontWeight: 'bold',
        fontSize: 25
    },
    locationStyle: {
        fontWeight: 'bold',
        fontSize: 20
    },
    roomStyle: {
        color: 'gray',
        fontSize: 15
    },
    reviewsStyle:{
        fontWeight: 'bold',
    },

    image: {
      width: '100%',
      height: 250,
      borderRadius: 5,

    },
    separator: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginVertical: 20,
        width: 350
      },

    middleText: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 50,
        fontWeight: 'bold',
        fontSize: 15
    },
    middleTextTwo: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 50,
        fontWeight: 'bold'
    },
    descriptionStyle: {
        fontSize: 15
    },
    reserveBtn: {
        width: 100,
        height: 50,
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
    bottomContainer: {
        flexDirection: 'row', // Aligns children in a row
        justifyContent: 'space-between', // Positions children with space between them
        alignItems: 'center', // Centers children vertically
        padding: 10, // Adds padding inside the container
      },
      priceStyle: {
        fontSize: 18, // Sets the size of the text
        fontWeight: 'bold', // Makes the text bold
        color: '#333', // Sets the text color
        // Additional styling for price text as needed
      },

  });


  export default Details;
