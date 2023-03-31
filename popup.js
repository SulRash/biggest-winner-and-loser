const winningStock = document.getElementById("winningStock");
const losingStock = document.getElementById("losingStock");

function displayStocks() {
  const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "FB"];

  const promises = symbols.map((symbol) =>
    fetch(`https://finance.yahoo.com/quote/${symbol}`)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const priceChangeElement = doc.querySelector(
          '[data-test="PREV_CLOSE-value"] + td'
        );

        const priceChangeText = priceChangeElement.textContent;
        const change = parseFloat(
          priceChangeText.slice(0, -1).replace(",", "")
        );

        return { symbol, change };
      })
  );

  Promise.all(promises)
    .then((priceChanges) => {
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
    })
    .catch((error) => {
      winningStock.textContent = "Error fetching data";
      losingStock.textContent = "Error fetching data";
      console.error("Error fetching stock data:", error);
    });
}

displayStocks();
