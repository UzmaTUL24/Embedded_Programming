import Twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages.create({
  from: process.env.TWILIO_WHATSAPP_FROM,
  to: process.env.TWILIO_WHATSAPP_TO,
  body: "⚠️ Test Alert from Weather Station!"
})
.then(msg => console.log("Message SID:", msg.sid))
.catch(err => console.error(err));

