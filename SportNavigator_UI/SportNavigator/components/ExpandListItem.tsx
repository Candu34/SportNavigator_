import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutChangeEvent,
  Alert,
  Linking,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Colors from "@/constants/Colors";

// Include the CollapsableContainer in the same file
const CollapsableContainer = ({
  children,
  expanded,
}) => {
  const [height, setHeight] = useState(0);
  const animatedHeight = useSharedValue(0);

  const onLayout = (event) => {
    const onLayoutHeight = event.nativeEvent.layout.height;

    if (onLayoutHeight > 0 && height !== onLayoutHeight) {
      setHeight(onLayoutHeight);
    }
  };

  const collapsableStyle = useAnimatedStyle(() => {
    animatedHeight.value = expanded ? withTiming(height) : withTiming(0);

    return {
      height: animatedHeight.value,
    };
  }, [expanded]);

  return (
    <Animated.View style={[collapsableStyle, { overflow: "hidden" }]}>
      <View style={{ position: "absolute" }} onLayout={onLayout}>
        {children}
      </View>
    </Animated.View>
  );
};

export const ListItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const rotateIcon = useSharedValue(0);

  const userUrl = `/users/${item.UserId}`;

  const fetchItems = async () => {
      try {
          console.log(userUrl)
          const response = await fetch(userUrl);
          const responseJson = await response.json();
          setUser(responseJson);
      } catch (error) {
          console.error("Error fetching user:", error);
      }
  };

  useEffect(() => {
      fetchItems();
  }, [item]);

  const toggleExpand = () => {
      setExpanded(!expanded);
      rotateIcon.value = withTiming(expanded ? 0 : 1, { duration: 300 });
  };

  const iconAnimatedStyle = useAnimatedStyle(() => {
      const rotation = rotateIcon.value * 180;
      return {
          transform: [{ rotate: `${rotation}deg` }]
      };
  });

  const addEventToCalendar = async () => {
    try {
      // Parse the event time
      const eventDateTime = new Date(item.event_time);
      
      // Calculate end time (1 hour after start time)
      const endDateTime = new Date(eventDateTime);
      endDateTime.setHours(endDateTime.getHours() + 1);
      
      // Format dates for calendar URI
      const startDate = eventDateTime.toISOString().replace(/-|:|\.\d+/g, '');
      const endDate = endDateTime.toISOString().replace(/-|:|\.\d+/g, '');
      
      const eventTitle = encodeURIComponent(item.name);
      const eventDescription = encodeURIComponent(item.description || 'No description provided');
      
      // Use Google Calendar as it works on all platforms
      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDate}/${endDate}&details=${eventDescription}`;
      
      const supported = await Linking.canOpenURL(googleCalUrl);
      
      if (supported) {
        await Linking.openURL(googleCalUrl);
      } else {
        Alert.alert(
          "Calendar Error",
          "Could not open calendar. Please try again or add the event manually.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      Alert.alert(
        "Calendar Error",
        "Could not open calendar. Please try again or add the event manually.",
        [{ text: "OK" }]
      );
    }
  };

  return (
      <View style={styles.wrap}>
          <View style={styles.container}>
              {user && user.image && user.image.data ? (
                  <Image
                      source={{ uri: `data:${user.image.mime};base64,${user.image.data.slice(16)}` }}
                      style={styles.image}
                  />
              ) : (
                  <View style={styles.imagePlaceholder} />
              )}
              <View style={{flex: 1}}>
                  <View style={styles.textContainer}>
                      <Text style={styles.title}>{item.name}</Text>
                      <TouchableWithoutFeedback onPress={toggleExpand}>
                          <Animated.View style={iconAnimatedStyle}>
                              <MaterialIcons name="expand-more" size={40} color="black" />
                          </Animated.View>
                      </TouchableWithoutFeedback>
                  </View>
                  <TouchableWithoutFeedback onPress={addEventToCalendar}>
                    <View style={styles.calendarContainer}>
                        <Ionicons name="calendar-outline" size={25} color={Colors.primary} />
                        <Text style={styles.calendarText}>
                          {item.event_time.replace('T', '  |  ')}
                        </Text>
                    </View>
                  </TouchableWithoutFeedback>
              </View>
          </View>
          
          <CollapsableContainer expanded={expanded}>
              <Text style={[styles.details, styles.description]}>{item.description}</Text>
          </CollapsableContainer>
      </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderColor: "#ccc",
    marginTop: 10,
    borderWidth: 1,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
  },
  container: { 
    flexDirection: "row" 
  },
  image: { 
    width: 50, 
    height: 50, 
    margin: 10, 
    borderRadius: 30 
  },
  textContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 10,
    alignItems: 'center',
  },
  calendarContainer: {
    gap: 10, 
    flexDirection: 'row', 
    paddingLeft: 20, 
    paddingBottom: 10,
    alignItems: 'center'
  },
  calendarText: {
    fontFamily: 'pop', 
    fontSize: 15, 
    color: Colors.primary,
  },
  details: { 
    margin: 10 
  },
  title: { 
    fontFamily: 'pop-b', 
    maxWidth: '80%',
    fontSize: 20 
  },
  description: {
    opacity: 0.7, 
    fontFamily: 'pop', 
    fontSize: 15
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    margin: 10,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
});