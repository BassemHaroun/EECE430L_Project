package com.ahmadelzein.exchange.transactions;
import com.ahmadelzein.exchange.Authentication;
import com.ahmadelzein.exchange.api.ExchangeService;
import com.ahmadelzein.exchange.api.model.Funds;
import com.ahmadelzein.exchange.api.model.Stats;
import com.ahmadelzein.exchange.api.model.Transaction;
import com.ahmadelzein.exchange.api.model.User;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import java.net.URL;
import java.time.LocalDate;
import java.util.List;
import java.util.ResourceBundle;
public class Transactions implements Initializable {
    public TableColumn lbpAmount;
    public TableColumn usdAmount;
    public TableColumn transactionDate;
    public TextField lbpTextField;
    public TextField usdTextField;
    public Label usd_current;
    public Label lbp_current;
    public TableView tableView;
    public Label usd_wallet;
    public Label lbp_wallet;

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        lbpAmount.setCellValueFactory(new
                PropertyValueFactory<Transaction, Long>("lbpAmount"));
        usdAmount.setCellValueFactory(new
                PropertyValueFactory<Transaction, Long>("usdAmount"));
        transactionDate.setCellValueFactory(new
                PropertyValueFactory<Transaction, String>("addedDate"));
        ExchangeService.exchangeApi().getTransactions("Bearer " +
                        Authentication.getInstance().getToken())
                .enqueue(new Callback<List<Transaction>>() {
                    @Override
                    public void onResponse(Call<List<Transaction>> call, Response<List<Transaction>> response) {
                        tableView.getItems().setAll(response.body());
                    }

                    @Override
                    public void onFailure(Call<List<Transaction>> call, Throwable throwable) {

                    }
                });
    }
    public void addFunds() {
        Float usd = 0.0f;
        Float lbp = 0.0f;
        if( usdTextField.getText() != ""){
            usd = Float.parseFloat(usdTextField.getText());
        }
        if(lbpTextField.getText() != ""){
            lbp = Float.parseFloat(lbpTextField.getText());
        }
        Funds funds = new Funds(usd, lbp);
        String userToken = Authentication.getInstance().getToken();
        String authHeader = userToken != null ? "Bearer " + userToken : null;
        ExchangeService.exchangeApi().addFunds(funds,authHeader).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                User user = response.body();
                Platform.runLater(() -> {
                    usdTextField.setText("");
                    lbpTextField.setText("");
                });
            }
            @Override
            public void onFailure(Call<User> call, Throwable throwable){

            }
        });
    }

  //  private void fetchWallet() {
    //    ExchangeService.exchangeApi().getWallet().enqueue(new Callback<Transaction>() {
      //      @Override
        //    public void onResponse(Call<Transaction> call, Response<Transaction> response) {
          //      Transaction transactions = response.body();
            //    Platform.runLater(() -> {
              //      usd_wallet.setText(transactions.usd_wallet.toString());
                //    lbp_wallet.setText(transactions.lbp_wallet.toString());
               // });
            //}
            //@Override
           // public void onFailure(Call<Transaction> call, Throwable throwable) {

            //}
        //});

    //}
}