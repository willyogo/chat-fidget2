// Common ABIs used across the application
export const DEPLOYER_ABI = [{
  name: 'deployer',
  type: 'function',
  stateMutability: 'view',
  inputs: [],
  outputs: [{ name: '', type: 'address' }],
}] as const;

export const OWNER_ABI = [{
  name: 'owner',
  type: 'function',
  stateMutability: 'view',
  inputs: [],
  outputs: [{ name: '', type: 'address' }],
}] as const;