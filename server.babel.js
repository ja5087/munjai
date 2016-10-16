import express from 'express';

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //we need to enable CORS or we can't embed secure stuff'
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("X-Frame-Options", "ALLOW-FROM https://www.youtube.com");
  next();
});

app.use('/', express.static('public')); //defines '/'' as in public folder




app.listen(process.env.PORT || 3000); //listens at environment variable PORT or 3000 (for remote deployment)