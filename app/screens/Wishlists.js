

import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import { auth, db } from '../../firebase';


const Wishlists = () => {
    const [reservedListings, setReservedListings] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribeAuth = auth.onAuthStateChanged(authUser => {
          setUser(authUser);
          if (!authUser) {
            setReservedListings([]); // Clear listings when logged out
          }
        });

        return unsubscribeAuth;
      }, []);

      useEffect(() => {
        if (!user) {
          return;
        }
      //if (user) {
        const uid = user.uid;
        const unsubscribe = db
          .collection('users')
          .doc(uid)
          .collection('registeredListings')
          .onSnapshot(snapshot => {
            const listings = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setReservedListings(listings);
          }, error => {
            console.error("Error fetching listings: ", error);
          });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
      }
    , [user]);

    const renderItem = ({ item }) => (
        <View style={styles.listingContainer}>
            <View style={styles.cardContainer} >
                <Image source={{ uri: item.image }} style={styles.imageStyle} />
                <Text style={styles.listingTitle}>{item.title}</Text>
                <Text style={styles.listingHost}>{'Entire home ' + item.host}</Text>
            </View>
        </View>

      );

    return (
      <FlatList
        data={reservedListings}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    );
  };
const deviceWidth = Math.round(Dimensions.get('window').width)
const styles = StyleSheet.create({
  listingContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  listingImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make the image round
    marginRight: 10,
  },
  listingLocation: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listingHost: {
    fontSize: 12,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Add other styles as needed
  cardContainer: {width: deviceWidth - 37,
    backgroundColor: 'white',
    height: 200,
    borderRadius: 6,

    shadowColor: '#000',
    shadowOffset: {
        width: 5,
        height: 5,
    },
    shadowOpacity: 0.75,
    elevation: 7,
    paddingHorizontal: 5,
    marginVertical: 25,
    paddingTop: 0,
    justifyContent: 'flex-start', // Align children vertically in the center
    alignItems: 'center'

    },
    imageStyle: {
    width: deviceWidth - 37,
    height: 130,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,

    },
});

export default Wishlists;
