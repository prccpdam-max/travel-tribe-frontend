import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";
import { theme } from "../styles/theme";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import FeedScreen from "../screens/feed/FeedScreen";
import CreatePostScreen from "../screens/feed/CreatePostScreen";
import ReviewsScreen from "../screens/reviews/ReviewsScreen";
import CreateReviewScreen from "../screens/reviews/CreateReviewScreen";
import GroupsScreen from "../screens/groups/GroupsScreen";
import GroupDetailsScreen from "../screens/groups/GroupDetailsScreen";
import BuddyFinderScreen from "../screens/buddy/BuddyFinderScreen";
import CreateBuddyPostScreen from "../screens/buddy/CreateBuddyPostScreen";
import MapExplorerScreen from "../screens/map/MapExplorerScreen";
import ConversationsScreen from "../screens/messages/ConversationsScreen";
import ChatScreen from "../screens/messages/ChatScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const FeedStack = createNativeStackNavigator();
const GroupStack = createNativeStackNavigator();
const BuddyStack = createNativeStackNavigator();
const MessageStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const stackStyle = {
  headerStyle: { backgroundColor: theme.colors.background },
  headerTintColor: theme.colors.textOnDark,
  headerTitleStyle: { fontWeight: "700" },
  contentStyle: { backgroundColor: theme.colors.background },
};

const LoadingScreen = () => (
  <View style={styles.loadingWrap}>
    <ActivityIndicator size="large" color={theme.colors.accent} />
    <Text style={styles.loadingText}>Loading Travel Tribe...</Text>
  </View>
);

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={stackStyle}>
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: "Create Account" }} />
  </AuthStack.Navigator>
);

const FeedNavigator = () => (
  <FeedStack.Navigator screenOptions={stackStyle}>
    <FeedStack.Screen name="FeedHome" component={FeedScreen} options={{ title: "Travel Feed" }} />
    <FeedStack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: "New Post" }} />
    <FeedStack.Screen name="Reviews" component={ReviewsScreen} options={{ title: "Place Reviews" }} />
    <FeedStack.Screen name="CreateReview" component={CreateReviewScreen} options={{ title: "Write Review" }} />
    <FeedStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Notifications" }} />
  </FeedStack.Navigator>
);

const GroupNavigator = () => (
  <GroupStack.Navigator screenOptions={stackStyle}>
    <GroupStack.Screen name="GroupsHome" component={GroupsScreen} options={{ title: "Travel Groups" }} />
    <GroupStack.Screen name="GroupDetails" component={GroupDetailsScreen} options={{ title: "Group" }} />
  </GroupStack.Navigator>
);

const BuddyNavigator = () => (
  <BuddyStack.Navigator screenOptions={stackStyle}>
    <BuddyStack.Screen name="BuddyHome" component={BuddyFinderScreen} options={{ title: "Buddy Finder" }} />
    <BuddyStack.Screen name="CreateBuddyPost" component={CreateBuddyPostScreen} options={{ title: "New Buddy Post" }} />
  </BuddyStack.Navigator>
);

const MessageNavigator = () => (
  <MessageStack.Navigator screenOptions={stackStyle}>
    <MessageStack.Screen
      name="Conversations"
      component={ConversationsScreen}
      options={{ title: "Messages" }}
    />
    <MessageStack.Screen name="Chat" component={ChatScreen} options={{ title: "Chat" }} />
  </MessageStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={stackStyle}>
    <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: "Profile" }} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Edit Profile" }} />
  </ProfileStack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "#0B202C",
        borderTopColor: "#21495E",
        paddingBottom: 6,
        height: 66,
      },
      tabBarActiveTintColor: theme.colors.accent,
      tabBarInactiveTintColor: "#8CB2C4",
      tabBarIcon: ({ color, size }) => {
        const iconMap = {
          Feed: "earth",
          Map: "map",
          Groups: "people",
          Buddy: "compass",
          Messages: "chatbubbles",
          Profile: "person-circle",
        };

        const name = iconMap[route.name] || "ellipse";
        return <Ionicons name={name} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Feed" component={FeedNavigator} />
    <Tab.Screen name="Map" component={MapExplorerScreen} />
    <Tab.Screen name="Groups" component={GroupNavigator} />
    <Tab.Screen name="Buddy" component={BuddyNavigator} />
    <Tab.Screen name="Messages" component={MessageNavigator} />
    <Tab.Screen name="Profile" component={ProfileNavigator} />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="Main" component={MainTabs} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: theme.colors.textOnDark,
    fontSize: 16,
  },
});

export default RootNavigator;
