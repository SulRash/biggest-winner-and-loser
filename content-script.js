chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchStockData") {
      const symbols = request.symbols;
      const results = [];
  
      symbols.forEach((symbol, index) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://www.marketwatch.com/investing/stock/${symbol}`);
        xhr.onload = () => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(xhr.responseText, "text/html");
          const priceChangeElement = doc.querySelector(
            '.element--intradayChange .primary'
          );
          const priceChangeText = priceChangeElement.textContent;
          const change = parseFloat(priceChangeText.replace(/[+%]/g, ""));
  
          results.push({ symbol, change });
  
          if (results.length === symbols.length) {
            sendResponse(results);
          }
        };
        xhr.send();
      });
  
      return true;
    }
});
  