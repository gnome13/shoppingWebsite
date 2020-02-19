console.log("app is loading");
const express = require("express");
const app = express();
const mongoDB_BuyingCenter = require('./mongoDB_BuyingCenter')
const routHelper = require('./routerHelper');
const path=require('path');

const multer  = require('multer');
const uploadDirectory = 'uploads/';
const upload = multer({ dest: uploadDirectory});

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

// --- used for json in body
app.use(express.json());

// let idsUsers = 3,idsItems=3,idCategoriot=3,idStatus=3;


const users = [
  {email:'gozmanv@013.net',password: '12345678',userID: 1, userName: 'Gozman Valentina', telefon:'+972544532852',boss:true},
  {email:"kukue@013.net",password: "87654321",userID: 2, userName: "Gozman Alisa",telefon:"+972544882852",boss:false}
];
const userAdress = [
  { userID: 1, shipingYes: true, street: "ahad am",house:10,flat:10,town:"lod",postcode:"444444" },
  { userID: 1, shipingYes: false, street: "ahad am",house:10,flat:10,town:"lod",postcode:"444444" }
];
const categoriot = [
  { categoriot: 1, description: "dress" },
  { categoriot: 2, description: "shoes" }
];  
const items = [
  { itemID: 1, categoriotID: 1, description:"bbbbbbbbbbb", picture: 'dress1.jpg', price: 100 },
  { itemID: 2, categoriotID: 1, description:"bbbbbbbbbbb", picture: 'dress2.jpg', price: 150 }
];  
const shoppingCard = [
  { userID:1 , itemID: 1 },
  { userID:1 , itemID: 2  }
];  
const orders = [
{ orderID:1 , userID:1 , itemID: 1 ,date:"20/10/2019",status:1},
{  orderID:1 , userID:1 , itemID: 2 ,date:"20/10/2019",status:1 }
];  
const status = [
  { status: 1, description: "create" },
  { status: 2, description: "on fly" }
];  
let param='';
app.get("/categoriot", (req, res) => {
  mongoDB_BuyingCenter.handeGet(req,res,'categoriot');
});
app.get("/userAdress", (req, res) => {
  param={ userID: Number(req.query.userID)}
  mongoDB_BuyingCenter.handeGet(req,res,'userAdress',param);
});
app.get("/items", (req, res) => {
  param={ categoriotID: Number(req.query.categoriotID)};
  mongoDB_BuyingCenter.handeGet(req,res,'items',param);
});

app.get("/shoppingCard", (req, res) => {
  param={ userID: Number(req.query.userID)};
  mongoDB_BuyingCenter.handeGetshoppingCard(req,res,'shoppingCard',param);
});
app.get("/orders", (req, res) => {
  param={ userID: Number(req.query.userID)};;
  mongoDB_BuyingCenter.handeGetOrders(req,res,'orders',param);
});
app.post("/users/register", (req, res) => {
  routHelper.register(req,res);
});
app.post("/users/login", (req, res) => {
  routHelper.login(req,res);
});
app.post("/users/order", (req, res) => {
  routHelper.addOrder(req,res,'orders');
});
app.post("/users/shoppingCard", (req, res) => {
  routHelper.addshoppingCard(req,res,'shoppingCard');
});
app.post("/users/userAdress", (req, res) => {
  routHelper.userAdress(req,res);
});
app.post("/categoriot", (req, res) => {
  routHelper.categoriotAdd(req,res,'categoriot');
});
app.put("/categoriot", (req, res) => {
  routHelper.categoriotUpdate(req,res,'categoriot');
});
app.put("/users/userAdress", (req, res) => {
  routHelper.userUpdate(req,res,'userAdress');
});
app.put("/users/userUpdate", (req, res) => {
  routHelper.userUpdate(req,res,'users');
});
app.put("/items", (req, res) => {
  routHelper.itemsUpdate(req,res,'items');
});
app.post("/items", (req, res) => {
  routHelper.itemsAdd(req,res,'items');
});
app.get('/images/:newFieName',(req, res) => {
  const fullPathName = path.join(__dirname,uploadDirectory,req.params.newFieName);
  res.sendfile(fullPathName);
});
app.post("/api",upload.single('someFile'),(req, res) => {
  console.log("/api is accessed");
  res.status(201).send({body:req.body,file:req.file});
});

app.delete("/shoppingCard", (req, res) => {
  param={ userID: Number(req.query.userID),itemID: Number(req.query.itemID)};
  mongoDB_BuyingCenter.handeDelete(req,res,'shoppingCard',param);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
