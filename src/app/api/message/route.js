import schedule from "node-schedule";
import sendVonageSMS from "@/app/utils/sendVonageSMS";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import moment from "moment-timezone";

export async function POST(request, res) {
  const { data: requestData } = await request.json();
  const { shortURL, idString } = await urlShorten(requestData.link);
  const templateMessage = requestData.message.replace("{link}", shortURL + "/");

  const shortCodes = extractShortCode(templateMessage);
  const taskUuid = await scheduleMessage(
    requestData,
    shortCodes,
    templateMessage,
    idString
  );
  return NextResponse.json({ data: taskUuid }, { stasu: 200 });
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

async function scheduleMessage(
  requestData,
  shortCodes,
  templateMessage,
  idString
) {
  const taskUuid = uuidv4().slice(0, 4) + "-" + idString;
  let time;
  if (!requestData.scheduleDate) {
    const temp = new Date();
    time = new Date(temp.setSeconds(temp.getSeconds() + 5));
  } else {
    time = new Date(requestData.scheduleDate);
  }
  console.log(time);
  time = moment(time);
  let i = 0;
  console.log(time);
  const job = schedule.scheduleJob(taskUuid, time, async function () {
    for (; i < requestData.to.length; i++) {
      const customerNumber = requestData.to[i];
      const customerData = requestData.sub[i];
      let customerMessage = templateMessage;
      for (let shortCode of shortCodes) {
        let shortCodeInfo;
        if (customerData) {
          shortCodeInfo = customerData[shortCode];
        } else {
          shortCodeInfo = "";
        }
        customerMessage = customerMessage.replace(
          `{${shortCode}}`,
          shortCodeInfo
        );
      }
      const vonage_response = await sendVonageSMS(
        customerNumber,
        requestData.from,
        customerMessage,
        taskUuid
      );
    }
  });
  return taskUuid;
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
      domain: "trytopsms.com",
    }),
  };
  const { shortURL, idString } = await fetch(
    "https://api.short.io/links",
    options
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });

  return { shortURL, idString };
}
