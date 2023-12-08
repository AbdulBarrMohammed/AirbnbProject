import {NavigationContainer} from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Profile from './app/screens/Profile';
import Explore from './app/screens/Explore';
import Inbox from './app/screens/Inbox';
import Trips from './app/screens/Trips';
import Details from './app/screens/Details'
import Wishlists from './app/screens/Wishlists';
import { Ionicons } from '@expo/vector-icons'
import CreateAccount from './app/screens/CreateAccount';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Tab Bottom
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function TabGroup() {
    return (
        <Tab.Navigator
            screenOptions={({route, navigation}) => ({
                tabBarIcon: ({color, focused, size}) => {
                    let iconName;
                    if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    }else if (route.name === "Inbox") {
                        iconName = focused ? "mail" : "mail-outline";
                    }
                    else if (route.name === "Wishlists") {
                        iconName = focused ? "heart" : "heart-outline";
                    }
                    else if (route.name === "Explore") {
                        iconName = focused ? "search" : "search-outline";
                    }
                    //
                    return <Ionicons name={iconName} size={size} color={color} />

                },
                tabBarActiveTintColor: "#E1306C"
            })}
            >
            <Tab.Screen name="Profile" component={Profile}/>
            <Tab.Screen name="Explore" component={Explore}/>
            <Tab.Screen name="Inbox" component={Inbox}/>
            <Tab.Screen name="Trips" component={Trips}/>
            <Tab.Screen name="Wishlists" component={Wishlists}/>
        </Tab.Navigator>
    )
}

function MyStack() {
    return (
        <Stack.Navigator initialRouteName="MainApp">
        <Stack.Screen name="MainApp" component={TabGroup} options={{ headerShown: false }} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="Explore" component={Explore} />
        <Stack.Screen name="Details" component={Details} />



      </Stack.Navigator>
    );
  }

export default function Navigation() {
    return (
        <NavigationContainer>
            <MyStack />

        </NavigationContainer>
    )

}
