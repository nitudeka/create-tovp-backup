const shell = require("shelljs");
const CronJob = require("cron").CronJob;
const base64 = require("file-base64");
const sendMail = require("./lib/sendMail");
require("dotenv").config();

const main = () => {
  const fileName = `backup-${Date.now()}.zip`;

  // remove the previous zip files
  shell.exec(`rm *.zip`);

  // create the backup
  shell.exec(`mongodump --host="localhost:27017"`);

  // craete zip from backup
  shell.exec(`zip -r ${fileName} dump`);

  base64.encode(fileName, function(err, base64String) {
    const mail = {
      to: process.env.TO_MAIL,
      subject: "Tovp database backup",
      html: `<p>Database backup of ${new Date()}</p>`,
      attachment: { [fileName]: base64String }
    };
    sendMail(mail, err => {
      if (err) console.log(err);
      else console.log("mail sent at", new Date());
    });
  });
};

const job = new CronJob("0 0 0 * * *", main);

// start the cron job
job.start();
