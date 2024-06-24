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
  console.log("hi i am fetch func");
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
      message_type: "text",
      sms: {
        encoding_type: "text",
        content_id: "1107457532145798767",
        entity_id: "1101456324675322134",
      },
    }),
  }).then((res) => res.json());
  console.log("-------------------vonage response----------------");
  console.log(response);

  console.log("-------------------vonage response----------------");
  console.log(`message id: ${response}`);
  return response;
}
