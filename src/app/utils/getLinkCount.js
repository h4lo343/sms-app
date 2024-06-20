const baseUrl = "https://api-v2.short.io/statistics/link/";
const shortIOKey = process.env.SHORTIO_API_KEY;

export default async function getLinkCount(linkId) {
  const requestUrl = baseUrl + linkId;
  const options = {
    method: "GET",
    headers: {
      Authorization: shortIOKey,
      accept: "*/*",
    },
  };
  const response = await fetch(requestUrl, options).then((res) => res.json());

  return response;
}