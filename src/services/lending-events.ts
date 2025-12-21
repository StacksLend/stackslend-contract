import { StacksTransaction } from '@hirosystems/chainhook-client';

export interface DepositEvent {
  txId: string;
  depositor: string;
  amount: string;
  timestamp: number;
  blockHeight: number;
}

export interface BorrowEvent {
  txId: string;
  borrower: string;
  amount: string;
  timestamp: number;
  blockHeight: number;
}

export interface RepaymentEvent {
  txId: string;
  borrower: string;
  amount: string;
  timestamp: number;
  blockHeight: number;
}

export interface LiquidationEvent {
  txId: string;
  liquidator: string;
  borrower: string;
  collateralAmount: string;
  debtAmount: string;
  timestamp: number;
  blockHeight: number;
}

// In-memory storage (replace with database later)
const deposits: DepositEvent[] = [];
const borrows: BorrowEvent[] = [];
const repayments: RepaymentEvent[] = [];
const liquidations: LiquidationEvent[] = [];

export async function handleDeposit(tx: StacksTransaction): Promise<void> {
  const depositor = tx.metadata.sender_address;
  
  // Extract amount from transaction operations
  const amount = extractAmountFromOps(tx.operations);
  
  const depositEvent: DepositEvent = {
    txId: tx.transaction_identifier.hash,
    depositor,
    amount,
    timestamp: Date.now(),
    blockHeight: tx.metadata.position.index
  };
  
  deposits.push(depositEvent);
  
  console.log(`💰 Deposit processed: ${depositor} deposited ${amount} STX`);
}

export async function handleBorrow(tx: StacksTransaction): Promise<void> {
  const borrower = tx.metadata.sender_address;
  const amount = extractAmountFromOps(tx.operations);
  
  const borrowEvent: BorrowEvent = {
    txId: tx.transaction_identifier.hash,
    borrower,
    amount,
    timestamp: Date.now(),
    blockHeight: tx.metadata.position.index
  };
  
  borrows.push(borrowEvent);
  
  console.log(`📤 Borrow processed: ${borrower} borrowed ${amount} STX`);
}

export async function handleRepay(tx: StacksTransaction): Promise<void> {
  const borrower = tx.metadata.sender_address;
  const amount = extractAmountFromOps(tx.operations);
  
  const repaymentEvent: RepaymentEvent = {
    txId: tx.transaction_identifier.hash,
    borrower,
    amount,
    timestamp: Date.now(),
    blockHeight: tx.metadata.position.index
  };
  
  repayments.push(repaymentEvent);
  
  console.log(`💵 Repayment processed: ${borrower} repaid ${amount} STX`);
}

export async function handleLiquidation(tx: StacksTransaction): Promise<void> {
  const liquidator = tx.metadata.sender_address;
  
  // Extract borrower from contract call arguments
  const borrower = extractBorrowerFromArgs(tx);
  const collateralAmount = extractAmountFromOps(tx.operations);
  
  const liquidationEvent: LiquidationEvent = {
    txId: tx.transaction_identifier.hash,
    liquidator,
    borrower,
    collateralAmount,
    debtAmount: '0', // TODO: Calculate from contract state
    timestamp: Date.now(),
    blockHeight: tx.metadata.position.index
  };
  
  liquidations.push(liquidationEvent);
  
  console.log(`⚠️ Liquidation processed: ${liquidator} liquidated ${borrower}`);
}

// Helper functions
function extractAmountFromOps(operations: any[]): string {
  for (const op of operations) {
    if (op.amount?.value) {
      return op.amount.value;
    }
  }
  return '0';
}

function extractBorrowerFromArgs(tx: StacksTransaction): string {
  // Extract from contract call arguments
  for (const op of tx.operations) {
    if (op.type === 'contract_call' && op.metadata?.args) {
      const args = op.metadata.args;
      if (Array.isArray(args) && args.length > 0) {
        return args[0].repr || 'unknown';
      }
    }
  }
  return 'unknown';
}

// Export data getters
export function getAllDeposits(): DepositEvent[] {
  return [...deposits];
}

export function getAllBorrows(): BorrowEvent[] {
  return [...borrows];
}

export function getAllRepayments(): RepaymentEvent[] {
  return [...repayments];
}

export function getAllLiquidations(): LiquidationEvent[] {
  return [...liquidations];
}

export function getUserEvents(address: string) {
  return {
    deposits: deposits.filter(d => d.depositor === address),
    borrows: borrows.filter(b => b.borrower === address),
    repayments: repayments.filter(r => r.borrower === address),
    liquidations: liquidations.filter(l => l.borrower === address || l.liquidator === address)
  };
}
