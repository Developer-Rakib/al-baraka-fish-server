const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware 
app.use(cors())
app.use(express.json())

// functionreq, res, next) {
//     const authorize = req.headers.authorization;
//     if (!authorize) {
//         return res.status(401).send({ message: "Unauthorize access!" })
//     }
//     // console.log(authorize);
//     const token = authorize.split(" ")[1];
//     jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
//         if (err) {
//             // console.log("err");
//             return res.status(403).send({ message: "Forbidden access" })
//         }
//         req.decoded = decoded;
//         next()
//     });
// }



const uri = `mongodb://albarakafish601:baraka2030@ac-myowzxd-shard-00-00.0puqj8t.mongodb.net:27017,ac-myowzxd-shard-00-01.0puqj8t.mongodb.net:27017,ac-myowzxd-shard-00-02.0puqj8t.mongodb.net:27017/?ssl=true&replicaSet=atlas-10lmz7-shard-0&authSource=admin&retryWrites=true&w=majority&appName=al-baraka-fish`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbflg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// mongodb://tajulislam601:rakib601@cluster0-shard-00-00.sj400.mongodb.net:27017,cluster0-shard-00-01.sj400.mongodb.net:27017,cluster0-shard-00-02.sj400.mongodb.net:27017/?ssl=true&replicaSet=atlas-wfhqoo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://tajulislam601:rakib601@cluster0-shard-00-00.sj400.mongodb.net:27017,cluster0-shard-00-01.sj400.mongodb.net:27017,cluster0-shard-00-02.sj400.mongodb.net:27017/?ssl=true&replicaSet=atlas-wfhqoo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0')
//     .then(() => console.log('Connected to MongoDB!'))
//     .catch(err => console.error('Connection error:', err));



