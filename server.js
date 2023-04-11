import express from "express";
import { config } from "dotenv";
import { processGooglePayToken } from "./googlePayController.js";

const app = express();
const PORT = process.env.PORT || 4545;

config();
app.use(express.static("public"));
app.use(express.json());

app.post("/payments/googlepay/tokens", processGooglePayToken);

app.listen(PORT, () => console.log(`Node server listening on port ${PORT}`));
