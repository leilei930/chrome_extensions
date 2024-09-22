// Suppress passive event listener warnings
const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
  let modifiedOptions = options;
  if (type === 'touchstart' || type === 'touchmove' || type === 'wheel') {
    if (typeof options === 'object') {
      modifiedOptions = {...options, passive: true};
    } else {
      modifiedOptions = {passive: true};
    }
  }
  return originalAddEventListener.call(this, type, listener, modifiedOptions);
};

const config = {
  username: 'leiz',
  password: 'Thomas-11711210',
  maxRetries: 5,
  retryDelay: 100 // milliseconds
};

// Example of a passive event listener
document.addEventListener('touchmove', function(e) {
  // Your touch move handling code here
}, { passive: true });

// Function to wait for an element with exponential backoff
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const checkElement = (delay) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime < timeout) {
        setTimeout(() => checkElement(Math.min(delay * 1.5, 1000)), delay);
      } else {
        resolve(null);
      }
    };
    checkElement(100);
  });
}

// Function to fill the login form and click the login button
async function fillLoginForm() {
  try {
    const usernameField = await waitForElement('input[name="pc-login-username"]');
    const passwordField = await waitForElement('input[name="pc-login-password"]');

    if (usernameField && passwordField) {
      usernameField.value = config.username;
      passwordField.value = config.password;

      usernameField.dispatchEvent(new Event('input', { bubbles: true }));
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));
    }
  } catch (error) {
    console.error('Error in fillLoginForm:', error);
  }
}

async function clickLoginButton() {
  try {
    const loginButton = await waitForElement('div[name="pc-login-btn"]');
    if (loginButton) {
      loginButton.click();
      // Wait for login to complete
      await waitForLoginSuccess();
      console.log('Login successful!');
    }
  } catch (error) {
    console.error('Error in clickLoginButton:', error);
  }
}

// Function to wait for login success
function waitForLoginSuccess(timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkLoginStatus = () => {
      // Check for an element that appears after successful login
      // You may need to adjust this selector based on the actual page structure
      const loggedInElement = document.querySelector('.home-pc-head-box');
      if (loggedInElement) {
        resolve();
      } else if (Date.now() - startTime < timeout) {
        setTimeout(checkLoginStatus, 100);
      } else {
        reject(new Error('Login timeout'));
      }
    };
    checkLoginStatus();
  });
}

// Automatically fill the form when the page loads
window.addEventListener('load', () => setTimeout(fillLoginForm, Math.random() * 2000 + 1000));

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "performLogin") {
    clickLoginButton();
  }
});

// Remove the message listener for alarm functionality as it's no longer needed
// chrome.runtime.onMessage.addListener(...);

// ... rest of the existing code ...