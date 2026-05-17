import type { Profile } from '@ember/db';
import { resolveGroupLabel } from './identity';
import { APP_NAME } from './constants';

export type NotificationKind =
  | 'member_answered'
  | 'daily_prompt_ready'
  | 'streak_at_risk'
  | 'nudge_received'
  | 'full_match'
  | 'weekly_recap'
  | 'new_member_joined';

export interface NotificationPayload {
  title: string;
  body: string;
  kind: NotificationKind;
  data?: Record<string, string>;
}

export function buildNotification(
  kind: NotificationKind,
  params: {
    responderProfile?: Pick<Profile, 'display_name' | 'pronouns'>;
    groupName?: string | null;
    memberCount?: number;
    remainingCount?: number;
    newMemberProfile?: Pick<Profile, 'display_name' | 'pronouns'>;
  }
): NotificationPayload {
  const groupLabel = params.memberCount ? resolveGroupLabel(params.memberCount) : 'your group';

  switch (kind) {
    case 'member_answered': {
      const name = params.responderProfile?.display_name ?? 'Someone';
      const remaining = params.remainingCount ?? 1;
      return {
        title: `${APP_NAME} — ${name} just answered`,
        body: `Waiting on ${remaining} more ${remaining === 1 ? 'person' : 'people'} in ${groupLabel}`,
        kind,
      };
    }
    case 'daily_prompt_ready':
      return {
        title: `${APP_NAME} — Today's prompt is ready`,
        body: params.groupName
          ? `A new question is waiting for ${params.groupName}`
          : `A new question is waiting for ${groupLabel}`,
        kind,
      };
    case 'streak_at_risk':
      return {
        title: `${APP_NAME} — Your streak is at risk`,
        body: `Answer today's prompt to keep ${groupLabel}'s streak alive`,
        kind,
      };
    case 'nudge_received':
      return {
        title: `${APP_NAME} — You've been nudged`,
        body: `Someone in ${groupLabel} wants to connect`,
        kind,
      };
    case 'full_match':
      return {
        title: `${APP_NAME} — Full match! ✨`,
        body: `Everyone in ${groupLabel} said yes — check it out`,
        kind,
      };
    case 'weekly_recap':
      return {
        title: `${APP_NAME} — Your weekly recap`,
        body: `See what ${groupLabel} accomplished this week`,
        kind,
      };
    case 'new_member_joined': {
      const name = params.newMemberProfile?.display_name ?? 'Someone new';
      return {
        title: `${APP_NAME} — ${name} joined`,
        body: `${name} has joined ${groupLabel}`,
        kind,
      };
    }
    default:
      return { title: APP_NAME, body: 'You have a new notification', kind };
  }
}
