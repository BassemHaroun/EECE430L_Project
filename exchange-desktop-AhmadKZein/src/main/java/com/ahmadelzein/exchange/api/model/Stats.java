package com.ahmadelzein.exchange.api.model;

import com.google.gson.annotations.SerializedName;

public class Stats {
    @SerializedName("start_date")
    public String start_date;
    @SerializedName("end_date")
    public String end_date;
    @SerializedName("usd_to_lbp_avg")
    public Float usd_to_lbp_avg;
    @SerializedName("usd_to_lbp_min")
    public Float usd_to_lbp_min;
    @SerializedName("usd_to_lbp_max")
    public Float usd_to_lbp_max;
    @SerializedName("usd_to_lbp_median")
    public Float usd_to_lbp_median;
    @SerializedName("lbp_to_usd_median")
    public Float lbp_to_usd_median;
    @SerializedName("lbp_to_usd_avg")
    public Float lbp_to_usd_avg;
    @SerializedName("lbp_to_usd_min")
    public Float lbp_to_usd_min;
    @SerializedName("lbp_to_usd_max")
    public Float lbp_to_usd_max;
    @SerializedName("usd_to_lbp_var")
    public Float usd_to_lbp_var;
    @SerializedName("lbp_to_usd_var")
    public Float lbp_to_usd_var;
    @SerializedName("usd_to_lbp_stddev")
    public Float usd_to_lbp_stddev;
    @SerializedName("lbp_to_usd_stddev")
    public Float lbp_to_usd_stddev;
}
