import schedule from "node-schedule";

let scheduleTaskQueue = [];

export async function POST(request) {
  const { data: requestData } = await request.json();
  const shortendUrl = urlShorten(requestData.link);

  const templateMessage = requestData.message.replace(
    "{link}",
    shortendUrl + "/"
  );
  const shortCodes = extractShortCode(templateMessage);
  const taskIndex = scheduleMessage(requestData, shortCodes, templateMessage);
  return new Response(
    { taskIndex },
    {
      status: 200,
    }
  );
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

function scheduleMessage(requestData, shortCodes, templateMessage) {
  const time = new Date(Number(requestData.scheduleDate));
  const job = schedule.scheduleJob(time, function () {
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
        console.log(customerMessage);
      }
    }
  });
  scheduleTaskQueue.push(job);
  return scheduleTaskQueue.length;
}

export async function DELETE(request) {
  const { index } = await request.json();
  scheduleTaskQueue[index].cancle();
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
  console.log(shortURL);
  return shortURL;
}
