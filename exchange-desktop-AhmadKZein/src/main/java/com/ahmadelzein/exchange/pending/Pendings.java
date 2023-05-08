package com.ahmadelzein.exchange.pending;
import com.ahmadelzein.exchange.Authentication;
import com.ahmadelzein.exchange.OnPageCompleteListener;
import com.ahmadelzein.exchange.PageCompleter;
import com.ahmadelzein.exchange.Parent;
import com.ahmadelzein.exchange.rates.Rates;
import com.ahmadelzein.exchange.rates.Rates.*;
import com.ahmadelzein.exchange.api.ExchangeService;
import com.ahmadelzein.exchange.api.model.Pending;
import com.ahmadelzein.exchange.api.model.Transaction_id;
import javafx.event.ActionEvent;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.BorderPane;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.ResourceBundle;

public class Pendings implements Initializable {
    public TableColumn lbpAmount;
    public TableColumn usdAmount;
    public TableColumn transactionDate;
    public TableView tableView;

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        lbpAmount.setCellValueFactory(new
                PropertyValueFactory<Pending, Long>("lbpAmount"));
        usdAmount.setCellValueFactory(new
                PropertyValueFactory<Pending, Long>("usdAmount"));
        transactionDate.setCellValueFactory(new
                PropertyValueFactory<Pending, String>("addedDate"));

        ExchangeService.exchangeApi().getPending().enqueue(new Callback<List<Pending>>() {
                    @Override
                    public void onResponse(Call<List<Pending>> call, Response<List<Pending>> response) {
                        tableView.getItems().setAll(response.body());
                    }

                    @Override
                    public void onFailure(Call<List<Pending>> call, Throwable throwable) {

                    }
                });
    }

    public void accept(ActionEvent actionEvent) {
        Pending pend = (Pending) tableView.getSelectionModel().getSelectedItem();
        Transaction_id trans = new Transaction_id(pend.getId());
        String userToken = Authentication.getInstance().getToken();
        String authHeader = userToken != null ? "Bearer " + userToken : null;
        ExchangeService.exchangeApi().acceptTransaction(trans,authHeader).enqueue(new Callback<Object>() {
            @Override
            public void onResponse(Call<Object> call, Response<Object> response) {
                ExchangeService.exchangeApi().getPending().enqueue(new Callback<List<Pending>>() {
                    @Override
                    public void onResponse(Call<List<Pending>> call, Response<List<Pending>> response) {
                        tableView.getItems().setAll(response.body());
                    }

                    @Override
                    public void onFailure(Call<List<Pending>> call, Throwable throwable) {

                    }
                });

            }
            @Override
            public void onFailure(Call<Object> call, Throwable throwable){

            }
        });
    }
}