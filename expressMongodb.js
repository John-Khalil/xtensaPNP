var express = require("express");
const bodyParser = require('body-parser')
const router = express.Router();
var nodeFileSystem= require("fs");
var cors = require('cors');
const { endianness } = require("os");

const appListenerPort =229;
var app=express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.use(express.json());


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const dataBase="dataBase";
const dataBaseCollection="dataBaseCollection";
var generalCollection=null;


async function clientInsertOne(insertedObject){                         //just for testing purpose
    return await generalCollection.insertOne(insertedObject);
}

async function clientFind(queryObject){
    return await generalCollection.find(queryObject);
}

function authenticator(userCredentials){
    return (userCredentials=="bWluYSBtYWdkeQ==");               // we could make an authentication server later
}

async function main(){
    try{
        MongoClient.connect(url, async(err, dataBaseObject)=> {
            if (err) throw err;
        
            generalCollection=await dataBaseObject.db(dataBase).collection(dataBaseCollection);

            app.post("/dataBase",(req,res)=>{
                var userQueryObject=req.body.userQueryObject||{};
                var userSortingObject=req.body.userSortingObject||{};
                var userAuth=req.body.userAuth||"endUser";
                if(userAuth=="endUser"){
                    generalCollection.find(userQueryObject).sort(userSortingObject).toArray((err,results)=>{
                        if(err)throw err;
                        console.log("results >> ",results);
                        res.send(JSON.stringify({
                            userQuery:req.body,
                            queryResult:results
                        }));
                    });
                }
                else if(authenticator(userAuth)){
                    var adminRequest=req.body.adminRequest||{};
                    if(((adminRequest.updateOne||{}).updateQuery!=undefined)&&((adminRequest.updateOne||{}).newValuse!=undefined)){
                        generalCollection.updateOne(adminRequest.updateOne.updateQuery,adminRequest.updateOne.newValuse,(err, res)=>{
                            if (err) throw err;
                            console.log(res);
                        });
                    }
                    if(adminRequest.insertOne!=undefined){
                        generalCollection.insertOne(adminRequest.insertOne,(err,res)=>{
                            if (err) throw err;
                            console.log(res);
                        });
                    }
                    if(adminRequest.deleteOne!=undefined){
                        generalCollection.deleteOne(adminRequest.deleteOne,(err,res)=>{
                            if (err) throw err;
                            console.log(res);
                        });
                    }
                    res.send(res);
                   
                }
                
                
                
            });

            app.use('/home',(req,res)=>{
                var webPage;

                try{
                    webPage=nodeFileSystem.readFileSync(decodeURI(req.originalUrl).slice(1));
                }
                catch(fileErr){
                    console.log(fileErr);
                    webPage="File Not Found";
                }
                
                res.send(webPage);
            });

            // app.route('/home').get((req,res)=>{
                
                
                
            // });
            
            
            app.listen(appListenerPort,()=>{
                console.log("--server started--");
            });

        
            // var test=await clientInsertOne({
            //     name:"mina",
            //     gender:"male",
            //     age:22
            // })
        
            // console.log(`final res - ${test} `,test);
        
        
        
        
            // console.log("Database created!");
            //dataBaseObject.close();
        });
    }
    finally{
        
    }
}

main().catch(console.error);


