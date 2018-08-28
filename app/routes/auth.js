var authController = require('../controllers/authcontroller.js');

 
module.exports = function(app,passport,models) {


    app.use('/api/user',function(req,res,next){
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
     * @api {post} /api/user/generate_otp API for generating OTP.
     * @apiName Generate OTP
     * @apiGroup User
     * @apiParam {String} mobile_number Mandatory Mobile number of the user
     * @apiParam {String} [resend] Optional for resending OTP
     * @apiHeader {String} source Users unique source.
     * @apiHeader {String} deviceid Users unique deviceid.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *  }
     */
    app.post('/api/user/generate_otp',function(req,res){
        authController.generateOtp(req,res,models);
    });

    /**
     * @api {post} /api/user/verify_otp API for verifying OTP.
     * @apiName Verify OTP
     * @apiGroup User
     * @apiParam {String} mobile_number Mandatory Mobile number of the user
     * @apiParam {String} otp Mandatory One time password of the user
     * @apiParam {String} firebase_token mandatory firbase_token for the user
     * @apiHeader {String} source Users unique source.
     * @apiHeader {String} deviceid Users unique deviceid.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *  }
     */
    app.post('/api/user/verify_otp',function(req,res){
        authController.verifyOtp(app,req,res,models);
    });

    /**
     * @api {post} /api/user/create_account API for Creating profile for new user.
     * @apiName Create Account
     * @apiGroup User
     * @apiParam {String} [full_name] optional full name of the user
     * @apiParam {String} [email] optional email of the user
     * @apiParam {String} [dob] optional date of birth of the user
     * @apiParam {String} [gender] optional gender of the user
     * @apiParam {String} [google_token] optional google token of the user
     * @apiParam {String} [facebook_token] optional facebook token of the user
     * @apiParam {String} [twitter_token] optional twitter token of the user
     * @apiHeader {String} source Users unique source.
     * @apiHeader {String} deviceid Users unique deviceid.
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345",
     *      "auth_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1MCwiaWF0IjoxNTE3ODM5MTc5LCJleHAiOjE1MTc5MjU1Nzl9.40QMA6I7ScHqo_Nr-sdFEfT8GlmIjjKchnP9XG0PHPY" 
     *  }
     */
    app.post('/api/user/create_account',function(req,res){
        authController.createAccount(app,req,res,models);
    });

    /**
     * @api {post} /api/user/verfiy_token API for For checking if the token is valid. If the token is valid, same token will be return, if token has expired new token will be returned, if there is any error redirect user to login screen
     * @apiName Verify Token
     * @apiGroup User
     * @apiParam {String} firebase_token mandatory firbase_token for the user
     * @apiHeader {String} source Users unique source.
     * @apiHeader {String} deviceid Users unique deviceid.
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345",
     *      "auth_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1MCwiaWF0IjoxNTE3ODM5MTc5LCJleHAiOjE1MTc5MjU1Nzl9.40QMA6I7ScHqo_Nr-sdFEfT8GlmIjjKchnP9XG0PHPY" 
     *  }
     */
    app.post('/api/user/verfiy_token',function(req,res){
        authController.verifyToken(app,req,res,models);
    });    
}