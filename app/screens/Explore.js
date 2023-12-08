import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storage } from '../../firebase';

const categories = [
    {
      name: 'Tiny homes',
      icon: 'home',
    },
    {
      name: 'Cabins',
      icon: 'house-siding',
    },
    {
      name: 'Trending',
      icon: 'local-fire-department',
    },
    {
      name: 'Play',
      icon: 'videogame-asset',
    },
    {
      name: 'City',
      icon: 'apartment',
    },
    {
      name: 'Beachfront',
      icon: 'beach-access',
    },
    {
      name: 'Countryside',
      icon: 'nature-people',
    },
  ];

const listings = [
    {
      id: '1',
      title: 'Stylish House Close to River Thames',
      location: 'Indianapolis, Indiana',
      rating: '4.98',
      imageUrl: '',
      host: 'Hosted by Lena',
      hostingYears: 8,
      price: '120',
      dates: '2023-10-10',
      reviews: "310 reviews",
      rooms: '3 guests . 4 bedrooms . 3 bed . 3 bathrooms',
      description: 'This inviting home features a traditional stone facade with rustic charm. Nestled in a tranquil neighborhood, its well-manicured lawn and welcoming entryway promise a serene stay. Perfect for families or small groups seeking a peaceful retreat.'
    },
    {
        id: '2',
        title: 'Big Home and giant front lawn',
        location: 'Marion, Indiana',
        rating: '4.92',
        imageUrl: '',
        host: 'Hosted by James',
        hostingYears: 3,
        price: '170',
        reviews: '130 reviews',
        dates: '2019-10-10',
        rooms: '3 guests . 3 bedrooms . 3 bed . 2 bathrooms',
        description: 'With its expansive front lawn and classic design, this home offers a spacious and luxurious stay. The wrap-around porch and large windows provide plenty of natural light and a perfect view of the sunset. Ideal for those who appreciate open spaces and elegant interiors'
      },
      {
        id: '3',
        title: 'cool small brick home with 2 bedrooms',
        location: 'Bloomington, Indiana',
        rating: '4.00',
        imageUrl: '',
        host: 'Hosted by Dave',
        hostingYears: 5,
        price: '110',
        dates: '2020-12-07',
        reviews: '280 reviews',
        rooms: '3 guests . 3 bedrooms . 3 bed . 2 bathrooms',
        description: 'This contemporary residence boasts a unique stone exterior and modern landscaping. The sleek design and privacy of the location make it a stylish getaway for those looking for a blend of modernity and nature.'
      },
      {
        id: '4',
        title: 'Nice home with 5 bedrooms',
        location: 'Avon, Indiana',
        rating: '4.00',
        imageUrl: '',
        host: 'Hosted by Abdul',
        hostingYears: 2,
        price: '220',
        dates: '2018-08-07',
        reviews: '128 reviews',
        rooms: '5 guests . 5 bedrooms . 4 bed . 3 bathrooms',
        description: 'Featuring a large driveway, three-car garage, and expansive outdoor spaces, it designed for guests who desire space and grandeur during their stay Cozy Corner Bungalow: it’s a charming option for couples or solo travelers seeking a quiet and comfortable home base'
      },

      {
        id: '6',
        title: 'Large house in a gated community',
        location: 'Fishers, Indiana',
        rating: '4.00',
        reviews: '300 reviews',
        imageUrl: '',
        host: 'Hosted by Dan',
        hostingYears: 2,
        price: '250',
        dates: '2018-07-07',
        rooms: '3 guests . 4 bedrooms . 3 bed . 2 bathrooms',
        description: 'Set back from the road with a sweeping driveway, this brick villa exudes elegance and privacy. With lush landscaping and a prominent entrance, it’s a stately choice for those who value a distinguished and private ambiance'
      },
      {
        id: '5',
        title: 'tiny small house in the city',
        location: 'Indianapolis, Indiana',
        rating: '2.90',
        imageUrl: '',
        host: 'Hosted by Conner',
        hostingYears: 2,
        price: '70',
        dates: '2016-07-07',
        reviews: '210 reviews',
        rooms: '1 guests . 1 bedrooms . 1 bed . 1 bathrooms',
        description: 'a small nice home that will allow you to have a quiet place to read and write or do homework'
      },
  ];

