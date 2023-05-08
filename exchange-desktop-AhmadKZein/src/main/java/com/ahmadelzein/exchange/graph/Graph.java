package com.ahmadelzein.exchange.graph;

import com.ahmadelzein.exchange.api.ExchangeService;
import com.ahmadelzein.exchange.api.model.Grph;
import com.ahmadelzein.exchange.api.model.Range;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.chart.LineChart;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.XYChart;
import javafx.scene.control.DatePicker;
import javafx.scene.control.RadioButton;
import javafx.scene.control.ToggleGroup;
import javafx.util.StringConverter;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;

import static java.lang.Math.round;

public class Graph {
    public DatePicker start_date;
    public DatePicker end_date;
    public ToggleGroup Graph_range;
    public NumberAxis xAxis = new NumberAxis();
    public NumberAxis yAxis = new NumberAxis();
    public LineChart<Number, Number> chart = new LineChart(xAxis, yAxis);


    public void initialize() {
        fetchGraph();
    }

    //citations
    //https://www.tutorialspoint.com/javafx/line_chart.htm#:~:text=A%20line%20chart%20or%20line,of%20schools%20in%20different%20years.
    //https://docs.oracle.com/javafx/2/charts/line-chart.htm#CIHGBCFI

    @FXML
    private void fetchGraph() {
        Range range = new Range(30);
        Range finalRange = range;
        ExchangeService.exchangeApi().getGraph(range).enqueue(new Callback<List<Grph>>() {
            @Override
            public void onResponse(Call<List<Grph>> call, Response<List<Grph>> response) {
                List<Grph> graph = response.body();
                Platform.runLater(() -> {
                    XYChart.Series series1 = new XYChart.Series();
                    series1.setName("average sell usd");
                    LocalDate today = LocalDate.now( ) ;
                    LocalDateTime today2 = LocalDateTime.now();
                    int base = 0;
                    if(((RadioButton) Graph_range.getSelectedToggle()) != null ){
                        base = Integer.parseInt(graph.get(0).date);
                        for (Grph item : graph) {
                            System.out.println(item.date);
                            if(Integer.parseInt(item.date) >= today2.getHour()){
                                series1.getData().add(new XYChart.Data(Integer.parseInt(item.date)-base, item.usd_to_lbp_average));
                            } else {
                                series1.getData().add(new XYChart.Data(24+Integer.parseInt(item.date)-base, item.usd_to_lbp_average));
                            }
                        }
                    }
                    chart.getData().clear();
                    chart.getData().add(series1);
                    if(((RadioButton) Graph_range.getSelectedToggle()) != null ){
                        int finalBase = base;
                        yAxis.setTickLabelFormatter(new StringConverter<Number>() {
                            private final SimpleDateFormat format = new SimpleDateFormat("hh.mm.ss\n");

                            @Override
                            public String toString(Number object) {
                                if (round((Double) object) > 23) {
                                    Double time = ((Double) object) - 24 + finalBase;
                                    return "" + round(time) + ":"+ today2.getMinute() + ":" + today2.getSecond();
                                }
                                Double time = ((Double) object) + finalBase;
                                return "" + round(time) + ":"+ today2.getMinute() + ":" + today2.getSecond();
                            }

                            @Override
                            public Number fromString(String string) {
                                return null;
                            }
                        });
                    } else {
                        yAxis.setTickLabelFormatter(new StringConverter<Number>() {
                            private final SimpleDateFormat format = new SimpleDateFormat("dd.MM.yyyy\n");

                            @Override
                            public String toString(Number object) {
                                return today.minusDays(finalRange.range - round((Double) object)).toString();
                            }

                            @Override
                            public Number fromString(String string) {
                                return null;
                            }
                        });
                    }
                });
            }
            @Override
            public void onFailure(Call<List<Grph>> call, Throwable throwable) {

            }
        });
    }
}
