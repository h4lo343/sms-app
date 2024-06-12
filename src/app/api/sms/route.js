import supabase from "@/app/lib/supabase";
import vonage from "@/app/lib/vonage";

export async function POST(request) {
  const requestData = await request.json();
  const { data } = await supabase.from("customer_info").select();

  for (const customer of data) {
    const temp = await vonage.sms.send({
      to: customer.customer_number,
      from: requestData.senderNumber,
      text: requestData.SMSContent,
    });
    const vonage_response = temp.messages[0];

    await supabase.from("sms_result").insert({
      sender_number: requestData.senderNumber,
      sender_name: requestData.senderName,
      receiver_number: customer.customer_number,
      receiver_name: customer.customer_name,
      time: new Date(),
      content: requestData.SMSContent,
      status: vonage_response["status"],
      message_price: vonage_response["messagePrice"],
      message_id: vonage_response["messageId"],
    });
  }
  return new Response({
    status: 200,
  });
}
