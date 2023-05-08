package com.ahmadelzein.exchange.calculator;

import com.ahmadelzein.exchange.Authentication;
import com.ahmadelzein.exchange.api.ExchangeService;
import com.ahmadelzein.exchange.api.model.ExchangeRates;
import com.ahmadelzein.exchange.api.model.Transaction;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.RadioButton;
import javafx.scene.control.TextField;
import javafx.scene.control.ToggleGroup;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Calculator {
    public String buyUsdRateLabel;
    public String sellUsdRateLabel;
    public TextField lbpTextField;
    public TextField usdTextField;
    public ToggleGroup calcType;
    public void initialize() {
        fetchRates();
    }
    @FXML
    private void fetchRates() {
        ExchangeService.exchangeApi().getExchangeRates().enqueue(new Callback<ExchangeRates>() {
            @Override
            public void onResponse(Call<ExchangeRates> call, Response<ExchangeRates> response) {
                ExchangeRates exchangeRates = response.body();
                Platform.runLater(() -> {
                    buyUsdRateLabel = (exchangeRates.lbpToUsd.toString());
                    sellUsdRateLabel = (exchangeRates.usdToLbp.toString());
                });
            }
            @Override
            public void onFailure(Call<ExchangeRates> call, Throwable throwable) {

            }
        });
    }
    public void calculate(){
        if (usdTextField.getText() == "" && lbpTextField.getText() == ""){
            return;
        } else if (usdTextField.getText() == ""){
            float amount_lbp = Float.parseFloat(lbpTextField.getText());
            if(((RadioButton) calcType.getSelectedToggle()).getText().equals("Sell USD")){
                usdTextField.setText(Float.toString(amount_lbp/Float.parseFloat(sellUsdRateLabel)));
            } else if(((RadioButton) calcType.getSelectedToggle()).getText().equals("Buy USD")){
                    usdTextField.setText(Float.toString(amount_lbp/Float.parseFloat(buyUsdRateLabel)));
            }
        } else {
                float amount_usd = Float.parseFloat(usdTextField.getText());
                if(((RadioButton) calcType.getSelectedToggle()).getText().equals("Sell USD")){
                    lbpTextField.setText(Float.toString(amount_usd*Float.parseFloat(sellUsdRateLabel)));
                } else if(((RadioButton) calcType.getSelectedToggle()).getText().equals("Buy USD")){
                        lbpTextField.setText(Float.toString(amount_usd*Float.parseFloat(buyUsdRateLabel)));
                    }
            }



    }
}