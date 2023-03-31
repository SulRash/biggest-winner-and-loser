const winningStock = document.getElementById("winningStock");
const losingStock = document.getElementById("losingStock");

function displayStocks() {
  const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN"];

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "fetchStockData", symbols: symbols },
      (priceChanges) => {
        const winner = priceChanges.reduce((max, stock) =>
          max.change > stock.change ? max : stock
        );
        const loser = priceChanges.reduce((min, stock) =>
          min.change < stock.change ? min : stock
        );

        winningStock.textContent = `${winner.symbol}: ${winner.change.toFixed(
          2
        )}%`;
        losingStock.textContent = `${loser.symbol}: ${loser.change.toFixed(
          2
        )}%`;
      }
    );
  });
}

displayStocks();
