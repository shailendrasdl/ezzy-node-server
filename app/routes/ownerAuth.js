var ownerAuthController = require('../controllers/ownerAuthController.js');

module.exports = function(app,passport,models) {

    app.use('/api/owner',function(req,res,next){
        console.log("Base url: " + req.baseUrl);
        if(req.headers['source']==undefined){
            res.status(400).json({error_msg: "source not found in request header"});        
            return;
        }
        if(req.headers['deviceid']==undefined){
            res.status(400).json({error_msg: "deviceid not found in request header"});        
            return;
        }
        next();
    })

    /**
     * @api {post} /api/owner/signup API for Signing up new user for Owner app.
     * @apiName Sign Up
     * @apiGroup OwnerAuth
     * @apiParam {String} email Mandatory email_address of the owner
     * @apiParam {String} name Mandatory name of the owner
     * @apiParam {String} mobile Mandatory mobile of the owner
     * @apiParam {Integer} city_id Mandatory city_id of the owner
     * @apiParam {String} pincode Mandatory pincode of the owner
     * @apiParam {String} business_name Mandatory Name of business of the owner
     * @apiParam {String} business_type Mandatory business_type_id of business
     * @apiParam {String} referred_by Mandatory From where user has heard about our app
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/signup', validateFields, passport.authenticate('local-signup',{ session: false}), 
        function(req,res){
            if(req.user!=null){
                res.json(req.user);
            } else {
                res.status(400).json({error_msg: "User already exists"});
            }
            // ownerAuthController.signUp(req,res,models);
        }
    );

    function validateFields(req,res,next){
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('mobile', 'Password is required').notEmpty();
        //validate 
        var errors = req.validationErrors();
        if (errors) {
            res.status(400).json({error_msg: "Validation errors, email address or mobile number is missing"});
        } else {
            next();
        }
    }

    /**
     * @api {post} /api/owner/verify_otp API for verifying OTP.
     * @apiName Verify OTP for Owner app
     * @apiGroup OwnerAuth
     * @apiParam {String} mobile_number Mandatory Mobile number of the employee
     * @apiParam {String} otp Mandatory One time password of the employee
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/verify_otp',function(req,res){
        ownerAuthController.verifyOtp(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/login API for login for new user for Owner app.
     * @apiName Login
     * @apiGroup OwnerAuth
     * @apiParam {String} email Mandatory email_address of the owner
     * @apiParam {String} password Mandatory password of the owner
     * @apiParam {String} fb_token Mandatory Firebase token of the owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/login', function(req, res, next) {
        passport.authenticate('local-login', { session: false}, function(err, user, info) {
            console.log("Error "+err);
                    if(err){
                        res.status(400).json({error_msg:"Invalid Username or password"});
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
     * @api {post} /api/owner/logout API.
     * @apiName Logout
     * @apiGroup OwnerAuth
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6MTIsImlhdCI6MTUxODQxOTYzNywiZXhwIjoxNTE4NTA2MDM3fQ.twPiLypFZ4svJTCXankurpP5J9dXGZwH-oA9N_n26LM"
     *  }
     */
    app.post('/api/owner/logout', function(req,res){
        ownerAuthController.logout(req,res,models,app);
    });

}