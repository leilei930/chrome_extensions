chrome.browserAction.onClicked.addListener((tab) => {
  if (tab.url.includes("smartplay.lcsd.gov.hk")) {
    chrome.tabs.sendMessage(tab.id, {
      action: "fillLoginForm",
      username: "your_username",
      password: "your_password"
    });
  } else {
    alert("Please navigate to the SmartPLAY website first.");
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "bookingAlarm") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0] && tabs[0].url.includes("smartplay.lcsd.gov.hk")) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "prepareForBooking",
          bookingTime: new Date().setHours(20, 47, 0, 0) // 8:47 PM
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setBookingAlarm") {
    const bookingTime = new Date(request.bookingTime).getTime();
    const now = Date.now();
    const delay = Math.max(0, bookingTime - now - 10000); // 10 seconds before booking time

    chrome.alarms.create("bookingAlarm", { when: now + delay });
    sendResponse({success: true, message: `Alarm set for ${new Date(now + delay)}`});
  }
  // Remove the loginSuccess handler if you don't want notifications
});

function setAlarmForTestTime() {
  const now = new Date();
  const bookingTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 47, 0, 0); // 8:47 PM
  
  // If it's already past 8:47 PM today, set for tomorrow
  if (now.getHours() > 20 || (now.getHours() === 20 && now.getMinutes() >= 47)) {
    bookingTime.setDate(bookingTime.getDate() + 1);
  }
  
  const delay = Math.max(0, bookingTime.getTime() - Date.now() - 5000); // 5 seconds before booking time
  chrome.alarms.create("bookingAlarm", { when: Date.now() + delay });
  console.log(`Alarm set for ${bookingTime.toLocaleString('en-HK', { timeZone: 'Asia/Hong_Kong' })}`);
}

// Set alarm when extension is loaded
chrome.runtime.onInstalled.addListener(() => {
  console.log('SmartPlay Auto Login extension installed');
});

// Add this new listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes("smartplay.lcsd.gov.hk")) {
    chrome.tabs.sendMessage(tabId, { action: "fillLoginForm" });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "loginNow") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "performLogin"});
    });
  }
});