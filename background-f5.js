var tabs = {};

function addTab(tabId, delay) {
  if (tabId in tabs) return;

  var intervalId = window.setInterval(() => {
    browser.tabs.reload(tabId);
  }, delay);

  tabs[tabId] = intervalId;
}

function removeTab(tabId) {
  if (!(tabId in tabs)) return;

  window.clearInterval(tabs[tabId]);

  delete tabs[tabId];
}

browser.runtime.onMessage.addListener((msg, _, sendResponse) => {
  switch (msg.type) {
    case 'add':
      addTab(msg.tabId, msg.delay);
      break;

    case 'remove':
      removeTab(msg.tabId);
      break;

    case 'status':
      sendResponse({
        type: 'statusResponse',
        reloading: (msg.tabId in tabs)
      });
      break;
  }
});

browser.tabs.onActivated.addListener((info) => {
  var green = info.tabId in tabs ? '-green' : '';

  browser.browserAction.setIcon({
    path: `icons/reload${green}-48.png`
  });
});
