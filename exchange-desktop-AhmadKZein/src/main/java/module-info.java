module com.ahmadelzein.exchange {
    requires javafx.controls;
    requires javafx.fxml;
    requires retrofit2;
    requires java.sql;
    requires gson;
    requires retrofit2.converter.gson;
    requires java.prefs;
    opens com.ahmadelzein.exchange to javafx.fxml;
    opens com.ahmadelzein.exchange.api.model to javafx.base,gson;
    exports com.ahmadelzein.exchange;
    exports com.ahmadelzein.exchange.rates;
    opens com.ahmadelzein.exchange.rates to javafx.fxml;
    opens com.ahmadelzein.exchange.login to javafx.fxml;
    opens com.ahmadelzein.exchange.register to javafx.fxml;
    opens com.ahmadelzein.exchange.transactions to javafx.fxml;
    opens com.ahmadelzein.exchange.calculator to javafx.fxml;
    opens com.ahmadelzein.exchange.statistics to javafx.fxml;
    opens com.ahmadelzein.exchange.pending to javafx.fxml;
}