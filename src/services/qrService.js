const QRCode = require("qrcode");

const buildAttendanceQr = async ({ attendeeId, eventName, email, qrToken }) => {
  const payload = JSON.stringify({
    attendeeId,
    eventName,
    email,
    qrToken
  });

  return QRCode.toDataURL(payload, {
    margin: 1,
    width: 280,
    color: {
      dark: "#062431",
      light: "#F8FAFC"
    }
  });
};

module.exports = {
  buildAttendanceQr
};
