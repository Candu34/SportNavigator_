import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { API_URL } from "@/constants/api_url";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import Colors from "@/constants/Colors";

const EventDetailsPage = () => {
  const params = useLocalSearchParams();
  const eventId = params.id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
        }
      } catch (e) {
        console.error("Failed to fetch user ID:", e);
        Alert.alert("Error", "Could not retrieve user information.");
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) fetchEvent();
  }, [eventId, userId]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/events/${eventId}`);
      setEvent(response.data);
      if (response.data.participantsIds && Array.isArray(response.data.participantsIds)) {
        setIsParticipant(response.data.participantsIds.includes(Number(userId)));
      } else {
        setIsParticipant(false);
      }
    } catch (err) {
      Alert.alert("Error", "Could not load event.");
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async () => {
    setJoining(true);
    try {
      await axios.post(`${API_URL}/events/join/${eventId}`, null, { params: { userId } });
      fetchEvent();
    } catch {
      Alert.alert("Error", "Could not join event.");
    } finally {
      setJoining(false);
    }
  };

  const leaveEvent = async () => {
    setJoining(true);
    try {
      await axios.post(`${API_URL}/events/leave/${eventId}`, null, { params: { userId } });
      fetchEvent();
    } catch {
      Alert.alert("Error", "Could not leave event.");
    } finally {
      setJoining(false);
    }
  };

  if (loading || !event) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const currentCount = event.participants ?? 0;
  const maxCount = event.maxParticipants ?? 0;
  const isFull = currentCount >= maxCount;

  return (
    <View style={styles.bg}>
      <View style={styles.ticketCard}>
        <Text style={styles.eventTitle}>{event.name}</Text>
        <Text style={styles.eventDesc}>{event.description}</Text>
        <Text style={styles.label}>Event time</Text>
        <View style={styles.timeRow}>
          <Text style={styles.timeBlock}>
            {event.event_time?.replace('T', ' ').substring(0, 16)}
          </Text>
        </View>
        <Text style={styles.participants}>
          {currentCount} / {maxCount} participants
        </Text>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.actionBtn, (isParticipant || isFull || joining) && styles.disabledBtn]}
            onPress={joinEvent}
            disabled={isParticipant || isFull || joining}
          >
            <Text style={styles.actionBtnText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, (!isParticipant || joining) && styles.disabledBtn]}
            onPress={leaveEvent}
            disabled={!isParticipant || joining}
          >
            <Text style={styles.actionBtnText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#FFF8F6",
    justifyContent: "center",
    alignItems: "center"
  },
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 28,
    minWidth: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 9,
    marginVertical: 30,
    borderWidth: 1.5,
    borderColor: Colors.primary
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 6,
    textAlign: "center"
  },
  eventDesc: {
    fontSize: 16,
    color: Colors.grey,
    marginBottom: 15,
    textAlign: "center"
  },
  label: {
    fontSize: 12,
    color: Colors.grey,
    marginTop: 4,
    marginBottom: 2,
    fontWeight: "bold",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 9,
    marginTop: 0
  },
  timeBlock: {
    fontSize: 17,
    backgroundColor: "#FFF4EF",
    borderRadius: 13,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 6,
    color: Colors.dark,
    fontWeight: "600",
    letterSpacing: 0.2,
    borderWidth: 1,
    borderColor: Colors.primary
  },
  participants: {
    fontSize: 15,
    color: Colors.primary,
    marginVertical: 10,
    fontWeight: "600"
  },
  btnRow: {
    flexDirection: "row",
    gap: 22,
    marginTop: 10,
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center"
  },
  disabledBtn: {
    backgroundColor: "#FFD6C4"
  }
});

export default EventDetailsPage;
