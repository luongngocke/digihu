export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwzkOgN3jIAbLXKjgVzTp0ynN6H8DHpRs_XA8k29Hi_KMAoeThRWOU_YLrtRUTIMAJUTg/exec';

export const api = {
  async getData() {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getData`);
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to fetch data');
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  async addTransaction(transaction: any) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        // Using text/plain avoids CORS preflight issues with typical Google Apps Script setups
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'addTransaction', data: transaction })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  async addWallet(wallet: any) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'addWallet', data: wallet })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result;
    } catch (error) {
      console.error("Error adding wallet:", error);
      throw error;
    }
  },

  async addDebt(debt: any) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'addDebt', data: debt })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result;
    } catch (error) {
      console.error("Error adding debt:", error);
      throw error;
    }
  },

  async updateWalletBalance(walletId: string, newBalance: number) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'updateWalletBalance', data: { id: walletId, balance: newBalance } })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result;
    } catch (error) {
      console.error("Error updating wallet balance:", error);
      throw error;
    }
  },

  async updateSetting(key: string, value: string) {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'updateSetting', data: { key, value } })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result;
    } catch (error) {
      console.error("Error setting:", error);
      throw error;
    }
  }
};
