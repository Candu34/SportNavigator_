package com.example.sportnavigator.Utils.Excetions;

public class ReviewNotFoundException extends RuntimeException{
    public ReviewNotFoundException (String msg) {
        super(msg);
    }
}
