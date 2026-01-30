/**
 * Utility functions for Stacks addresses and transactions
 */

/**
 * Abbreviates a Stacks address or transaction ID
 * @param value The full address or transaction ID string
 * @param startChars Number of characters to show at the start (default: 4)
 * @param endChars Number of characters to show at the end (default: 4)
 * @returns Formatted string (e.g., "SP12...ABCD")
 */
export function abbreviateString(value: string, startChars = 4, endChars = 4): string {
  if (!value) return '';
  if (value.length <= startChars + endChars) return value;
  
  const start = value.slice(0, startChars);
  const end = value.slice(-endChars);
  
  return `${start}...${end}`;
}

/**
 * Validates if a string is a valid Stacks address format (basic check)
 * @param address The address string to check
 * @returns boolean
 */
export function isValidStacksAddress(address: string): boolean {
  // Basic regex for Mainnet (SP) and Testnet (ST) addresses
  // Starts with S, followed by P or T, alphanumeric, 38-41 chars
  const stacksAddressRegex = /^S[PT][0-9A-Z]{38,39}$/;
  return stacksAddressRegex.test(address);
}

/**
 * Formats a micro-STX amount to a readable string
 * @param microStx The amount in micro-STX
 * @returns Formatted string (e.g. "1.5 STX")
 */
export function formatMicroStx(microStx: number | string): string {
  const amount = typeof microStx === 'string' ? parseInt(microStx, 10) : microStx;
  if (isNaN(amount)) return '0 STX';
  
  return `${(amount / 1000000).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6
  })} STX`;
}
