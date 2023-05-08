package com.ahmadelzein.exchange.api.model;

import com.google.gson.annotations.SerializedName;

public class User {
    @SerializedName("id")
    Integer id;
    @SerializedName("user_name")
    String username;
    @SerializedName("password")
    String password;
    @SerializedName("usd_amount")
    public Float usdamount;
    @SerializedName("lbp_amount")
    public Float lbpamount;
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}