async function run() {
    try {
        await client.connect();
        const db = client.db("al-baraka-fish")
        const SalesCollection = db.collection("sales");
        const FishStockCollection = db.collection("fishStock");
        // const MemoCollection = client.db("poristhanFashion").collection("memoSerials");
        // const UserCollection = client.db("poristhanFashion").collection("users");
        // const MarchentNameCollection = client.db("poristhanFashion").collection("marchentName");

        // get all orders
        app.get('/test', async (req, res) => {
            res.send("working")
        })

        // // get all fish stock
        app.get('/fishStock', async (req, res) => {
            const query = {};
            const result = await FishStockCollection.find(query).toArray();
            res.send(result)
        })

        // // update fish stock
        app.put("/fishStock/update/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const stockInfo = req.body;
            const updateDoc = {
                $set: stockInfo
            };
            const result = await FishStockCollection.updateOne(filter, updateDoc);
            res.send(result)
        })
        // // update entry by memo
        // app.put("/order/update/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) };
        //     const orderInfo = req.body;
        //     const updateDoc = {
        //         $set: orderInfo
        //     };
        //     const result = await OrderCollection.updateOne(filter, updateDoc);
        //     res.send(result)
        // })











        // get all sales
        app.get('/sales', async (req, res) => {
            const query = {};
            const result = await SalesCollection.find(query).toArray();
            res.send(result)
        })

        // get sales by date
        app.get('/sales/:date', async (req, res) => {
            const saleDate = req.params.date;
            const filter = {
                date: saleDate
            };
            const result = await SalesCollection.find(filter).toArray()
            res.send(result)
        })

        // add Sale 
        app.post("/sales", async (req, res) => {
            const salesInfo = req.body;
            const result = await SalesCollection.insertOne(salesInfo)
            if (result.insertedId) {
                res.send({ success: true, message: `Successfuly Sale Inserted` })
            }
            else {
                res.send({ success: false, message: `Somthing is wrong! Please try again` })
            }
        })

        // // delete Sale 
        app.delete('/sale/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await SalesCollection.deleteOne(filter);
            res.send(result)
        })




        // // get order by memo no.
        // app.get('/order/:value', async (req, res) => {
        //     const value = req.params.value;

        //     if (value.length === 11) {
        //         const filterID = { recipient_phone: value };
        //         const result = await OrderCollection.find(filterID).toArray();
        //         if (result.length > 0) {
        //             res.send({ success: true, result })
        //         }
        //         else {
        //             res.send({ success: false, message: `${value} phone number not found!` })

        //         }

        //     } else if (value.length === 8) {
        //         const filterID = { bookingID: value };
        //         const result = await OrderCollection.findOne(filterID)
        //         if (!result) {
        //             res.send({ success: false, message: `${value} no booking ID not found!` })

        //         }
        //         else {
        //             res.send({ success: true, result })
        //         }
        //         // res.send(value)

        //     } else if (value.length < 8) {
        //         const filterMemo = { memo: parseInt(value) };
        //         const result = await OrderCollection.findOne(filterMemo)
        //         if (!result) {
        //             res.send({ success: false, message: `${value} no memo entry not found!` })
        //         }
        //         else {
        //             res.send({ success: true, result })
        //         }

        //     } else {
        //         res.send({ success: false, message: `Invalid input, Please enter a memo no or booking ID` })
        //     }

        //     // res.send(result)

        // })


        // // get order by seller name and date
        // app.get('/orders/:sellerName', async (req, res) => {
        //     const sellerName = req.params.sellerName;
        //     const bookingDate = req.query.bookingDate;
        //     if (sellerName === "all") {

        //         const fiter = {
        //             bookingDate: bookingDate
        //         };
        //         const result = await OrderCollection.find(fiter).toArray()
        //         res.send(result)
        //     }
        //     else {
        //         const fiter = {
        //             sellerName: sellerName,
        //             bookingDate: bookingDate
        //         };
        //         const result = await OrderCollection.find(fiter).toArray()
        //         res.send(result)
        //     }
        // })


        // // // post orders 
        // app.post('/orders', async (req, res) => {
        //     const orderInfo = req.body;
        //     const filterMemo = { memo: orderInfo.memo };
        //     const filterID = { bookingID: orderInfo.bookingID };
        //     const existMemo = await OrderCollection.findOne(filterMemo)
        //     const existID = await OrderCollection.findOne(filterID)
        //     if (existMemo) {
        //         res.send({ success: false, message: `Memo number aleady exist!` })
        //     }
        //     else if (existID) {
        //         res.send({ success: false, message: `Booking ID aleady exist!` })
        //     }
        //     else {
        //         const result = await OrderCollection.insertOne(orderInfo)
        //         if (result.insertedId) {
        //             res.send({ success: true, message: `Successfuly sell add for ${orderInfo.sellerName}` })
        //         }
        //         else {
        //             res.send({ success: false, message: `Somthing is wrong! Please try again` })
        //         }
        //     }

        // })

        // // update entry by id
        // app.put("/order/update/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) };
        //     const orderInfo = req.body;
        //     const updateDoc = {
        //         $set: orderInfo
        //     };
        //     const result = await OrderCollection.updateOne(filter, updateDoc);
        //     res.send(result)
        // })
        // // // update entry by memo
        // // app.put("/order/update/:id", async (req, res) => {
        // //     const id = req.params.id;
        // //     const filter = { _id: ObjectId(id) };
        // //     const orderInfo = req.body;
        // //     const updateDoc = {
        // //         $set: orderInfo
        // //     };
        // //     const result = await OrderCollection.updateOne(filter, updateDoc);
        // //     res.send(result)
        // // })




        // // delete order 
        // app.delete('/order/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) };
        //     const result = await OrderCollection.deleteOne(filter);
        //     res.send(result)
        // })




        // // memo 
        // app.get('/memo', async (req, res) => {
        //     const query = {};
        //     const result = await MemoCollection.find(query).toArray();
        //     res.send(result)
        // })

        // // add memo 
        // app.put("/addMemo/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) };
        //     const memoInfo = req.body;
        //     const updateDoc = {
        //         $set: memoInfo
        //     };
        //     const result = await MemoCollection.updateOne(filter, updateDoc);
        //     res.send(result)
        // })


        // // marchentName 
        // app.get('/marchentName', async (req, res) => {
        //     const query = {};
        //     const result = await MarchentNameCollection.find(query).toArray();
        //     res.send(result)
        // })

        // // update marchent name 
        // app.put("/changeMarchentName/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) };
        //     const marchentName = req.body;
        //     const updateDoc = {
        //         $set: marchentName
        //     };
        //     const result = await MarchentNameCollection.updateOne(filter, updateDoc);
        //     res.send(result)
        // })




        // //  create user
        // app.put('/user/:email', async (req, res) => {
        //     const user = req.body;
        //     const email = req.params.email;
        //     const filte = { email: email }
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: user
        //     }
        //     const result = await UserCollection.updateOne(filte, updatedDoc, options);
        //     // const token = jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: '60d' });
        //     res.send({ result })
        // })

        // // get all users
        // app.get('/users', async (req, res) => {
        //     const query = {};
        //     const result = await UserCollection.find(query).toArray();
        //     res.send(result)
        // })


        // // get role 
        // app.get('/role/:email', async (req, res) => {
        //     const userEmail = req.params.email;
        //     const user = await UserCollection.findOne({ email: userEmail })
        //     // const isAdmin = user.role === 'admin';
        //     if (user?.role) {
        //         res.send({ role: user?.role })
        //     }
        //     else {
        //         res.send({ role: undefined })
        //     }

        // })

        // // // get admin 
        // // app.get('/admin/:email', async (req, res) => {
        // //     const userEmail = req.params.email;
        // //     const user = await UserCollection.findOne({ email: userEmail })
        // //     const isAdmin = user.role === 'admin';
        // //     res.send({ admin: isAdmin })
        // // })

        // // Edit Role
        // app.put("/user/editRole/:email", async (req, res) => {
        //     const email = req.params.email;
        //     const user = req.body;
        //     const filter = { email: email };
        //     const updateDoc = {
        //         $set: { role: user.role }
        //     };
        //     const result = await UserCollection.updateOne(filter, updateDoc);
        //     res.send(result)
        // })



    } finally {

    }
}
run().catch(console.dir)





app.get('/', (req, res) => res.send('Welcome to Al-Baraka'))
app.listen(PORT, () => console.log('Port is', PORT))