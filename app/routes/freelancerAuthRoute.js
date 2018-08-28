var freelancerAuthController = require('../controllers/freelancerAuthController.js');

module.exports = function(app,passport,models,s3) {

    app.use('/api/freelancer',function(req,res,next){
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
     * @api {post} /api/freelancer/createnewfreelancer API for new freelancer for Freelancer app.
     * @apiName Create New Freelancer
     * @apiGroup FreelancerAuth
     * @apiParam {String} full_name Mandatory full_name of the freelancer
     * @apiParam {String} password Mandatory password of the freelancer
     * @apiParam {String} mobile_number Mandatory mobile_number of the freelancer
     * @apiParam {String} email_address Mandatory email_address of the freelancer
     * @apiParam {String} date_of_birth Mandatory date_of_birth of the freelancer
     * @apiParam {String} city_id Mandatory city_id of the freelancer
     * @apiParam {String} address Mandatory address of the freelancer
     * @apiParam {String} gender Mandatory gender of the freelancer
     * @apiParam {String} postal_code Mandatory postal_code of the freelancer
     * @apiParam {String} date_of_joining Mandatory date_of_joining of the freelancer
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/freelancer/createnewfreelancer', passport.authenticate('freelancer-signup',{ session: false}), 
        function(req,res){
            if(req.user!=null){
                res.json(req.user);
            } else {
                res.status(400).json({error_msg: "User already exists"});
            }
        }
    );

    /**
     * @api {post} /api/freelancer/addfreelancerdocuments API for add freelancer_documents.
     * @apiName Add Freelancer Documents Freelancer app
     * @apiGroup FreelancerAuth
     * @apiParam {String} freelancer_id Mandatory freelancer_id of the Freelancer_documents
     * @apiParam {String} document_type Mandatory document_type of the Freelancer_documents
     * @apiParam {String} base64documen Mandatory base64 encoded base64documen
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/freelancer/addfreelancerdocuments',function(req,res){
        freelancerAuthController.addFreelancerDocuments(req,res,models,app,s3);
    });


    /**
     * @api {post} /api/freelancer/login API for login for freelancer for Freelancer app.
     * @apiName Login
     * @apiGroup FreelancerAuth
     * @apiParam {String} email Mandatory email_address of the freelancer
     * @apiParam {String} password Mandatory password of the freelancer
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/freelancer/login', function(req, res, next) {
        passport.authenticate('freelancer-login', { session: false}, function(err, user, info) {
            console.log("Error "+ err);
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
     * @api {post} /api/freelancer/sendmessage API for generate otp.
     * @apiName Send Message to Mobile_Numbuer
     * @apiGroup FreelancerAuth
     * @@apiParam {String} mobile_number Mandatory Mobile number of the user
     * @apiParam {String} [resend] Optional for resending OTP
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/freelancer/sendmessage',function(req,res){
        freelancerAuthController.sendMessage(req,res,models);
    });


    app.post('/api/freelancer/generaepassword',function(req,res){
        freelancerAuthController.generaePassword(req,res,models);
    });
}

