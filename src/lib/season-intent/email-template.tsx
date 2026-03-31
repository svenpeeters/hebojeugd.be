import { Body, Container, Head, Html, Img, Preview, Section, Text } from '@react-email/components';
import * as React from 'react';
import { escapeHtml, type SeasonIntentChoice, type SeasonIntentRecipient } from './shared.js';

const defaultBaseUrl = 'https://www.hebojeugd.be';
const logoUrl = 'https://www.hebojeugd.be/logo.png';

interface SeasonIntentEmailProps {
  recipient: SeasonIntentRecipient;
  baseUrl?: string;
}

export function SeasonIntentEmail({ recipient, baseUrl = defaultBaseUrl }: SeasonIntentEmailProps) {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
      </Head>
      <Preview>Laat ons weten wat de plannen zijn voor volgend seizoen.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={hero}>
            <Img src={logoUrl} alt="VC HEBO Jeugd" width="120" height="120" style={logo} />
            <Text style={heroTitle}>VC HEBO JEUGD</Text>
            <Text style={heroMeta}>STAMNR 09827</Text>
          </Section>

          <Section style={content}>
            <Text style={text}>Hey {recipient.parentRole} van {recipient.childName}!</Text>
            <Text style={text}>
              We beginnen stilaan na te denken over volgend seizoen. Om alles goed te kunnen voorbereiden,
              horen we graag wat de plannen zijn voor {recipient.childName}. Zo kunnen we de ploegen vlot
              samenstellen en iedereen de beste begeleiding geven.
            </Text>
            <Text style={metaText}>Deze link is geldig tot en met 10 april.</Text>
          </Section>

          <a href={buildChoiceUrl(baseUrl, recipient.id, 'stay')} style={{ ...bandLink, backgroundColor: '#eef6fb' }}>
            <Text style={bandTitle}>Ja, wij blijven bij HEBO!</Text>
            <Text style={bandText}>Ons kind is er volgend seizoen weer bij. Count us in!</Text>
            <span style={{ ...pill, backgroundColor: '#0f5a8a' }}>Wij blijven</span>
          </a>

          <a href={buildChoiceUrl(baseUrl, recipient.id, 'leave')} style={{ ...bandLink, backgroundColor: '#fff3f1' }}>
            <Text style={bandTitle}>Helaas, wij stoppen ermee</Text>
            <Text style={bandText}>Ons kind gaat naar een andere club of stopt met voetbal.</Text>
            <span style={{ ...pill, backgroundColor: '#c9463d' }}>Wij stoppen</span>
          </a>

          <a href={buildChoiceUrl(baseUrl, recipient.id, 'talk')} style={{ ...bandLink, backgroundColor: '#fff9e7' }}>
            <Text style={bandTitle}>Even babbelen eerst?</Text>
            <Text style={bandText}>We twijfelen nog of hebben eerst nog een vraagje.</Text>
            <span style={{ ...pill, backgroundColor: '#b68a1a' }}>Laat ons praten</span>
          </a>

          <Section style={closing}>
            <Text style={text}>Alvast bedankt voor jullie medewerking en snelle reactie.</Text>
            <Text style={signoff}>Met sportieve groeten,<br />VC HEBO Jeugd</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function buildChoiceUrl(baseUrl: string, id: string, choice: SeasonIntentChoice) {
  const url = new URL(`/api/season-intent/respond/${escapePathSegment(id)}`, baseUrl);
  url.searchParams.set('choice', choice);
  return url.toString();
}

function escapePathSegment(value: string) {
  return encodeURIComponent(value);
}

export function buildSubject(recipient: SeasonIntentRecipient, mode: 'test' | 'send') {
  const baseSubject = `VC HEBO Jeugd - ${recipient.childName} Seizoen 2026-2027`;
  return mode === 'test' ? `[TEST] ${baseSubject}` : baseSubject;
}

export function renderConfirmationPage(options: {
  title: string;
  heading: string;
  message: string;
}) {
  const title = escapeHtml(options.title);
  const heading = escapeHtml(options.heading);
  const message = escapeHtml(options.message);

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { margin: 0; font-family: Inter, Arial, sans-serif; background: #f5f5f3; color: #1f2730; }
      main { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
      section { max-width: 560px; background: #fff; border: 1px solid #ece7df; padding: 32px 28px; }
      h1 { font-family: 'Bebas Neue', Impact, sans-serif; font-size: 44px; margin: 0 0 16px; letter-spacing: 0.04em; }
      p { font-size: 16px; line-height: 1.7; margin: 0; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <h1>${heading}</h1>
        <p>${message}</p>
      </section>
    </main>
  </body>
</html>`;
}

const main = { backgroundColor: '#f5f5f3', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", margin: '0', padding: '20px 10px' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', maxWidth: '620px' };
const hero = { borderBottom: '1px solid #ece7df', padding: '20px 24px 18px', textAlign: 'center' as const };
const logo = { display: 'block', margin: '0 auto 10px' };
const heroTitle = { color: '#1f2730', fontSize: '24px', fontWeight: '700', margin: '0 0 4px' };
const heroMeta = { color: '#6f6d67', fontSize: '12px', letterSpacing: '0.05em', margin: '0' };
const content = { padding: '20px 24px 10px' };
const text = { color: '#363c42', fontSize: '15px', lineHeight: '1.65', margin: '0 0 12px' };
const metaText = { color: '#6f6d67', fontSize: '13px', lineHeight: '1.4', margin: '0 0 12px' };
const bandLink = { display: 'block', padding: '16px 24px 18px', textDecoration: 'none', cursor: 'pointer' } as React.CSSProperties;
const bandTitle = { color: '#1f2730', fontSize: '17px', fontWeight: '700', margin: '0 0 5px' };
const bandText = { color: '#4d545b', fontSize: '14px', lineHeight: '1.6', margin: '0 0 12px' };
const pill = { borderRadius: '999px', color: '#ffffff', display: 'inline-block', fontSize: '13px', fontWeight: '700' as const, padding: '11px 16px' };
const closing = { borderTop: '1px solid #ece7df', padding: '18px 24px 24px' };
const signoff = { color: '#1f2730', fontSize: '15px', fontWeight: '700', lineHeight: '1.6', margin: '0' };
