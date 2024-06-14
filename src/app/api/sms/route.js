import supabase from "@/app/lib/supabase";
import vonage from "@/app/lib/vonage";
import sendVonageSMS from "@/app/utils/sendVonageSMS";

export async function POST(request) {
  const requestData = await request.json();
  const { data } = await supabase.from("customer_info").select();

  for (const customer of data) {
    const vonage_response = await sendVonageSMS(
      customer.customer_number,
      requestData.senderName,
      requestData.SMSContent
    );
    console.log(vonage_response);
    // const vonage_response = temp.messages[0];
    // await supabase.from("sms_result").insert({
    //   sender_name: requestData.senderName,
    //   receiver_number: customer.customer_number,
    //   receiver_name: customer.customer_name,
    //   time: new Date(),
    //   content: requestData.SMSContent,
    //   status: vonage_response["status"],
    //   message_price: vonage_response["messagePrice"],
    //   message_id: vonage_response["messageId"],
    // });
  }
  return new Response({
    status: 200,
  });
}
