var userController = require('../controllers/userController.js');
var jwt    = require('jsonwebtoken');
 
module.exports = function(app,passport,models,config,s3) {

    app.use('/api/user/', function(req,res,next){
        console.log("checking token");
        if(req.headers['token']!=undefined || req.headers['token']!=null){            
            models.Users_Sessions.findOne({where:{session_token: req.headers['token']}}).then(function(session){
                if(session){
                    jwt.verify(req.headers['token'], app.get('superSecret'),function(err, decoded){
                        if(err){
                            res.status(400).json({error_msg:"Token expired"});
                            return;
                        } else {
                            console.log("Token verified, Proceeding");
                            req.user_id = decoded.user_id;
                            next();
                        }
                    })
                } else {
                    res.status(400).json({error_msg:"Canot find token in user_sessions"});
                    return;
                }
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg:"Cannot find token"});
                return;
            });
        } else {
            res.status(400).json({error_msg:"Cannot call api unless you have api token"});
            return;
        }
    })

    /**
     * @api {post} /api/user/get_user_details API for getting profile details of user.
     * @apiName Get Details of user
     * @apiGroup User
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
    app.post('/api/user/get_user_details',function(req,res){
        userController.getUserDetails(app,req,res,models);
    });

    /**
     * @api {post} /api/user/update_user_details API for getting profile details of user.
     * @apiName Update user details
     * @apiGroup User
     * @apiParam {String} [name] Optional name of the user
     * @apiParam {String} [email_address] Optional email_address of the user
     * @apiParam {String} [address] Optional address of the user
     * @apiParam {String} [city_id] Optional city_id of the user    
     * @apiParam {String} [gender] Optional gender of the user    
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
    app.post('/api/user/update_user_details',function(req,res){
        userController.updateUserDetails(app,req,res,models);
    });

    /**
     * @api {post} /api/user/update_user_location API for For checking if the token is valid. If the token is valid, same token will be return, if token has expired new token will be returned, if there is any error redirect user to login screen
     * @apiName Update user location
     * @apiGroup User
     * @apiParam {String} lat Mandatory latitude of the user
     * @apiParam {String} long Mandatory longitude of the user
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
    app.post('/api/user/update_user_location',function(req,res){
        userController.updateUserLocation(app,req,res,models,config);
    });

    /**
     * @api {post} /api/user/createbusinessappointment API for create business appointment details.
     * @apiName Create a business appointment
     * @apiGroup User
     * @apiParam {String} business_id Mandatory business_id of the Business_appointment
     * @apiParam {String} booked_by Mandatory appointment booked by (User or Admin)
     * @apiParam {String} booked_for Mandatory appointment booked for (User or Other)
     * @apiParam {String} name Mandatory name of the customer
     * @apiParam {String} gender Mandatory gender of the customer
     * @apiParam {String} email_address Mandatory email_address of the customer     
     * @apiParam {DateTime} booking_date_time Mandatory booking_date_time for appointment, format should be: 22.05.2013 11:23:22
     * @apiParam {String} [special_instructions] Optional special_instructions from customer
     * @apiParam {String} customer_contact_number Mandatory contact_number of the customer    
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/user/createbusinessappointment',function(req,res){
        userController.CreateBusinessAppointment(req,res,models,app);
    });
    //add booked for and booked by

    /**
     * @api {post} /api/user/getappointmentbyid API for getting business_appointment details using appointment_id.
     * @apiName Get appointment by id
     * @apiGroup User
     * @apiParam {String} appointment_id  Mandatory appointment_id of the Business_appointment
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/user/getappointmentbyid',function(req,res){
        userController.getAppointmentById(req,res,models,app);
    });

    /**
     * @api {post} /api/user/addservicesforappointment API for For checking if the token is valid. If the token is valid, same token will be return, if token has expired new token will be returned, if there is any error redirect user to login screen
     * @apiName Add services for appointment
     * @apiGroup User
     * @apiParam {String} appointment_id Mandatory appointment_id of the booking
     * @apiParam {String} service_ids Mandatory comma separated service Ids to be included in appointment
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345",
     *      "auth_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1MCwiaWF0IjoxNTE3ODM5MTc5LCJleHAiOjE1MTc5MjU1Nzl9.40QMA6I7ScHqo_Nr-sdFEfT8GlmIjjKchnP9XG0PHPY" 
     *  }
     */
    app.post('/api/user/addservicesforappointment',function(req,res){
        userController.addServiceForAppoitment(req,res,models,app);
    });

    /**
     * @api {post} /api/user/updateprofilepicture API for For checking if the token is valid. If the token is valid, same token will be return, if token has expired new token will be returned, if there is any error redirect user to login screen
     * @apiName Update profile picture
     * @apiGroup User
     * @apiParam {String} base64image Mandatory base64 encoded image
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345",
     *      "auth_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1MCwiaWF0IjoxNTE3ODM5MTc5LCJleHAiOjE1MTc5MjU1Nzl9.40QMA6I7ScHqo_Nr-sdFEfT8GlmIjjKchnP9XG0PHPY" 
     *  }
     */
    app.post('/api/user/updateprofilepicture',function(req,res){
        userController.updateProfilePicture(req,res,models,s3);
    });

    /**
     * @api {post} /api/user/setbusinessreviews API for business reviews
     * @apiName Set business reviews
     * @apiGroup User
     * @apiParam {String} business_id Mandatory business_id of the Bussiness_Reviews
     * @apiParam {String} maintainance_rating Mandatory maintainance_rating of the Bussiness_Reviews
     * @apiParam {String} cleanliness_rating Mandatory cleanliness_rating of the Bussiness_Reviews
     * @apiParam {String} service_rating Mandatory service_rating of the Bussiness_Reviews
     * @apiParam {String} staff_rating Mandatory staff_rating of the Bussiness_Reviews
     * @apiParam {String} pricing_rating Mandatory pricing_rating of the Bussiness_Reviews
     * @apiParam {Integer} review Mandatory review of the Bussiness_Reviews
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/user/setbusinessreviews',function(req,res){
        userController.setbusinessReviews(req,res,models,app);
    });

    /**
     * @api {post} /api/user/getbusinessreview API for business reviews
     * @apiName Get business reviews
     * @apiGroup User
     * @apiParam {String} business_id Mandatory business_id of the Bussiness
     * @apiParam {String} [self] Optional boolean to get own review of the Bussiness
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/user/getbusinessreview',function(req,res){
        userController.getbusinessreview(req,res,models);
    });

    /**
     * @api {post} /api/user/setfavoritebusiness API for set user_favorite_business
     * @apiName Set favorite business
     * @apiGroup User
     * @apiParam {String} business_id Mandatory business_id of User_favorite_business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/user/setfavoritebusiness',function(req,res){
        userController.setFavoriteBusiness(req,res,models,app);
    });

    /**
     * @api {post} /api/user/unsetfavoritebusiness API for set user_favorite_business
     * @apiName Un-Set favorite business
     * @apiGroup User
     * @apiParam {String} business_id Mandatory business_id of User_favorite_business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/user/unsetfavoritebusiness',function(req,res){
        userController.unSetFavoriteBusiness(req,res,models,app);
    });


    /**
     * @api {post} /api/user/getfavoritebusiness API getting User_favorite_business details using user_id.
     * @apiName Get favorite business
     * @apiGroup User
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     * 
     * }
     */
    app.post('/api/user/getfavoritebusiness',function(req,res){
        userController.getFavoriteBusiness(req,res,models,app);
    });

    /**
     * @api {post} /api/user/addusersdeals API add user_deals details using user_id.
     * @apiName Add deals
     * @apiGroup User
     * @apiParam {String} deal_id Mandatory id of deal to be added
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     * 
     * }
     */
    app.post('/api/user/addusersdeals',function(req,res){
        userController.addUsersDeals(req,res,models,app);
    });


    /**
     * @api {post} /api/user/removeusersdeals API remove user_deals details using user_id.
     * @apiName Remove deals
     * @apiGroup User
     * @apiParam {String} deal_id Mandatory id of deal to be removed
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     * 
     * }
     */
    app.post('/api/user/removeusersdeals',function(req,res){
        userController.removeUsersDeals(req,res,models,app);
    });

    /**
     * @api {post} /api/user/resetuseralldeals API remove user_deals details using user_id.
     * @apiName Reset all deals
     * @apiGroup User     
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     * 
     * }
     */
    app.post('/api/user/resetuseralldeals',function(req,res){
        userController.resetUserAllDeals(req,res,models,app);
    });

    /**
     * @api {post} /api/user/getdeals API getting deals details using business_id.
     * @apiName Get deals
     * @apiGroup User
     * @apiParam {String} business_id Mandatory business_id of the deals
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     * 
     * }
     */
    app.post('/api/user/getdeals',function(req,res){
        userController.getDeals(req,res,models,app);
    });

    /**
     * @api {post} /api/user/getuserpurchasedeals API getting user-deals-purchase details.
     * @apiName Get purchased deals
     * @apiGroup User
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     * 
     * }
     */
    app.post('/api/user/getuserpurchasedeals',function(req,res){
        userController.getUserPurchaseDeals(req,res,models,app);
    });


    /**
     * @api {post} /api/user/applydiscountcoupons API
     * @apiName Apply discount coupon
     * @apiGroup User
     * @apiParam {String} coupon_code Mandatory coupon_code of the discount-coupons
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     * 
     * }
     */
    app.post('/api/user/applydiscountcoupons',function(req,res){
        userController.applyDiscountCoupons(req,res,models,app);
    });


    /**
     * @api {post} /api/user/setuserdealspurchase API for user-deals-purchase
     * @apiName Puchase Deals
     * @apiGroup User
     * @apiParam {String} total_amount Mandatory total_amount of the purchase
     * @apiParam {String} net_payable Mandatory net_payable amount of the purchase
     * @apiParam {String} transaction_mode Mandatory mode of transaction
     * @apiParam {String} transaction_status Mandatory status of transaction
     * @apiParam {String} bank_transaction_id Mandatory bank_transaction_id received from bank
     * @apiParam {String} deals_purchased Mandatory array of all the deals purchased
     * @apiParam {String} deals_purchased.deal_id Mandatory deal_id of the purchased deal
     * @apiParam {String} deals_purchased.quantity Mandatory quantity of the purchased deal
     * @apiParam {String} deals_purchased.price Mandatory price of the purchased deal
     * @apiParam {String} [discount_price] Mandatory discount_price of the purchased deal
     * @apiParam {String} [coupon_code] Optional discount_coupon_id of the user-deals-purchase
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/user/setuserdealspurchase',function(req,res){
        userController.setUserDealsPurchase(req,res,models,app);
    });

    /**
     * @api {post} /api/user/gettransactions API for getting transactions details of user.
     * @apiName Get Transaction Details of user
     * @apiGroup User
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
    app.post('/api/user/gettransactions',function(req,res){
        userController.getTransactions(req,res,models);
    });

    /**
     * @api {post} /api/user/getbusinessdetails API for getting business details.
     * @apiName Get business details
     * @apiGroup User
     * @apiParam {String} business_id of the busines
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/user/getbusinessdetails',function(req,res){
        userController.getBusinessDetails(req,res,models,app);
    });
    
    /**
     * @api {post} /api/user/getallbusinessappointment API for getting business appointment details of user.
     * @apiName Get All Business Appointment of user
     * @apiGroup User
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
    app.post('/api/user/getallbusinessappointment',function(req,res){
        userController.getAllBusinessAppointment(req,res,models);
    });

    /**
     * @api {post} /api/user/getrecentvisitbusiness API for getting recent business details of user.
     * @apiName Get Recent Visit Business of user
     * @apiGroup User
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
    app.post('/api/user/getrecentvisitbusiness', function(req,res){
        userController.getRecentVisitBusiness(req,res,models,app);
    });

    /**
     * @api {post} /api/user/adduserservices API add user_services details using user_id.
     * @apiName Add User Services
     * @apiGroup User
     * @apiParam {String} service_id Mandatory id of service to be added
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     * 
     * }
     */
    app.post('/api/user/adduserservices',function(req,res){
        userController.addUserServices(req,res,models,app);
    });

    /**
     * @api {post} /api/user/removeuserservices API remove user_services details using service_id.
     * @apiName Remove User Service
     * @apiGroup User
     * @apiParam {String} service_id Mandatory id of services to be removed
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     * 
     * }
     */
    app.post('/api/user/removeuserservices',function(req,res){
        userController.removeUserServices(req,res,models,app);
    });


    /**
     * @api {post} /api/user/resetuserallservices API for reset user_services
     * @apiName Reset User All Services
     * @apiGroup User
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "auth_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1MCwiaWF0IjoxNTE3ODM5MTc5LCJleHAiOjE1MTc5MjU1Nzl9.40QMA6I7ScHqo_Nr-sdFEfT8GlmIjjKchnP9XG0PHPY" 
     * 
     *  }
     */
    app.post('/api/user/resetuserallservices',function(req,res){
        userController.resetUserAllServices(req,res,models,app);
    });


    /**
     * @api {post} /api/user/getuserservices API for getting recent services details of user.
     * @apiName Get User Services of user
     * @apiGroup User
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
    app.post('/api/user/getuserservices', function(req,res){
        userController.getUserServices(req,res,models,app);
    });


    /**
     * @api {post} /api/user/removeusersallservices API remove user_services details using service_id.
     * @apiName Remove User's all services of provided service_id
     * @apiGroup User
     * @apiParam {String} service_id Mandatory id of services to be removed
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     * 
     * }
     */
    app.post('/api/user/removeusersallservices',function(req,res){
        userController.removeUsersAllServices(req,res,models,app);
    });


    /**
     * @api {post} /api/user/getnewdeals API for getting recent active_deals details of user.
     * @apiName Get New Deals of user
     * @apiGroup User
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
    app.post('/api/user/getnewdeals', function(req,res){
        userController.getNewDeals(req,res,models,app);
    });

    /**
     * @api {post} /api/user/gettrendingbusiness API for getting recent active_deals details of user.
     * @apiName Get trending businesses
     * @apiGroup User
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
    app.post('/api/user/gettrendingbusiness', function(req,res){
        userController.getTrendingBusiness(req,res,models,app);
    });

    /**
     * @api {post} /api/user/getnearbybusiness API for getting near by business.
     * @apiName Get Near By Business
     * @apiGroup User
     * @apiParam {String} latitude Mandatory latitude of the user
     * @apiParam {String} longitude Mandatory longitude of the user
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
    app.post('/api/user/getnearbybusiness', function(req,res){
        userController.getnearbybusiness(req,res,models,app);
    }); 

    /**
     * @api {post} /api/user/purchaseuserservices API
     * @apiName Purchase User Services
     * @apiGroup User
     * @apiParam {String} net_payable Mandatory net_payable of the transactions
     * @apiParam {String} transaction_mode Mandatory transaction_mode of the transactions
     * @apiParam {String} transaction_status Mandatory transaction_status of the transactions
     * @apiParam {String} bank_transaction_id Mandatory bank_transaction_id of the transactions
     * @apiParam {String} booked_for Mandatory booked_for of the service_booking
     * @apiParam {String} name Mandatory name of the service_booking
     * @apiParam {String} email Mandatory email of the service_booking
     * @apiParam {String} booked_by Mandatory booked_by of the service_booking
     * @apiParam {String} contact_number Mandatory contact_number of the service_booking
     * @apiParam {String} address Mandatory address of the service_booking
     * @apiParam {String} gender Mandatory gender of the service_booking
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
    app.post('/api/user/purchaseuserservices', function(req,res){
        res.end("API in progress");
        // userController.purchaseUserServices(req,res,models,app);
    });

    /**
     * @api {post} /api/user/verifynumber API for verfiying new Otp for Users app.
     * @apiName Verify Otp
     * @apiGroup User
     * @apiParam {String} number Mandatory new number of the customer
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
    app.post('/api/user/verifynumber', function(req,res){
        userController.verifyNumber(req,res,models,app);
    })

    /**
     * @api {post} /api/user/getalldeals API for getting all deals details of deals.
     * @apiName Get All Deals
     * @apiGroup User
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
    app.post('/api/user/getalldeals',function(req,res){
        userController.getAllDeals(req,res,models);
    });

    /**
     * @api {post} /api/user/setuserservicespurchase API for user-services-purchase
     * @apiName Puchase Services
     * @apiGroup User
     * @apiParam {String} total_amount Mandatory total_amount of the service_Booking
     * @apiParam {String} total_quantities Mandatory total_quantities of the service_Booking
     * @apiParam {String} booked_for Mandatory booked_for of service_Booking
     * @apiParam {String} booked_by Mandatory booked_by of service_Booking
     * @apiParam {String} name Mandatory name of service_Booking
     * @apiParam {String} contact_number Mandatory contact_number of service_Booking
     * @apiParam {String} address Mandatory address of the service_Booking
     * @apiParam {String} gender Mandatory gender of the service_Booking
     * @apiParam {String} booking_date_time Mandatory booking_date_time of the service_Booking
     * @apiParam {String} ez_transaction_id Mandatory ez_transaction_id of the service_Booking
     * @apiParam {String} payu_transaction_id Mandatory payu_transaction_id of the purchased deal
     * @apiParam {String} [email] Optional email of the user-services-purchase
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} auth_key Users unique Authorization key.
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/user/setuserservicespurchase',function(req,res){
        userController.setUserServicesPurchase(req,res,models,app);
    });

    /**
     * @api {post} /api/user/getuserpurchaseservices API for getting all services details of services.
     * @apiName Get User Purchase Services
     * @apiGroup User
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
    app.post('/api/user/getuserpurchaseservices',function(req,res){
        userController.getUserPurchaseServices(req,res,models,app);
    });
    
    /**
     * @api {post} /api/user/getuserservicespurchasedetails API for getting all purchase details of services.
     * @apiName Get User Services Purchase Details
     * @apiGroup User
     * @apiParam {String} booking_services_id Mandatory booking_services_id of service_Booking
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
    app.post('/api/user/getuserservicespurchasedetails',function(req,res){
        userController.getUserServicesPurchaseDetails(req,res,models,app);
    });

    /**
     * @api {post} /api/user/sendapplicationfeedback API for app feedback
     * @apiName Send Application Feedback
     * @apiGroup User
     * @apiParam {String} feedback Mandatory feedback of the Application_feedback
     * @apiParam {String} [contact_number] of the Application_feedback Optional
     * @apiParam {String} [email_address] of the Application_feedback Optional
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "auth_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1MCwiaWF0IjoxNTE3ODM5MTc5LCJleHAiOjE1MTc5MjU1Nzl9.40QMA6I7ScHqo_Nr-sdFEfT8GlmIjjKchnP9XG0PHPY"
     *  }
     */
    app.post('/api/user/sendaplicationfeedback',function(req,res){
        userController.sendApplicationFeedback(req,res,models,app);
    });    
}