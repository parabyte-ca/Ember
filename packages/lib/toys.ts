// ROADMAP-D: Teledildonics integration via Lovense Standard API + Buttplug.io
// This file is a stub — toy integration is planned for v2.
// See README section "Toy integration" for details.
// Docs: https://developer.lovense.com (Lovense Standard API)
//       https://buttplug.io (Buttplug.io abstraction layer, 750+ devices)

import { NotImplementedError } from './chat';

export interface ToyPattern {
  type: 'vibrate' | 'rotate' | 'pump';
  strength: number; // 0–20
  durationMs: number;
}

export async function connectToy(
  _userId: string,
  _provider: 'lovense' | 'buttplug_generic'
): Promise<void> {
  // ROADMAP-D: Initiate Bluetooth pairing via expo-bluetooth or react-native-ble-plx
  throw new NotImplementedError('connectToy');
}

export async function sendPattern(
  _toyConnectionId: string,
  _pattern: ToyPattern
): Promise<void> {
  // ROADMAP-D: Send vibration pattern via Lovense API or Buttplug.io
  throw new NotImplementedError('sendPattern');
}

export async function disconnectToy(_toyConnectionId: string): Promise<void> {
  // ROADMAP-D: Disconnect toy session
  throw new NotImplementedError('disconnectToy');
}
