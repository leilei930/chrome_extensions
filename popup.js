document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('status').textContent = "Login form will be filled automatically. Alarm is set for 8:47 PM HKT for testing.";
});

document.getElementById('loginNow').addEventListener('click', () => {
  chrome.runtime.sendMessage({action: "loginNow"});
  window.close();
});

