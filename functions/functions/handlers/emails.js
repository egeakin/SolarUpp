const { admin, db } = require("../util/admin");

const nodemailer = require("nodemailer");

const cors = require("cors")({origin: true});

let transporter = nodemailer.createTransport({
  service : "gmail",
  auth: {
      user: "fcelik98@gmail.com",
      pass: "yjywckzfezklsvkf"
  }
});

exports.sendMail = (req, res) => {
    cors(req, res, () => {
      
        // getting dest email by query string
        const dest = req.query.dest;

        const mailOptions = {
            from: 'Fatih Celik <fcelik98@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: "<akinege0@gmail.com>",
            subject: 'I\'M A PICKLE!!!', // email subject
            html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
                <br />
                <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
            ` // email content in HTML
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });    
  /*
  const mailjet = require('node-mailjet')
    .connect('1d7bc4911b6272370e8116e774ecfc70', 'abddb8401c91a650d50deae9ee54232a');
  request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
        {
          "From": {
            "Email": "fcelik98@gmail.com",
            "Name": "Fatih"
          },
          "To": [
            {
              "Email": "fcelik98@gmail.com",
              "Name": "Fatih"
            }
          ],
          "Subject": "Greetings from Mailjet.",
          "TextPart": "My first Mailjet email",
          "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
          "CustomID": "AppGettingStartedTest"
        }
      ]
    });
  request
    .then((result) => {
      console.log(result.body);
      return response.status(200);
    })
    .catch((err) => {
      console.log(err.statusCode);
      return response.status(500);
    });
    */
}