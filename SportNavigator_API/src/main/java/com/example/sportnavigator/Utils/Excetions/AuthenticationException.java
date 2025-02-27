package com.example.sportnavigator.Utils.Excetions;

public class AuthenticationException extends RuntimeException{
    public AuthenticationException(String msg){
        super(msg);
    }
}
