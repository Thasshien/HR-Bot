const axios = require("axios");
const url = "http://localhost:5005/webhooks/rest/webhook";

const askReq = async (req, res) => {
    try {
        const { query } = req.body;
        console.log("query:", query);

        if (!query) {
            return res.status(400).json({ message: "No queries" });
        }

        const reply = await axios.post(url, {
            sender: "user1",
            message: query
        });

        // Extract texts from Rasa response
        const texts = reply.data.map(r => r.text).join(" "); 

        console.log(texts);
        res.status(200).json({ reply: texts });  // send only string
    } catch (error) {
        console.error("askReq error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { askReq };
