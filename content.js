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
async function fillLoginFormAndSubmit() {
  try {
    const usernameField = await waitForElement('input[name="pc-login-username"]');
    const passwordField = await waitForElement('input[name="pc-login-password"]');
    const loginButton = await waitForElement('div[name="pc-login-btn"]');

    if (usernameField && passwordField && loginButton) {
      usernameField.value = config.username;
      passwordField.value = config.password;

      usernameField.dispatchEvent(new Event('input', { bubbles: true }));
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));

      // Short delay to ensure the form is filled before clicking
      setTimeout(() => {
        loginButton.click();
      }, 500);
    }
  } catch (error) {
    console.error('Error in fillLoginFormAndSubmit:', error);
  }
}

// Automatically fill the form and submit when the page loads
window.addEventListener('load', () => setTimeout(fillLoginFormAndSubmit, Math.random() * 2000 + 1000));

// Remove the message listener for alarm functionality as it's no longer needed
// chrome.runtime.onMessage.addListener(...);

// ... rest of the existing code ...