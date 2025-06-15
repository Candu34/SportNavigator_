import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import axios from "axios";
import { API_URL } from "@/constants/api_url";
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from 'expo-secure-store';

const EventDetailsPage = () => {
    const params = useLocalSearchParams();
    const eventId = params.id;
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [userId, setUserId] = useState(null);

   useEffect(() => {
               const fetchUserId = async () => {
                   try {
                       const userData = await SecureStore.getItemAsync('user');
                       if (!userData) {
                           throw new Error("[viewEvent] User not found in storage");
                       }
       
                       const user = JSON.parse(userData);
                       if (!user.id) {
                           throw new Error("[viewEvent] Invalid user data");
                       }
       
                       setUserId(user.id);
                   } catch (error) {
                       console.error("[viewEvent] Error fetching user ID:", error);
                   }
               };
       
               fetchUserId();
           }, []);



    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const fetchEvent = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/events/${eventId}`, {
                params: { userId }
            });
            setEvent(response.data);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const joinEvent = async () => {
        setJoining(true);
        try {
            await axios.post(`${API_URL}/events/join/${eventId}`, null, {
                params: { userId }
            });
            fetchEvent();
        } catch (err) {
            // handle error
        } finally {
            setJoining(false);
        }
    };

    const leaveEvent = async () => {
        setJoining(true);
        try {
            await axios.post(`${API_URL}/events/leave/${eventId}`, null, {
                params: { userId }
            });
            fetchEvent();
        } catch (err) {
        } finally {
            setJoining(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" />;

    if (!event) return <Text>Error loading event</Text>;

    const isFull = event.currentParticipants >= event.maxParticipants;

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 22 }}>{event.name}</Text>
            <Text style={{ marginVertical: 12 }}>{event.description}</Text>
            <Text>
                Participants: {event.currentParticipants}/{event.maxParticipants}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Button
                    title="+"
                    onPress={joinEvent}
                    disabled={event.isParticipant || isFull || joining}
                />
                <View style={{ width: 20 }} />
                <Button
                    title="-"
                    onPress={leaveEvent}
                    disabled={!event.isParticipant || joining}
                />
            </View>
        </View>
    );
};

export default EventDetailsPage;
