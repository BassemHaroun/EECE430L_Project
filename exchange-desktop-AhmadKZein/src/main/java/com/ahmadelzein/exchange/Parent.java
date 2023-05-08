package com.ahmadelzein.exchange;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.layout.BorderPane;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;
public class Parent implements Initializable, OnPageCompleteListener {
    public BorderPane borderPane;
    public Button transactionButton;
    public Button loginButton;
    public Button registerButton;
    public Button logoutButton;
    public Button pendingButton;



    private void updateNavigation() {
        boolean authenticated = Authentication.getInstance().getToken() != null;
        transactionButton.setManaged(authenticated);
        transactionButton.setVisible(authenticated);
        loginButton.setManaged(!authenticated);
        loginButton.setVisible(!authenticated);
        registerButton.setManaged(!authenticated);
        registerButton.setVisible(!authenticated);
        logoutButton.setManaged(authenticated);
        logoutButton.setVisible(authenticated);
        pendingButton.setVisible(authenticated);
        pendingButton.setManaged(authenticated);
    }
    @Override
    public void onPageCompleted() {
        swapContent(Section.RATES);
    }

    public void initialize(URL url, ResourceBundle resourceBundle) {
        updateNavigation();
    }

    public void ratesSelected() {
        swapContent(Section.RATES);
    }

    public void calculatorSelected() {
        swapContent(Section.CALCULATOR);
    }

    public void statSelected() {
        swapContent(Section.STAT);
    }
    public void graphSelected() {swapContent(Section.GRAPH);}

    public void transactionsSelected() {
        swapContent(Section.TRANSACTIONS);
    }

    public void loginSelected() {
        swapContent(Section.LOGIN);
    }

    public void registerSelected() {
        swapContent(Section.REGISTER);
    }


    public void pendingSelected() {
        swapContent(Section.PENDING);
    }

    public void logoutSelected() {
        Authentication.getInstance().deleteToken();
        swapContent(Section.RATES);
    }

    private void swapContent(Section section) {
        try {
            URL url = getClass().getResource(section.getResource());
            FXMLLoader loader = new FXMLLoader(url);
            borderPane.setCenter(loader.load());
            if (section.doesComplete()) {
                ((PageCompleter)
                        loader.getController()).setOnPageCompleteListener(this);
            }
            updateNavigation();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private enum Section {
        RATES,
        TRANSACTIONS,
        LOGIN,
        REGISTER,
        CALCULATOR,
        STAT,
        GRAPH,
        PENDING;

        public String getResource() {
            return switch (this) {
                case RATES -> "/com/ahmadelzein/exchange/rates/layout.fxml";
                case TRANSACTIONS -> "/com/ahmadelzein/exchange/transactions/transactions.fxml";
                case LOGIN -> "/com/ahmadelzein/exchange/login/login.fxml";
                case REGISTER -> "/com/ahmadelzein/exchange/register/register.fxml";
                case CALCULATOR -> "/com/ahmadelzein/exchange/calculator/calculator.fxml";
                case STAT -> "/com/ahmadelzein/exchange/statistics/statistics.fxml";
                case GRAPH -> "/com/ahmadelzein/exchange/graph/graph.fxml";
                case PENDING -> "/com/ahmadelzein/exchange/pending/pending.fxml";
                default -> null;
            };
        }
        public boolean doesComplete() {
            return switch (this) {
                case LOGIN, REGISTER -> true;
                default -> false;
            };
        }
    }
}
