import { Vonage } from "@vonage/server-sdk";

const vonageKey = process.env.VONAGE_API_KEY;
const vonageSecret = process.env.VONAGE_API_SECRET;

const vonage = new Vonage({
  apiKey: vonageKey,
  apiSecret: vonageSecret,
});

export default vonage;
