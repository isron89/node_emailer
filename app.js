
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const akun = require('./env.js')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 5000;

//server mulai
app.get("/", (req, res) => {

    res.status(200).send("Server ready, siap digunakan!");

})

//email file....

app.post("/api/mail", function (request, response) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: akun.email,
            pass: akun.password
        }
    });
   
    const admin = {
        to: akun.email, // list penerima (dapat multipel, dipisahkan koma)
        subject: `Pengiriman berhasil`, // Subject
        text: `${request.body.to} ${request.body.sub} ${request.body.text}` //text
    };

    const mail = {
        //from: `${request.body.from}`, // email pengirim
        to: `${request.body.to}`, // list penerima (dapat multipel, dipisahkan koma)
        subject: `${request.body.sub}`, // Subject
        text: `${request.body.text}` //text
        // attachments: [{   // menyisipkan file
        //   filename: 'test.docx',
        //   content: './storage/test.docx'
        // }]
    };

    // send mail with defined transport object
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    (async () => {

    if (`${request.headers.auth}` == akun.auth) {

    console.log(`Authorisasi berhasil`)

    //kirim ke admin
    transporter.sendMail(admin, function (err, info) {
        if (err) {
            console.log(err);
            response.json({
                message: "message not sent: an error occured; check the server's console log"
            });
        } else {
            console.log("Pengiriman ke admin berhasil")
            console.log("Pengiriman ke klien pending selama 6 jam")
            response.json({
                message: `Email telah sukses terkirim!`
            });
        }
    });

    await delay(360000);

    //kirim ke klien
    transporter.sendMail(mail, function (err, info) {
        if (err) {
            console.log(err);
            response.json({
                message: "message not sent: an error occured; check the http request"
            });
        } else {
             console.log("Pengiriman ke klien berhasil")
            response.json({
                message: `Email telah sukses terkirim!`
            });
        }
    });
    } else {
        response.json({
                message: `Anda tidak terautentikasi`
            });
    }

    })();
});



//express....
app.listen(port, () => {

    console.log(`Server berjalan pada ${port}.`);

})

// catch 404, meneruskan ke error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  // render error page
  res.status(err.status || 500);
  res.json({
     message: err.message,
     error: req.app.get('env') === 'development' ? err : {} 

  });
});

module.exports = app;
