import { Resend } from 'resend';
import { SeasonIntentEmail, buildSubject } from './email-template.js';
import type { SeasonIntentCampaignRecord, SeasonIntentRecipient } from './shared.js';

export async function sendSeasonIntentEmails(options: {
  recipients: SeasonIntentRecipient[];
  mode: 'test' | 'send';
  from: string;
  replyTo?: string;
  baseUrl: string;
}) {
  const apiKey = import.meta.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY');
  }

  const resend = new Resend(apiKey);
  const sentAt = new Date().toISOString();
  const campaignId = sentAt;
  const records: SeasonIntentCampaignRecord[] = [];

  for (const recipient of options.recipients) {
    const effectiveTo = recipient.to;
    const { data, error } = await resend.emails.send({
      from: options.from,
      to: effectiveTo,
      subject: buildSubject(recipient, options.mode),
      react: SeasonIntentEmail({ recipient, baseUrl: options.baseUrl }),
      replyTo: options.replyTo,
      tags: [
        { name: 'flow', value: 'season_intent' },
        { name: 'team', value: recipient.ploeg.replace(/[^A-Za-z0-9_-]/g, '_') },
      ],
    });

    if (error) {
      throw new Error(error.message);
    }

    records.push({
      ...recipient,
      campaignId,
      mode: options.mode,
      originalTo: recipient.to,
      effectiveTo,
      sentAt,
      resendEmailId: data?.id ?? null,
    });
  }

  return {
    campaignId,
    sentAt,
    records,
  };
}
