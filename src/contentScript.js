button.addEventListener("click", async () => {
  const insightsBox = document.getElementById("insights");
  const htmlData = await getHTMLData();
  insightsBox.innerHTML = htmlData;
});

function DOMtoString(selector) {
  if (selector) {
    selector = document.querySelector(selector);
    if (!selector) return "ERROR: querySelector failed to find node";
  } else {
    selector = document.documentElement;
  }
  return selector.outerHTML;
}

async function getHTMLData(insightsBox) {
  const response = await chrome.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      const activeTab = tabs[0];
      const activeTabId = activeTab.id;

      return chrome.scripting.executeScript({
        target: { tabId: activeTabId },
        // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
        func: DOMtoString,
        args: ["body"], // you can use this to target what element to get the html for
      });
    });

  const htmlData = await response[0].result;
  return htmlData;
}
