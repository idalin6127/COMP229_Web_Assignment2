const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const dbURL = 'mongodb://localhost:8080/Dressstore'; // 根据您的实际数据库信息进行修改

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('Connected to the database!');
    })
    .catch(err => {
      console.log('Cannot connect to the database!', err);
      process.exit();
    });
  

const db = {};

db.mongoose = mongoose;

db.url = dbConfig.url;

db.products = require("./product.model.js")(mongoose);
db.categories = require("./category.model.js")(mongoose);

 

module.exports = db;