var exports = module.exports = {}
var jwt    = require('jsonwebtoken');
var bCrypt = require('bcrypt-nodejs');
var moment = require('moment');
var nodemailer = require('nodemailer');
var admin = require('firebase-admin');

exports.verfifybusiness = function(req,res,models){
   
    if(req.body.business_id==undefined||req.body.business_id==null){
            res.status(400).json({error_msg: "business_id cannot be blank"});
            return;
    }
    var activate = true;
    if(req.body.deactivate){
            activate=false;
    }
    models.Business.update({is_active: activate},{where:{id: req.body.business_id}}).then(function(business){
        if(business[0]==0){
            res.status(400).json({error_msg: "business_id not found"});
        } else {
            console.log("Business id: "+business[0] +" is now active!");
            res.json({business: business});
        }
    })
}

exports.verifyemployee = function(req,res,models){
    if(req.body.employee_id==undefined||req.body.employee_id==null){
        res.status(400).json({error_msg: "employee_id cannot be blank"});
        return;
    }   
    var activate = true;
    if(req.body.deactivate){
            activate=false;
    }
    models.Employee.update({active: activate},{where:{id: req.body.employee_id}}).then(function(employee){
        if(employee[0]==0){
            res.status(400).json({error_msg: "employee_id not found"});
        } else {
            sendEmailToEmployee(req,res,models);
            console.log("Employee id: "+employee[0] +" is now active!");
            res.json({employee: employee});
        }
    })
}

//send-Email function
sendEmailToEmployee = function(req,res,models){
    if(req.body.employee_id==undefined||req.body.employee_id==null){
        res.status(400).json({error_msg: "employee_id cannot be blank"});
        return;
    }
    models.Employee.findOne({where:{id:req.body.employee_id}}).then(function(employee){
        console.log(employee.email_address);
        if(employee.email_address==undefined || employee.email_address == null){
            res.status(400).json({error_msg: "No email found for provided Employee_id"});
            return;
        }
        var generateHash = function(newpassword) {
            return bCrypt.hashSync(newpassword, bCrypt.genSaltSync(8), null);
        };
        var newpassword = this.generatePassword();        
        var encryptedPassword = generateHash(newpassword);
        console.log("new password: " + newpassword + " encrypted password: " + encryptedPassword);
        models.Employee.update({password:encryptedPassword},{where:{email_address:employee.email_address}}).then(function(){
            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'vibhor@ananditech.com',
                    pass: 'anandi@123'
                }
            });
            var mailOptions = {
                from: "Ezee Salon <vibhor@ananditech.com>",
                to: employee.email_address,
                subject: "Ezee Salon Partner - Your password",
                html: "Hello "+employee.first_name + ", <br /><br />"
                    + "Your new password is: &nbsp;" +"<b>"+ newpassword +"</b>"+  '\n\n' +
                    "<p>Thank you,<br />EZ Salon</p>"
            }
            smtpTransport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('error',error);
                    res.json({ message:"Error in sending mail."});
                    return;
                } else {
                    console.log('Message sent: %s', info.messageId);
                    res.json({ message:"Employee id is now active! An email has been sent to "+employee.email_address+". Please check your inbox"});
                    return;
                }
            });
        })
    })
}

exports.setpaaswordofemployee = function(req,res,models){
    if(req.body.employee_id==undefined||req.body.employee_id==null){
        res.status(400).json({error_msg: "employee_id cannot be blank"});
        return;
    }
    if(req.body.password==undefined||req.body.password==null){
        res.status(400).json({error_msg: "employee_id cannot be blank"});
        return;
    }
    var validationErrors = validatePassword(req.body.password);
    if(validationErrors!=""){
        res.status(400).json({error_msg: validationErrors});
        return;
    }
    var generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };
    var userPassword = generateHash(req.body.password);
    models.Employee.update({password:userPassword}, {where:{id:req.body.employee_id}}).then(function(employee){
        if(employee[0]==0){
            res.status(400).json({error_msg: "employee_id not found"});
        } else {
            console.log("Employee id: "+employee[0] +", Password updated!");
            res.json({employee: employee});
        }
    });
}

