// Makes the WhatsApp QR code shown next to the inquiry form (for visitors on a
// computer, who scan it with their phone). Reads contact.whatsapp from
// site/agency.config.js and writes the file named in contact.whatsappQr.
// Run it again whenever your WhatsApp link changes (e.g. after "Reset QR code").
// Desktop computer only:  cd tools && npm install && node make-whatsapp-qr.mjs
import QRCode from "qrcode";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const site = fileURLToPath(new URL("../site/", import.meta.url));
const sandbox = { window: {} };
vm.runInNewContext(await readFile(site + "agency.config.js", "utf8"), sandbox);
const { whatsapp = "", whatsappQr = "" } = sandbox.window.AGENCY_CONFIG.contact || {};

// Same rule as the website: a WhatsApp link is used as-is, a bare number becomes one.
const link = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(whatsapp.trim())
  ? whatsapp.trim()
  : whatsapp.replace(/\D/g, "") && "https://wa.me/" + whatsapp.replace(/\D/g, "");
if (!link || !whatsappQr) {
  console.error("Set contact.whatsapp and contact.whatsappQr in site/agency.config.js first.");
  process.exit(1);
}

const svg = await QRCode.toString(link, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 2,
  color: { dark: "#0B1B33", light: "#FFFFFF" },
});
await writeFile(site + whatsappQr, svg);
console.log(`saved site/${whatsappQr} → ${link}`);
