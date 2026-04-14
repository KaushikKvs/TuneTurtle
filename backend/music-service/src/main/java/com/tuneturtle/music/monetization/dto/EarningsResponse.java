package com.tuneturtle.music.monetization.dto;

import com.tuneturtle.music.monetization.document.Transaction;
import java.util.List;

public class EarningsResponse {
    private Double totalEarnings;
    private Double thisMonthEarnings;
    private Integer totalSales;
    private List<Transaction> recentTransactions;

    public EarningsResponse() {}
    public EarningsResponse(Double totalEarnings, Double thisMonthEarnings, Integer totalSales, List<Transaction> recentTransactions) {
        this.totalEarnings = totalEarnings;
        this.thisMonthEarnings = thisMonthEarnings;
        this.totalSales = totalSales;
        this.recentTransactions = recentTransactions;
    }

    public Double getTotalEarnings() { return totalEarnings; }
    public void setTotalEarnings(Double totalEarnings) { this.totalEarnings = totalEarnings; }

    public Double getThisMonthEarnings() { return thisMonthEarnings; }
    public void setThisMonthEarnings(Double thisMonthEarnings) { this.thisMonthEarnings = thisMonthEarnings; }

    public Integer getTotalSales() { return totalSales; }
    public void setTotalSales(Integer totalSales) { this.totalSales = totalSales; }

    public List<Transaction> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<Transaction> recentTransactions) { this.recentTransactions = recentTransactions; }

    public static EarningsResponseBuilder builder() {
        return new EarningsResponseBuilder();
    }

    public static class EarningsResponseBuilder {
        private Double totalEarnings;
        private Double thisMonthEarnings;
        private Integer totalSales;
        private List<Transaction> recentTransactions;

        public EarningsResponseBuilder totalEarnings(Double totalEarnings) { this.totalEarnings = totalEarnings; return this; }
        public EarningsResponseBuilder thisMonthEarnings(Double thisMonthEarnings) { this.thisMonthEarnings = thisMonthEarnings; return this; }
        public EarningsResponseBuilder totalSales(Integer totalSales) { this.totalSales = totalSales; return this; }
        public EarningsResponseBuilder recentTransactions(List<Transaction> recentTransactions) { this.recentTransactions = recentTransactions; return this; }
        public EarningsResponse build() {
            return new EarningsResponse(totalEarnings, thisMonthEarnings, totalSales, recentTransactions);
        }
    }
}
