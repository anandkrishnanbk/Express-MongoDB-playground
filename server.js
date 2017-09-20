var express = require('express');
var app = express();
app.get('/',function()
{
    app.send('Hello World');
});
app.get('/add',function()
{
    app.send('added name');
});
var server = app.listen('3000',function(){
    console.log("server running at "+server.address().port);
})