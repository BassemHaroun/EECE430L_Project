package com.ahmadelzein.exchange.statistics;

import com.ahmadelzein.exchange.api.ExchangeService;
import com.ahmadelzein.exchange.api.model.Stats;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.DatePicker;
import javafx.scene.control.Label;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.time.LocalDate;

public class Statistics {
    public DatePicker start_date;
    public DatePicker end_date;
    public DatePicker datePicker;
    public Label usd_to_lbp_avg;
    public Label usd_to_lbp_min;
    public Label usd_to_lbp_max;
    public Label usd_to_lbp_median;
    public Label lbp_to_usd_avg;
    public Label lbp_to_usd_min;
    public Label lbp_to_usd_max;
    public Label lbp_to_usd_median;
    public Label usd_to_lbp_var;
    public Label lbp_to_usd_var;
    public Label usd_to_lbp_stddev;
    public Label lbp_to_usd_stddev;



    public void initialize() {
        fetchStats();
    }
    @FXML
    private void fetchStats() {
        ExchangeService.exchangeApi().getStats().enqueue(new Callback<Stats>() {

            //https://www.geeksforgeeks.org/javafx-datepicker-with-examples/
            @Override
            public void onResponse(Call<Stats> call, Response<Stats> response) {
                Stats statistics = response.body();
                Platform.runLater(() -> {
                    LocalDate start_date= datePicker.getValue();
                    LocalDate end_date= datePicker.getValue();
                    LocalDate selectedDate= datePicker.getValue();
                    usd_to_lbp_avg.setText(statistics.usd_to_lbp_avg.toString());
                    usd_to_lbp_min.setText(statistics.usd_to_lbp_min.toString());
                    usd_to_lbp_max.setText(statistics.usd_to_lbp_max.toString());
                    usd_to_lbp_median.setText(statistics.usd_to_lbp_median.toString());
                    usd_to_lbp_median.setText(statistics.lbp_to_usd_median.toString());
                    lbp_to_usd_avg.setText(statistics.lbp_to_usd_avg.toString());
                    lbp_to_usd_min.setText(statistics.lbp_to_usd_min.toString());
                    lbp_to_usd_max.setText(statistics.lbp_to_usd_max.toString());
                    usd_to_lbp_var.setText(statistics.usd_to_lbp_var.toString());
                    lbp_to_usd_var.setText(statistics.lbp_to_usd_var.toString());
                    usd_to_lbp_stddev.setText(statistics.usd_to_lbp_stddev.toString());
                    lbp_to_usd_stddev.setText(statistics.lbp_to_usd_stddev.toString());
                });
            }
            @Override
            public void onFailure(Call<Stats> call, Throwable throwable) {

            }
        });
    }

}