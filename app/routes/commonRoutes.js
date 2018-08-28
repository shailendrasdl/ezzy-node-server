var commonController = require('../controllers/commonController.js');

module.exports = function(app,passport,models,admin) {

    // app.use('/api/common',function(req,res,next){
    //     console.log("Base url: " + req.baseUrl);
    //     if(req.headers['source']==undefined){
    //         res.status(400).json({error_msg: "source not found in request header"});        
    //         return;
    //     }
    //     if(req.headers['deviceid']==undefined){
    //         res.status(400).json({error_msg: "deviceid not found in request header"});        
    //         return;
    //     }
    //     next();
    // })

    /**
     * @api {post} /api/common/getallcountries API for getting country details.
     * @apiName Get all countries
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getallcountries', function(req,res,next){
        commonController.getCountry(req,res,models,app);
    });



    /**
     * @api {post} /api/common/getcountrybyid API for getting country details.
     * @apiName Get country by id
     * @apiGroup Common
     * @apiParam {String} country_id of the country
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getcountrybyid', function(req,res,next){
        commonController.getCountryById(req,res,models,app);
    });


    /**
     * @api {post} /api/common/getallstates API for getting states details.
     * @apiName Get all states
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getallstates', function(req,res,next){
        commonController.getStates(req,res,models,app);
    });



    /**
     * @api {post} /api/common/getstatebyid API for getting state details using state_id.
     * @apiName Get state by id
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getstatebyid', function(req,res,next){
        commonController.getStateById(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getstatebycountryid API for getting state details using country_id.
     * @apiName Get state by country id
     * @apiGroup Common
     * @apiParam {String} country_id of the state
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getstatebycountryid', function(req,res,next){
        commonController.getstatebycountryid(req,res,models,app);
    });
    
    /**
     * @api {post} /api/common/getallcities API for getting cites details.
     * @apiName Get all city
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getallcities', function(req,res,next){
        commonController.getCities(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getcitybyid API for getting cites details using city_id.
     * @apiName Get city by id
     * @apiGroup Common
     * @apiParam {String} city_id of the city
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getcitybyid', function(req,res,next){
        commonController.getCityById(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getcitybystateid API for getting cites details by state_id.
     * @apiName Get city by state id
     * @apiGroup Common
     * @apiParam {String} state_id of the state
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getcitybystateid', function(req,res,next){
        commonController.getCityByState(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getallservicescategory API for getting category details.
     * @apiName Get all service category
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getallservicescategory',function(req,res){
        commonController.AllServicesCategory(req, res,models,app);
    });

    /**
     * @api {post} /api/common/getservicecategorybyid API for getting category details using category_id.
     * @apiName Get service category by id
     * @apiGroup Common
     * @apiParam {String} category_id of the service_category
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getservicecategorybyid',function(req,res){  
        commonController.serviceCategoryById(req,res,models,app);
    });
    
    /**
     * @api {post} /api/common/getallservices API for getting services details.
     * @apiName Get all services
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getallservices',function(req,res){
        commonController.getAllServices(req,res,models,app);
    });



    /**
     * @api {post} /api/common/getservicesbyid API for getting services details using service_id.
     * @apiName Get service by serivce_id
     * @apiGroup Common
     * @apiParam {String} service_id of the service
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getservicesbyid',function(req,res){
        commonController.getServicesByid(req,res,models,app);
    });


    /**
     * @api {post} /api/common/getservicesbycategoryid API for getting category details using category_id.
     * @apiName Get services by category_id
     * @apiGroup Common
     * @apiParam {String} category_id of the services
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getservicesbycategoryid',function(req,res){
        commonController.getServicesbyCategoryId(req,res,models,app);
    });


    /**
     * @api {post} /api/common/getallamenities API for getting amenities details.
     * @apiName Get all amenities
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getallamenities',function(req,res){
        commonController.getAllAmenities(req,res,models,app);
    });    

     /**
     * @api {post} /api/common/getcategorybygender API for getting amenities details.
     * @apiName Get category gender
     * @apiGroup Common
     * @apiParam {String} Gender Male(M) or Female(F)
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getcategorybygender',function(req,res){
        commonController.getCategoryByGender(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getallactivebusiness API for getting all active business details.
     * @apiName Get all active businesses
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getallactivebusiness',function(req,res){
        commonController.getAllActiveBusiness(req,res,models,app);
    });  

    /**
     * @api {post} /api/common/getallcityareas API for getting city details using city_id.
     * @apiName Get all city areas
     * @apiGroup Common
     * @apiParam {String} city_id of the city for which areas are required
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android",
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getallcityareas',function(req,res){
        commonController.getAllCityAreas(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getmediatype API for getting media_type details.
     * @apiName Get media types
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getmediatype',function(req,res){
        commonController.getMediaType(req,res,models,app);
    });

    /**
     * @api {post} /api/common/addappfeedback API for app feedback
     * @apiName Add application feedback
     * @apiGroup Common
     * @apiParam {String} feedback Mandatory feedback of the Application_feedback
     * @apiParam {String} [user_id] of the Application_feedback Optional
     * @apiParam {String} [employee_id] of the Application_feedback Optional
     * @apiParam {String} [contact_number] of the Application_feedback Optional
     * @apiParam {String} [email_address] of the Application_feedback Optional
     * @apiParam {String} [preferred_contact_mode] of the Application_feedback Optional
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/addappfeedback',function(req,res){
        commonController.addAppFeedback(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getbusinesshours API getting Business_hours details using business_id.
     * @apiName Get business hours
     * @apiGroup Common
     * @apiParam {String} business_id Mandatory business_id of the business
     * @apiParam {String} day Optional day of Business_hours must be between ["1"-"7"], where 1 is sunday, All days hours will be returned if no day is provided
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
    app.post('/api/common/getbusinesshours',function(req,res){
        commonController.getBusinessHours(req,res,models,app);
    });


    /**
     * @api {post} /api/common/getbusinessamenities API getting amenities_master details using business_id.
     * @apiName Get Business amenities
     * @apiGroup Common
     * @apiParam {String} business_id Mandatory business_id of the business
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
    app.post('/api/common/getbusinessamenities',function(req,res){
        commonController.getBusinessAmenities(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getbusinesscategoryandservices API details.
     * @apiName Get business category and services
     * @apiGroup Common
     * @apiParam {String} business_id Mandatory business_id of the business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     *  }
     */
    app.post('/api/common/getbusinesscategoryandservices',function(req,res){
        commonController.getBusinessCategoryAndServices(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getbusinessmedia API getting business_media details using business_id.
     * @apiName Get business media
     * @apiGroup Common
     * @apiParam {String} business_id Mandatory business_id of the business_media
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
    app.post('/api/common/getbusinessmedia',function(req,res){
        commonController.getBusinessMedia(req,res,models,app);
    });

    /**
     * @api {post} /api/common/deletebusinessmedia API delete business_media details using media_id.
     * @apiName Delete business media
     * @apiGroup Common
     * @apiParam {String} media_id Mandatory media_id of the business_media
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
    app.post('/api/common/deletebusinessmedia',function(req,res){
        commonController.deletebusinessmedia(req,res,models,app);
    });
    
    /**
     * @api {post} /api/common/getdeals API getting deals details using business_id.
     * @apiName Get deals
     * @apiGroup Common
     * @apiParam {String} business_id Mandatory business_id of the deals
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
    app.post('/api/common/getdeals',function(req,res){
        commonController.getDeals(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getdealstermsofuse API getting deals-terms-of-use details using deal_id.
     * @apiName get deals' terms of use
     * @apiGroup Common
     * @apiParam {String} deal_id Mandatory deal_id of the deals-terms-of-use
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
    app.post('/api/common/getdealstermsofuse',function(req,res){
        commonController.getDealsTermsOfUse(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getalldealstermsofuse API getting deals-terms-of-use details using deal_id.
     * @apiName Get master list of deals terms of use
     * @apiGroup Common
     * @apiParam {String} deal_id Mandatory deal_id of the deals-terms-of-use
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
    app.post('/api/common/getalldealstermsofuse',function(req,res){
        commonController.getalldealstermsofuse(req,res,models,app);
    });

    /**
     * @api {post} /api/Common/redeemdeal API for Redeeming deals
     * @apiName Redeem deal
     * @apiGroup Common
     * @apiParam {String} deal_code Mandatory deal_code of the Puchased deal
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
    app.post('/api/common/redeemdeal',function(req,res){
        commonController.redeemDeals(req,res,models,app);
    });


    /**
     * @api {post} /api/Common/canceldeal API for Cancelling deals
     * @apiName Cancel deal
     * @apiGroup Common
     * @apiParam {String} deal_code Mandatory deal_code of the Puchased dealf
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
    app.post('/api/common/canceldeal',function(req,res){
        commonController.cancelDeal(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getsearchkeywords API for search-keywords.
     * @apiName Get Search Keywords
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getsearchkeywords', function(req,res,next){
        commonController.getSearchKeywords(req,res,models,app);
    });

    /**
    * @api {post} /api/common/getdealsdetails API getting deals details using deals_id.
    * @apiName Get Deals Details
    * @apiGroup Common
    * @apiParam {String} deals_id Mandatory deals_id of the deals
    * @apiHeader {String} source source - Android or iOS
    * @apiHeader {String} deviceid unique deviceid
    * @apiHeaderExample {json} Header-Example: 
    * { 
    * "source": "Android", 
    * "deviceid": "abcde12345" 
    * "Content-Type": "application/json"
    * 
    * }
    */
    app.post('/api/common/getdealsdetails',function(req,res){
        commonController.getDealsDetails(req,res,models,app);
    });

    /**
    * @api {post} /api/common/notifications API.
    * @apiName Notifications
    * @apiGroup Notifications
    * @apiHeader {String} source source - Android or iOS
    * @apiHeader {String} deviceid unique deviceid
    * @apiHeaderExample {json} Header-Example: 
    * { 
    * "source": "Android", 
    * "deviceid": "abcde12345" 
    * "Content-Type": "application/json"
    * "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6MTIsImlhdCI6MTUxODQxOTYzNywiZXhwIjoxNTE4NTA2MDM3fQ.twPiLypFZ4svJTCXankurpP5J9dXGZwH-oA9N_n26LM"
    * }
    */
    app.post('/api/common/notifications',function(req,res){
        commonController.notifications(req,res,models,admin);
    });

    /**
     * @api {post} /api/common/forgotownerpassword API for forgot password.
     * @apiName Forgot common Password
     * @apiGroup Common
     * @apiParam {String} email_address Mandatory email-id of owner     
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6MTIsImlhdCI6MTUxODQxOTYzNywiZXhwIjoxNTE4NTA2MDM3fQ.twPiLypFZ4svJTCXankurpP5J9dXGZwH-oA9N_n26LM"
     *  }
     */
    app.post('/api/common/forgotownerpassword', function(req,res){
        commonController.forgotPassword(req,res,models,app)
    });

    /**
     * @api {post} /api/common/getallbusinesstype API for getting business_type details.
     * @apiName Get all business_type
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid     
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getallbusinesstype', function(req,res){
        commonController.getallBusinessType(req,res,models,app);
    });

    /**
     * @api {post} /api/common/getallusers API for getting all_users details.
     * @apiName Get all users details
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid     
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getallusers', function(req,res){
        commonController.getallUsers(req,res,models,app);
    });


    /**
     * @api {post} /api/common/getallroles API for getting all_roles details.
     * @apiName Get all Roles details
     * @apiGroup Common
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid     
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/getallroles', function(req,res){
        commonController.getAllRoles(req,res,models,app);
    });

    /**
     * @api {post} /api/common/encodeHash API for getting SHA512 encoded string.
     * @apiName Encode string for PayuMoney
     * @apiGroup Common
     * @apiParam {String} inpString Mandatory inpString of owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid     
     * @apiHeaderExample {json} Header-Example: 
     *  {
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/common/encodeHash',function(req,res){
        commonController.encodeHash(req,res);
    });

    app.use(function(req,res,next){
        res.send("No matching request found!");
    });

}