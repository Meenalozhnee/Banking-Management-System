export interface Transaction {
  transactionId: number;
  referenceNumber: string;
  amount: number;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'FD_CREATE' | 'FD_CLOSE' | 'LOAN_REPAYMENT';
  transactionDate: string;
  description: string;
  senderAccountNumber: string;
  receiverAccountNumber: string;
}

export interface AmountRequest {
  amount: number;
  description?: string;
}

export interface TransferRequest {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  description?: string;
}
