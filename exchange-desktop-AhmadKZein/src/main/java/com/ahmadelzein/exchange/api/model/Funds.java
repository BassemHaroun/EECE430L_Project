package com.ahmadelzein.exchange.api.model;
import com.google.gson.annotations.SerializedName;

public class Funds {
    @SerializedName("usd_amount")
    public Float usdAmount;
    @SerializedName("lbp_amount")
    public Float lbpAmount;

    public Funds(Float usdAmount, Float lbpAmount) {
        this.usdAmount = usdAmount;
        this.lbpAmount = lbpAmount;
    }
}
