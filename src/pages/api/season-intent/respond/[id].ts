import type { APIRoute } from 'astro';
import { renderConfirmationPage } from '../../../../lib/season-intent/email-template.js';
import { findRecipientById, findResponseById, saveResponse } from '../../../../lib/season-intent/storage.js';
import { isSeasonIntentChoice } from '../../../../lib/season-intent/shared.js';

function htmlResponse(html: string, status = 200) {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export const GET: APIRoute = async ({ params, url }) => {
  const id = params.id?.trim();
  const choice = url.searchParams.get('choice');

  if (!id || !isSeasonIntentChoice(choice)) {
    return htmlResponse(
      renderConfirmationPage({
        title: 'Ongeldige link',
        heading: 'Ongeldige link',
        message: 'Deze link is niet geldig. Neem gerust contact op met VC HEBO Jeugd.',
      }),
      400,
    );
  }

  const recipient = await findRecipientById(id);
  if (!recipient) {
    return htmlResponse(
      renderConfirmationPage({
        title: 'Link niet gevonden',
        heading: 'Link niet gevonden',
        message: 'Deze keuze-link werd niet gevonden. Neem gerust contact op met VC HEBO Jeugd.',
      }),
      404,
    );
  }

  const existing = await findResponseById(id);
  if (existing) {
    return htmlResponse(
      renderConfirmationPage({
        title: 'Keuze al ontvangen',
        heading: 'Keuze al ontvangen',
        message: 'Je hebt je keuze al doorgegeven. Bedankt!',
      }),
    );
  }

  await saveResponse({
    id,
    campaignId: recipient.campaignId,
    choice,
    respondedAt: new Date().toISOString(),
  });

  return htmlResponse(
    renderConfirmationPage({
      title: 'Keuze ontvangen',
      heading: 'Bedankt!',
      message: `We noteerden jouw keuze voor ${recipient.childName}.`,
    }),
  );
};
