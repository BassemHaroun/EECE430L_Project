package com.ahmadelzein.exchange.register;

import com.ahmadelzein.exchange.Authentication;
import com.ahmadelzein.exchange.OnPageCompleteListener;
import com.ahmadelzein.exchange.PageCompleter;
import com.ahmadelzein.exchange.api.ExchangeService;
import com.ahmadelzein.exchange.api.model.Token;
import com.ahmadelzein.exchange.api.model.User;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.scene.control.TextField;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Register implements PageCompleter {
    public TextField usernameTextField;
    public TextField passwordTextField;
    private OnPageCompleteListener onPageCompleteListener;

    public void register(ActionEvent actionEvent) {
        User user = new User(usernameTextField.getText(),
                passwordTextField.getText());
        ExchangeService.exchangeApi().addUser(user).enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                ExchangeService.exchangeApi().authenticate(user).enqueue(new Callback<Token>() {
                    @Override
                    public void onResponse(Call<Token> call, Response<Token> response) {
                        Authentication.getInstance().saveToken(response.body().getToken());
                        Platform.runLater(() -> {onPageCompleteListener.onPageCompleted();});
                    }
                    @Override
                    public void onFailure(Call<Token> call, Throwable throwable) {
                } });
        }
        @Override
        public void onFailure(Call<User> call, Throwable throwable) {
        } });
}

    @Override
    public void setOnPageCompleteListener(OnPageCompleteListener onPageCompleteListener) {
        this.onPageCompleteListener = onPageCompleteListener;

    }
}