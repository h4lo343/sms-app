import vonage from "@/app/lib/vonage";

export default async function sendVonageSMS(
  customerNumber,
  senderName,
  SMSContent,
  clientRef
) {
  const vonage_response = (
    await vonage.sms.send({
      to: customerNumber,
      from: senderName,
      text: SMSContent,
      "client-ref": clientRef,
    })
  ).messages[0];

  return vonage_response;
}
