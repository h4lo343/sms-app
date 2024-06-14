import schedule from "node-schedule";
import sendVonageSMS from "@/app/utils/sendVonageSMS";

export async function POST(request) {
  const { data: requestData } = await request.json();
  const shortendUrl = await urlShorten(requestData.link);

  const templateMessage = requestData.message.replace(
    "{link}",
    shortendUrl + "/"
  );
  const shortCodes = extractShortCode(templateMessage);
  scheduleMessage(requestData, shortCodes, templateMessage);
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

async function scheduleMessage(requestData, shortCodes, templateMessage) {
  const time = new Date(Number(requestData.scheduleDate));
  let i = 0;
  const job = schedule.scheduleJob(requestData.to[i], time, async function () {
    for (; i < requestData.to.length; i++) {
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
      const vonage_response = await sendVonageSMS(
        customerNumber,
        requestData.from,
        customerMessage
      );
    }
  });
  // job.cancel();
  // scheduleTaskQueue.push(job);
  // console.log(job, scheduleTaskQueue.length);
}

export async function DELETE(request) {
  const { deleteNum } = await request.json();
  schedule.scheduledJobs[Number(deleteNum)]?.cancle();
  return new Response({
    status: 200,
  });
}

async function urlShorten(originalURL) {
  const shortIOKey = process.env.SHORTIO_API_KEY;
  const options = {
    method: "POST",
    headers: {
      Authorization: shortIOKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      originalURL: originalURL,
      domain: "topsms.au",
    }),
  };
  const { shortURL } = await fetch("https://api.short.io/links", options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });
  return shortURL;
}
