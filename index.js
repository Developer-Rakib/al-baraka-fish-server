const express = require('express');
const cors = require('cors');
const moment = require("moment");
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


            // const allDocs = await SalesCollection.find({}).toArray();

            // for (const doc of allDocs) {
            //     if (typeof doc.date === "string") {
            //         const parsedDate = moment(doc.date, "DD MMM YYYY").toDate();
            //         await SalesCollection.updateOne(
            //             { _id: doc._id },
            //             { $set: { date: parsedDate } }
            //         );
            //     }
            // }

            // console.log("All dates converted!");
            // await client.close();
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

        // add fish stock
        app.post("/fishStock/create", async (req, res) => {
            const stockInfo = req.body;
            const result = await FishStockCollection.insertOne(stockInfo)
            if (result.insertedId) {
                res.send({ success: true, message: `Added fish in the stock` })
            }
            else {
                res.send({ success: false, message: `Somthing is wrong! Please try again` })
            }
        })


        // get all sales
        app.get('/sales', async (req, res) => {
            const query = {};
            const result = await SalesCollection.find(query).toArray();
            res.send(result)
        })

        // get sales by date
        app.get('/sales/:date', async (req, res) => {
            const dateStr = req.params.date; // e.g., "04 Mar 2025"

            const start = moment(dateStr, "DD MMM YYYY").startOf('day').toDate(); // 2025-03-04 00:00:00
            const end = moment(dateStr, "DD MMM YYYY").endOf('day').toDate();     // 2025-03-04 23:59:59

            const filter = {
                date: {
                    $gte: start,
                    $lte: end
                }
            };

            try {
                const result = await SalesCollection.find(filter).toArray();
                res.send(result);
            } catch (error) {
                console.error("Error fetching sales:", error);
                res.status(500).send({ error: "Internal server error" });
            }
        });


        // get sales by month
        app.get('/sales/month/:month', async (req, res) => {
            const monthStr = req.params.month; // e.g., "Mar 2025"

            // Start and end of the month (e.g., for "Mar 2025" → 2025-03-01 to 2025-03-31)
            const start = moment(monthStr, "MMM YYYY").startOf('month').toDate();  // First day of the month
            const end = moment(monthStr, "MMM YYYY").endOf('month').toDate();    // Last day of the month

            const filter = {
                date: {
                    $gte: start,
                    $lte: end
                }
            };

            try {
                const result = await SalesCollection.find(filter).toArray();
                res.send(result);
            } catch (error) {
                console.error("Error fetching sales:", error);
                res.status(500).send({ error: "Internal server error" });
            }
        });

        // add Sale 
        app.post("/sales", async (req, res) => {
            try {
                const salesInfo = req.body;

                // Convert date string to Date object
                if (salesInfo.date) {
                    // Try parsing as ISO first, fallback to "DD MMM YYYY"
                    const parsedDate = moment(salesInfo.date, moment.ISO_8601, true).isValid()
                        ? new Date(salesInfo.date)
                        : moment(salesInfo.date, "DD MMM YYYY").toDate();

                    salesInfo.date = parsedDate;
                }

                const result = await SalesCollection.insertOne(salesInfo);

                if (result.insertedId) {
                    res.send({ success: true, message: "Successfully Sale Inserted" });
                } else {
                    res.send({ success: false, message: "Something is wrong! Please try again" });
                }
            } catch (error) {
                console.error("Insert error:", error);
                res.status(500).send({ success: false, message: "Server error occurred" });
            }
        });


        // // delete Sale 
        app.delete('/sale/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await SalesCollection.deleteOne(filter);
            res.send(result)
        })







    } finally {

    }
}
run().catch(console.dir)





app.get('/', (req, res) => res.send('Welcome to Al-Baraka'))
app.listen(PORT, () => console.log('Port is', PORT))