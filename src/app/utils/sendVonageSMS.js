import vonage from "@/app/lib/vonage";

export default async function sendVonageSMS(
  customerNumber,
  senderName,
  SMSContent,
  clientRef
) {
  const vonage_response = await vonage.sms.send({
    to: customerNumber,
    from: senderName,
    text: SMSContent,
    "client-ref": clientRef,
  });
  console.log("------------------vonage_response----------------");
  console.log(vonage_response);
  console.log("------------------vonage_response----------------");

  return vonage_response.messages[0];
}
