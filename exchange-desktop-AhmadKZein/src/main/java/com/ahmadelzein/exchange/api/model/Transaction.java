package com.ahmadelzein.exchange.api.model;
import com.google.gson.annotations.SerializedName;

public class Transaction {
    @SerializedName("usd_amount")
    Float usdAmount;
    @SerializedName("lbp_amount")
    Float lbpAmount;
    @SerializedName("usd_to_lbp")
    Boolean usdToLbp;
    @SerializedName("id")
    Integer id;
    @SerializedName("added_date")
    String addedDate;
    @SerializedName("user_id_buy")
    String useridbuy;
    @SerializedName("user_id_sell")
    String useridsell;

    @SerializedName("usd_wallet")
    Float usd_wallet;

    @SerializedName("lbp_wallet")
    Float lbp_wallet;
    public Transaction(Float usdAmount, Float lbpAmount, Boolean usdToLbp) {
        this.usdAmount = usdAmount;
        this.lbpAmount = lbpAmount;
        this.usdToLbp = usdToLbp;
    }

    public Float getUsdAmount() {
        return usdAmount;
    }

    public Float getLbpAmount() {
        return lbpAmount;
    }

    public Boolean getUsdToLbp() {
        return usdToLbp;
    }

    public Integer getId() {
        return id;
    }

    public String getAddedDate() {
        return addedDate;
    }
    public Float usd_wallet() {return usd_wallet;}
    public Float lbp_wallet(){return lbp_wallet;}
}
