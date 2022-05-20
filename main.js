const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = 8080

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'));

var data=[];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users',(req,res)=>{
  res.render(__dirname + '/users.ejs',{data}) // json 을 전송하여 ejs 파일에서 변수 출력할 수 있도록 함
})

app.post('/users/create',(req,res)=>{
  data.push(req.body); 
  console.log(data)
  res.redirect('/users')
})

app.get('/users/create',(req,res)=>{
  res.sendFile(__dirname + '/create.html')
})

app.get('/users/:userid',(req,res)=>{
  console.log('route')
  var Rdata = null
  for( let i of data){
    console.log(typeof(i.id) + " " + typeof(req.params.userid))
    if(i.id == req.params.userid){ //파라미터를 사용
      Rdata = i;
    }
  }
  if(Rdata == null)res.send('사용자를 찾을 수 없습니다.')
  else{res.render(__dirname + '/user.ejs',{Rdata})}
})

app.post('/users/:userid/delete',(req,res)=>{
  console.log('parse')
  for(let i in data){
    if(data[i].id == req.params.userid){
      data.splice(i,1);
    }
  }
  res.redirect('/users')
})



app.listen(port, () => {
  console.log(`start server ${port}`)
})