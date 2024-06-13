import schedule from "node-schedule";
export async function POST(request) {
  const temp = await request.json();
  const requestData = temp.data;
  const url = `https://cdpt.in/shorten?url=${requestData.link}`;
  const shortendUrl = await fetch(url).then(
    async (response) => await response.text()
  );
  const templateMessage = requestData.message.replace(
    "{link}",
    shortendUrl + "/"
  );
  const shortCodes = extractShortCode(templateMessage);

  for (let i = 0; i < requestData.to.length; i++) {
    const customerNumber = requestData.to[i];
    const customerData = requestData.sub[i];
    let customerMessage = templateMessage;

    for (let shortCode of shortCodes) {
      const shortCodeInfo = customerData[shortCode] || "";
      customerMessage = customerMessage.replace(
        `{${shortCode}}`,
        shortCodeInfo
      );
    }
    scheduleMessage(
      customerMessage,
      requestData.from,
      customerNumber,
      requestData.scheduleDate
    );
  }

  return new Response({
    status: 200,
  });
}

function extractShortCode(str) {
  const regex = /{([^}]*)}/g;
  let matches = [];
  let match;
  while ((match = regex.exec(str)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function scheduleMessage(message, from, to, scheduleDate) {
  const time = new Date(Number(scheduleDate));
  schedule.scheduleJob(time, function () {
    console.log(message, from, to);
    // sendMessage()
  });
}
