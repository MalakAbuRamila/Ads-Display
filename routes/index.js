const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const session = require('express-session');
const crypto = require('crypto');

//controllers
const errorController = require('../controllers/error');
const newAdController =  require('../controllers/newad');
const loginController = require('../controllers/login');
const adminController = require('../controllers/admin');


//session
const secret = crypto.randomBytes(64).toString('hex');
router.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
}));

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

//authentication
sequelize.authenticate().then(()=>{
  console.log('Connection has been established successfully.');
})
    .catch((err)=>{
      console.log(err);
    })


const Ad = require('../models/Ad')(sequelize); // Import the Ad model
Ad.sync({force: false}).then(() => {
  console.log("Ads table is up");
});


async function createAd(id, title, description, price, phone, email ) {
  await Ad.create({id,  title, description, price, phone, email  })
      .then(() => console.log("Created an ad successfully."))
      .catch(err => {
        console.log(err);
        alert("An error has occurred: " + err.message);
      });
}

async function findAds() {
  return Ad.findAll()
      .then(ads => {
        if(typeof ads === "undefined")
          return [];
        else{
          return ads;
        }
      })
  .catch(err => {console.log(err); alert("An error has occurred: " + err.message);});
}




/* GET home page. */
router.get('/', async (req, res)=> {
  try {
    //find all approved ads
    let approvedAds = await Ad.findAll({ where: { approved: true }, order: [['createdAt', 'DESC']] });

    //check if there is a search query
      const querySearch = req.query.q;
      if(querySearch){
          approvedAds = approvedAds.filter(ad =>
              ad.title.toLowerCase().includes(querySearch.toLowerCase()));
      }

    //render the landing page with approved ads
    res.render('index', { title: 'Ads', ads: approvedAds, querySearch });
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//get new ad page
router.get('/new-ad', newAdController.getNewAd);

router.post('/new-ad', async (req, res) =>{
  try{
      //create ad
    const {id, title, description, price, phone, email } = req.body;
    await createAd(id, title, description, price, phone, email );

    //define a cookie for the user's email
    let welcomeMessage = null;
    const userEmail = req.cookies.userEmail;

    if(userEmail && userEmail === email){
      const previousAd = await Ad.findOne({ where: { email }, order: [['createdAt', 'DESC']] });
      if (previousAd) {
          //if a user already posted an ad before, display a welcome back message with the email and created at date
        welcomeMessage = `Welcome back, ${email}! Your previous ad was posted on ${previousAd.createdAt}. \nYour ad was successfully posted and is waiting for approval.`;
      }
    }
    else {

      welcomeMessage = 'Your ad was successfully posted and is waiting for approval.';
      //cookie for the user's email
      res.cookie('userEmail', email);
    }
    res.cookie('welcomeMessage', welcomeMessage);

    //redirect to added page after posting the ad
    res.redirect('/added');

  }
  catch (error){
    res.status(400).send('Bad Request');
  }
});

//get added page
router.get('/added', (req, res) => {
  const welcomeMessage = req.cookies.welcomeMessage;
  res.render('added', { welcomeMessage });
});

router.post('/add-ad',function(req, res) {

  createAd(req.body.id, req.body.title, req.body.description, req.body.price, req.body.phone, req.body.email)

      .then(() =>
          findAds()
              .then(ads => {
                res.json(ads);
              })
              .catch(() => res.render('error', {message: 'Error'}))
      )
      .catch(() => res.render('error', {message: 'Error'}))

});

//delete ads
router.delete('/ads/:id', (req, res) => {
  const adId = req.params.id;

  Ad.destroy({
    where: {
      id: adId,
    }
  })
      .then(() => {
        findAds()
            .then(ads => {
              res.json(ads);
            })
      })
      .catch(error =>  {
        res.status(500).render('error', {message:'Internal server error'});

      });
});

//update (for approved ads)
router.put('/approved/:id', async (req, res) => {
  try{
    const adId = req.params.id;
    const {approved} = req.body;

    const ad = await Ad.findByPk(adId);

    if(!ad){
      return res.status(404).render('error', {message:'Ad not found'});

    }

    ad.approved = approved;
    await ad.save();
    res.json({message: 'Ad approved successfully'});
  }
  catch (error){
    console.log(error);
    res.status(500).render('error', {message:'Internal server error'});

  }
});
router.get('/find-ads', function(req, res) {

  if(!req.session.user)
    //if the session expired, display the error page with relevant error message
    res.render('error', {message: 'Only admin has access to this information'});
 else {
    findAds()
        .then(ads => {
          res.json(ads);
        })
        .catch(() => res.render('error', {message:'Error'}));
  }
});

//get login page
router.get('/login', loginController.getLogin);

router.post('/login', loginController.postLogin);

//get admin page
router.get('/admin', adminController.getAdmin);

//get logout page
router.get('/logout', loginController.getLogout);

// GET error page
router.get('/error', errorController.getError);

module.exports = router;
