// Copyright 2021 Google LLC
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd

// Initialize the demo on install
//does local persist
//does session persist
//does IndexDB persist 

chrome.runtime.onInstalled.addListener((reason) => {
  if (reason !== chrome.runtime.OnInstalledReason.INSTALL) { return }

  openDemoTab();

  // Create an alarm so we have something to look at in the demo
  chrome.alarms.create('demo-default-alarm', {
    delayInMinutes: 1,
    periodInMinutes: 1,
  });
});

chrome.action.onClicked.addListener(openDemoTab);

function openDemoTab() {
  chrome.tabs.create({ url: 'index.html' });
}


// Where we will expose all the data we retrieve from storage.session.
const storageCache = {};
// Asynchronously retrieve data from storage.session, then cache it.
const initStorageCache = getAllStorageSessionData().then(items => {
  // Copy the data retrieved from storage into storageCache.
  Object.assign(storageCache, items);
  console.log('grabbed from cache: ', storageCache, items);
});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    await initStorageCache;
  } catch (e) {
    // Handle error that occurred during storage initialization.
  }
  // Normal action handler logic.
});

// Reads all data out of storage.sync and exposes it via a promise.
//
// Note: Once the Storage API gains promise support, this function
// can be greatly simplified.
function getAllStorageSessionData() {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.session.get(null, (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items);
    });
  });
}

// Watch for changes to storage
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if(key === 'logText'){
      console.log('new logText: ', newValue);
    }
  }
});