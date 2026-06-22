export interface Loan {
  loanId: number;
  loanType: 'PERSONAL' | 'HOME' | 'VEHICLE' | 'EDUCATION' | 'BUSINESS';
  amount: number;
  interestRate: number;
  emi: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';
  tenureMonths: number;
}

export interface ApplyLoanRequest {
  loanType: 'PERSONAL' | 'HOME' | 'VEHICLE' | 'EDUCATION' | 'BUSINESS';
  amount: number;
  interestRate: number;
  tenureMonths: number;
}
