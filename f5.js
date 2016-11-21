function addTab(tabId, delay) {
  browser.runtime.sendMessage({
    type: 'add',
    tabId: tabId,
    delay: delay
  });
}

function removeTab(tabId) {
  browser.runtime.sendMessage({
    type: 'remove',
    tabId: tabId
  });
}

function loadStatus(tabId) {
  browser.runtime.sendMessage({
    type: 'status',
    tabId: tabId
  }).then((msg) => {
    if (msg.type !== 'statusResponse') return;

    if (msg.reloading) showReloading();
    else showNotReloading();
  });
}

function elem(id) {
  return document.getElementById(id);
}

function showReloading() {
  browser.browserAction.setIcon({
    path: 'icons/reload-green-48.png'
  });
  elem('input-delay').style.display = 'none';
  elem('btn-add').style.display = 'none';
  elem('btn-remove').style.display = '';
}

function showNotReloading() {
  browser.browserAction.setIcon({
    path: 'icons/reload-48.png'
  });
  elem('input-delay').style.display = '';
  elem('btn-add').style.display = '';
  elem('btn-remove').style.display = 'none';
}

document.addEventListener('click', (e) => {
  var activeTab = browser.tabs.query({
    active: true,
    currentWindow: true
  });

  if (e.target.id === 'btn-add') {
    var delay = elem('input-delay').value;
    if (delay > 0) {
      activeTab.then((tabs) => {
        addTab(tabs[0].id, delay);
        showReloading();
      });
    }
  }

  else if (e.target.id === 'btn-remove') {
    activeTab.then((tabs) => {
      removeTab(tabs[0].id);
      showNotReloading();
    });
  }
});

browser.tabs.query({
    active: true,
    currentWindow: true
}).then((tabs) => {
  loadStatus(tabs[0].id);
});