function validatePassword(p) {
    var errors = [];
    if (p.length < 8) {
        errors.push("Your password must be at least 8 characters");
    }
    if (p.search(/[a-z]/) < 0) {
        errors.push("Your password must contain at least one letter."); 
    }
    if (p.search(/[A-Z]/) < 0) {
        errors.push("Your password must contain at least one capital letter."); 
    }
    if (p.search(/[0-9]/) < 0) {
        errors.push("Your password must contain at least one digit.");
    }
    if (p.search(/[!@#$%^&*]/i) < 0) {
        errors.push("Your password must contain at least one special character."); 
    }
    if (errors.length > 0) {
        console.log(errors.join("\n"));
        return errors.join("\n");
    }
    return "";
}

exports.addServiceCategory = function(req,res,models,app){
    if(req.body.category_name==undefined || req.body.category_name==null){
        res.status(400).json({error_msg:"category_name not found in body"});
        return;
    }
    models.Service_category.findOrCreate({where:{category_name:req.body.category_name}})
    .then(function(created){
        if(created){
            res.json({message : "created Successfully."});
            return;
        } else {
            res.status(400).json({error_msg: "Category already exists"});
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//@addServices API
exports.addServices = function(req,res,models,app){
    if(req.body.category_id==undefined || req.body.category_id==null){
        res.status(400).json({error_msg:"category_id not found in body"});
        return;
    }
    if(req.body.service_name==undefined || req.body.service_name==null){
        res.status(400).json({error_msg:"name not found in body"});
        return;
    }
    if(req.body.price==undefined || req.body.price==null){
        res.status(400).json({error_msg:"price not found in body"});
        return;
    }
    if(req.body.duration==undefined || req.body.duration==null){
        res.status(400).json({error_msg:"duration not found in body"});
        return;
    }
    models.Service_category.findOne({where:{id:req.body.category_id}}).then(function(category){
        if(category){
            var defaults = {        
                    price:req.body.price,
                    duration:req.body.duration,
                    description:req.body.description,
                    category_id:req.body.category_id
            }
            models.Services.findOrCreate({where:{
                    name:req.body.service_name                    
            },defaults}).then(function(created,result){
            if(created){
                res.json({"msg":"Services created successfully"});
            } else {
                res.json({"msg":"Service with this name already exists"})
                }
            });
        } else {
            res.status(400).json({error_msg:"No category found for this category_id"});
        }
    })
};

//@ Update_Services_Name_API
exports.updateServiceName = function(req,res,models,app){    
    if(req.body.service_name==undefined || req.body.service_name==null){
        res.status(400).json({error_msg:"service_name not found in body"});
        return;
    }    
    if(req.body.service_id==undefined || req.body.service_id==null){
        res.status(400).json({error_msg:"service_id not found in body"});
        return;
    }
    models.Services.findOne({where:{id:req.body.service_id}}).then(function(service){
        if(service==null){
            res.status(400).json({error_msg:"services_id not found in services"});
            return; 
        } else{
            models.Services.update({name:req.body.service_name},
                {where:{id:service.id},returning:true,plain:true})
                .then(function(){
                    res.json({"msg":"services name updated Successfully"
                });
            })  
        }
    })
     
};


//Update_Services_Description API
exports.updateServiceDescription = function(req,res,models,app){  
    if(req.body.description==undefined || req.body.description==null){
        res.status(400).json({error_msg:"description not found in body"});
        return;
    }    
    if(req.body.service_id==undefined || req.body.service_id==null){
        res.status(400).json({error_msg:"service_id not found in body"});
        return;
    }
    models.Services.findOne({where:{id:req.body.service_id}}).then(function(service){
        if(service==null){
            res.status(400).json({error_msg:"services_id not found in services"});
            return; 
        } else{
            models.Services.update({description:req.body.description},
                    {where:{id:service.id},returning:true,plain:true})
                    .then(function(){
                        res.json({"msg":"Description updated Successfully"
                    });
            }) 
        }
    })   
};


//@Update Services_Duration API
exports.updateServiceDuration = function(req,res,models,app){  
    if(req.body.duration==undefined || req.body.duration==null){
        res.status(400).json({error_msg:"duration not found in body"});
        return;
    }    
    if(req.body.service_id==undefined || req.body.service_id==null){
        res.status(400).json({error_msg:"service_id not found in body"});
        return;
    }
    models.Services.findOne({where:{id:req.body.service_id}}).then(function(service){
        if(service==null){
            res.status(400).json({error_msg:"services_id not found in services"});
            return; 
        } else{
            models.Services.update({duration:req.body.duration},
                {where:{id:service.id},returning:true,plain:true})
                .then(function(){
                    res.json({"msg":"duration updated Successfully"
                });
            })   
        }
    }) 
};


//@Update Services_Price API
exports.updateServicePrice = function(req,res,models,app){  
    if(req.body.price==undefined || req.body.price==null){
        res.status(400).json({error_msg:"price not found in body"});
        return;
    }    
    if(req.body.service_id==undefined || req.body.service_id==null){
        res.status(400).json({error_msg:"service_id not found in body"});
        return;
    }
    models.Services.findOne({where:{id:req.body.service_id}}).then(function(service){
        if(service==null){
            res.status(400).json({error_msg:"services_id not found in services"});
            return; 
        } else{
            models.Services.update({price:req.body.price},
                {where:{id:service.id},returning:true,plain:true})
                .then(function(){
                    res.json({"msg":"price updated Successfully"
                });
            })  
        }
    })  
};


//@update services category_id API
exports.updateServiceCategoryId = function(req,res,models,app){
    if(req.body.category_id==undefined || req.body.category_id==null){
        res.status(400).json({error_msg:"category_id not found in body"});
        return;
    }
    if(req.body.service_id==undefined || req.body.service_id==null){
        res.status(400).json({error_msg:"service_id not found in body"});
        return;
    }
    models.Service_category.findOne({where:{id:req.body.category_id}}).then(function(category){
        if(category){
            models.Services.findOne({where:{id:req.body.service_id}}).then(function(service){
                if(service==null){
                    res.status(400).json({error_msg:"services_id not found in services"});
                    return; 
                } else{
                    models.Services.update({category_id:req.body.category_id},
                        {where:{id:service.id},returning:true,plain:true})
                        .then(function(){
                            res.json({"msg":"category_id updated Successfully for "+service.name
                        });
                    })  
                }
            })          
        }else {
            res.status(400).json({error_msg:"No category found for this category_id"});
        }
    })
};

//@create_Amenities API
exports.setAmenitiesMaster = function(req,res,models,app){
    console.log("setAmenitiesMaster");
    if(req.body.amenities_name==undefined || req.body.amenities_name==null){
        res.status(400).json({error_msg:"amenities_name not found in body"});
        return;
    }
    models.Amenities_master.findOrCreate({where:{name:req.body.amenities_name,
        description:req.body.description,
        icon_url:req.body.icon_url}}).then(function(anenities){
        if(anenities){
            res.json({message : "Set Amenities  Successfully."});
            return;
        } else {
            res.status(400).json({error_msg: "Amenities already exists"});
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//@set_City_Areas API
exports.setCityAreas = function(req,res,models,app){
    if(req.body.city_id == undefined || req.body.city_id == null){
        res.status(400).json({error_msg:"city_id not found in body"});
        return;
    }
    if(req.body.area_name == undefined || req.body.area_name == null){
        res.status(400).json({error_msg:"area_name not found in body"});
        return;
    }
    if(req.body.area_code == undefined || req.body.area_code == null){
        res.status(400).json({error_msg:"area_code not found in body"});
        return;
    }
    if(req.body.pincode == undefined || req.body.pincode == null){
        res.status(400).json({error_msg:"pincode not found in body"});
        return;
    }
    if(req.body.area_lat == undefined || req.body.area_lat == null){
        res.status(400).json({error_msg:"area_lat not found in body"});
        return;
    }
    if(req.body.area_long == undefined || req.body.area_long == null){
        res.status(400).json({error_msg:"area_long not found in body"});
        return;
    }

    models.City_master.findOne({where:{id:req.body.city_id}}).then(function(city){
        if(city){
            models.City_areas.findOrCreate({where:{area_name:req.body.area_name,city_id:req.body.city_id},
                                            defaults:{area_code:req.body.area_code, pincode:req.body.pincode,area_lat:req.body.area_lat,area_long:req.body.area_long}
                                          }).spread(function(result,created){
                                                if(created){
                                                    res.json({"msg":"city areas created successfully"});
                                                    return;
                                                } else {
                                                    result.update({area_code:req.body.area_code, pincode:req.body.pincode,area_lat:req.body.area_lat,area_long:req.body.area_long}).then(function(){
                                                        res.json({"msg":"city areas updated"});                                            
                                                    })
                                                }
                                            }).catch(function(err){
                                            console.log(err);
                                            res.status(400).json({error_msg: "Something want wrong"});
                                            return;
                                        })

        } else {
            res.status(400).json({error_msg:"No city_id found for this City_master"});
            return;
        }
    })
};

//@ Set_Media-Type-API
exports.setMediaType = function(req,res,models,app){
    if(req.body.media_type_name==undefined || req.body.media_type_name==null){
        res.status(400).json({error_msg:"media_type_name not found in body"});
        return;
    }
    models.Media_type.findOrCreate({where:{type_name:req.body.media_type_name}
    }).then(function(created){
        if(created){
            res.json({message : "media type created Successfully."});
            return;
        } else {
            res.status(400).json({error_msg: "media type already exists"});
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//get App_Feedbac API
exports.getAppFeedback = function(req,res,models,app){
    models.Application_feedback.findAll()
        .then(function(data){
            if(data && data.length > 0){
                res.json(data);
                return;
            } else {
                res.status(400).json({error_msg:"There are no feedbac found"});
            }
        }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//create Discount-Coupons API
exports.createDiscountCoupons = function(req,res,models,app){
    if(req.body.coupon_code==undefined || req.body.coupon_code==null){
        res.status(400).json({error_msg:"coupon_code not found in body"});
        return;
    }
    if(req.body.discount_percent==undefined || req.body.discount_percent==null){
        res.status(400).json({error_msg:"discount_percent not found in body"});
        return;
    }
    if(req.body.valid_from!=undefined || req.body.valid_from!=null){
        if(!moment(req.body.valid_from, "DD:MM:YYYY",true).isValid()){
            res.status(400).json({error_msg:"valid_from date not in correct format, Correct format: DD:MM:YYYY"});
            return;
        }
    }
    if(req.body.valid_upto==undefined || req.body.valid_upto==null){ 
        res.status(400).json({error_msg:"valid_upto not found in body"});
        return;
    }
    if(!moment(req.body.valid_upto, "DD:MM:YYYY",true).isValid()){
        res.status(400).json({error_msg:"valid_upto date not in correct format, Correct format: DD:MM:YYYY"});
        return;
    }
    if(req.body.total_limit==undefined || req.body.total_limit==null){
        res.status(400).json({error_msg:"total_limit not found in body"});
        return;
    }
    models.Discount_Coupons.findOrCreate({where:{coupon_code:req.body.coupon_code},defaults:{discount_percent:req.body.discount_percent,valid_for:req.body.valid_for,valid_upto:req.body.valid_upto,total_limit:req.body.total_limit,valid_from:req.body.valid_from,not_valid_on:req.body.not_valid_on,created_by:req.body.created_by}})
    .spread(function(result,created){
        if(created){
            console.log(created);
            res.json({message : "discount coupons created Successfully."});
            return;
        } else {
            result.update({discount_percent:req.body.discount_percent,valid_for:req.body.valid_for,valid_upto:req.body.valid_upto,total_limit:req.body.total_limit,valid_from:req.body.valid_from,not_valid_on:req.body.not_valid_on,created_by:req.body.created_by}).then(function(){
                res.json({message : "discount coupons updated Successfully."});
                return;
            })
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//set Deals-Terms-Of-Master API
exports.setdealstermsofusemaster = function(req,res,models,app){
    if(req.body.terms_text == undefined || req.body.terms_text == null){
        res.status(400).json({error_msg:"terms_text not found in body"});
        return;
    }
    models.Deals_terms_of_uses_master.findOrCreate({where:{terms_text:req.body.terms_text,created_by:req.body.created_by}
    }).spread(function(result,created){
        if(created){
            res.json({message : "Deals terms of use master created Successfully."});
            return;
        } else {
            res.status(400).json({error_msg: "Deals terms of use master already exists"});
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//send-Email API
exports.sendPasswordToOwner = function(req,res,models,app){
    if(req.body.owner_id == undefined || req.body.owner_id == null){
        res.status(400).json({error_msg:"owner_id not found in body"});
        return;
    }
    models.Employee.findOne({where:{id:req.body.owner_id}}).then(function(employee){
        if(employee!=null){
            console.log("email_address : " + employee.email_address);
            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'shailendra.ananditech@gmail.com',
                    pass: '!ananditech!'
                }
            });
            var mailOptions = {
                from: "ezzy-node-server <shailendra.ananditech@gmail.com>",
                to: employee.email_address,
                subject: "ezzy-node-server",
                token: generatePassword(),
                html: "Hello "+employee.first_name + ", <br /><br />"
                    + "Please setup  your new password : &nbsp;" +"<b>"+ this.generatePassword() +"</b>"+  '\n\n' +
                    "<p>Thank you,<br />ezzy-node-server team.</p>"
            }
            smtpTransport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('error',error);
                    res.json({status : false, message:"Error in sending mail."});
                    return;
                } else {
                    console.log('Message sent: %s', info.messageId);
                    res.json({status : true, message:"Thank you! An email has been sent to "+employee.email_address+" email id. Please check your inbox."});
                    return;
                }
            });
        } else {
            res.json({status : false, message:"Invalid owner_id for employee."});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

generatePassword = function() {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var string_length = 8;
    var genPassword = '';
    var charCount = 0;
    var numCount = 0;
    for (var i=0; i<string_length; i++) {
        if((Math.floor(Math.random() * 2) == 0) && numCount < 3 || charCount >= 5) {
            var rnum = Math.floor(Math.random() * 10);
            genPassword += rnum;
            numCount += 1;
        } else {
            var rnum = Math.floor(Math.random() * chars.length);
            genPassword += chars.substring(rnum,rnum+1);
            charCount += 1;
        }
    }
    return genPassword;
}

//get_Business_List API
exports.getBusinessList = function(req,res,models,app){
    //var query = "SELECT b.id,b.business_name,b.contact_number,b.email_address,b.alternate_contact_number,b.description,b.owner_id,e.first_name,b.address,b.city_id,b.address_lat,b.address_long,b.postal_code,b.profile_picture_url,b.business_type,b.website,b.avg_rating,b.avg_wait_time,b.avg_price,b.referred_by,b.is_active,b.created_by,b.updatedAt,b.createdAt FROM `Business` as b,`Employee` as e where b.owner_id=e.id";
    var query = "SELECT b.*,e.first_name FROM `Business` as b,`Employee` as e where b.owner_id=e.id ORDER BY createdAt ";
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(business){
        if(business!=undefined && business.length > 0) {
            response = {
                data: business.sort((a, b) => (a.first_name < b.first_name ? -1 : 1)),
                page: 0,
                rowsPerPage: 15
            }
            res.json(response);
            return;
        } else {
            res.status(400).json({error_msg:"There are no business found"});
            return;
        }
    }).catch(function(err) {
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//get_Deals_List API
exports.getDealsList = function(req,res,models,app){
    var query = "SELECT d.*,b.business_name FROM `Deals` as d,`Business` as b where d.business_id=b.id";
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(deals){
        if(deals!=undefined && deals.length > 0) {
            response = {
                data: deals.sort((a, b) => (a.first_name < b.first_name ? -1 : 1)),
                page: 0,
                rowsPerPage: 15
            }
            res.json(response);
            return;
        } else {
            res.status(400).json({error_msg:"There are no deals found"});
            return;
        }
    }).catch(function(err) {
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//get_Employee_List API
exports.getEmployeeList = function(req,res,models,app){    
    var query = "Select e.*, b.business_name, c.city_name FROM `Employee`as e, `Business`as b, `City_master`as c where e.id=owner_id=c.id";
    console.log("Query===>" + query);
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(employee){
        if(employee!=undefined && employee.length > 0) {
            response = {
                data: employee.sort((a, b) => (a.first_name < b.first_name ? -1 : 1)),
                page: 0,
                rowsPerPage: 15
            }
            res.json(response);
            return;
        } else {
            res.status(400).json({error_msg:"There are no employee found"});
            return;
        }
    }).catch(function(err) {
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//get_All_Business_Visits API
exports.getAllBusinessVisits = function(req,res,models,app){
    var query = "Select v.*, u.first_name, b.business_name FROM `Visits`as v, `Users`as u, `Business`as b where v.user_id=u.user_id and v.entity_id=b.id";
    console.log("Query==>"+query);
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT})
    .then(function(visits){
        if(visits!=null && visits.length>0){
            res.json(visits);
            return;
        } else {
            res.status(400).json({error_msg: "There are no visits found"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//get_All_Booking API
exports.getAllBooking = function(req,res,models,app){
    var query = "Select ba.*,b.business_name FROM `Business_appointment` as ba,`Business` as b where ba.business_id=b.id";
    console.log("Query==>"+query);
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT})
    .then(function(booking){
        if(booking!=null && booking.length>0){
            res.json(booking);
            return;
        } else {
            res.status(400).json({error_msg: "There are no booking found"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};


//Show_Working_Hours API
exports.showWorkingHours = function(req,res,models,app){
    if(req.body.business_id == undefined || req.body.business_id == null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    models.Business_hours.findAll({where:{business_id:req.body.business_id}
    }).then(function(data){
        if(data!=undefined && data.length>0){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No working hours found for this business_id"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
}

exports.getBookingService = function(req,res,models,app){
    if(req.body.appointment_id==undefined || req.body.appointment_id==null){
        res.status(400).json({error_msg:"appointment_id not found in body"});
        return;
    }
    var query = "SELECT aps.*,sc.category_name,s.name FROM `Appointment_services` as aps,`Service_category` as sc,`Services` as s where aps.appointment_id=" + req.body.appointment_id + " and aps.service_id=s.id and sc.id=s.category_id";
    console.log("Query==>"+query);
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT})
    .then(function(data){
        if(data!=null && data.length>0){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg: "There are no booking found"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
}

//get_Business_Amenities API
exports.getBusinessAmenities = function(req,res,models,app){
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    var query ="SELECT ba.*,am.name FROM `Business_amenities` as ba,`Amenities_master` as am  where ba.business_id=" + req.body.business_id + " and ba.amenity_id=am.id";
    console.log("Query==>"+query);
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT})
    .then(function(amenities){
        if(amenities!=null && amenities.length>0){
            res.json(amenities);
            return;
        } else {
            res.status(400).json({error_msg: "There are no amenities found"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//disable_Business API
exports.disableBusiness = function(req,res,models,app){
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not found"});
        return;
    }
    models.Business.update({is_active:0},{where:{
        id:req.body.business_id},returning:true,plain:true}).then(function(){
            res.json({"msg":" your business disable Successfully"});
        return;
    })
};

//get_All_Business_Media API
exports.getAllBusinessMedia = function(req,res,models,app){
    if(req.body.business_id == undefined || req.body.business_id == null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    models.Business_media.findAll({where:{business_id:req.body.business_id}
    }).then(function(data){
        if(data!=undefined && data.length>0){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No business media found for this business_id"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};


//send_Otp_To_Employee API
exports.sendOtpToEmployee = function(req,res,models,app){
    if(req.body.employee_id == undefined || req.body.employee_id == null){
        res.status(400).json({error_msg:"employee_id not found in body"});
        return;
    }
    models.Employee.findOne({where:{id: req.body.employee_id}}).then(function(employee){
        if(employee.otp==null || employee.otp==""){
            var response = {};
            var otp = Math.floor(1000 + Math.random() * 9000);
            response.otp = otp
            models.Employee.update({otp:otp},{where:{id:req.body.employee_id}}).then(function(otp){
                res.json(response);
                console.log("Otp: " + otp +  " Otp Generate Successfully.!");
                return;
            })
        } else {
            models.Employee.findOne({where:{id: req.body.employee_id}}).then(function(employee){
                res.json(employee.otp);
                console.log("Otp: " + employee.otp);
                return;
            })
        }
    })
}

//create_Employee API
exports.createEmployee = function(req,res,models,app){
    if(req.body.first_name==undefined || req.body.first_name==null){
        res.status(400).json({error_msg:"first_name not found in body"});
        return;
    }
    if(req.body.mobile_number==undefined || req.body.mobile_number==null){
        res.status(400).json({error_msg:"mobile_number not found in body"});
        return;
    }
    if(req.body.email_address==undefined || req.body.email_address==null){
        res.status(400).json({error_msg:"email_address not found in body"});
        return;
    }
    if(req.body.employee_type==undefined || req.body.employee_type==null){
        res.status(400).json({error_msg:"employee_type not found in body"});
        return;
    }
    if(req.body.city_id==undefined || req.body.city_id==null){
        res.status(400).json({error_msg:"city_id not found in body"});
        return;
    }
    if(req.body.address==undefined || req.body.address==null){
        res.status(400).json({error_msg:"address not found in body"});
        return;
    }
    if(req.body.gender==undefined || req.body.gender==null){
        res.status(400).json({error_msg:"gender not found in body"});
        return;
    }
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    if(req.body.postal_code==undefined || req.body.postal_code==null){
        res.status(400).json({error_msg:"postal_code not found in body"});
        return;
    }
    if(req.body.role_id==undefined || req.body.role_id==null){
        res.status(400).json({error_msg:"role_id not found in body"});
        return;
    }
    var defaults = {        
        mobile_number:req.body.mobile_number,
        email_address:req.body.email_address,
        employee_type:req.body.employee_type,
        date_of_birth:req.body.date_of_birth,
        business_id:req.body.business_id,
        postal_code:req.body.postal_code,
        city_id:req.body.city_id,
        address:req.body.address,
        gender:req.body.gender,
        role_id:req.body.role_id
    }
    models.Employee.findOrCreate({where:{first_name:req.body.first_name}, defaults})
    .spread(function(created){
        if(created){
            res.json({"msg":"Employee details created Successfully."});
            return;
        } else{

        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

// get_All_Users API
exports.getAllUsers = function(req,res,models,app){
    models.Users.findAll().then(function(users){
        if(users && users.length > 0){
            response = {
                data: users.sort((a, b) => (a.first_name < b.first_name ? -1 : 1)),
                page: 0,
                rowsPerPage: 15
            }
            res.json(response);
            return;
        } else {
            res.status(400).json({error_msg:"There are no users found"});
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

exports.getallhomeservices = function(req,res,models,app){
    models.Service_Booking.findAll().then(function(bookings){
        if(bookings.length>0){
            var booking_services_promises = [];
            var response = [];
            for(var i=0; i<bookings.length;i++){
                response[i] = {}
                response[i].booking_info = bookings[i];
                booking_services_promises.push(models.Service_Booking_Services.findAll({where:{service_booking_id: bookings[i].id}}));
            }
            Promise.all(booking_services_promises).then(function(booking_services){
                for(var j=0; j<bookings.length;j++){
                    for(var k=0;k<booking_services.length;k++){
                        response[j].services = booking_services[k];
                    }
                }
                res.json(response);
            });
        } else {
            res.status(400).json({error_msg:"No bookings found"});            
            return;
        }
    });
}

exports.gethomeserviceservices = function(req,res,models,app){
    if(req.body.booking_services_id==undefined || req.body.booking_services_id==null){
        res.status(400).json({error_msg:"booking_services_id not defined in body"});
        return;
    }
    models.Service_Booking.findOne({where:{id:req.body.booking_services_id}}).then(function(result){
        if(result!=undefined && result!=null){
            models.Service_Booking_Services.findAll({where:{service_booking_id:result.id}}).then(function(details){
                var response = {};
                response.booking_detail = result;
                response.services  = details;
                res.json(response);  
                return;
            })
        } else {
            res.status(400).json({error_msg:"No bookings purchase details found"});            
           return;
        }
    });
}

//update_Employee_Details API
exports.updateEmployeeDetails = function(req, res,models,app){  
    if(req.body.employee_id==undefined || req.body.employee_id==null){
        res.status(400).json({error_msg:"employee_id not defined in body"});
        return;
    }
    models.Employee.update({
                    first_name : req.body.first_name,
                    last_name  : req.body.last_name,
                    city_id    : req.body.city_id,
                    address    : req.body.address,
                    gender     : req.body.gender,
                    active     : req.body.active,
                    role_id    : req.body.role_id,
                    postal_code   : req.body.postal_code,
                    date_of_birth : req.body.date_of_birth,
                    mobile_number : req.body.mobile_number,
                    email_address : req.body.email_address,
                    employee_type : req.body.employee_type,
                    email_verified  : req.body.email_verified,
                    mobile_verified : req.body.mobile_verified,
                    date_of_joining : req.body.date_of_joining,
                    profile_picture_url : req.body.profile_picture_url
                },{where:{id:req.body.employee_id},returning:true,plain:true})
                    .then(function(data){
                    res.json({"msg":"employee updated successfully"});
                    return;           
                }).catch(function(err){
                    console.log(err);
                    res.status(400).json({error_msg: "Something went wrong"});
                    return;
                })
}

//update_Business_Details API
exports.updateBusinessDetails = function(req, res,models,app){  
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not defined in body"});
        return;
    }
    models.Business.update({
                    business_name : req.body.business_name,
                    city_id : req.body.city_id,
                    website : req.body.website,
                    address : req.body.address,
                    is_active : req.body.is_active,
                    address_lat : req.body.address_lat,
                    description : req.body.description,
                    postal_code : req.body.postal_code,
                    address_long:req.body.address_long,
                    business_type : req.body.business_type,
                    email_address : req.body.email_address,
                    contact_number : req.body.contact_number,
                    profile_picture_url : req.body.profile_picture_url,
                    alternate_contact_number : req.body.alternate_contact_number
                },{where:{id:req.body.business_id},returning:true,plain:true})
                    .then(function(data){
                    res.json({"msg":"business updated successfully"});
                    return;           
                }).catch(function(err){
                    console.log(err);
                    res.status(400).json({error_msg: "Something went wrong"});
                    return;
                })
};

// active_Deals API
exports.activeDeals = function(req,res,models,app){
    if(req.body.deal_id==undefined || req.body.deal_id==null){
        res.status(400).json({error_msg:"deal_id not defined in body"});
        return;
    }
    models.Deals.update({is_active:1},{where:{id:req.body.deal_id},returning:true,plain:true})
    .then(function(){
        res.json({message : "Active Deals Successfully."});
        return;
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//deactive_deals API
exports.deactiveDeals = function(req,res,models,app){
    if(req.body.deal_id==undefined || req.body.deal_id==null){
        res.status(400).json({error_msg:"deal_id not defined in body"});
        return;
    }
    models.Deals.update({is_active:0},{where:{id:req.body.deal_id},returning:true,plain:true}).then(function(){
        res.json({message : "Deactive Deals Successfully."});
        return;
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//get_bussiness_reviews API
exports.getBusinessReviews = function(req,res,models,app){
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not defined in body"});
        return;
    }
    models.Bussiness_Reviews.findAll({where:{business_id:req.body.business_id}})
    .then(function(data){
        console.log("Data==>",data);
        if(data!=undefined && data!=null){
            res.json(data);
            // var response = {};
            // response.review = data.review;
            // res.json(response);  
            return;
        } else {
            res.status(400).json({error_msg:"There are no business_id found"});
            return;
        }
    })
};

//set_bussiness_reviews_visible API
exports.setBusinessReviewsVisible = function(req,res,models,app){
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not defined in body"});
        return;
    }
    models.Bussiness_Reviews.update({visible:1},{where:{business_id:req.body.business_id},returning:true,plain:true})
    .then(function(){
        res.json({message : "set business reviews visible Successfully."});
        return;
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//set_bussiness_reviews_visible_hidden API
exports.setBusinessReviewsVisibleHidden = function(req,res,models,app){
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not defined in body"});
        return;
    }
    models.Bussiness_Reviews.update({visible:0},{where:{business_id:req.body.business_id},returning:true,plain:true})
    .then(function(){
        res.json({message : "hidden business visible"});
        return;
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//get_bussiness_service API  Query
exports.getBussinessService = function(req,res,models,app){
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not defined in body"});
        return;
    }
    var query ="Select";
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT})
    .then(function(service){
        if(service!=null && service.length>0){
            res.json(service);
            return;
        } else {
            res.status(400).json({error_msg: "There are no amenities found"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })

    models.Business_Service.findAll({where:{business_id:req.body.business_id}}).then(function(bs){
        if(bs!=undefined && bs!=null){
            console.log("Service_id : ",bs.service_id);
            models.Services.findOne({where:{id:bs.service_id}}).then(function(service){
                console.log(service.duration);
                console.log(service.price);
                var response = {};
                response.duration = service.duration;
                response.price = service.price;
                res.json(response); 
                return;
            })
        } else {
            res.status(400).json({error_msg:"There are no business_id found"});
            return;
        }
    })
};


//get_business_amenities API
exports.getBusinessAmenities = function(req,res,models,app){
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    var query ="Select ba.*,am.name, am.icon_url FROM `Business_amenities` as ba, `Amenities_master` as am  WHERE ba.business_id=" + req.body.business_id + " and ba.amenity_id=am.id";
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT})
    .then(function(amenities){
        if(amenities!=null && amenities.length>0){
            res.json(amenities);
            return;
        } else {
            res.status(400).json({error_msg: "There are no amenities found"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//get_All_Application_Feedback_Users API
exports.getAllApplicationFeedbackUsers = function(req,res,models,app){
   var query ="Select af.*, u.first_name FROM `Application_feedback` as af, `Users` as u WHERE af.user_id != 'NULL' and af.user_id=u.user_id";
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT})
    .then(function(user){
        res.json(user);
        return;
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "No Feedback found for users"});
        return;
    })
};

//get_All_Application_Feedback_Employee API
exports.getAllApplicationFeedbackEmployee = function(req,res,models,app){
    var query ="Select af.*, e.first_name FROM `Application_feedback` as af, `Employee` as e WHERE af.employee_id != 'NULL' and af.employee_id=e.id";
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT})
    .then(function(employee){
        res.json(employee);
        return;
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "No Feedback found for employee"});
        return;
    })
};

//Send_Feedback_Reply_To_Employee API
exports.sendFeedbackReplyToEmployee = function(req,res,models,app){
    console.log("sendFeedbackReplyToEmployee");
    if(req.body.Feedback_id==undefined || req.body.Feedback_id==null){
        res.status(400).json({error_msg:"Feedback_id not defined in body"});
        return;
    }
    models.Application_feedback.findOne({where:{id : req.body.Feedback_id}}).then(function(employee){
        console.log("employee_id : ",employee.employee_id);
        models.Employee.findOne({where:{id : employee.employee_id}}).then(function(token){
            console.log("firebase_token : ",token.firebase_token);
            var data=req.body;
            var message = {
                notification: {
                    title: "You've a Feedback to employee",
                    body: "You've Feedback to employee ",
                },
                android: {
                    ttl: 3600 * 1000,
                    notification: {                     
                    color: '#f45342',
                    },
                },
                data: {
                    "id": ""+employee.employee_id
                },

                token: token.firebase_token
            };
            admin.messaging().send(message).then(function(response,err){
                if (response) {            
                    console.log("Successfully sent with response: ", response);            
                    return;
                } else {
                    console.log("Notification not sent", err);            
                }
            }).catch(function(err){
                console.log("Notification not sent", err);    
            });
        })
    })
};


//send_Feedback_Reply_To_Users API
exports.sendFeedbackReplyToUsers = function(req,res,models,app){
    if(req.body.Feedback_id==undefined || req.body.Feedback_id==null){
        res.status(400).json({error_msg:"Feedback_id not defined in body"});
        return;
    }
    models.Application_feedback.findOne({where:{id:req.body.Feedback_id}}).then(function(user){
        console.log("user_id : ", user.user_id);
        models.Users.findOne({where:{user_id : user.user_id}}).then(function(token){
            console.log("firebase_token : ",token.firebase_token);
            var data=req.body;
            var message = {
                notification: {
                    title: "You've a Feedback to user",
                    body: "You've Feedback to user ",
                },
                android: {
                    ttl: 3600 * 1000,
                    notification: {                     
                    color: '#f45342',
                    },
                },
                data: {
                    "user_id": ""+user.user_id
                },
                token: token.firebase_token
            };
            admin.messaging().send(message).then(function(response,err){
                if (response) {            
                    console.log("Successfully sent with response: ", response);            
                    return;
                } else {
                    console.log("Notification not sent", err);            
                }
            }).catch(function(err){
                console.log("Notification not sent", err);    
            });
        })
    })
};