export interface FixedDeposit {
  fdId: number;
  amount: number;
  interestRate: number;
  maturityDate: string;
  maturityAmount: number;
  status: 'ACTIVE' | 'CLOSED' | 'MATURED';
}

export interface CreateFdRequest {
  accountNumber: string;
  amount: number;
  interestRate: number;
  tenureMonths: number;
}
