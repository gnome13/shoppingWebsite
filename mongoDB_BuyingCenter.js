const mongodb=require('mongodb')
const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/";
const my_db='buyingCenter';
// const bookCollection='books';

function handeGet(req,res,collectionName,param){
    MongoClient.connect(url,{useUnifiedTopology: true,useNewUrlParser: true,}, function(err, db) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        const dbo = db.db(my_db);
        if (param){
            
            dbo.collection(collectionName).find(param).toArray(function(err, items) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.status(200).send(items);
              });
        }
        else{
            dbo.collection(collectionName).find({}).toArray(function(err, items) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.status(200).send(items);
                // console.log(items);
              });
        }

      }
      );
}

function handeGetshoppingCard(req,res,collectionName,param){
    MongoClient.connect(url,{useUnifiedTopology: true,useNewUrlParser: true,}, function(err, db) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        const dbo = db.db(my_db);
        if (param){
            dbo.collection(collectionName).find(param).toArray(function(err, shoppingCard) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                for (let index = 0; index < shoppingCard.length; index++) {
                    const element = shoppingCard[index];
                    dbo.collection('items').find({itemID:element.itemID}).toArray(function(err, items) {
                        if (err) {
                            res.sendStatus(500);
                            return;
                        }
                        shoppingCard[index]={...shoppingCard[index], description:items[0].description, picture:items[0].picture, price:items[0].price };
                        if (index==shoppingCard.length-1)  {
                            res.status(200).send(shoppingCard);
                        }                          
                    });                    
                }

              });
        }
        else{
            dbo.collection(collectionName).find({}).toArray(function(err, items) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.status(200).send(items);
                // console.log(items);
              });
        }

      }
      );
}

function handeGetOrders(req,res,collectionName,param){
    MongoClient.connect(url,{useUnifiedTopology: true,useNewUrlParser: true,}, function(err, db) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        const dbo = db.db(my_db);
        if (param){
            dbo.collection(collectionName).find(param).toArray(function(err, orders) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                for (let index = 0; index < orders.length; index++) {
                    const element = orders[index];
                    dbo.collection('items').find({itemID:element.itemID}).toArray(function(err, items) {
                        if (err) {
                            res.sendStatus(500);
                            return;
                        }
                        orders[index]={...orders[index], description:items[0].description, picture:items[0].picture, price:items[0].price };

                        dbo.collection('status').find({status:Number(element.status)}).toArray(function(err, status) {
                            if (err) {
                                res.sendStatus(500);
                                return;
                            }
                            orders[index]={...orders[index], statusName:status[0].description };
                            if (index==orders.length-1)  {
                                res.status(200).send(orders);
                            }                                 
                        });
                     
                    });                    
                }

              });
        }
        else{
            dbo.collection(collectionName).find({}).toArray(function(err, items) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.status(200).send(items);
                // console.log(items);
              });
        }

      }
      );
}
function handeDelete(req,res,CollectionName,param){
    MongoClient.connect(url, function(err, db) {
        if (err)  {
            res.sendStatus(500);
            return;
        }
        const dbo = db.db(my_db);
        dbo.collection(CollectionName).find(param).toArray(function(err, result) {
            if (err)  {
                res.sendStatus(500);
                return;
            }
            if (result.length==0){
                res.sendStatus(404);
            }
            else {
                dbo.collection(CollectionName).deleteOne(param, function(err, result) {
                    if (err)  {
                        res.sendStatus(500);
                        return;
                    }
                    res.sendStatus(200);
                    });     
            }
        });
    });
}

module.exports.handeGet =handeGet;
module.exports.handeDelete=handeDelete;
module.exports.handeGetshoppingCard =handeGetshoppingCard;
module.exports.handeGetOrders =handeGetOrders;

