const vonageKey = process.env.VONAGE_API_KEY;
const vonageSecret = process.env.VONAGE_API_SECRET;
const baseUrl = `https://api.nexmo.com/v1/messages`;
const authStr = Buffer.from(vonageKey + ":" + vonageSecret).toString("base64");

export default async function sendVonageSMSFetch(
  customerNumber,
  senderName,
  SMSContent,
  clientRef
) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authStr}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message_type: "text",
      channel: "sms",
      from: senderName,
      to: customerNumber,
      text: SMSContent,
      client_ref: clientRef,
    }),
  }).then((res) => res.json());
}
