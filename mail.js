var nodemailer = require("nodemailer");
var mailer = function(mailOptions){
  console.log(mailOptions);
let transporter = nodemailer.createTransport({
  service: 'gmail',
  //port: 587,
  auth: {
      user: "techkopra1@gmail.com",
      pass: "Techk0pra@123"
  },
    logger: true, // log to console
    debug: true // include SMTP traffic in the logs
});

  transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
          return console.log(error);
      }else{
        console.log("message sent successfully");

      }

  });

}

module.exports = mailer;
