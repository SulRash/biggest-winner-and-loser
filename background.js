// background.js (Alpha Vantage)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchStockData") {
      const symbols = ["AAPL", "GOOG", "TSLA", "MSFT", "AMZN"]; // replace with your own symbols
      const apiKey = "demo"; // replace with your own API key
      const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=${apiKey}`;
  
      const fetchPromises = symbols.map((symbol) => {
        const url = `${apiUrl}&symbol=${symbol}`;
        return fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (data.hasOwnProperty("Global Quote")) {
              const priceChangeText = data["Global Quote"]["10. change percent"];
              const change = parseFloat(priceChangeText.replace(/[+%]/g, ""));
              return { symbol, change };
            } else {
              console.error(`Error fetching data for ${symbol}:`, data);
              return { symbol, error: "Error fetching data" };
            }
          })
          .catch((error) => {
            console.error(`Error fetching data for ${symbol}:`, error);
            return { symbol, error: "Error fetching data" };
          });
      });
  
      Promise.all(fetchPromises)
        .then((results) => {
          const sortedResults = results.sort((a, b) => b.change - a.change);
          const topGainers = sortedResults.slice(0, 10);
          const topLosers = sortedResults.slice(-10).reverse();
          sendResponse({ topGainers, topLosers });
        })
        .catch((error) => {
          console.error(`Error fetching data:`, error);
          sendResponse({ error: "Error fetching data" });
        });
  
      return true;
    }
});