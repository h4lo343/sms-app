import schedule from "node-schedule";
import sendVonageSMS from "@/app/utils/sendVonageSMS";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import moment from "moment-timezone";
import sendVonageSMSFetch from "@/app/utils/sendVonageSMSFetch";

export async function POST(request, res) {
  const { data: requestData } = await request.json();
  const uuid = uuidv4().slice(0, 7);
  const urlResponse = await urlShorten(requestData.link + `#${uuid}`);
  console.log("---------------url response-----------------");
  console.log(urlResponse);
  console.log("---------------url response-----------------");
  const { shortURL, idString } = urlResponse;
  const templateMessage = requestData.message.replace("{link}", shortURL + "/");
  const shortCodes = extractShortCode(templateMessage);
  const taskUuid = await scheduleMessage(
    requestData,
    shortCodes,
    templateMessage,
    idString,
    uuid
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
  idString,
  uuid
) {
  const taskUuid = uuid + "-" + idString;

  if (!requestData.scheduleDate) {
    sendMessageTask(requestData, templateMessage, taskUuid, shortCodes);
    return taskUuid;
  }
  console.log("---------this task has the time---------");
  const time = new Date(
    moment.utc(Number(requestData.scheduleDate)).tz(moment.tz.guess()).format()
  );

  console.log("----------task-scheduled------------");
  const tempMoment = moment()
    .tz("Australia/Sydney")
    .format("YYYY-MM-DD HH:mm:ss");
  const job = schedule.scheduleJob(taskUuid, time, async function () {
    sendMessageTask(requestData, templateMessage, taskUuid, shortCodes);
  });
  return taskUuid;
}

async function sendMessageTask(
  requestData,
  templateMessage,
  taskUuid,
  shortCodes
) {
  console.log("***Task Executed***");
  for (let i = 0; i < requestData.to.length; i++) {
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
    console.log("message send" + " " + taskUuid);
  }
  return taskUuid;
}

async function urlShorten(originalURL) {
  if (!originalURL) return { shortURL: "", idString: "" };
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
  const response = await fetch("https://api.short.io/links", options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });

  const { shortURL, idString } = response;
  return { shortURL, idString };
}
