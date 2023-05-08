package com.ahmadelzein.exchange.api;
import com.ahmadelzein.exchange.api.model.*;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

import java.util.List;

public interface Exchange {
    @POST("/user")
    Call<User> addUser(@Body User user);
    @POST("/authentication")
    Call<Token> authenticate(@Body User user);
    @GET("/exchangeRateStats")
    Call<Stats> getStats();
    @POST("/graph")
    Call<List<Grph>> getGraph(@Body Range range);
    @GET("/exchangeRate")
    Call<ExchangeRates> getExchangeRates();
    @POST("/trans")
    Call<Object> addTransaction(@Body Transaction transaction,
                                @Header("Authorization") String authorization);
    @POST("/addFunds")
    Call<User> addFunds(@Body Funds funds,
                                @Header("Authorization") String authorization);
    @POST("/accept")
    Call<Object> acceptTransaction(@Body Transaction_id id,
                                @Header("Authorization") String authorization);

    @GET("/trans")
    Call<List<Transaction>> getTransactions(@Header("Authorization")
                                                    String authorization);
    @GET("/pending")
    Call<List<Pending>> getPending();

    @GET("/user")
    Call<Object> getWallet();
}