package com.example.sportnavigator.Utils.Excetions;

public class UserNotVerifiedException extends RuntimeException{
    public UserNotVerifiedException(String msg){
        super(msg);
    }
}
