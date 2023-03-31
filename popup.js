const winningStock = document.getElementById("winningStock");
const losingStock = document.getElementById("losingStock");

function displayStocks() {
  const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "FB"];

  const code = `
    new Promise((resolve) => {
      const symbols = ${JSON.stringify(symbols)};
      const results = [];

      symbols.forEach((symbol, index) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://finance.yahoo.com/quote/" + symbol);
        xhr.onload = () => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(xhr.responseText, "text/html");
          const priceChangeElement = doc.querySelector(
            '[data-test="PREV_CLOSE-value"] + td'
          );
          const priceChangeText = priceChangeElement.textContent;
          const change = parseFloat(
            priceChangeText.slice(0, -1).replace(",", "")
          );

          results.push({ symbol, change });

          if (results.length === symbols.length) {
            resolve(results);
          }
        };
        xhr.send();
      });
    });
  `;

  browser.tabs
    .executeScript({ code })
    .then((priceChangesArray) => {
      const priceChanges = priceChangesArray[0];
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
