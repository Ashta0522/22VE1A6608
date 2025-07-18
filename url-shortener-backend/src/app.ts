import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import shorturlRoutes from "./routes/shorturl";
import { logger } from "./middleware/logger";
import { getUrl, addClick } from "./services/urlService";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(logger("route"));

app.use("/shorturls", shorturlRoutes);

app.get("/:shortcode", async (req, res) => {
  const code = req.params.shortcode;
  const entry = getUrl(code);
  if (!entry) {
    await res.locals.log("error", "Shortcode not found for redirect");
    return res.status(404).json({ error: "Shortcode not found" });
  }
  if (new Date() > new Date(entry.expiry)) {
    await res.locals.log("error", "Short link expired");
    return res.status(410).json({ error: "Short link expired" });
  }
  addClick(code, req.get("referer"), req.ip);
  await res.locals.log("info", `Redirected to ${entry.url}`);
  res.redirect(entry.url);
});

export default app; 