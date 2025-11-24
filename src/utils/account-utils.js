// API Configuration

// Get CSRF token from cookie
function getCsrfToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Local Account Utilities
// This file provides shared functions for managing account data across all client pages

const currentAccountData = {
  account_id: null,
  balance: null,
  equity: null,
  margin: null,
  free_margin: null,
  margin_level: null
};

function getAuthToken() {
  return localStorage.getItem('jwt_token');
}

function getAuthHeaders() {
  const token = getAuthToken();
  if (!token) {
    console.error('No authentication token found');
    // Don't redirect if we're in an iframe (let parent handle auth)
    if (window.self === window.top) {
      window.location.href = '/client/login/?next=' + encodeURIComponent(window.location.pathname);
    }
    return null;
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}

function updateGlobalAccountDisplays(accountData) {
  if (!accountData) return;

  Object.assign(currentAccountData, accountData);

  const accountId = accountData.account_id || 'N/A';

  const elementIds = [
    'with_accid', 'open_pos_acc_id', 'trade_acc_id',
    'dash_acc_id', 'social_acc_id', 'deposit_acc_id',
    'investmam_acc_id'
  ];

  elementIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = accountId;
  });

  const depositAccountSpan = document.querySelector('.info-box span');
  if (depositAccountSpan && depositAccountSpan.textContent.includes('Account ID:')) {
    depositAccountSpan.textContent = `📘 Account ID: ${accountId}`;
  }
}

function updateGlobalBalanceDisplays(balance) {
  if (balance === null || balance === undefined) return;

  currentAccountData.balance = balance;
  const formattedBalance = parseFloat(balance).toFixed(2);

  const balanceElements = [
    document.getElementById('with_balance'),
    document.getElementById('dash_balance'),
    document.getElementById('social_balance')
  ];

  balanceElements.forEach(el => {
    if (el) el.textContent = `$${formattedBalance}`;
  });

  document.querySelectorAll('.current-balance').forEach(el => {
    el.textContent = `$${formattedBalance}`;
  });
}

async function initializeAccountData() {
  try {
    const headers = getAuthHeaders();
    if (!headers) return;

    const endpoint = window.API_CONFIG?.getEndpoint?.('user-trading-accounts/');
    if (!endpoint) {
      console.error('API endpoint is undefined. Ensure api-config.js is loaded first.');
      return;
    }

    const response = await fetch(endpoint, { headers });

    if (response.status === 401) {
      console.error('Authentication failed - redirecting to login');
      window.location.href = '/client/login/?next=' + encodeURIComponent(window.location.pathname);
      return;
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Received HTML response instead of JSON. Check your endpoint or routing.');
    }

    const data = await response.json();

    const accounts = data.accounts || [];
    if (Array.isArray(accounts) && accounts.length > 0) {
      const primaryAccount = accounts[0];
      Object.assign(currentAccountData, primaryAccount);

      updateGlobalAccountDisplays(primaryAccount);
      updateGlobalBalanceDisplays(primaryAccount.balance);
      const accountContainer = document.querySelector('.glass-card.container');
      if (accountContainer) accountContainer.style.display = 'block';

      return primaryAccount;
    } else {
      console.debug('No trading accounts found');
      updateGlobalAccountDisplays({ account_id: 'N/A' });

      const accountContainer = document.querySelector('.glass-card.container');
      if (accountContainer) accountContainer.style.display = 'none';
    }
  } catch (error) {
    console.error('Failed to initialize account data:', error);
    updateGlobalAccountDisplays({ account_id: 'Error' });

    const accountContainer = document.querySelector('.glass-card.container');
    if (accountContainer) accountContainer.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initializeAccountData();
  }, 500);
});

// Export for use in React
export {
  updateGlobalAccountDisplays,
  updateGlobalBalanceDisplays,
  initializeAccountData,
  currentAccountData
};
