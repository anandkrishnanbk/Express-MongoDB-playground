var express=require('express');
var helpers=require('./helpers');
var fs=require('fs');
var User = require('./db').User;

var router=express.Router({
    mergeParams:true
})
router.use(function (req, res, next) {
    console.log(req.method, 'for', req.params.username, ' at ' + req.path)
    next()
})
/*router.all('/',function(req,res,next)
    {
        console.log(req.method+' for '+req.params.username);
        next();
    })*/
router.use(function(error,req,res,next)
{
    console.error(error.stack);
    res.status(500).send('something broke');
})
router.get('/',function(req,res)
    {
        var username =req.params.username;
        //res.send(username);
        //var user = helpers.getUser(username);
        User.findOne({username:username},function(err,user)
        {
            if(err)
                console.log(user);

            res.render('user',{
                user:user,
                address:user.location
            });

        })

        /*res.render('user',{
            user:user,
            address:user.location
        });*/
    })
router.get('/edit',function(req,res)
{
    res.send('like to edit '+req.params.username);
});

router.put('/',function (req, res)
    {
        var username = req.params.username
        var user = helpers.getUser(username)
        user.location = req.body
        helpers.saveUser(username, user)
        res.end()
    })

router.delete('/',function (req, res)
    {
        var fp = getUserFilePath(req.params.username)
        fs.unlinkSync(fp) // delete the file
        res.sendStatus(200)
    })

module.exports = router;



