const axios = require("axios")

let adminCookie = null;
let cookieExpiry = null;
const HRIS_URL = process.env.FRAPPE_URL;
const ADMIN_USER = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASSWORD


function isCookieValid() {
  return adminCookie && cookieExpiry && new Date() < cookieExpiry;
}

async function getAdminCookie() {
  if (isCookieValid()) return adminCookie;

  console.log("Logging in to HRIS...");
  const resp = await axios.post(`${HRIS_URL}/api/method/login`, {
    usr: ADMIN_USER,
    pwd: ADMIN_PASS
  });

  // Extract SID cookie
  adminCookie = resp.headers['set-cookie'].find(c => c.startsWith('sid=')).split(';')[0];
  global.adminSid = adminCookie;
  cookieExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  console.log("✅ Obtained HRIS cookie:", adminCookie);
  return adminCookie;
}

module.exports = { getAdminCookie };
