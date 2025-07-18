import { Router, Request, Response } from "express";
import { createShortUrl, getUrl, addClick } from "../services/urlService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url) {
    await res.locals.log("error", "Missing URL in request body");
    return res.status(400).json({ error: "URL is required" });
  }
  if (shortcode && getUrl(shortcode)) {
    await res.locals.log("error", "Shortcode already exists");
    return res.status(409).json({ error: "Shortcode already exists" });
  }
  const entry = createShortUrl(url, validity, shortcode);
  if (!entry) {
    await res.locals.log("error", "Shortcode collision");
    return res.status(409).json({ error: "Shortcode already exists" });
  }
  await res.locals.log("info", `Short URL created: ${entry.shortcode}`);
  res.status(201).json({
    shortLink: `${req.protocol}://${req.get("host")}/${entry.shortcode}`,
    expiry: entry.expiry,
  });
});

router.get("/:shortcode", async (req: Request, res: Response) => {
  const code = req.params.shortcode;
  const entry = getUrl(code);
  if (!entry) {
    await res.locals.log("error", "Shortcode not found");
    return res.status(404).json({ error: "Shortcode not found" });
  }
  res.status(200).json({
    url: entry.url,
    created: entry.created,
    expiry: entry.expiry,
    totalClicks: entry.clicks.length,
    clicks: entry.clicks,
  });
});

export default router; 