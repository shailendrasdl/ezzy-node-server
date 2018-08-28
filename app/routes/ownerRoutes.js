var ownerController = require('../controllers/ownerController.js');
var jwt    = require('jsonwebtoken');


module.exports = function(app,passport,models,config,s3) {
    app.use('/api/owner/', function(req,res,next){
        console.log("Executing service " + req.path);
        if(req.headers['token']==undefined || req.headers['token']==null){
            res.status(400).json({error_msg:"token not found in header"});
            return;
        } else {
            models.Employee_Sessions.findOne({where:{session_token: req.headers['token'],device_id: req.headers['deviceid'],active: 1}}).then(function(session){
                if(session){
                    jwt.verify(req.headers['token'], app.get('superSecret'),function(err, decoded){
                        if(err){
                            res.status(400).json({error_msg:"Token expired"});
                            return;
                        } else {
                            console.log("Owner_id: " + decoded.employee_id)
                            req.employee_id = decoded.employee_id;
                            next();
                            return null;
                        }
                    })
                    return null;
                } else {
                    res.status(400).json({error_msg:"Please relogin"});
                    return;
                }
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg:"Cannot find token"});
                return;
            });
        }
    });

    /**
     * @api {post} /api/owner/updatebusinessdescription API for updated about business(business description).
     * @apiName Update business description
     * @apiGroup Owner
     * @apiParam {String} description Mandatory description of business
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
    app.post('/api/owner/updatebusinessdescription', function(req, res){
        ownerController.updateBusinessDescription(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/getbusinessdescription API for getting about business(get business description).
     * @apiName Get business description
     * @apiGroup Owner
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
    app.post('/api/owner/getbusinessdescription',function(req,res){
        ownerController.getBusinessDescription(req,res,models,app);
    });


     /**
     * @api {post} /api/owner/updatebusinesscontactdetails API for updated contact details of business.
     * @apiName Update business contact details
     * @apiGroup Owner
     * @apiParam {String} contact_number Mandatory contact_number of business
     * @apiParam {String} email_address Mandatory email_address of business
     * @apiParam {String} [address] Optional address of business
     * @apiParam {String} [website] Optional website of business
     * @apiParam {String} [address_lat] Mandatory address_lat of business
     * @apiParam {String} [address_long] Mandatory address_long of business
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
    app.post('/api/owner/updatebusinesscontactdetails', function(req, res){
        ownerController.updatebusinesscontactdetails(req,res,models,app);
    });

    
    /**
     * @api {post} /api/owner/getemployeedetails API for getting owner's contact details.
     * @apiName Get employee details
     * @apiGroup Owner
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
    app.post('/api/owner/getemployeedetails',function(req,res){
        ownerController.getEmployeeDetails(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/getbusinessdetails API for getting business contact details.
     * @apiName Get business details
     * @apiGroup Owner
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
    app.post('/api/owner/getbusinessdetails',function(req,res){
        ownerController.getBusinessContactDetails(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/updateemplemail API for updated contact details of employee.
     * @apiName Update employee's email address
     * @apiGroup Owner
     * @apiParam {String} email_address Mandatory email_address of employee
     * @apiHeader {String} token token of the owner
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
    app.post('/api/owner/updateemplemail',function(req,res){
        ownerController.updateEmplEmail(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/updateemplphonenumber API for updated contact details of business.
     * @apiName Update employee's phone number
     * @apiGroup Owner
     * @apiParam {String} contact_number Mandatory contact_number of business
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
    app.post('/api/owner/updateemplphonenumber',function(req,res){
        ownerController.updateEmplPhoneNumber(req,res,models,app);
    });  

    /**
     * @api {post} /api/owner/updatebusinesscontact API for updated contact details of business.
     * @apiName Update Business Contact details
     * @apiGroup Owner
     * @apiParam {String} contact_number Mandatory contact_number of business
     * @apiParam {String} [alternate_contact_number] Optional alternate_contact_number of business
     * @apiParam {String} email Mandatory email of business
     * @apiParam {String} address Mandatory address of business
     * @apiParam {String} [website] Optional website of business
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
    app.post('/api/owner/updatebusinesscontact',validateFields, function(req,res){
        ownerController.updateBusinessContact(req,res,models,app);
    }); 

    function validateFields(req,res,next){
        req.checkBody('contact_number', 'Contact number is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('address', 'Address is required').notEmpty();
        //validate 
        var errors = req.validationErrors();
        if (errors) {
            res.status(400).json({error_msg: errors.map(function(v){
                return v.msg;
            }).join(", ")});
        } else {
            next();
        }
    }

    /**
     * @api {post} /api/owner/setbusinessservice API adding services to the business.
     * @apiName Set services for business
     * @apiGroup Owner
     * @apiParam {String} service_id Mandatory service_id of service
     * @apiParam {String} price Mandatory price of service
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
    app.post('/api/owner/setbusinessservice',function(req,res){
        ownerController.setBusinessService(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/setpassword API set password of the owner.
     * @apiName Set password
     * @apiGroup Owner
     * @apiParam {String} password Mandatory
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
    app.post('/api/owner/setpassword', function(req,res){
        ownerController.setPassword(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/uploadownerprofilepicture API set password of the owner.
     * @apiName Upload owner's profile picture
     * @apiGroup Owner
     * @apiParam {String} base64image Mandatory base64 encoded image
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
    app.post('/api/owner/uploadownerprofilepicture', function(req, res){
        ownerController.uploadProfilePicture(req,res,models,s3);
    });

    /**
     * @api {post} /api/owner/uploadbusinessprofilepicture API set password of the owner.
     * @apiName Upload business profile picture
     * @apiGroup Owner
     * @apiParam {String} base64image Mandatory base64 encoded image
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
    app.post('/api/owner/uploadbusinessprofilepicture', function(req, res){
        ownerController.uploadBusinessProfilePicture(req,res,models,s3);
    });

    /**
     * @api {post} /api/owner/uploadbusinessphotos API upload business photos
     * @apiName Upload photos of business
     * @apiGroup Owner
     * @apiParam {String} base64image Mandatory base64 encoded image
     * @apiParam {String} media_type_id Mandatory and valid media_type_id from Media_type table
     * @apiParam {String} media_name Mandatory and valid media_name from Media_type table
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
    app.post('/api/owner/uploadbusinessphotos', function(req, res){
        ownerController.uploadBusinessPhoto(req,res,models,s3);
    });

    /**
     * @api {post} /api/owner/uploadbusinessvideos API upload business videos.
     * @apiName Upload business videos
     * @apiGroup Owner
     * @apiParam {String} base64image Mandatory base64 encoded image
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
    app.post('/api/owner/uploadbusinessvideos', function(req, res){
        res.end("Api in progress");
        // ownerController.uploadVideoToS3(req,res,models,s3);
    });

    /**
     * @api {post} /api/owner/updatebusinessprimarycontact API for updated contact details of business.
     * @apiName Update business primary contact number
     * @apiGroup Owner
     * @apiParam {String} contact_number Mandatory contact_number of business
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
    app.post('/api/owner/updatebusinessprimarycontact',function(req,res){
        ownerController.updateBusinesPrimaryContact(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/updatebusinesssecondarycontact API for updated secondary contact details of business.
     * @apiName Update business seconday contact number
     * @apiGroup Owner
     * @apiParam {String} alternate_contact_number Mandatory alternate_contact_numbers of business
     * @apiHeader {String} token token of the owner
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
    app.post('/api/owner/updatebusinesssecondarycontact',function(req,res){
        ownerController.updateBusinessSecondaryContact(req,res,models,app);
    });



    /**
     * @api {post} /api/owner/updatebusinessemail API for updated email details of business.
     * @apiName Update business email address
     * @apiGroup Owner
     * @apiParam {String} email_address Mandatory email_address of business
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
    app.post('/api/owner/updatebusinessemail',function(req,res){
        ownerController.updateBusinessEmail(req,res,models,app);
    });


     /**
     * @api {post} /api/owner/updatebusinesseaddress API for updated address details of business.
     * @apiName Update business address
     * @apiGroup Owner
     * @apiParam {String} address Mandatory address of business
     * @apiHeader {String} token token of the owner
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
    app.post('/api/owner/updatebusinesseaddress',function(req,res){
        ownerController.updateBusinessAddress(req,res,models,app);
    });



    /**
     * @api {post} /api/owner/updatebusinesslatlongaddress API for updated lat-long details of business.
     * @apiName Update business map location
     * @apiGroup Owner
     * @apiParam {String} address_lat Mandatory address_lat of business
     * @apiParam {String} address_long Mandatory address_long of business
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
    app.post('/api/owner/updatebusinesslatlongaddress',function(req,res){
        ownerController.updateBusinessLatlongAddress(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/setbusinessamenities API for set business_amenities details using Business_amenities.
     * @apiName Set amenities for business
     * @apiGroup Owner    
     * @apiParam amenity_id Mandatory amenity_id of the business_amenities
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/setbusinessamenities',function(req,res){
        ownerController.setBusinessAmenities(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/getallbusinessamenities API for getting business_amenities details.
     * @apiName Get all business amenities
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/getallbusinessamenities',function(req,res){
        ownerController.getAllBusinessAmenities(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/getappointments API for getting business_appointment details using business_id.
     * @apiName Get appointments
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/getappointments',function(req,res){
        ownerController.getAllAppointmentsForBusiness(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/deletebusinessamenities API for deleting business_amenities details using amenity_id.
     * @apiName Delete business amenities
     * @apiGroup Owner
     * @apiParam {String} amenity_id Mandatory amenity_id of amenity to be removed from business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5Mjg2NDc0LCJleHAiOjE1MTkzNzI4NzR9.EAnfPfOthzx2gig7s6Cf3WExImEpyreuA8uY_D27pCw"
     *  }
     */
    app.post('/api/owner/deletebusinessamenities',function(req,res){
        ownerController.deleteBusinessAmenities(req,res,models,app);
    });

    

    /**
     * @api {post} /api/owner/getbusinesscategoryandservices API details.
     * @apiName Get business category and services
     * @apiGroup Owner
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
    app.post('/api/owner/getbusinesscategoryandservices',function(req,res){
        ownerController.getBusinessCategoryAndServices(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/setbusinesshours API for set Business_hours details using business_id.
     * @apiName Set business hours
     * @apiGroup Owner
     * @apiParam {String} day Mandatory day of Business_hours must be between ["1"-"7"], where 1 is sunday
     * @apiParam {String} open_time Mandatory open_time of Business_hours, must be in format HH:MM
     * @apiParam {String} close_time Mandatory close_tiime of Business_hours, must be in format HH:MM
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     *  }
     */
    app.post('/api/owner/setbusinesshours',function(req,res){
        // res.status(400).end("API work in progress");
        ownerController.setBusinessHours(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/getbusinesshours API getting Business_hours details using business_id.
     * @apiName Get business hours
     * @apiGroup Owner
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
    app.post('/api/owner/getbusinesshours',function(req,res){
        ownerController.getBusinessHours(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/getbusinessreviews API getting business_reviews details.
     * @apiName Get busines reviews
     * @apiGroup Owner
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
    app.post('/api/owner/getbusinessreviews',function(req,res){
        ownerController.getBusinessReviews(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/deletebusinessservice API for deleting business_service details using service_id.
     * @apiName Delete business services
     * @apiGroup Owner
     * @apiParam {String} service_id Mandatory service_id of business_service to be removed from business
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5NzEwNjY4LCJleHAiOjE1MTk3OTcwNjh9.n-2rFXbCR9uJXjZIJcqVXIlytd0qSpmqTaMGq029rmg"
     *  }
     */
    app.post('/api/owner/deletebusinessservice',function(req,res){
        ownerController.deleteBusinessService(req,res,models,app);
    });

        /**
     * @api {post} /api/owner/updatebusinessappointmentstatus API for updated about business_appointment(booking_status).
     * @apiName Update business appointment status
     * @apiGroup Owner
     * @apiParam {String} appointment_id Mandatory appointment_id of business_appointment
     * @apiParam {String} status Mandatory booking_status of business_appointment
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
    app.post('/api/owner/updatebusinessappointmentstatus',function(req,res){
        ownerController.updateBusinessAppointmentStatus(req,res,models,app);
    });



    /**
     * @api {post} /api/owner/getbusinessappointmentbydate API getting business appointment details.
     * @apiName Get business apoointment by date
     * @apiGroup Owner
     * @apiParam {String} date Mandatory booking_date of Business_appointment
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
    app.post('/api/owner/getbusinessappointmentbydate',function(req,res){
        ownerController.getBusinessAppointmentByDate(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/getbusinessmedia API getting business_media details using business_id.
     * @apiName Get business media
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/getbusinessmedia',function(req,res){
        ownerController.getBusinessMedia(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/createdeals API for create deals
     * @apiName Create deals
     * @apiGroup Owner
     * @apiParam {String} deal_title Mandatory deal_title of the deal
     * @apiParam {String} valid_from Mandatory valid_from of the deal
     * @apiParam {String} valid_upto Mandatory valid_upto of the deal
     * @apiParam {String} deal_type Mandatory deal_type of the deal
     * @apiParam {String} is_active Mandatory is_active of the deal
     * @apiParam {String} [deal_description] Optional deal_description of deal
     * @apiParam {String} [image_url] Optional image_url of deal
     * @apiParam {String} [actual_price] Optional actual_price of deal
     * @apiParam {String} [other_details] Optional other_details of deal
     * @apiParam {String} [percentage_off] Optional percentage_off of deal
     * @apiParam {String} [net_price] Optional net_price of deal
     * @apiParam {String} [max_people] Optional max_people of deal
     * @apiParam {String} [min_people] Optional min_people of deal
     * @apiParam {String} [total_number_of_deals] Optional total_number_of_deals of deal
     * @apiParam {String} [terms_of_use] Optional terms_of_use of deal
     * @apiParam {String} [max_purchase_quatity_per_person] Optional max_purchase_quatity_per_person of deal
     * @apiParam {String} [deal_id] Optional deal_id,(send only if existing deal needs to be updated)
     * @apiParam {String} [valid_on] Optional valid_on to set deal validity days
     * @apiHeader {String} source source - Android or iOS   
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     *  }
     */
    app.post('/api/owner/createdeals',function(req,res){
        ownerController.createdeals(req,res,models,app,s3);
    });

    /**
     * @api {post} /api/owner/getdeals API getting deals details using business_id.
     * @apiName Get deals
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/getdeals',function(req,res){
        ownerController.getDeals(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/updatebusinesswebsite API for updated swebsite details of business.
     * @apiName Update business website
     * @apiGroup Owner
     * @apiParam {String} website Mandatory website of business
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
    app.post('/api/owner/updatebusinesswebsite',function(req,res){
        ownerController.updateBusinessWebsite(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/getalldealspurchased API for getting user-purchase-deals details.
     * @apiName Get all deals purchased till now
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/getalldealspurchased',function(req,res){
        ownerController.getAllDealsPurchased(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/getallpurchasedeals API for getting user-purchase-deals details.
     * @apiName Get all purchased deals
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/getallpurchasedeals',function(req,res){
        ownerController.getAllPurchaseDeals(req,res,models,app);
    });

     /**
     * @api {post} /api/owner/getallredeemeddeals API for getting user-purchase-deals details.
     * @apiName Get all redeemed deals
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/getallredeemeddeals',function(req,res){
        ownerController.getAllRedeemedDeals(req,res,models,app);
    });

     /**
     * @api {post} /api/owner/getallcancelleddeals API for getting user-purchase-deals details.
     * @apiName Get all cancelled deals
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/getallcancelleddeals',function(req,res){
        ownerController.getAllcancelledDeals(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/getbusinesspurchasedeals API for getting user-purchase-deals details.
     * @apiName Get business deals
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/getbusinesspurchasedeals',function(req,res){
        ownerController.getBusinessPurchaseDeals(req,res,models,app);
    });
    
    /**
     * @api {post} /api/owner/setdealstermsofuse API for set deals-terms-of-use details.
     * @apiName Set deals' terms of use
     * @apiGroup Owner
     * @apiParam {String} deal_id Mandatory deal_id of the deals-terms-of-use details
     * @apiParam {String} checked Mandatory Send checked true to add, false to remove
     * @apiParam {String} deal_terms_of_use_master_id Mandatory deal_terms_of_use_master_id of the deals-terms-of-use details
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      
     * }
     */
    app.post('/api/owner/setdealstermsofuse',function(req,res){
        ownerController.setDealsTermsOfUse(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/deactivatedeals API for deactive-deals
     * @apiName Deactivate deal
     * @apiGroup Owner
     * @apiParam {String} deal_id Mandatory deal_id of the deal
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *    
     * }
     */
    app.post('/api/owner/deactivatedeals',function(req,res){
        ownerController.DeactiveDeals(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/activateDeals API for active-deals
     * @apiName Activate deals
     * @apiGroup Owner
     * @apiParam {String} deal_id Mandatory deal_id of the deal
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *    
     * }
     */
    app.post('/api/owner/activateDeals',function(req,res){
        ownerController.ActiveDeals(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/getdealdetails API for getting deals details.
     * @apiName Get deal deatails
     * @apiGroup Owner
     * @apiParam {String} deal_id Mandatory deal_id of the deal
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *    
     * }
     */
    app.post('/api/owner/getdealdetails',function(req,res){
        ownerController.getDealDetails(req,res,models,app);
    });

     /**
     * @api {post} /api/owner/getredeemedeals API for getting redeemed deals details.
     * @apiName Get Redeemed deals Details.
     * @apiGroup Owner
     * @apiParam {String} deal_id Mandatory deal_id of the deal
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/getredeemedeals',function(req,res){
        ownerController.getredeemedeals(req,res,models,app);
    });

   /**
     * @api {post} /api/owner/getcancelleddeals API for getting cancelled deals details.
     * @apiName Get Cancelled deals Details.
     * @apiGroup Owner
     * @apiParam {String} deal_id Mandatory deal_id of the deal
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/getcancelleddeals',function(req,res){
        ownerController.getcancelleddeals(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/getpurchaseddeals API for getting purchased deals details.
     * @apiName Get Purchased deals Details.
     * @apiGroup Owner
     * @apiParam {String} purchase_id Mandatory purchase_id of the deal
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/getpurchaseddeals',function(req,res){
        ownerController.getPurchasedDeals(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/getdashboarddata API for getting dashboard data details.
     * @apiName Get Dashboard Data Details.
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/getdashboarddata',function(req,res){
        ownerController.getDashboardData(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/setdayclosed API for set close day details using business_id.
     * @apiName Set Day Close
     * @apiGroup Owner
     * @apiParam {String} day Mandatory day of Business_hours must be between ["1"-"7"], where 1 is sunday
     * @apiParam {String} closed Mandatory closed parameter to mark business open or closed, (0=closed), (1=open)
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     *  }
     */
    app.post('/api/owner/setdayclosed',function(req,res){
        ownerController.setDayClosed(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/getappointmentbyid API for getting business_appointment details using appointment_id.
     * @apiName Get appointment by id
     * @apiGroup Owner
     * @apiParam {String} appointment_id  Mandatory appointment_id of the Business_appointment
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/getappointmentbyid',function(req,res){
        ownerController.getAppointmentById(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/getappointmentbydate API for getting business appointment details using date.
     * @apiName Get appointment by date
     * @apiGroup Owner
     * @apiParam {String} date Mandatory date for fecting bookings
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example:
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     *  }
     */
    app.post('/api/owner/getappointmentbydate', function(req,res){
        ownerController.getAppointmentByDate(req,res,models,app)
    });


    /**
     * @api {post} /api/owner/approveappointment API for approving appointment
     * @apiName Approve Appointment
     * @apiGroup Owner
     * @apiParam {String} appointment_id Mandatory appointment_id of business_appointment
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
    app.post('/api/owner/approveappointment', function(req,res){
        ownerController.approveAppointment(req,res,models,app)
    });

    /**
     * @api {post} /api/owner/cancelappointment API for cancelling business_appointment.
     * @apiName Cancel Appointment
     * @apiGroup Owner
     * @apiParam {String} appointment_id Mandatory appointment_id of business_appointment
     * @apiParam {String} cancellation_reason Mandatory reason of cancellation
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
    app.post('/api/owner/cancelappointment', function(req,res){
        ownerController.cancelAppointment(req,res,models,app)
    });

    /**
     * @api {post} /api/owner/getdashboarddataday API for getting dashboard data details.
     * @apiName Get Dashboard Data Day Details.
     * @apiGroup Owner
     * @apiParam {String} day Mandatory day of user_deals_purchase
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/getdashboarddataday',function(req,res){    
        ownerController.getDashboardDataDay(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/getredeemedealsforday API for getting redeemed deals details.
     * @apiName Get Redeemed deals For Day Details.
     * @apiGroup Owner
     * @apiParam {String} day Mandatory day of the user_deals_purchase
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/getredeemedealsforday',function(req,res){
        res.end("Api in progress");
        // ownerController.getRedeemeDealsForDay(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/getcancelleddealsforday API for getting cancelled deals details.
     * @apiName Get Cancelled deals For Day Details.
     * @apiGroup Owner
     * @apiParam {String} day Mandatory day of the user_deals_purchase
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/getcancelleddealsforday',function(req,res){
        res.end("Api in progress");
        // ownerController.getCancelledDealsForDay(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/getpurchaseddealsforday API for getting Purchased deals details.
     * @apiName Get Purchased deals For Day Details.
     * @apiGroup Owner
     * @apiParam {String} day Mandatory day of the user_deals_purchase
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/getpurchaseddealsforday',function(req,res){
        res.end("Api in progress");
        // ownerController.getPurchasedDealsForDay(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/activatebusiness API
     * @apiName Activate Business.
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/activatebusiness', function(req,res){
        ownerController.activatebusiness(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/updatefirebasetoken API for update firebase_token of employee.
     * @apiName Update Firebase Token
     * @apiGroup Owner
     * @apiParam {String} firebase_token Mandatory firebase_token of employee
     * @apiHeader {String} firebase_token token of the owner
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
    app.post('/api/owner/updatefirebasetoken', function(req,res){
        ownerController.updateFirebaseToken(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/searchdeals API for search deals.
     * @apiName Search Deals
     * @apiGroup Owner
     * @apiParam {String} search_parameter Mandatory parameter for searching deals
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
    app.post('/api/owner/searchdeals', function(req,res){
        ownerController.searchDeals(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/searchbooking API for search business_appointment.
     * @apiName Search Booking
     * @apiGroup Owner
     * @apiParam {String} search_parameter Mandatory parameter for searching appointments
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
    app.post('/api/owner/searchbooking', function(req,res){
        ownerController.searchBooking(req,res,models,app);
    });

     /**
     * @api {post} /api/owner/updatebusinesstype API for updated business_type details of business.
     * @apiName Update business For business_type
     * @apiGroup Owner
     * @apiParam {String} business_type_id Mandatory business_type_id of business
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
    app.post('/api/owner/updatebusinesstype',function(req,res){
        ownerController.updateBusinessType(req,res,models,app);
    });
    
    /**
     * @api {post} /api/owner/generateotp API for generating otp.
     * @apiName Generate Otp for employee
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *  }
     */
    app.post('/api/owner/generateotp', function(req,res){
        ownerController.generateOtp(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/setbankaccountdetails API for set bank_account_details.
     * @apiName Set Bank Account Details
     * @apiGroup Owner
     * @apiParam {String} bank_name Mandatory bank_name of the business_bank_details
     * @apiParam {String} account_number Mandatory account_number of the business_bank_details
     * @apiParam {String} account_holder_name Mandatory account_holder_name of the business_bank_details
     * @apiParam {String} pan_card_number Mandatory pan_card_number of the business_bank_details
     * @apiParam {String} account_type Mandatory account_type of the business_bank_details
     * @apiParam {String} [gst_number] Optional GST Identification Number of the business_bank_details
     * @apiParam {String} [ifsc_code] Optional ifsc_code of business_bank_details
     * @apiParam {String} [branch_name] Optional branch_name of business_bank_details
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/setbankaccountdetails',function(req,res){
        ownerController.setBankAccountDetails(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/getbankaccountdetails API getting bank_account details.
     * @apiName Get Bank Account Details
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/getbankaccountdetails',function(req,res){
        ownerController.getBankAccountDetails(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/deleteownerprofilepicture API for deleting profile_picture_url for employee.
     * @apiName Delete Owner Profile Picture
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5Mjg2NDc0LCJleHAiOjE1MTkzNzI4NzR9.EAnfPfOthzx2gig7s6Cf3WExImEpyreuA8uY_D27pCw"
     *  }
     */
    app.post('/api/owner/deleteownerprofilepicture',function(req,res){
        ownerController.deleteOwnerProfilePicture(req,res,models,s3);
    });


    /**
     * @api {post} /api/owner/deletebusinessprofilepicture API for deleting profile_picture_url for business.
     * @apiName Delete Business Profile Picture
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeader {String} token of the owner
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5Mjg2NDc0LCJleHAiOjE1MTkzNzI4NzR9.EAnfPfOthzx2gig7s6Cf3WExImEpyreuA8uY_D27pCw"
     *  }
     */
    app.post('/api/owner/deletebusinessprofilepicture',function(req,res){
        ownerController.deleteBusinessProfilePicture(req,res,models,s3);
    });

    /**
     * @api {post} /api/owner/getnotificationsbygroupname API getting notifications details.
     * @apiName Get Notifications By Group Name
     * @apiGroup Owner
     * @apiParam {String} group_name Mandatory group_name of the notifications
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/getnotificationsbygroupname',function(req,res){
        ownerController.getNotificationsByGroupName(req,res,models,app);
    });

    /**
     * @api {post} /api/owner/getNotificationsByEmployeeId API getting Notifications details.
     * @apiName Get Notifications By Employee Id
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/getNotificationsByEmployeeId',function(req,res){
        ownerController.getNotificationsByEmployeeId(req,res,models,app);
    });

       /**
     * @api {post} /api/owner/clearallnotifications API for clear notifications.
     * @apiName Clear All Notifications
     * @apiGroup Owner
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/clearallnotifications',function(req,res){
        ownerController.clearAllNotifications(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/marknotificationasread API for mark notifications.
     * @apiName Mark Notification As Read
     * @apiGroup Owner
     * @apiParam {String} notification_id Mandatory notification_id of the notifications
     * @apiHeader {String} source source - Android or iOS
     * @apiHeader {String} deviceid unique deviceid
     * @apiHeaderExample {json} Header-Example: 
     *  { 
     *      "source": "Android", 
     *      "deviceid": "abcde12345" 
     *      "Content-Type": "application/json"
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/marknotificationasread',function(req,res){
        ownerController.markNotificationAsRead(req,res,models,app);
    });


    /**
     * @api {post} /api/owner/sendaplicationfeedback API for owner feedback.
     * @apiName Send Application Feedback
     * @apiGroup Owner
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
     *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6NSwiaWF0IjoxNTE5MzczOTM5LCJleHAiOjE1MTk0NjAzMzl9.mI43aQruagnCuGMJQqYA1wNaAqp7tiwzmBXNqJcRd8s"
     * 
     * }
     */
    app.post('/api/owner/sendaplicationfeedback',function(req,res){
        ownerController.sendApplicationFeedback(req,res,models,app);
    });

    
}