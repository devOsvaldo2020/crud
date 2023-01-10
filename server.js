const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const ObjectId = require('mongodb').ObjectID; 

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://teste:teste@cluster0.rhaau.mongodb.net/crud?retryWrites=true&w=majority";

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('crud') // coloque o nome do seu DB
    app.listen(3000, function(){
        console.log("servidor rodando. port: 3000")
    })
})
    
app.use(bodyparser.urlencoded({ extended: true}))

app.set('view engine' , 'ejs')

app.get('/', function(req, res){
    res.render('home');
}) //ok

app.get('/', (req, res) =>{
    var cursor = db.collection('funcionario').find()
})

app.get('/show' , (req, res) => {
    db.collection('funcionario').find().toArray(
        (err, results) => {
        if (err) return console.log(err)
        console.log(results)// só para teste pode tirar
        res.render('show', { data: results }) 
    })
}) //ok


app.post('/show', function(req, res){
    //criar a coleção “do banco de dados”, que irá armazenar nossos dados
    db.collection('funcionario').save(req.body, (err, result) => {
        if (err) return console.log(err)     
        console.log('rodou o post show')
        res.redirect('/show')
    })
})//ok

app.route('/edit/: id').get((req, res) =>{
    var id = req.params.id

    db.collection('funcionario').find(ObjectId(id))
    .toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit', {data: result})
    })
}) //ok

.post((req, res) => {
    var id = req.params.id
    var nome = req.body.nome
    var sobrenome = req.body.sobrenome

    db.collection('funcionario').updateOne(
        {
            _id: ObjectId(id)
        },
        {
            $set: {
                nome: nome,
                sobrenome: sobrenome
            }

        }, (err, result)=>{
            if (err) return res.send(err)                
            console.log('banco atualizado com sucesso!!')
            res.redirect('/show')
        })
})

app.route('/delete/:id').get((req, res) =>{
    var id = req.params.id

    db.collection('funcionario').deleteOne(
        {
        _id: ObjectId(id)
        },
            (err, result) =>{
                if(err) return console.log(err)
                console.log('valor removido com sucesso!!')
                res.redirect('/show')
            })       
}) //ok











