var express = require('express');
var app = express();

var fs=require('fs');
var _=require('lodash');
var engines  = require('consolidate');

var users=[];

fs.readFile('users.json',{encoding:'utf8'},function(err,data)
{
    if(err)
        throw err;

    JSON.parse(data).forEach(function(user){
        user.name.full = _.startCase(user.name.first+' '+user.name.last);
        users.push(user);
    });

});

app.engine('hbs',engines.handlebars);
app.set('views','./views');
//app.set('view engine','jade');
app.set('view engine','hbs');
app.use('/profilepics',express.static('images'));

app.get('/',function(req,res)
{
    /*var buffer = [];
    //app.send('Hello World');
    users.forEach(function(user){
        buffer += '<a href="/'+user.username+'">'+user.name.full+'</a><br>';
    });
    res.send(buffer);*/
    res.render('index',{users:users});
});
app.get(/big.*/,function(req,res,next)
{
    console.log('I AM BIG USER ACCESS');
    next()
});
app.get('/:username',function(req,res)
{
   // var username =req.params.username;
    //res.send(username);
    res.render('user',{username:req.params.username})
});
app.get('/add',function()
{
    app.send('added name');
});
var server = app.listen('3000',function(){
    console.log("server running at "+server.address().port);
});