import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { auth } from "./src/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoginScreen from "./src/screens/LoginScreen";
import FeedScreen from "./src/screens/FeedScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import MapScreen from "./src/screens/MapScreen";
import MessagesScreen from "./src/screens/MessagesScreen";
import ChatScreen from "./src/screens/ChatScreen";
import GroupsScreen from "./src/screens/GroupsScreen";
import GroupChatScreen from "./src/screens/GroupChatScreen";
import AIAssistantScreen from "./src/screens/AIAssistantScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function GroupsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GroupsList" component={GroupsScreen} />
      <Stack.Screen name="GroupChat" component={GroupChatScreen} />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesList" component={MessagesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: "#1A1735", borderTopColor: "#2A2450" }, tabBarActiveTintColor: "#7B9FFF", tabBarInactiveTintColor: "#A0A0B0" }}>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Explore" component={MapScreen} />
      <Tab.Screen name="AI" component={AIAssistantScreen} />
      <Tab.Screen name="Groups" component={GroupsStack} />
      <Tab.Screen name="Messages" component={MessagesStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return unsub;
  }, []);

  if (loading) return <View style={{ flex: 1, backgroundColor: "#0D0B1E", justifyContent: "center", alignItems: "center" }}><ActivityIndicator color="#7B9FFF" size="large" /></View>;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? <Stack.Screen name="Main" component={MainTabs} /> : <Stack.Screen name="Login" component={LoginScreen} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
