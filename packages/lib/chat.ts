// ROADMAP-B: Community rooms using Matrix E2EE protocol
// This file is a stub — Matrix integration is planned for v2.
// See README section "Community rooms" for details.

export class NotImplementedError extends Error {
  constructor(feature: string) {
    super(`${feature} is not yet implemented. See ROADMAP-B.`);
    this.name = 'NotImplementedError';
  }
}

export async function joinCommunityRoom(_roomId: string): Promise<void> {
  // ROADMAP-B: Connect to Matrix room using matrix-js-sdk
  throw new NotImplementedError('joinCommunityRoom');
}

export async function leaveCommunityRoom(_roomId: string): Promise<void> {
  // ROADMAP-B: Leave Matrix room
  throw new NotImplementedError('leaveCommunityRoom');
}

export async function sendCommunityMessage(_roomId: string, _body: string): Promise<void> {
  // ROADMAP-B: Send E2EE message to Matrix room
  throw new NotImplementedError('sendCommunityMessage');
}
