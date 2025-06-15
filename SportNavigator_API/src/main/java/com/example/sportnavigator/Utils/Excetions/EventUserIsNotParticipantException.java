package com.example.sportnavigator.Utils.Excetions;

public class EventUserIsNotParticipantException extends RuntimeException{
    public EventUserIsNotParticipantException(String msg){
        super(msg);
    }
}
