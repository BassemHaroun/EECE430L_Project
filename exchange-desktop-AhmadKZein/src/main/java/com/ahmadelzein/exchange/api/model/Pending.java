package com.ahmadelzein.exchange.api.model;
import com.google.gson.annotations.SerializedName;
import javafx.scene.control.Button;

public class Pending {
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
    Integer useridbuy;

    public Pending(Float usdAmount, Float lbpAmount, Boolean usdToLbp)
    {
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

    public Integer getUserID() {
        return useridbuy;
    }
}
