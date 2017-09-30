var express = require('express');
var app = express();

var fs=require('fs');
var path = require('path')
var _=require('lodash');
var bodyParser = require('body-parser');
var engines  = require('consolidate');
var helpers = require('./helpers')
var JSONStream = require('JSONStream');
var User =require('./db').User

var users=[];

app.engine('hbs',engines.handlebars);
app.set('views','./views');
//app.set('view engine','jade');
app.set('view engine','hbs');
app.use('/profilepics',express.static('images'));
app.use(bodyParser.urlencoded({extended:true}));
app.get('/favicon.ico', function (req, res) {
    res.end()
})
app.get('/',function(req,res)
{
    /*var buffer = [];
    //app.send('Hello World');
    users.forEach(function(user){
        buffer += '<a href="/'+user.username+'">'+user.name.full+'</a><br>';
    });
    res.send(buffer);*/
    //res.render('index',{users:users});

    /*var users = [];
    fs.readdir('users', function (err, files) {
        files.forEach(function (file) {
            fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'}, function (err, data) {
                var user = JSON.parse(data)
                user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
                users.push(user)
                if (users.length === files.length) res.render('index', {users: users})
            })
        })
    })*/
    User.find({},function(err,users)
    {
        res.render('index',{users:users})

    })
});
app.get(/big.*/,function(req,res,next)
{
    console.log('I AM BIG USER ACCESS');
    next()
});

app.get('*.json',function(req,res)
{
    res.download('./users/'+req.path,'anand.exe')
})
app.get('/data/:username',function(req,res)
{
    //var username=req.params.username;
    //var user=helpers.getUser(username);
    //res.json(user);

    var username = req.params.username;
    var readable = fs.createReadStream('./users/'+ username +'.json')
    readable.pipe(res);
});
app.get('/users/by/:gender',function(req,res)
{
    var gender = req.params.gender;
    var readable = fs.createReadStream('users.json');

    readable.pipe(JSONStream.parse('*',function(user)
    {
        if(user.gender === gender)
        {
            return user.name;
        }

    }))
    .pipe(JSONStream.stringify())
    .pipe(res);

})
/*app.get('/users/by/:gender', function (req, res) {
    var gender = req.params.gender
    var readable = fs.createReadStream('users.json')

    readable
        .pipe(JSONStream.parse('*', function (user) {
            if (user.gender === gender) return user.name
        }))
        .pipe(JSONStream.stringify('[\n  ', ',\n  ', '\n]\n'))
        .pipe(res)
})*/

app.get('/error/:username',function(req,res)
{
   //res.send('OOPPPSSSS');
    res.status(404).send('username named '+req.params.username+' not available');
})


app.get('/add',function()
{
    app.send('added name');
});

var userRouter = require('./username');
app.use('/:username',userRouter);

var server = app.listen('3000',function(){
    console.log("server running at "+server.address().port);
});