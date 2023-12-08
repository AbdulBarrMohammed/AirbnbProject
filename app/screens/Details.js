import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { auth }  from '../../firebase';
import { db } from '../../firebase';
const Details = ({ navigation, route }) => {
    // route params for listing information
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

    const handleReserveListing = async () => {
        console.log("Image URL:", image);
        const user = auth.currentUser; // Get the current signed-in user

        if (user) {
            // gets user's UID
            const uid = user.uid;

            try {
                // adds a new document in collection "users" under their UID with the listing info
                await db.collection('users')
                    .doc(uid)
                    .collection('registeredListings')
                    .doc(listingId) // listingId to uniquely identify the listing for respective user
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

            } catch (error) {
                console.error("Error registering listing: ", error);

            }
        } else {
            // User not signed in check
            console.log('User must be signed in to register a listing');

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
      },
      priceStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',

      },

  });


  export default Details;
