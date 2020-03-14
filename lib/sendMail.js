require("./mailin");

module.exports = (msg, callback) => {
  const client = new Mailin(
    "https://api.sendinblue.com/v2.0",
    process.env.SENDINBLUE_SECRET
  );
  let recievers;
  if (typeof msg.to === "string") {
    recievers = { [msg.to]: msg.to };
  } else if (typeof msg.to === "object") {
    recievers = {};
    msg.to.forEach(reciever => {
      recievers[reciever] = reciever;
    });
  }

  const data = {
    to: recievers,
    from: [process.env.FROM_EMAIL, "Tovp.org"],
    subject: msg.subject,
    html: msg.html,
    attachment: msg.attachment || []
  };

  if (msg.custom) {
    callback(false);
  } else {
    client.send_email(data).on("complete", data => {
      const parsedData = JSON.parse(data);
      if (parsedData.code === "failure") {
        callback(parsedData.message);
      } else {
        callback(false);
      }
    });
  }
};
