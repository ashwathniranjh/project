const bcrypt = require('bcryptjs');

const User = require('../models/users');
//const { getMaxListeners } = require('../models/users');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

let transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key:'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'
  }
}));

exports.getLogin = (req, res, next) => {
  res.render('auth/index', {
    path: '/',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  //console.log(req.body.userid);
  //console.log(req.body.password);
  const userid = req.body.userid.toString();
  const password = req.body.password.toString();
  User.findOne({  userid: userid })
    .then(user => {
      if (!user) {
        console.log("1");
        return res.redirect('/');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              //console.log(req.session.user);
              res.redirect('/dashboard');
            });
          }
          res.redirect('/');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/');
        });
    })
    .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postSignup = (req, res, next) => {
  const userid = req.body.userid;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password.toString();
  const confirmPassword = req.body.confirmPassword;
  const output = `
  <p> You have signed up to gallery! </p>
  <h3>Account details</h3>
  <ul>
    <li>Userid: ${userid}</li>
    <li>Name: ${name}</li>
    <li>Email id: ${email}</li>
  </ul>
  <p>Hope you have a great time using Gallery.</p>
  `;
  User.findOne({ userid: userid })
    .then(userDoc => {
      if (userDoc) {
        return res.redirect('/signup');
      }
      if(password === confirmPassword){
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            name: name,
            userid: userid,
            email: email,
            password: hashedPassword,
            posts: { photo: [] },
            followers: { user: [] },
            following: { user: [] }
          });

          return user.save();
          
        })
        .then(result => {
          res.redirect('/');
           return transporter.sendMail({
            from: 'mailconfirm@gallery.com', // sender address
            to: `${email}`, // list of receivers
            subject: 'Gallery Signup Confirmation', // Subject line
            html: output, // html body
          });
        });
    }
    else{
        return res.redirect('/signup');
    }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
