import { Request, Response } from '@vercel/node'
import { getScreenshot } from './_lib/puppeteer';

module.exports = async (req: Request, res: Response) => {
  const usage = "https://s.vercel.app/api?url=https://google.com&width=1280&height=720 or https://s.vercel.app/api?lotimg=true&date=01062565"
  if (!req.query.url && (!req.query.lotimg && !req.query.date)) return res.status(400).json({
    "success": false,
    "error": "No url query specified.",
    "usage": usage
  });
  let havelot = false;
  let date = null;
  if(req.query.lotimg === "true") {
    havelot = true
    date = req.query.date
  };
  try {
    const file = await getScreenshot(req.query.url, req.query.width, req.query.height, havelot, date);
    res.setHeader('Content-Type', `image/png`);
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).end(file);
  } catch (error) {
    console.error(error)
    res.setHeader('Content-Type', 'application/json');
    res.status(400).json({
      "success": false,
      "error": "The server encountered an error. You may have inputted an invalid query.",
      //"dev": error,
      "usage": usage
    });
  }
}
