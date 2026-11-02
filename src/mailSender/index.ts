import { BrevoClient } from '@getbrevo/brevo';
import { BREVO_API_KEY, BREVO_SENDER_EMAIL } from '#/util/variable';

if (!BREVO_SENDER_EMAIL) {
  throw new Error(
    'BREVO_SENDER_EMAIL is missing. Set it in .env / your hosting env vars to a sender you have verified in Brevo (Senders, Domains & Dedicated IPs -> Senders).',
  );
}

if (/@gmail\.com$/i.test(BREVO_SENDER_EMAIL)) {
  console.warn(
    `Brevo sender ${BREVO_SENDER_EMAIL} is a Gmail address - mail may be flagged as spam or have the sender rewritten. Test with Gmail and Outlook inboxes.`,
  );
}

if (!BREVO_API_KEY) {
  throw new Error(
    'BREVO_API_KEY is missing. Set it in .env (Brevo: your name -> SMTP & API -> API Keys).',
  );
}

if (!BREVO_API_KEY.startsWith('xkeysib-')) {
  throw new Error(
    `BREVO_API_KEY must start with "xkeysib-" (v3 API key), got "${BREVO_API_KEY.slice(0, 9)}...". ` +
      'Keys starting with "xsmtpsib-" are SMTP credentials and are rejected by the API with 401.',
  );
}

// Log a masked key so typos, quotes or trailing spaces are easy to spot.
console.log(
  `Brevo api-key header: ${BREVO_API_KEY.slice(0, 10)}...${BREVO_API_KEY.slice(-4)} (length ${BREVO_API_KEY.length})`,
);

export const brevo = new BrevoClient({ apiKey: BREVO_API_KEY });
