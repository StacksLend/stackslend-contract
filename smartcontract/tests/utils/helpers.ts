import { Cl } from '@stacks/transactions';

export const CONTRACT_NAME = 'stackslend-v1';
export const ORACLE_NAME = 'mock-oracle-v1';
export const SBTC_TOKEN = 'sbtc-token';

export function initializeOracle(deployer: string) {
  return simnet.callPublicFn(
    ORACLE_NAME,
    'initialize',
    [Cl.principal(deployer)],
    deployer
  );
}

export function updateOracle(price: number, updater: string) {
  return simnet.callPublicFn(
    ORACLE_NAME,
    'update-price',
    [Cl.uint(price)],
    updater
  );
}

export function mintSBTC(amount: number, recipient: string) {
  return simnet.callPublicFn(
    SBTC_TOKEN,
    'mint',
    [Cl.uint(amount), Cl.principal(recipient)],
    recipient
  );
}

export function getTotalDeposits(deployer: string) {
  return simnet.getDataVar(CONTRACT_NAME, 'total-stx-deposits');
}

export function getTotalBorrows(deployer: string) {
  return simnet.getDataVar(CONTRACT_NAME, 'total-stx-borrows');
}

export function getUserDebt(user: string, deployer: string) {
  return simnet.callReadOnlyFn(
    CONTRACT_NAME,
    'get-debt',
    [Cl.principal(user)],
    deployer
  );
}
