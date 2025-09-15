const express = require("express");
const axios = require("axios");
require("dotenv").config();

const FRAPPE_URL = process.env.FRAPPE_URL;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "no valid email or password" });
    }

    await axios.post(`${FRAPPE_URL}/api/method/login`, {
      usr: email,
      pwd: password
    });

    res.status(200).json({ message: "Login successful", user: { email } });
  } catch (err) {
    res.status(500).json({ error: "Invalid email or password" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const response = await axios.post(`${FRAPPE_URL}/api/method/login`, {
      usr: process.env.ADMIN_EMAIL,
      pwd: process.env.ADMIN_PASSWORD
    });
    const sidCookie = response.headers["set-cookie"].find(c => c.startsWith("sid="));
    global.adminSid = sidCookie.split(";")[0];
    console.log("Admin logged in, sid stored!", global.adminSid);
  } catch (err) {
    console.error("Admin login failed:", err.response?.data || err.message);
  }
};

module.exports = { login, loginAdmin };
