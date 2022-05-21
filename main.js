const express = require('express')
var bodyParser = require('body-parser')
const mysql = require('mysql')
const Connection = require('mysql/lib/Connection')
const app = express()
const port = 8080

const con= mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'user'
})

con.connect((err)=>{
  if(err) throw err;
  console.log('Connected DB')
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'));

var data=[];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users',(req,res)=>{
  con.query("SELECT * FROM USERS",(err,results,fields)=>{
    if(err)throw err;

    res.render(__dirname + '/users.ejs',{results}) // json 을 전송하여 ejs 파일에서 변수 출력할 수 있도록 함
  })
})

app.post('/users/create',(req,res)=>{
  con.query("INSERT INTO USERS VALUES(?,?,?)",
    [req.body.id,req.body.pw,req.body.name],
    (err,results,fields)=>{
    if(err) throw err;
    console.log("INSERT COMPLETE")
  })

  res.redirect('/users')
})

app.get('/users/create',(req,res)=>{
  res.sendFile(__dirname + '/create.html')
})

app.get('/users/:userid',(req,res)=>{

  con.query("SELECT * FROM USERS WHERE userid=?",[req.params.userid],(err,results,fields)=>{
    if(err)throw err;

    console.log('db접근')
    console.log(results);
    if(results.length == 0){
      res.send('해당 사용자를 찾을 수 없습니다.')
    }
    else{
      res.render(__dirname + '/user.ejs',{results})
    }
    
  })

})

app.post('/users/:userid/delete',(req,res)=>{
  
  con.query('DELETE FROM USERS WHERE userid=?',[req.params.userid],(err,results,field)=>{
    if(err) throw err;
    console.log('DELETE COMPLETE')
    res.redirect('/users')
  })
  
})



app.listen(port, () => {
  console.log(`start server ${port}`)
})