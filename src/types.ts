/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'income' | 'expense';

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  type: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date: Date;
  walletId: string;
}

export interface Debt {
  id: string;
  person: string;
  amount: number;
  type: 'borrow' | 'lend';
  date: Date;
  status: 'active' | 'cleared';
}
