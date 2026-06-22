export interface Account {
  accountNumber: string;
  accountHolder: string;
  accountType: 'SAVINGS' | 'CURRENT';
  balance: number;
  status: 'ACTIVE' | 'CLOSED' | 'BLOCKED';
  branchName: string;
  bankName: string;
  showBalance?: boolean;
}

export interface CreateAccountRequest {
  accountHolder: string;
  accountType: 'SAVINGS' | 'CURRENT';
  initialDeposit: number;
  branchName: string;
  bankName: string;
}
