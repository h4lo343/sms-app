import vonage from "@/app/lib/vonage";

export default async function sendVonageSMS(
  customerNumber,
  senderName,
  SMSContent,
  clientRef
) {
  console.log("hi i am sdk func");
  const vonage_response = await vonage.sms
    .send({
      to: customerNumber,
      from: senderName,
      text: SMSContent,
      "client-ref": clientRef,
      channel: "sms",
    })
    .then((res) => {
      console.log("sdk request finished");
      return res;
    });
  console.log("hi i am sdk func finished");
  console.log("------------------vonage_response----------------");
  console.log(vonage_response);
  console.log("------------------vonage_response----------------");

  return vonage_response.messages[0];
}
