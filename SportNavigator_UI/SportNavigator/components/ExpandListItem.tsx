import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutChangeEvent,
} from "react-native";
import { ListItemType } from "./getData";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


export const CollapsableContainer = ({
  children,
  expanded,
}: {
  children: React.ReactNode;
  expanded: boolean;
}) => {
  const [height, setHeight] = useState(0);
  const animatedHeight = useSharedValue(0);

  const onLayout = (event: LayoutChangeEvent) => {
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

    const userUrl = 'https://3q55nqgg-8080.euw.devtunnels.ms/api/users/'+item.UserId;

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



  const onItemPress = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.wrap}>
      <TouchableWithoutFeedback onPress={onItemPress}>
            <View style={styles.container}>
                  {user && user.image && user.image.data ? (
                  <Image
                    source={{ uri: `data:${user.image.mime};base64,${user.image.data}` }}
                    style={styles.image}
                  />
                  ) : (
                    <View style={styles.imagePlaceholder} />
                  )}
                <View style={{flex: 1}}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.name}</Text>
                    {!expanded && <MaterialIcons name="expand-more" size={40} color="black" />}
                    {expanded && <MaterialIcons name="expand-less" size={40} color="black" />}
                </View>
                  <View style={{gap: 10, flexDirection: 'row',paddingLeft: 20 }}>
                    <Ionicons name="time-outline" size={20} color="black" />
                    <Text style={{fontFamily: 'pop'}}>{item.event_time.replace('T', '  |  ')}</Text>
                  </View>
                </View>
            </View>
      </TouchableWithoutFeedback>
      
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
    paddingHorizontal: 20, paddingTop: 10,
    alignItems: 'center',
    },
  details: { 
    margin: 10 
    },
  title: { 
    fontFamily: 'pop-b', 
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