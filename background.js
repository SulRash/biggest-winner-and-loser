chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchStockData") {
      const symbol = "AAPL";
  
      fetch(`https://finviz.com/quote.ashx?t=${symbol}`)
        .then((response) => response.text())
        .then((text) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "text/html");
          const priceChangeElement = doc.querySelector(
            "table.snapshot-table2 td:nth-child(11)"
          );
          const priceChangeText = priceChangeElement.textContent;
          const change = parseFloat(priceChangeText.replace(/[+%]/g, ""));
          sendResponse({ symbol, change });
        })
        .catch((error) => {
          console.error(`Error fetching data for ${symbol}:`, error);
          sendResponse({ error: "Error fetching data" });
        });
  
      return true;
    }
});