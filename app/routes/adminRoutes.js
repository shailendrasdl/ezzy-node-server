var adminController = require('../controllers/adminController.js');

module.exports = function(app,passport,models,s3) {

    app.use('/api/admin',function(req,res,next){
        console.log("Base url: " + req.baseUrl);
        // if(req.headers['source']==undefined){
        //     res.status(400).json({error_msg: "source not found in request header"});        
        //     return;
        // }
        // if(req.headers['deviceid']==undefined){
        //     res.status(400).json({error_msg: "deviceid not found in request header"});        
        //     return;
        // }
        next();
    })


    /**
     * @api {post} /api/admin/verifybusiness API for verfiying new business for Owner app.
     * @apiName Verify business
     * @apiGroup Admin
     * @apiParam {String} business_id Mandatory business_id of the business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/verifybusiness', function(req,res){
        adminController.verfifybusiness(req,res,models);
    });

    /**
     * @api {post} /api/admin/verifyemployee API for verfiying new employee for Owner app.
     * @apiName Verify employee
     * @apiGroup Admin
     * @apiParam {String} employee_id Mandatory employee_id of the owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/verifyemployee', function(req,res){
        adminController.verifyemployee(req,res,models);
    });

    /**
     * @api {post} /api/admin/setpaaswordofemployee API for set password for employee for Owner app. Password must have 1 small, 1 capital, 1 special character, 1 digit and minimum 8 digits in length
     * @apiName Set employee password
     * @apiGroup Admin
     * @apiParam {String} employee_id Mandatory employee_id of the owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/setpaaswordofemployee', function(req,res){
        adminController.setpaaswordofemployee(req,res,models);
    });

    /**
     * @api {post} /api/admin/addservicecategory API for created category details using category_name.
     * @apiName Add service category
     * @apiGroup Admin
     * @apiParam category_name Mandatory name of the category
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/addservicecategory',function(req,res){
        adminController.addServiceCategory(req,res,models,app);
    });

    /**
     * @api {post} /api/admin/addservices API for create services details.
     * @apiName Add services
     * @apiGroup Admin
     * @apiParam {String} service_name of the service Mandatory
     * @apiParam {String} category_id of the category to which service belongs Mandatory
     * @apiParam {String} duration of the service Mandatory
     * @apiParam {String} price of the service Mandatoy
     * @apiParam {String} [description] of the service Optional
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/addservices',function(req,res){
        adminController.addServices(req,res,models,app);
    });

    /**
     * @api {post} /api/admin/updateservicename API for updated name of services.
     * @apiName Update service name
     * @apiGroup Admin
     * @apiParam {String} service_name Mandatory name of service
     * @apiParam {String} service_id Mandatory id of service
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/updateservicename',function(req,res){
        adminController.updateServiceName(req,res,models,app);
    });
    

    /**
     * @api {post} /api/admin/updateservicedescription API for updated description of services.
     * @apiName Update service description
     * @apiGroup Admin
     * @apiParam {String} description Mandatory description of services
     * @apiParam {String} service_id Mandatory id of service
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/updateservicedescription',function(req,res){
        adminController.updateServiceDescription(req,res,models,app);
    });


    /**
     * @api {post} /api/admin/updateserviceduration API for updated duration of services.
     * @apiName Update service duration
     * @apiGroup Admin
     * @apiParam {String} duration Mandatory duration of services
     * @apiParam {String} service_id Mandatory id of service
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/updateserviceduration',function(req,res){
        adminController.updateServiceDuration(req,res,models,app);
    });


    /**
     * @api {post} /api/admin/updateserviceprice API for updated price of services.
     * @apiName Update service price
     * @apiGroup Admin
     * @apiParam {String} price Mandatory price of services
     * @apiParam {String} service_id Mandatory id of service
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/updateserviceprice',function(req,res){
        adminController.updateServicePrice(req,res,models,app);
    });


    /**
     * @api {post} /api/admin/updateservicecategory API for updated categoryid of services.
     * @apiName Update service category
     * @apiGroup Admin
     * @apiParam {String} category_id Mandatory category_id of services
     * @apiParam {String} service_id Mandatory id of service
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/updateservicecategory',function(req,res){
        adminController.updateServiceCategoryId(req,res,models,app);
    });


    /**
     * @api {post} /api/admin/setamenities API for set amenities details using amenities.
     * @apiName Set Amanities
     * @apiGroup Admin
     * @apiParam amenities_name Mandatory name of the amenities
     * @apiParam [description] Optional description of the amenities
     * @apiParam [icon_url] Optional icon_url of the amenities
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/setamenities',function(req,res){
        adminController.setAmenitiesMaster(req,res,models,app);
    });

    /**
     * @api {post} /api/admin/setcityareas API for created city_areas details. 
     * @apiName Set city Areas
     * @apiGroup Admin
     * @apiParam {String} area_name Mandatory area_name of the city_areas
     * @apiParam {String} area_code Mandatory area_code of the city_areas
     * @apiParam {String} pincode Mandatory pincode of the city_areas
     * @apiParam {Integer} city_id Mandatory city_id of the city_areas
     * @apiParam {Integer} area_lat Mandatory area_lat of the city_areas
     * @apiParam {Integer} area_long Mandatory area_long of the city_areas
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/setcityareas',function(req,res){
        adminController.setCityAreas(req,res,models,app);
    });

    /**
     * @api {post} /api/admin/setmediatype API for created media_type details. 
     * @apiName Set media type
     * @apiGroup Admin
     * @apiParam {String} media_type_name Mandatory media_type_name of the media_type
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/setmediatype',function(req,res){
        adminController.setMediaType(req,res,models,app);
    });

    /**
     * @api {post} /api/admin/getappfeedback API for getting feedback details.
     * @apiName Get App feedback
     * @apiGroup Admin
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getappfeedback',function(req,res){
        adminController.getAppFeedback(req,res,models,app);
    });

    /**
     * @api {post} /api/admin/creatediscountcoupons API for created discount-coupons details. 
     * @apiName Create Discount Coupons
     * @apiGroup Admin
     * @apiParam {String} coupon_code Mandatory coupon_code of the discount-coupons
     * @apiParam {String} discount_percent Mandatory discount_percent of the discount-coupons
     * @apiParam {String} valid_for Mandatory valid_for of the discount-coupons
     * @apiParam {String} valid_upto Mandatory valid_upto of the discount-coupons
     * @apiParam {String} total_limit Mandatory total_limit of the discount-coupons
     * @apiParam [valid_from] Optional valid_from of the discount-coupons
     * @apiParam [not_valid_on] Optional not_valid_on of the discount-coupons
     * @apiParam [created_by] Optional created_by of the discount-coupons
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/creatediscountcoupons',function(req,res){
        adminController.createDiscountCoupons(req,res,models,app);
    });

    /**
     * @api {post} /api/admin/setdealstermsofusemaster API for set deals-terms-of-uses-master details. 
     * @apiName Deals' terms of Use
     * @apiGroup Admin
     * @apiParam {String} terms_text Mandatory terms_text of the deals-terms-of-uses-master
     * @apiParam {String} [created_by] Optional created_by of deals-terms-of-uses-master
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/setdealstermsofusemaster',function(req,res){
        adminController.setdealstermsofusemaster(req,res,models,app);
    });

    /**
     * @api {post} /api/admin/sendpasswordtoowner API for send password to employee. 
     * @apiName Send Password To Owner
     * @apiGroup Admin
     * @apiParam {String} owner_id Mandatory owner_id of the employee
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/sendpasswordtoowner', function(req,res){
        adminController.sendPasswordToOwner(req,res,models,app)
    });

    /**
     * @api {post} /api/admin/getbusinesslist API for getting business list. 
     * @apiName Get Business list
     * @apiGroup Admin
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getbusinesslist', function(req,res){
        adminController.getBusinessList(req,res,models,app)
    });

    /**
     * @api {post} /api/admin/getdealslist API for getting deals list. 
     * @apiName Get Deals list
     * @apiGroup Admin
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getdealslist', function(req,res){
        adminController.getDealsList(req,res,models,app)
    });


    /**
     * @api {post} /api/admin/getemployeelist API for getting employee list. 
     * @apiName Get Employee list
     * @apiGroup Admin
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getemployeelist', function(req,res){
        adminController.getEmployeeList(req,res,models,app)
    });

    /**
     * @api {post} /api/admin/getallbusinessvisits API for getting Visits. 
     * @apiName Get All Business Visits
     * @apiGroup Admin
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getallbusinessvisits', function(req,res){
        adminController.getAllBusinessVisits(req,res,models,app)
    });

    /**
     * @api {post} /api/admin/getallbooking API for getting Business_appointment. 
     * @apiName Get All Booking
     * @apiGroup Admin
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getallbooking', function(req,res){
        adminController.getAllBooking(req,res,models,app)
    });


     /**
     * @api {post} /api/admin/showworkinghours API for getting Business_hours. 
     * @apiName Show Working Hours
     * @apiGroup Admin
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/showworkinghours', function(req,res){
        adminController.showWorkingHours(req,res,models,app)
    });

    /**
     * @api {post} /api/admin/disablebusiness API for disable business of business.
     * @apiName Disable Business
     * @apiGroup Admin
     * @apiParam {String} business_id Mandatory business_id of business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/disablebusiness', function(req,res){
        adminController.disableBusiness(req,res,models,app);
    });

    /**
     * @api {post} /api/admin/getbusinessamenities API for getting business_amenities. 
     * @apiName Get Business Amenities
     * @apiGroup Admin
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getbusinessamenities', function(req,res){
        adminController.getBusinessAmenities(req,res,models,app)
    });

    /**
     * @api {post} /api/admin/getbookingservice API for getting appointment_services. 
     * @apiName Get Booking Service
     * @apiGroup Admin
     * @apiParam {String} booking_id Mandatory booking_id of appointment_services
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getbookingservice', function(req,res){
        adminController.getBookingService(req,res,models,app)
    });

    /**
     * @api {post} /api/admin/getallbusinessmedia API for getting business_media details.
     * @apiName Get all Business Media details
     * @apiGroup Admin
     * @apiParam {String} business_id Mandatory business_id of business_media
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid     
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getallbusinessmedia', function(req,res){
        adminController.getAllBusinessMedia(req,res,models,app);
    });


    /**
     * @api {post} /api/admin/sendotptoemployee API for send otp to employee. 
     * @apiName Send Otp To Employee
     * @apiGroup Admin
     * @apiParam {String} business_id Mandatory business_id of of the employee
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/sendotptoemployee', function(req,res){
        adminController.sendOtpToEmployee(req,res,models,app)
    });


     /**
     * @api {post} /api/admin/createemployee API for created employee details. 
     * @apiName Create Employee Details.
     * @apiGroup Admin
     * @apiParam {String} first_name Mandatory first_name of the employee
     * @apiParam {String} mobile_number Mandatory mobile_number of the employee
     * @apiParam {String} email_address Mandatory email_address of the employee
     * @apiParam {String} employee_type Mandatory employee_type of the employee
     * @apiParam {String} city_id Mandatory city_id of the employee
     * @apiParam {String} address Mandatory address of the employee
     * @apiParam {String} gender Mandatory gender of the employee
     * @apiParam {String} business_id Mandatory business_id of the employee
     * @apiParam {String} postal_code Mandatory postal_code of the employee
     * @apiParam {String} role_id Mandatory role_id of the employee
     * @apiParam [date_of_birth] Optional date_of_birth of the employee
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/createemployee',function(req,res){
        adminController.createEmployee(req,res,models,app);
    });


    /**
     * @api {post} /api/admin/getallusers API for getting all users list. 
     * @apiName Get All Users list
     * @apiGroup Admin
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getallusers', function(req,res){
        adminController.getAllUsers(req,res,models,app)
    });

    /**
     * @api {post} /api/admin/getallhomeservices API for getting all services details of services.
     * @apiName Get All Home services
     * @apiGroup Admin
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
    app.post('/api/admin/getallhomeservices',function(req,res){
        adminController.getallhomeservices(req,res,models,app);
    });
    
    /**
     * @api {post} /api/user/gethomeserviceservices API for getting all purchase details of services.
     * @apiName Get Serives inside homeservice
     * @apiGroup Admin
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
    app.post('/api/admin/gethomeserviceservices',function(req,res){
        adminController.gethomeserviceservices(req,res,models,app);
    });


    /**
     * @api {post} /api/admin/updateemployeedetails API for updated details of employee.
     * @apiName Update Employee Details
     * @apiGroup Admin
     * @apiParam {String} employee_id Mandatory employee_id of employee
     * @apiParam [first_name] Optional first_name of the employee
     * @apiParam [last_name] Optional last_name of the employee
     * @apiParam [city_id] Optional city_id of the employee
     * @apiParam [address] Optional address of the employee
     * @apiParam [gender] Optional gender of the employee
     * @apiParam [active] Optional active of the employee
     * @apiParam [role_id] Optional role_id of the employee
     * @apiParam [postal_code] Optional postal_code of the employee
     * @apiParam [date_of_birth] Optional date_of_birth of the employee
     * @apiParam [mobile_number] Optional mobile_number of the employee
     * @apiParam [email_address] Optional email_address of the employee
     * @apiParam [employee_type] Optional employee_type of the employee
     * @apiParam [email_verified] Optional email_verified of the employee
     * @apiParam [mobile_verified] Optional mobile_verified of the employee
     * @apiParam [date_of_joining] Optional date_of_joining of the employee
     * @apiParam [profile_picture_url] Optional profile_picture_url of the employee
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/updateemployeedetails',function(req,res){
        adminController.updateEmployeeDetails(req,res,models,app);
    });


    /**
     * @api {post} /api/admin/updatebusinessdetails API for updated details of business.
     * @apiName Update Business Details
     * @apiGroup Admin
     * @apiParam {String} business_id Mandatory business_id of business
     * @apiParam [business_name] Optional business_name of the business
     * @apiParam [city_id] Optional city_id of the business
     * @apiParam [website] Optional website of the business
     * @apiParam [address] Optional address of the business
     * @apiParam [is_active] Optional is_active of the business
     * @apiParam [address_lat] Optional address_lat of the business
     * @apiParam [address_long] Optional address_long of the business
     * @apiParam [description] Optional description of the business
     * @apiParam [postal_code] Optional postal_code of the business
     * @apiParam [business_type] Optional business_type of the business
     * @apiParam [email_address] Optional email_address of the business
     * @apiParam [contact_number] Optional contact_number of the business
     * @apiParam [profile_picture_url] Optional profile_picture_url of the business
     * @apiParam [alternate_contact_number] Optional alternate_contact_number of the business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/updatebusinessdetails',function(req,res){
        adminController.updateBusinessDetails(req,res,models,app);
    });

    /**
     * @api {post} /api/admin/activedeals API for active deals. 
     * @apiName Active Deals
     * @apiGroup Admin
     * @apiParam {String} deal_id Mandatory deal_id of of the deals
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/activedeals', function(req,res){
        adminController.activeDeals(req,res,models,app)
    });


    /**
     * @api {post} /api/admin/deactivedeals API for deactive deals. 
     * @apiName Deactive Deals
     * @apiGroup Admin
     * @apiParam {String} deal_id Mandatory deal_id of of the deals
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/deactivedeals', function(req,res){
        adminController.deactiveDeals(req,res,models,app)
    });


    /**
     * @api {post} /api/admin/getbussinessreviews API for bussiness reviewss. 
     * @apiName Get Bussiness Reviews
     * @apiGroup Admin
     * @apiParam {String} business_id Mandatory business_id of business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getbusinessreviews', function(req,res){
        adminController.getBusinessReviews(req,res,models,app)
    });

    /**
     * @api {post} /api/admin/setbussinessreviewsvisible API for set bussiness reviewss visible. 
     * @apiName Set Bussiness Reviews Visible
     * @apiGroup Admin
     * @apiParam {String} business_id Mandatory business_id of business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/setbussinessreviewsvisible', function(req,res){
        adminController.setBusinessReviewsVisible(req,res,models,app)
    });

    /**
     * @api {post} /api/admin/setbussinessreviewsvisiblehidden API for set bussiness reviewss visible hidden. 
     * @apiName Set Bussiness Reviews Visible Hidden
     * @apiGroup Admin
     * @apiParam {String} business_id Mandatory business_id of business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/setbussinessreviewsvisiblehidden', function(req,res){
        adminController.setBusinessReviewsVisibleHidden(req,res,models,app)
    });

    /**
     * @api {post} /api/admin/getbussinessservice API
     * @apiName Get Bussiness Service
     * @apiGroup Admin
     * @apiParam {String} business_id Mandatory business_id of business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getbussinessservice', function(req,res){
        adminController.getBussinessService(req,res,models,app)
    });


    /**
     * @api {post} /api/admin/getbusinessamenities API
     * @apiName Get Business Amenities
     * @apiGroup Admin
     * @apiParam {String} business_id Mandatory business_id of business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getbusinessamenities', function(req,res){
        adminController.getBusinessAmenities(req,res,models,app)
    });

    /**
     * @api {post} /api/admin/getallapplicationfeedbackemployee API
     * @apiName get All Application Feedback Employee
     * @apiGroup Admin
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getallapplicationfeedbackusers', function(req,res){
        adminController.getAllApplicationFeedbackUsers(req,res,models,app)
    });


    /**
     * @api {post} /api/admin/getallapplicationfeedbackemployee API
     * @apiName get All Application Feedback Employee
     * @apiGroup Admin
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/getallapplicationfeedbackemployee', function(req,res){
        adminController.getAllApplicationFeedbackEmployee(req,res,models,app)
    });


    /**
     * @api {post} /api/admin/sendfeedbackreplytoemployee API
     * @apiName Send Feedback Reply To Employee
     * @apiGroup Admin
     * @apiParam {String} Feedback_id Mandatory Feedback_id of Application_feedback
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/sendfeedbackreplytoemployee', function(req,res){
        adminController.sendFeedbackReplyToEmployee(req,res,models,app)
    });


    /**
     * @api {post} /api/admin/sendfeedbackreplytousers API
     * @apiName Send Feedback Reply To Users
     * @apiGroup Admin
     * @apiParam {String} Feedback_id Mandatory Feedback_id of Application_feedback
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/admin/sendfeedbackreplytousers', function(req,res){
        adminController.sendFeedbackReplyToUsers(req,res,models,app)
    });
}