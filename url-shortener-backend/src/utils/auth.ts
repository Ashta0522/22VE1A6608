import axios from "axios";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

const REGISTER_API = "http://20.244.56.144/evaluation-service/register";
const AUTH_API = "http://20.244.56.144/evaluation-service/auth";

const credentials = {
  companyName: "", // Optional, fill if required
  clientID: "c504cee7-e893-4258-8501-217dfb043c93",
  clientSecret: "euHBSjftNsxPuESn",
  ownerName: "Rama Ashta Lakshmi Chakilam",
  ownerEmail: "ashta2205@gmail.com",
  rollNo: "22ve1a6608",
  accessCode: "NNZDGq"
};

export async function getAuthToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) return cachedToken;

  // Register (ignore errors if already registered)
  await axios.post(REGISTER_API, credentials).catch(() => {});

  // Authenticate and get token
  const response = await axios.post(AUTH_API, {
    email: credentials.ownerEmail,
    name: credentials.ownerName,
    rollNo: credentials.rollNo,
    accessCode: credentials.accessCode,
    clientID: credentials.clientID,
    clientSecret: credentials.clientSecret,
  });
  const data = response.data as { access_token: string };
  cachedToken = data.access_token;
  tokenExpiry = now + 60 * 60 * 1000;
  return cachedToken!;
}