const Explore = ({ navigation }) => {
  const [updatedListings, setUpdatedListings] = useState([]);

    /**
     * get image url
     * @param imageName (String)
     * @return url (String)
     */
    // Function to get the download URL for an image
    const getImageUrl = async (imageName) => {
        const imageRef = storage.ref().child(imageName);
        const url = await imageRef.getDownloadURL();
        return url;
    };

    // fetches URLs and update listings
    useEffect(() => {
        const fetchImageUrlsAndUpdateListings = async () => {
            const promises = listings.map(async (listing) => {

                const imageUrl = await getImageUrl(`house${listing.id}.png`);
                return { ...listing, imageUrl }; // replaces the local image with the fetched URL
            });

            const updatedListingsWithUrls = await Promise.all(promises);
            setUpdatedListings(updatedListingsWithUrls); // updates state with new listings
        };

        fetchImageUrlsAndUpdateListings();
    }, []);
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.navContainer}>
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.searchBtn}>
                        <Ionicons name="search" size={24}/>
                        <View>
                            <Text style={{fontWeight: 'bold'}}>Where to?</Text>
                            <Text style={{color: 'grey'}}>Anywhere * Any week</Text>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Ionicons name="options-outline" size={24} />
                    </TouchableOpacity>

                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle= {{
                    alignItems: 'center',
                    gap: 20,
                    paddingHorizontal: 16,
                }}>

                    {categories.map((item, index) => (
                        <TouchableOpacity key={index}>
                            <MaterialIcons size={24} name= {item.icon} />
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                        ))}


                </ScrollView>

            </View>


        <ScrollView style={styles.container}>
            {updatedListings.map((listing) => (
                <View key={listing.id} style={styles.listingContainer}>
                    <Image source={{uri: listing.imageUrl }} style={styles.image} />
                    <TouchableOpacity onPress={() => navigation.navigate('Details', {
                        listingId: listing.id,
                        image: listing.imageUrl,
                        location: listing.location,
                        rating: listing.rating,
                        reviews: listing.reviews,
                        host: listing.host,
                        description: listing.description,
                        dates: listing.dates,
                        title: listing.title,
                        rooms: listing.rooms,
                        price: listing.price


                    })}>
                        <Text style={styles.title}>{listing.title}</Text>
                    </TouchableOpacity>
                    <Text style={styles.location}>{listing.location}</Text>
                    <View style={styles.row}>
                        <Text style={styles.rating}>⭐ {listing.rating}</Text>
                    </View>
                    <Text style={styles.price}>${listing.price} night</Text>
                </View>
            ))}
        </ScrollView>
    </SafeAreaView>



      );
};

const styles = StyleSheet.create({
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 16,


    },
    navContainer: {
        height: 130

    },
    filterBtn: {
        padding: 10,
        borderWidth: 1,
        borderColor: "Black",
        borderRadius: 24,
        marginRight: 10,

    },
    searchBtn: {
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderColor: '#c2c2c2',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 30,
        backgroundColor: '#fff',
        elevation: 4,
        padding: 14,
        shadowColor: 'black',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        width: 310,
        height: 70,
        shadowOffset: {
            width: 1,
            height: 1,
        },

    },
    safeArea: {
        backgroundColor: 'white',
    },
    searchBar: {
        height: 40,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white',
        borderRadius: 20,
        paddingLeft: 10,
        paddingBottom: 10,
        marginBottom: 20

    },
    container: {
      paddingTop: 10,
      backgroundColor: '#fff',
    },
    listingContainer: {
      marginBottom: 30,
      padding: 10,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 5,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 5,
    },
    location: {
      color: 'gray',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 5,
    },
    rating: {
      backgroundColor: 'lightgray',
      padding: 5,
      borderRadius: 5,
    },
    host: {
      color: 'gray',
    },
    dates: {
      color: 'gray',
      marginTop: 5,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 5,
    },
  });


export default Explore;
