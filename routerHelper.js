const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const dbName='buyingCenter', collectionName='users',collectionNameAdr='userAdress';
var idsUsers = 3,idOrders=3,idsItems=3,idCategoriot=3;

function login(req,res){
  console.log("/users/login is accessed");
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    };
    const dbo = db.db(dbName);
    //espesting email, password
    const queryUser=req.body;
    
    dbo.collection(collectionName).findOne(queryUser, function(err, user) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      };
      if(user) {
        //this is post but no document is created 
        return res.status(200).send(user);
      }
      //user not found
      return res.sendStatus(404);
    });
  });  
}
function register(req,res){
    console.log("/users/register is accessed");
    MongoClient.connect(url, function(err, db) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      };
      const dbo = db.db(dbName);
      //espesting email, password
      const queryUser=req.body;
      dbo.collection(collectionName).findOne({email:queryUser.email}, function(err, userfound) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        };
        if(userfound) {
          //--email found 
          return res.sendStatus(400);
        }
        
        //no match insert user
        // dbo.collection(collectionName).insertOne(queryUser, function(err, result) {
        dbo.collection(collectionName).insertOne({email:queryUser.email,password:queryUser.password,userID:idsUsers}, function(err, result) {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          };
          idsUsers++;
          return res.status(201).send({email:queryUser.email,password:queryUser.password,userID:idsUsers-1});
        });      
       
        
      });
    });
}
function addOrder(req,res,collectionNameParam){
  console.log("/users/order is accessed");
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    };
    const dbo = db.db(dbName);
    const queryUser=req.body;
    let now = new Date();
    let tarich=now.getDate() + '/' + (now.getMonth()+1) + '/' + now.getFullYear();
    dbo.collection(collectionNameParam).insertOne({orderID:idOrders,userID:queryUser.userID,itemID:queryUser.itemID,quantity:Number(queryUser.quantity),date:tarich,status:1}, function(err, result) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      };
      idOrders++;
     
      return res.status(201).send({orderID:idOrders-1,userID:queryUser.userID,itemID:queryUser.itemID,quantity:Number(queryUser.quantity)});
    });      
  });
}

function addshoppingCard(req,res,collectionNameParam){
  console.log("collectionNameParam is accessed");
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    };
    const dbo = db.db(dbName);
    const queryUser=req.body;
    dbo.collection(collectionNameParam).insertOne({userID:queryUser.userID,itemID:queryUser.itemID,quantity:Number(queryUser.quantity)}, function(err, result) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      };
    const queryUser=req.body;
    return res.status(201).send({userID:queryUser.userID,itemID:queryUser.itemID,quantity:Number(queryUser.quantity)});
    });      
  });
}

function userAdress(req,res){
  console.log("/users/userAdress  is accessed");
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    };
    const dbo = db.db(dbName);
    const queryUser=req.body;
    dbo.collection(collectionNameAdr).findOne({userID:queryUser.userID}, function(err, userfound) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      };
      if(userfound) {
        //--user found 
        return res.sendStatus(400);
      }
      
      //no match insert user
      dbo.collection(collectionNameAdr).insertOne(queryUser, function(err, result) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        };
        res.sendStatus(201);
      });      
     
      
    });
  });
}
function userUpdate(req,res,CollectionNameUpdate){
  console.log("/users is accessed");
  MongoClient.connect(url, {useUnifiedTopology: true,useNewUrlParser: true,},function(err, db) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    };
    const dbo = db.db(dbName);
    //espesting email, password
    const queryUser=req.body;
    dbo.collection(CollectionNameUpdate).findOne({userID:queryUser.userID},function(err, userfound) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      };
      if(userfound) {
        
        dbo.collection(CollectionNameUpdate).deleteOne({userID:queryUser.userID}, function(err, result) {
          if (err)  {
              res.sendStatus(500);
              return;
          }
          //no match insert user
          dbo.collection(CollectionNameUpdate).insertOne(queryUser, function(err, result) {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            };
            return res.status(200).send(queryUser)
          });           
          // res.sendStatus(200);
          // db.close();
          });    
      }
    });
  });
}

function categoriotAdd(req,res,CollectionNameadd){
  console.log("/categoriot  is accessed");
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    };
    const dbo = db.db(dbName);
    const query=req.body;
    dbo.collection(CollectionNameadd).findOne({description:query.description}, function(err, userfound) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      };
      if(userfound) {
        //--user found 
        return res.sendStatus(400);
      }
      
      //no match insert user
      dbo.collection(CollectionNameadd).insertOne({categoriot:idCategoriot,description:query.description}, function(err, result) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        };
        idCategoriot++;
        return res.status(201).send({categoriot:idCategoriot,description:query.description});
      });      
    });
  });
}
function categoriotUpdate(req,res,CollectionNameUpdate){
  console.log("/categoriot is accessed");
  MongoClient.connect(url, {useUnifiedTopology: true,useNewUrlParser: true,},function(err, db) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    };
    const dbo = db.db(dbName);
    //espesting email, password
    const query=req.body;
    console.log(query);
    dbo.collection(CollectionNameUpdate).findOne({categoriot:query.categoriot},function(err, categoryfound) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      };
      if(categoryfound) {
        
        dbo.collection(CollectionNameUpdate).deleteOne({categoriot:query.categoriot}, function(err, result) {
          if (err)  {
              res.sendStatus(500);
              return;
          }
          //no match insert user
          dbo.collection(CollectionNameUpdate).insertOne(query, function(err, result) {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            };
            return res.status(200).send(query)
          });           
          // res.sendStatus(200);
          // db.close();
          });    
      }
    });
  });
}
function itemsUpdate(req,res,CollectionNameUpdate){
  console.log("/items is accessed");
  MongoClient.connect(url, {useUnifiedTopology: true,useNewUrlParser: true,},function(err, db) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    };
    const dbo = db.db(dbName);
    //espesting email, password
    const query=req.body;
    dbo.collection(CollectionNameUpdate).findOne({itemID:query.itemID,categoriotID:query.categoriotID},function(err, itemfound) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      };
      if(itemfound) {
        
        dbo.collection(CollectionNameUpdate).deleteOne({itemID:query.itemID,categoriotID:query.categoriotID}, function(err, result) {
          if (err)  {
              res.sendStatus(500);
              return;
          }
          //no match insert user
          dbo.collection(CollectionNameUpdate).insertOne(query, function(err, result) {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            };
            return res.status(200).send(query)
          });           
          // res.sendStatus(200);
          // db.close();
          });    
      }
    });
  });
}
function itemsAdd(req,res,CollectionNameadd){
  console.log("/items  is accessed");
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    };
    const dbo = db.db(dbName);
    const query=req.body;
    //no match insert user
    dbo.collection(CollectionNameadd).insertOne({itemID:idsItems,categoriotID:query.categoriotID,description:query.description,picture:query.picture,price:Number(query.price)}, function(err, result) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      };
      idsItems++;
      return res.status(201).send({itemID:idsItems,categoriotID:query.categoriotID,description:query.description,picture:query.picture,price:Number(query.price)});
    });      
  });
}
module.exports.register = register;
module.exports.login = login;
module.exports.userAdress = userAdress;
module.exports.userUpdate = userUpdate;
module.exports.addOrder = addOrder;
module.exports.addshoppingCard = addshoppingCard;
module.exports.categoriotUpdate = categoriotUpdate;
module.exports.categoriotAdd = categoriotAdd;
module.exports.itemsUpdate = itemsUpdate;
module.exports.itemsAdd = itemsAdd;