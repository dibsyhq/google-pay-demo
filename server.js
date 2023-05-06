import "dotenv/config";
import express from "express";
import { processGooglePayToken } from "./googlePayController.js";

const app = express();
const PORT = process.env.PORT || 4545;

app.use(express.static("public"));
app.use(express.json());

app.post("/payments/googlepay/tokens", processGooglePayToken);

app.listen(PORT, () => console.log(`Node server listening on port ${PORT}`));
