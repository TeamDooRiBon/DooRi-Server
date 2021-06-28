import express from "express"; 
const app = express(); 
import connectDB from "./Loaders/db";
import routes from './routes';

connectDB();

app.use(express.urlencoded);
app.use(express.json());  

app.use(routes);   //라우터 
// error handler
app.use(function (err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app 
  .listen(5000, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: 5000 🛡️
    ################################################
  `);
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });