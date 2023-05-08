package com.ahmadelzein.exchange.api.model;
import com.google.gson.annotations.SerializedName;

public class Range {
    @SerializedName("start_range")
    public Integer range;

    public Range(Integer range) {
        this.range = range;
    }
}
