package com.example.sportnavigator.Utils.Excetions;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException (String msg) {
        super(msg);
    }
}
