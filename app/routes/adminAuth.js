module.exports = function(app,passport,models) {

    app.use('/api/adminauth',function(req,res,next){
        console.log("Base url1: " + req.baseUrl);        
        next();
    })

    /**
     * @api {post} /api/adminauth/login API for login for new user for Admin app.
     * @apiName Login
     * @apiGroup AdminAuth
     * @apiParam {String} email Mandatory email_address of the admin
     * @apiParam {String} password Mandatory password of the admin
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/adminauth/login', function(req, res, next) {        
        passport.authenticate('admin-login', { session: false}, function(err, user, info) {
                    if(err){
                        console.log("Error "+err);
                        res.statusMessage = "Invalid Username or password";
                        res.status(400).end();
                        return;
                    }
                    if(user!=null){
                        res.json(user);
                    } else {
                        res.status(400).json({error_msg: "Login failed"});        
                    }
          })(req, res, next);
    });

    /**
     * @api {post} /api/admin/logout API.
     * @apiName Logout
     * @apiGroup AdminAuth
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the admin
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6MTIsImlhdCI6MTUxODQxOTYzNywiZXhwIjoxNTE4NTA2MDM3fQ.twPiLypFZ4svJTCXankurpP5J9dXGZwH-oA9N_n26LM"
     *  }
     */
    // app.post('/api/admin/logout', function(req,res){
    //     adminAuthController.logout(req,res,models,app);
    // });

}