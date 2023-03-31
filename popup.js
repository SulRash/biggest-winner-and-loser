const winningStock = document.getElementById("winningStock");
const losingStock = document.getElementById("losingStock");

function displayStocks() {
  chrome.runtime.sendMessage(
    { action: "fetchStockData" },
    (response) => {
      if (response.error) {
        winningStock.textContent = response.error;
        losingStock.textContent = response.error;
        return;
      }

      winningStock.textContent = `${response.symbol}: ${response.change.toFixed(
        2
      )}%`;
      losingStock.textContent = "";
    }
  );
}

displayStocks();
