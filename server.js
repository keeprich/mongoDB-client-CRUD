const express = require('express');
const MongoClient = require('mongodb').MongoClient
const app = express();

app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))

// DATABASE CONNECTION
// const connectionString = "mongodb://127.0.0.1:27017/mongoClientDemo"

MongoClient.connect("mongodb://127.0.0.1:27017/mongoClientDemo", {
    useUnifiedTopology: true
  }) 
  .then(client => {
      console.log('connected agin and tring to set new database name')
      const db = client.db('star-wars-quotes')

    // creating database table or collections named "quotes"
    const quotesCollection = db.collection('quotes')

 



app.get('/', function (req, res) {

    res.sendFile(__dirname + '/index.html')
})

app.get('/quotes', (req, res) => {
    db.collection('quotes').find().toArray()
      .then(results => {
        res.render('index.ejs', {quotes: results})

        console.log(results)
      })
      .catch(error => console.error(error))
    })

app.post('/quotes', (req, res) => {
    console.log('Hellooooooooooooooooo!')
    console.log(req.body)

    quotesCollection.insertOne(req.body)
    .then(result => {
        res.redirect('/')
      console.log(result)
    })
    .catch(error => console.error(error))
  });

  app.put('/quotes', (req, res) => {
    quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => {
            res.json('Success')
            console.log(result)
        })
        
        .catch(error => console.error(error))
    console.log(req.body)
  })

  app.delete('/quotes', (req, res) => {

    quotesCollection.deleteOne(
        { name: req.body.name },
       
      )
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json('No quote to delete')
              }
            res.json(`Deleted Darth Vadar's quote`)

        })
        .catch(error => console.error(error))

})


app.listen(9000, function() {
    console.log('listening on 9000')
  })


})
.catch(console.error)