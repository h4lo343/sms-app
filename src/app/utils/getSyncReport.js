import { link } from "fs";
import queryString from "querystring";
import getLinkCount from "./getLinkCount";
let nextLink;
const vonageKey = process.env.VONAGE_API_KEY;
const vonageSecret = process.env.VONAGE_API_SECRET;
// const baseUrl = `https://api.nexmo.com/v2/reports/records`;
const baseUrl = `https://api.nexmo.com/v2/reports/records`;
const authStr = Buffer.from(vonageKey + ":" + vonageSecret).toString("base64");
const records = [];
export default async function getReport(clientRef) {
  const linkId = clientRef.split("-")[1];
  const linkInfo = await getLinkCount(linkId);
  const params = queryString.stringify({
    account_id: vonageKey,
    client_ref: clientRef,
    // id: "e67bc8f2-16a7-4d28-b139-b36cf35c3e3d",
    date_start: "2024-06-14T10:56:27.000Z",
    product: "SMS",

    direction: "outbound",
  });
  const requestUrl = baseUrl + "?" + params;

  const result = {};
  const non_delivered_numbers = [];
  result.taskUuid = clientRef;
  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authStr}`,
    },
    cache: "no-store",
  }).then((res) => res.json());
  console.log(response);
  nextLink = response._links?.next?.href;
  records.push(...response.records);
  while (nextLink) {
    await continueRequest(nextLink);
  }
  console.log(records);
  console.log(`----------------${records.length} records got------------`);
  for (let report of records) {
    const status = report.status;
    if (!result[status]) {
      result[status] = 1;
    } else {
      result[status]++;
    }
    if (status === "expired" || status === "failed" || status === "rejected") {
      non_delivered_numbers.push(report.to);
    }
  }
  result.non_delivered_numbers = non_delivered_numbers;
  result.linkInfo = linkInfo;
  records.length = 0;
  return result;
}

async function continueRequest(link) {
  const response = await fetch(link, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authStr}`,
    },
    cache: "no-store",
  }).then((res) => res.json());
  nextLink = response._links?.next?.href;
  records.push(...response.records);
}
