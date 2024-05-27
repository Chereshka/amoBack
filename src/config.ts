import * as dotenv from "dotenv";

dotenv.config();

export default {
  port: parseInt(process.env.PORT || "3000", 10),
  amo: {
    token: process.env.AMO_SECRET || "",
    subdomain: process.env.AMO_SUBDOMAIN || "",
  }

};

