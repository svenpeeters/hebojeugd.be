export const ALLOWED_CHOICES = ['stay', 'leave', 'talk'] as const;

export const ALLOWED_YOUTH_TEAMS = new Set([
  'U5',
  'U6',
  'U7',
  'U9',
  'U10',
  'U11',
  'U12',
  'U15',
  'U17',
]);

export type SeasonIntentChoice = (typeof ALLOWED_CHOICES)[number];
export type SeasonIntentMode = 'dry-run' | 'test' | 'send';
export type ParentRole = 'mama' | 'papa';

export interface SeasonIntentRecipient {
  id: string;
  to: string;
  parentRole: ParentRole;
  childName: string;
  ploeg: string;
  club: string;
}

export interface SeasonIntentCampaignRecord extends SeasonIntentRecipient {
  campaignId: string;
  mode: Exclude<SeasonIntentMode, 'dry-run'>;
  originalTo: string;
  effectiveTo: string;
  sentAt: string;
  resendEmailId: string | null;
}

export interface SeasonIntentResponseRecord {
  id: string;
  campaignId: string;
  choice: SeasonIntentChoice;
  respondedAt: string;
}

export function isSeasonIntentChoice(value: string | null | undefined): value is SeasonIntentChoice {
  return Boolean(value && ALLOWED_CHOICES.includes(value as SeasonIntentChoice));
}

export function isSeasonIntentMode(value: string | null | undefined): value is SeasonIntentMode {
  return value === 'dry-run' || value === 'test' || value === 'send';
}

export function jsonHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  };
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
