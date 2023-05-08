package com.ahmadelzein.exchange.rates;

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

public class Rates {
    public Label buyUsdRateLabel;
    public Label sellUsdRateLabel;
    public TextField lbpTextField;
    public TextField usdTextField;
    public ToggleGroup transactionType;
    private ExchangeRates exchangeRates;
    public void initialize() {
        fetchRates();
    }
    @FXML
    private void fetchRates() {
        ExchangeService.exchangeApi().getExchangeRates().enqueue(new Callback<ExchangeRates>() {
            @Override
            public void onResponse(Call<ExchangeRates> call, Response<ExchangeRates> response) {
                exchangeRates = response.body();
            Platform.runLater(() -> {
                buyUsdRateLabel.setText(exchangeRates.lbpToUsd.toString());
                sellUsdRateLabel.setText(exchangeRates.usdToLbp.toString());
            });
        }
        @Override
        public void onFailure(Call<ExchangeRates> call, Throwable throwable) {

        }
    });
    }
    public void addTransaction(ActionEvent actionEvent) {
        Float usd = 0.0f;
        Float lbp = 0.0f;
        if( usdTextField.getText() != ""){
            System.out.println(usdTextField.getText());
            usd = Float.parseFloat(usdTextField.getText());
        }
        if(lbpTextField.getText() != ""){
            lbp = Float.parseFloat(lbpTextField.getText());
        }
        Boolean type = ((RadioButton) transactionType.getSelectedToggle()).getText().equals("Sell USD");
        if(usd==0){
            usd = lbp/exchangeRates.lbpToUsd;
        } else if (lbp == 0){
            lbp = usd*exchangeRates.usdToLbp;
        }
        Transaction transaction = new Transaction(usd, lbp, type);
        String userToken = Authentication.getInstance().getToken();
        String authHeader = userToken != null ? "Bearer " + userToken : null;
        ExchangeService.exchangeApi().addTransaction(transaction,authHeader).enqueue(new Callback<Object>() {
            @Override
            public void onResponse(Call<Object> call, Response<Object> response) {
                fetchRates();
                Platform.runLater(() -> {
                    usdTextField.setText("");
                    lbpTextField.setText("");
                });
            }
            @Override
            public void onFailure(Call<Object> call, Throwable throwable){

            }
        });

    }
}