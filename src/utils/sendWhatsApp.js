import axios from "axios";

const INSTANCE_ID =
  "instance174845";

const TOKEN =
  "qpixes3m5h7srm7v";

const PHONE =
  "918792171917";

export const sendWhatsAppAlert =
  async (message) => {

    try {

      await axios.post(
        `https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`,
        {
          token: TOKEN,
          to: PHONE,
          body: message
        }
      );

      console.log(
        "WhatsApp alert sent"
      );

    } catch (error) {

      console.log(error);
    }
};