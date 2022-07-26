let express = require('express');
let app = express();
let morgan = require('morgan');
let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 8500;
let mongo = require('mongodb');
let cors = require('cors');
let MongoClient = mongo.MongoClient;
let bodyParser = require('body-parser')
let mongoUrl = process.env.MongoLocalUrl;
let db;

app.use(morgan('common'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.get('/',(req,res)=>{
    res.send('<h1>This is flipkart api</h1>');
})

app.get('/category',(req,res)=>{
    db.collection('category').find ().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.get('/category',(req,res) => {
    db.collection('category').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result);
    })
}) 

 
//to show all Product

app.get('/product',(req,res)=>{
    db.collection('product').find({},{'product_name':1,'_id':0}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.get('/details/:id',(req,res)=>{
    let id = Number(req.params.id);
    db.collection('product').find({product_id:Number(id)},{product_name:1,_id:0}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

//To show Product Acc to category
app.get('/product/:id',(req,res)=>{
    let id=req.params.id;
    db.collection('product').find({category_id:Number(id)},{product_name:0}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
}) 

//To show Product Acc to Brands
app.get('/products',(req,res)=>{
    let query = {}
    let brandId = Number(req.query.brandId);
    if(brandId){
        query = {"Brand.brand_id":brandId}
    }else{
        query = {}
    }
    db.collection('product').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

// connections with Mongodb
MongoClient.connect(mongoUrl,(err,client) =>{
    if(err) console.log(`Error While Connecting`);
    db = client.db('flipkart');
    app.listen(port,() => {
        console.log(`listening on port ${port}`)
    })
})