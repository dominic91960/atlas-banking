export interface Transaction {
  id: string;
  name: string;
  date: string;
  type: "DEBIT" | "CREDIT";
  amount: string;
  signedAmount: string;
  balance: string;
  counterpartyAccountNumber: string;
  reference: string | null;
  status: string;
}
