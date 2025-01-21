const qrcode = require("qrcode");

const convertLinkToQr = async (link) => {
  try {
    const qr = await qrcode.toDataURL(link, { errorCorrectionLevel: "H" });
    return qr;
  } catch (err) {
    console.log("error while creating qr: ", err);
    return;
  }
};

module.exports = convertLinkToQr;
