var exports = module.exports = {}
var moment = require('moment');
var jwt    = require('jsonwebtoken');
var bCrypt = require('bcrypt-nodejs');
var admin = require('firebase-admin');

exports.updateBusinessDescription = function(req,res,models,app){    
    // if(req.body.description==undefined || req.body.description==""){
    //     res.status(400).json({error_msg:"Description cannot be blank"});
    //     return;
    // }
    models.Business.update({description:req.body.description},{where:{owner_id:req.employee_id},returning:true,plain:true}).then(function(){
        res.json({"msg":"Business description updated successfully"});
    })  
}

exports.getBusinessDescription = function(req,res,models,app){
        models.Business.findAll({where:{owner_id:req.employee_id},
            returning: true,
            plain : true
        }).then(function(data){
            if(data)
                res.json({description: data.description})
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something went wrong"});
            return;
        });    
};
        
exports.updatebusinesscontactdetails = function(req, res,models,app){  
    if(req.body.contact_number==undefined || req.body.contact_number==null){
        res.status(400).json({error_msg:"contact_number not found"});
        return;
    }
    if(req.body.email_address==undefined || req.body.email_address==null){
        res.status(400).json({error_msg:"email_address not found"});
        return;
    }    
    models.Business.update({
        contact_number:req.body.contact_number,
        alternate_contact_number:req.body.alternate_contact_number,
        email_address:req.body.email_address,
        address:req.body.address,
        address_lat:req.body.address_lat,
        address_long:req.body.address_long,
        website:req.body.website
        },{where:{owner_id:req.employee_id},returning:true,plain:true}).then(function(data){
        res.json({"msg":"Contact updated successfully", busniess: data });            
    });
}
     
exports.getBusinessContactDetails = function(req,res,models,app){    
    models.Business.findOne({ where:{owner_id:req.employee_id},
        returning:true,plain:true
    }).then(function(data){
        if(data){
            /*return res.send(data);*/
            res.json(data);
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })        
};

exports.getEmployeeDetails = function(req,res,models,app){
    var query = "Select e.*, count(n.id) as notification_count from Employee e, Notifications n where e.id = '"+ req.employee_id +"' and n.sent_to = e.id and n.visible=1;"
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(data){
        if(data){     
            var response = {};
            response.employee = data[0];       
            var permissionQuery = "select pm.module_code, pm.module_name from Permissions_master pm, Permission_Role_Business prb where prb.role_id ='"+ data[0].role_id + "' and prb.`permission_id` = pm.id;"
            models.sequelize.query(permissionQuery,{type: models.sequelize.QueryTypes.SELECT}).then(function(permissinos){
                response.permissinos = permissinos;
                res.json(response);
                return;
            });
        }                        
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })        
};
    
    
exports.updateEmplEmail = function(req,res,models,app){    
    if(req.body.email_address==undefined || req.body.email_address==null){
        res.status(400).json({error_msg:"email_address not found"});
        return;
    }    
    models.Employee.update({email_address:req.body.email_address
        },{where:{id:req.employee_id},returning:true,plain:true}).then(function(){
        res.json({"msg":"email_id updated Successfully"});
    })    
};
    
exports.updateEmplPhoneNumber = function(req,res,models,app){ 
    if(req.body.contact_number==undefined || req.body.contact_number==null){
        res.status(400).json({error_msg:"contact_number not found"});
        return;
    }    
    models.Employee.update({mobile_number:req.body.contact_number
        },{where:{id:req.employee_id},returning:true,plain:true}).then(function(){
        res.json({"msg":"phone number update Successfully."});
    })    
};

exports.setBusinessService = function(req,res,models,app){    
    if(req.body.service_id==undefined || req.body.service_id==null){
        res.status(400).json({error_msg:"service_id not found in body"});
        return;
    }         
    if(req.body.price==undefined || req.body.price==null){
        res.status(400).json({error_msg:"price of the service not found in body"});
        return;
    }         
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business==null){
            res.status(400).json({error_msg:"No business found for this token"});
        } else {
            models.Services.findOne({where:{id:req.body.service_id}}).then(function(service){
                if(service){
                    models.Business_Service.findOrCreate({where:{business_id:business.id,service_id:service.id}}).spread(function(bs,created){
                        console.log(created);
                        if(created){
                            bs.update({price:req.body.price}).then(function(){
                                avgPrice(req,res,models);
                                res.json({"msg":"Business service created successfully"});  
                            })
                        } else {
                            bs.update({price:req.body.price}).then(function(){
                                avgPrice(req,res,models);
                                res.json({"msg":"Business service updated successfully"});  
                            })
                        }
                    });
                } else{
                    res.status(400).json({error_msg:"No service found for this service_id"});
                }
            })
            
        }
    });        
};

avgPrice = function(req,res,models){
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        var query = "Select avg(price) as average_price FROM Business_Service WHERE business_id="+business.id+";"
        console.log("Query: " + query);
        models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(data){
            console.log(data[0].average_price);
            models.Business.update({avg_price:data[0].average_price},{where:{id:business.id}}).then(function(){
                console.log("Price updated successful")
            })
        })
    })
};


//@ setPassword API
exports.setPassword =function(req,res,models,app){
    if(req.body.password==undefined || req.body.password==null){
        res.status(400).json({error_msg:"password not found"});
        return;
    }
    console.log("employee_Id==>"+req.employee_id);
    var generateHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };    
    var encryptedPassword = generateHash(req.body.password);
    models.Employee.update({password:encryptedPassword},{where:
        {id:req.employee_id},returning:true,plain:true
    }).then(function(){
        res.json({"msg":"Password Update Successfully."})
    });
};

//@ update Business Primary Contact Number API
exports.updateBusinesPrimaryContact = function(req,res,models,app){
    if(req.body.contact_number==undefined || req.body.contact_number==null){
        res.status(400).json({error_msg:"contact_number not found"});
        return;
    }
    models.Business.update({contact_number:req.body.contact_number
        },{where:{owner_id:req.employee_id},returning:true,plain:true}).then(function(){
        res.json({"msg":"contact_number update Successfully."});
    })
};


//@ update BusinessSecondry Contact Number API
exports.updateBusinessSecondaryContact = function(req,res,models,app){    
    if(req.body.alternate_contact_number==undefined || req.body.alternate_contact_number==null){
        res.status(400).json({error_msg:"alternate_contact_number not found"});
        return;
    }    
    models.Business.update({alternate_contact_number:req.body.alternate_contact_number
        },{where:{owner_id:req.employee_id},returning:true,plain:true}).then(function(){
        res.json({"msg":"alternate_contact_number updated Successfully"});
    })    
};


//@update Business Email API
exports.updateBusinessEmail = function(req,res,models,app){    
    if(req.body.email_address==undefined || req.body.email_address==null){
        res.status(400).json({error_msg:"email_address not found"});
        return;
    }    
    models.Business.update({email_address:req.body.email_address
        },{where:{owner_id:req.employee_id},returning:true,plain:true}).then(function(){
        res.json({"msg":"email_id updated Successfully"});
    })    
};


//@update_Business_address API
exports.updateBusinessAddress = function(req,res,models,app){    
    if(req.body.address==undefined || req.body.address==null){
        res.status(400).json({error_msg:"address not found"});
        return;
    }    
    models.Business.update({address:req.body.address
        },{where:{owner_id:req.employee_id},returning:true,plain:true}).then(function(){
        res.json({"msg":"address updated Successfully"});
    })    
};

//@update lat-long API
exports.updateBusinessLatlongAddress = function(req,res,models,app){    
    if(req.body.address_lat==undefined || req.body.address_lat==null){
        res.status(400).json({error_msg:"Latitude not found"});
        return;
    }
    if(req.body.address_long==undefined || req.body.address_long==null){
        res.status(400).json({error_msg:"Longitude not found"});
        return;
    }      
    models.Business.update({
        address_lat:req.body.address_lat,address_long:req.body.address_long},
        {where:{owner_id:req.employee_id},
            returning:true,plain:true
        }).then(function(){
        res.json({"msg":"lat long updated Successfully"});
    })    
};

//@api set_Business_Amenities API
exports.setBusinessAmenities = function(req,res,models,app){    
    if(req.body.amenity_id==undefined || req.body.amenity_id==null){
        res.status(400).json({error_msg:"amenity_id not found in body"});
        return;
    }
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business==null)
        {
            res.status(400).json({error_msg:"No business_id found for this business"});
        } else {
            models.Amenities_master.findOne({where:{id:req.body.amenity_id}}).then(function(anenities){
                if(anenities){                
                    models.Business_amenities.findOrCreate({where:{business_id:business.id,amenity_id:anenities.id}})
                        .spread(function(result,created){
                        if(created){
                            res.json({"msg":"Business amenities created successfully"});

                        } else {
                            res.json({"msg":"Business amenities already exists"})
                        }
                    });
                } else {
                    res.status(400).json({error_msg:"No Amenities found for this amenity_id"});
                }
            })
        }
    })
};

//@get_All_BusinessAmenities API
exports.getAllBusinessAmenities = function(req,res,models,app){
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        var query = "Select * from `Amenities_master` a where id in (select b.amenity_id from `Business_amenities` b where b.business_id=" + business.id +") order by name asc;";
        console.log(query);
        models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(data){
            if(data){
                res.json(data);
            } else {
                res.status(400).json({error_msg: "No Amenities found for this business"});
                return;
            }
        });
    });
};

//@getAppointmentByBusinessId API
exports.getAllAppointmentsForBusiness = function(req,res,models,app){
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business){
            var query = "SELECT `Business_appointment`.*, count(`Appointment_services`.`id`) as `Service_count` " + 
                        " FROM `Appointment_services` AS `Appointment_services`, `Business_appointment` as `Business_appointment` " +
                        " WHERE `Business_appointment`.`business_id` = " + business.id + " "+
                        " AND `Business_appointment`.`id` =  `Appointment_services`.`appointment_id` " +
                        " Group by `Business_appointment`.`id` ";
            models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT})
                .then(function(data){
                    if(data){
                        res.json(data);
                        return;
                    } else {
                        res.status(400).json({error_msg:"No appointments found for this appointment_id"});
                    }
                }).catch(function(err){
                    console.log(err);
                    res.status(400).json({error_msg: "Something want wrong"});
                    return;
                })
        } else {
            res.status(400).json({error_msg:"No business exists with this business_id"});
            return;
        }
    })
    
};

//@ Delete business_amenities API
exports.deleteBusinessAmenities = function(req,res,models,app){
    if(req.body.amenity_id==undefined || req.body.amenity_id==null){
        res.status(400).json({error_msg:"amenity_id not found in body"});
        return;
    }
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business){               
            models.Business_amenities.destroy({where:{amenity_id:req.body.amenity_id, business_id: business.id}}).then(function(destroy){
                if(destroy){
                    res.json({"msg":"business amenities Deleted successfully"});
                    return;
                } else{
                    res.status(400).json({error_msg:"Amenity not found for this business"});
                }
            }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
            })
        } else {
            res.status(400).json({error_msg:"No business_id found for this business"});
        }

    })  
};

//@get Business_Category And Services API
exports.getBusinessCategoryAndServices = function(req,res,models,app){
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business){                    
            models.Business_Service.findAll({where:{business_id:business.id}}).then(function(business_services){
                if(business_services && business_services.length>0){
                       var service_ids = [];
                       for(var i=0; i<business_services.length; i++){                                          
                          service_ids.push(business_services[i].service_id);
                        }
                       models.Services.findAll({where:{id:service_ids}}).then(function(services){
                           var category_ids = [];
                           for(var j=0;j<services.length;j++){
                               category_ids.push(services[j].category_id);
                            }      
                            console.log(category_ids);
                            models.Service_category.findAll({where:{id:category_ids}}).then(function(cat){
                                var json_arr = [];
                                var json_obj = {};
                                for(var k=0;k<cat.length;k++){
                                    json_obj = {};                                
                                    json_obj.category_id = cat[k].id;
                                    json_obj.category_name = cat[k].category_name;
                                    var cat_ser = [];
                                    for(var l=0;l<services.length;l++){
                                        if(services[l].category_id==cat[k].id){
                                            var service = {}
                                            service.id = services[l].id;
                                            service.name = services[l].name;
                                            service.price = business_services[l].price;
                                            service.duration = services[l].duration;
                                            cat_ser.push(service);
                                        }
                                    }
                                    json_obj.services = cat_ser;
                                    json_arr.push(json_obj);
                                }
                                res.json(json_arr);
                            });
                       });                       
                } else {
                    res.status(400).json({error_msg:"No category_id found for this category"});
                    return;
                }
            })
        } else {
            res.status(400).json({error_msg:"No business_id found for this business"});
            return;
        }        
    })
};


//set_Business_Hours API
// exports.setBusinessHours = function(req,res,models,app){    
//     if(req.body.days==undefined || req.body.days==null){
//         res.status(400).json({error_msg:"days array not found in body"});
//         return;
//     }
//     if(req.body.days.length<0){
//         res.status(400).json({error_msg:"days array cannot be blank"});
//         return;
//     }
//     var days = req.body.days;
//     if(req.body.open_time!=undefined || req.body.open_time!=null){
//         if(!validateHhMm(req.body.open_time)){
//             res.status(400).json({error_msg:"Open Time not in correct format, Correct format: HH:MM"});
//             return;
//         }
//     }
//     if(req.body.close_time!=undefined || req.body.close_time!=null){
//         if(!validateHhMm(req.body.close_time)){
//             res.status(400).json({error_msg:"Close Time not in correct format, Correct format: HH:MM"});
//             return;
//         }
//     }
    
//     models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
//         if(business){
//             var promises = []
//             for(var i=0; i<days; i++){
//                 promises[i] = models.Business_hours.findOrCreate({where:{business_id: business.id, day: days[i]},defaults:{open_time: req.body.open_time, close_time: req.body.close_time}});
//             }
//             Promise.all(promises).then(function(results){
//                 for(var j=0; j<days; j++){
//                     if(results)
//                 }
//             })
//             .catch(function(err){
//                 console.log(err);
//                 res.status(400).json({error_msg: "Something want wrong"});
//                 return;
//             })
//         } 
//     })
// };

exports.setBusinessHours = function(req,res,models,app){
    if(req.body.working_hours==undefined || req.body.working_hours==null){
        res.status(400).json({error_msg:"day not found in body"});
        return;
    }
    if(req.body.working_hours.length==0){
        res.status(400).json({error_msg:"working_hours array cannot be blank"});
        return;
    }
    var working_hours = req.body.working_hours;
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business){
            var dataArray = [];
            for(var i=0;i<working_hours.length;i++){
                console.log(working_hours[i]);
                dataArray[i] = {};
                dataArray[i].business_id = business.id;
                dataArray[i].day = working_hours[i].day;
                dataArray[i].closed = false;
                dataArray[i].open_time = working_hours[i].open_time;
                dataArray[i].close_time = working_hours[i].close_time;            
            }
            models.Business_hours.bulkCreate(dataArray,{updateOnDuplicate: ["open_time","close_time","closed"]}).then(function(){
                models.Business_hours.findAll({where:{business_id: business.id}}).then(function(data){
                    res.json(data);
                })
            })
        }
    })
}

function validateHhMm(inputField) {
    var isValid = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(inputField);
    return isValid;
}

//@ get_Business_Hours API
exports.getBusinessHours = function(req,res,models,app){
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business){
            models.Business_hours.findAll({where:{business_id:business.id}}).then(function(data){
                if(data){
                res.json(data);
                return;
            } else{
                res.status(400).json({error_msg:"No business_id found"});
                return;
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
            })
        }
    })
};

//@get_Business_Reviews API
exports.getBusinessReviews = function(req,res,models,app){
    var query = "SELECT br.id,br.business_id,br.user_id,u.first_name as name, u.profile_picture_url as user_profile, br.maintainance_rating,br.cleanliness_rating,br.service_rating,br.staff_rating,br.pricing_rating,br.avg_rating,br.review,br.createdAt as review_date, visible FROM `Bussiness_Reviews` br,Users u, Business b where br.user_id=u.user_id and br.business_id=b.id and b.owner_id="+req.employee_id+" and br.visible='1';"    
    models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(data){
        if(data){
            res.json(data);
        } else {
            res.status(400).json({error_msg: "No user deals found."});
            return;
        }
    });    
};

//@Delete_Business_Service API
exports.deleteBusinessService = function(req,res,models,app){
    if(req.body.service_id==undefined || req.body.service_id==null){
        res.status(400).json({error_msg:"service_id not found in body"});
        return;
    }

    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business){
            models.Business_Service.destroy({where:{service_id:req.body.service_id, business_id: business.id}})
                .then(function(destroy){
                    if(destroy){
                        res.json({"msg":"business service Deleted successfully"});
                        return;
                    } else {
                        res.status(400).json({error_msg:"service not found for this business"});
                        return;
                    }
                }).catch(function(err){
                    console.log(err);
                    res.status(400).json({error_msg: "Something want wrong"});
                    return;
                })
        } else {
            res.status(400).json({error_msg:"No business_id found for this business"});
        }
    })
};

//@update_Business_Appointment_Status API
exports.updateBusinessAppointmentStatus = function(req,res,models,app){
    if(req.body.appointment_id==undefined || req.body.appointment_id==null){
        res.status(400).json({error_msg:"appointment_id not found in body"});
        return;
    }
    if(req.body.status==undefined || req.body.status==null){
        res.status(400).json({error_msg:"status not found in body"});
        return;
    }
    var status = ["PENDING", "CONFIRMED", "CANCELLED", "APPROVED"];
    if(status.indexOf(req.body.status)<0){
        res.status(400).json({error_msg:"status must be PENDING, CONFIRMED, CANCELLED, APPROVED"});
        return;
    }

    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business){
            console.log("business_id==>"+business.id);
            models.Business_appointment.update({booking_status:req.body.status
            },{where:{id:req.body.appointment_id},returning:true,plain:true}).then(function(appointment){
                console.log(appointment);
                if(appointment[1]>0){
                    res.json({"msg":"Status updated Successfully"});
                } else {
                    res.status(400).json({error_msg:"No appointment found for this appointment_id"});
                }
            })
        } else {
            res.status(400).json({error_msg:"No business_id found for this business"});
        }
    })
};


//@getBusiness_Appointment_ByDate API
exports.getBusinessAppointmentByDate = function(req,res,models,app){
    if(req.body.date==undefined || req.body.date==null){
        res.status(400).json({error_msg:"date not found in body"});
        return;
    }
    console.log(moment(req.body.date, "YYYY-MM-DD hh:mm:ss",true).isValid());
    if(!moment(req.body.date, "YYYY-MM-DD hh:mm:ss",true).isValid()){
        res.status(400).json({error_msg:"Date not in correct format, Correct format: YYYY-MM-DD hh:mm:ss"});
        return;
    }

    models.Business.findOne({wher:{business_id:req.employee_id}}).then(function(business){
        if(business){
            console.log("Business_id==>"+business.id);
            models.Business_appointment.findAll({id:business.id},
                {where:{booking_date_time:req.body.booking_date},
                returning:true}).then(function(appointment){
                if(appointment && appointment.length>0){
                    res.json(appointment);
                    return;
                } else {
                    res.status(400).json({error_msg:"appointment date not found."});
                    return;
                }
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg: "Something want wrong"});
                return;
            })
        }
        else {
            res.status(400).json({error_msg:"No business_id found for this business"});
        }
    })
};

exports.uploadProfilePicture = function(req,res,models,s3){
    if(req.body.base64image==undefined || req.body.base64image==null){
        res.status(400).json({error_msg:"base64image parameter not found in body"});
        return;
    }
    var base64 = req.body.base64image;
    var base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    var key = "profiles/" + req.employee_id + "_profile"+Date.now()+"." + base64.split(';')[0].split('/')[1];
    var type = base64.split(';')[0].split('/')[1]
    var params = {
        Body: base64Data,
        Bucket: "uploads-dev-ez",
        Key: key,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`,
        ACL: 'public-read'
    };
    s3.upload(params, function(err, data) {
        if(err)
            res.status(400).json({"err":err});
        else{  
            models.Employee.update({profile_picture_url: data.Location}, {where:{id:req.employee_id}}).then(function(){
                res.json({"profile_picture_url":data.Location})
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg: "Something want wrong"});
                return;
            })
            
        }
    });
}

exports.uploadBusinessProfilePicture = function(req,res,models,s3){
    if(req.body.base64image==undefined || req.body.base64image==null){
        res.status(400).json({error_msg:"base64image parameter not found in body"});
        return;
    }
    var base64 = req.body.base64image;
    var base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    var key = "business_profiles/" + req.employee_id + "_profile"+Date.now()+"." + base64.split(';')[0].split('/')[1];
    var type = base64.split(';')[0].split('/')[1]
    var params = {
        Body: base64Data,
        Bucket: "uploads-dev-ez",
        Key: key,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`,
        ACL: 'public-read'
    };
    s3.upload(params, function(err, data){
        if(err)
            res.status(400).json({"err":err});
        else{  
            models.Business.update({profile_picture_url: data.Location}, {where:{owner_id:req.employee_id}}).then(function(){
                res.json({"profile_picture_url":data.Location})
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg: "Something want wrong"});
                return;
            })
            
        }
    });
}

exports.uploadBusinessPhoto = function(req,res,models,s3){
    if(req.body.media_type_id==undefined || req.body.media_type_id==null){
        res.status(400).json({error_msg:"media_type_id parameter not found in body"});
        return;
    }
    if(req.body.media_type_id!=9){
        if(req.body.base64image==undefined || req.body.base64image==null){
            res.status(400).json({error_msg:"base64image parameter not found in body"});
            return;
        }
        models.Media_type.findOne({where:{id:req.body.media_type_id}}).then(function(media_type){
            if(media_type){
                var base64 = req.body.base64image;
                var base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                var key = "business_media/" + req.employee_id + "_" + media_type.type_name + "_" +Date.now()+"." + base64.split(';')[0].split('/')[1];
                var type = base64.split(';')[0].split('/')[1]
                var params = {
                    Body: base64Data,
                    Bucket: "uploads-dev-ez",
                    Key: key,
                    ContentEncoding: 'base64',
                    ContentType: `image/${type}`,
                    ACL: 'public-read'
                };
                s3.upload(params, function(err, data){
                    if(err)
                    res.status(400).json({"err":err});
                    else{  
                        models.Business.findOne({where:{owner_id: req.employee_id}}).then(function(business){
                            if(business){                            
                                models.Business_media.create({business_id:business.id,media_url: data.Location, media_type: media_type.id,media_format:type,media_name: req.body.media_name}).then(function(){                                
                                   res.json({"picture_url":data.Location});                                    
                                }).catch(function(err){
                                    console.log(err);
                                    res.status(400).json({error_msg: "Something want wrong"});
                                    return;
                                });
                            } else {
                                res.status(400).json({error_msg: "Business id not found"});
                                return;
                            }                        
                        });
                    }
                });
            } else {
                res.status(400).json({error_msg:"media_type_id not found in Media_type table"});
                return;
            }
        })        
    } else {
        res.status(400).json({error_msg:"Please call uploadbusinessvideo api to upload video"});
    }
}

exports.uploadVideoToS3 = function(req,res,models,s3){

}

//get_Business-Media API
exports.getBusinessMedia = function(req,res,models,app){
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business==null){
            res.status(400).json({error_msg:"No business found for this token"});
        } else {
            models.Business_media.findAll({where:{business_id:business.id}}).then(function(data){
                if(data){
                    res.json(data);
                    return;
                } else {
                    res.status(400).json({error_msg:"No business Media found."});
                    return;
                }
            })
        }
    })
};

// create-deals API
exports.createdeals = function(req,res,models,app,s3){
    if(req.body.deal_title==undefined || req.body.deal_title==null){
        res.status(400).json({error_msg:"deal_title not found in body"});
        return;
    }
    if(req.body.deal_type==undefined || req.body.deal_type==null){
        res.status(400).json({error_msg:"deal_type not found in body"});
        return;
    }
    if(req.body.is_active==undefined || req.body.is_active==null){
        res.status(400).json({error_msg:"is_active not found in body"});
        return;
    }
    if(req.body.valid_from!=undefined || req.body.valid_from!=null){        
        console.log(moment(req.body.valid_from, "YYYY-MM-DD",true).isValid());
        if(!moment(req.body.valid_from, "YYYY-MM-DD",true).isValid()){
            res.status(400).json({error_msg:"valid_from not in correct format, Correct format: YYYY-MM-DD"});
            return;
        }
    }
    if(req.body.valid_upto!=undefined || req.body.valid_upto!=null){
        console.log(moment(req.body.valid_upto, "YYYY-MM-DD",true).isValid());
        if(!moment(req.body.valid_upto, "YYYY-MM-DD",true).isValid()){
            res.status(400).json({error_msg:"valid_upto not in correct format, Correct format: YYYY-MM-DD"});
            return;
        }
    }
    
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        console.log(req.body.image_url);
        if(business==null){
            res.status(400).json({error_msg:"No business found for this token"});
        } else {
            if(req.body.deal_id==null || req.body.deal_id==undefined){
                models.Deals.findOrCreate({where:{business_id:business.id,created_by:business.owner_id,deal_title:req.body.deal_title,deal_type:req.body.deal_type}}).spread(function(dl,created){
                    dl.update({deal_title:req.body.deal_title,valid_from:req.body.valid_from,valid_upto:req.body.valid_upto,deal_type:req.body.deal_type,is_active:req.body.is_active,image_url:req.body.image_url,deal_description:req.body.deal_description,actual_price:req.body.actual_price,net_price:req.body.net_price,percentage_off:req.body.percentage_off,total_number_of_deals:req.body.total_number_of_deals,max_purchase_quatity_per_person:req.body.max_purchase_quatity_per_person,min_people:req.body.min_people,max_person:req.body.max_person,valid_on:req.body.valid_on,other_details:req.body.other_details},{returning:true}).then(function(updatedDeal){
                        if(req.body.image_url!='' || req.body.image_url!=undefined){
                            if(req.body.image_url.length>10){
                                uploadImageToS3(req.body.image_url,updatedDeal,res, models, s3);
                            } else{
                                res.json(updatedDeal);
                            }
                        } else {
                            res.json(updatedDeal);
                        }
                    }) 
                })
            } else {
                models.Deals.update({
                    deal_title:req.body.deal_title,
                    deal_type:req.body.deal_type,
                    deal_title:req.body.deal_title,
                    valid_from:req.body.valid_from,
                    valid_upto:req.body.valid_upto,
                    deal_type:req.body.deal_type,
                    is_active:req.body.is_active,                    
                    deal_description:req.body.deal_description,
                    actual_price:req.body.actual_price,
                    net_price:req.body.net_price,
                    percentage_off:req.body.percentage_off,
                    total_number_of_deals:req.body.total_number_of_deals,
                    max_purchase_quatity_per_person:req.body.max_purchase_quatity_per_person,
                    min_people:req.body.min_people,
                    max_person:req.body.max_person,
                    valid_on:req.body.valid_on,
                    other_details:req.body.other_details,                    
                },{where:{id:req.body.deal_id}}
                ,{returning:true}).then(function(deall){
                    if(deall){
                        console.log("1");
                        if(req.body.image_url!='' || req.body.image_url!=undefined){
                            console.log("2");
                            if(req.body.image_url.length>10){
                                models.Deals.findOne({where: {id: req.body.deal_id}}).then(function(dea){
                                    uploadImageToS3(req.body.image_url,dea,res, models, s3);
                                })
                            } else {
                                models.Deals.findOne({where:{id: req.body.deal_id}}).then(function(deal_data){
                                    res.json(deal_data);
                                })
                            }
                        } else {                            
                            models.Deals.findOne({where:{id: req.body.deal_id}}).then(function(deal_data){
                                res.json(deal_data);
                            })
                        }
                    } else {
                        res.status(400).json({error_msg:"Deal not updated"});
                        return;
                    }              
                })
            }
        }
    });
};

var uploadImageToS3 = function(base64, dl , res, models, s3){
    var base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    var key = "deal_images/" + dl.id + "_" + dl.deal_title + Date.now()+"." + base64.split(';')[0].split('/')[1];
    var type = base64.split(';')[0].split('/')[1]
    var params = {
        Body: base64Data,
        Bucket: "uploads-dev-ez",
        Key: key,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`,
        ACL: 'public-read'
    };
    s3.upload(params, function(err, data) {
        if(err)
            res.status(400).json({"err":err});
        else{ 
            var deal_id = dl.id;
            models.Deals.update({image_url: data.Location},{where:{id:deal_id}},{returning:true,plain: true}).then(function(updated){
                models.Deals.findOne({where:{id: deal_id}}).then(function(deal_data){
                    res.json(deal_data);
                })
            });
        }
    });
}

//get_Business-Media API
exports.getDeals = function(req,res,models,app){
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business==null){
            res.status(400).json({error_msg:"No business found for this token"});
        } else {
            models.Deals.findAll({where:{business_id:business.id},order: [['createdAt', 'DESC']]}).then(function(deals){
                if(deals){
                    res.json(deals);
                    return;
                } else {
                    res.status(400).json({error_msg:"No deals found."});
                    return;
                }
            })
        }
    })
};


//@update Business-Website API
exports.updateBusinessWebsite = function(req,res,models,app){    
    if(req.body.website==undefined || req.body.website==null){
        res.status(400).json({error_msg:"website not found"});
        return;
    }    
    models.Business.update({website:req.body.website
        },{where:{owner_id:req.employee_id},returning:true,plain:true}).then(function(){
        res.json({"msg":"website updated Successfully"});
    })    
};

exports.getAllDealsPurchased = function(req,res,models,app){    
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business==null){
            res.status(400).json({error_msg:"No business found for this token"});
        } else {
            var query = "Select *,udp.id as purchase_id, udp.createdAt as purchased_on from User_Deals_Purchase udp, Deals d where udp.`deal_id` = d.`id` and d.business_id =" + business.id + " order by purchased_on desc";
            models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(data){            
                if(data){
                    res.json(data);
                    return;
                } else {
                    res.status(400).json({error_msg:"No purchase deals found."});
                    return;
                }
            })
        }
    })
};

//get All-Purchase-Deals API
exports.getAllPurchaseDeals = function(req,res,models,app){    
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business==null){
            res.status(400).json({error_msg:"No business found for this token"});
        } else {
            var query = "Select *,udp.id as purchase_id, udp.createdAt as purchased_on from User_Deals_Purchase udp, Deals d where udp.`deal_id` = d.`id` and d.business_id =" + business.id + " and udp.deal_status='PURCHASED' order by purchased_on desc";
            models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(data){            
                if(data){
                    res.json(data);
                    return;
                } else {
                    res.status(400).json({error_msg:"No purchase deals found."});
                    return;
                }
            })
        }
    })
};

exports.getAllRedeemedDeals = function(req,res,models,app){    
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business==null){
            res.status(400).json({error_msg:"No business found for this token"});
        } else {
            var query = "Select *,udp.id as purchase_id, udp.createdAt as purchased_on from User_Deals_Purchase udp, Deals d where udp.`deal_id` = d.`id` and d.business_id =" + business.id + " and udp.deal_status='REDEEMED' order by purchased_on desc";
            models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(data){            
                if(data){
                    res.json(data);
                    return;
                } else {
                    res.status(400).json({error_msg:"No purchase deals found."});
                    return;
                }
            })
        }
    })
};

exports.getAllcancelledDeals = function(req,res,models,app){    
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business==null){
            res.status(400).json({error_msg:"No business found for this token"});
        } else {
            var query = "Select *,udp.id as purchase_id, udp.createdAt as purchased_on  from User_Deals_Purchase udp, Deals d where udp.`deal_id` = d.`id` and d.business_id =" + business.id + " and udp.deal_status='CANCELLED' order by purchased_on desc";
            models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(data){            
                if(data){
                    res.json(data);
                    return;
                } else {
                    res.status(400).json({error_msg:"No purchase deals found."});
                    return;
                }
            })
        }
    })
};

//get Business-Purchase-Deals API
exports.getBusinessPurchaseDeals = function(req,res,models,app){
    if(req.body.deal_id==undefined || req.body.deal_id==null){
        res.status(400).json({error_msg:"deal_id not found in body"});
        return;
    }
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business==null){
            res.status(400).json({error_msg:"No business found for this token"});
        } else {
            models.User_Deals_Purchase.findAll({where:{deal_id:req.body.deal_id}}).then(function(data){
                if(data){
                    res.send(data);
                    return;
                } else {
                    res.status(400).json({error_msg:"No purchase deals found."});
                    return;
                }
            })
        }
    })
};

//set Deals-Terms-Of-Use API
exports.setDealsTermsOfUse = function(req,res,models,app){
    if(req.body.deal_id==undefined || req.body.deal_id==null){
        res.status(400).json({error_msg:"deal_id not found in body"});
        return;
    }
    if(req.body.checked==undefined || req.body.checked==null){
        res.status(400).json({error_msg:"checked not found in body"});
        return;
    }
    if(req.body.deal_terms_of_use_master_id==undefined || req.body.deal_terms_of_use_master_id==null){
        res.status(400).json({error_msg:"deal_terms_of_use_master_id not found in body"});
        return;
    }
    if(req.body.checked=="true"){
        models.Deals_terms_of_use.findOrCreate({where:{deal_id:req.body.deal_id,deal_terms_of_use_master_id:req.body.deal_terms_of_use_master_id}
        }).spread(function(result,created){
            if(created){
                res.json({message : "created Successfully."});
                return;
            } else {
                res.status(400).json({error_msg: "already exists"});
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "deal_id or master_id you've entered does not exists"});
            return;
        })
    } else {
        models.Deals_terms_of_use.destroy({where:{deal_id:req.body.deal_id, deal_terms_of_use_master_id:req.body.deal_terms_of_use_master_id}}).then(function(){
            res.json({message : "removed successfully."});
            return;
        }).catch(function(){
            res.status(400).json({error_msg: "deal_id or master_id you've entered does not exists"});
            return;
        });
    }
};

//Deactive-Deals API
exports.DeactiveDeals = function(req,res,models,app){
    if(req.body.deal_id==undefined || req.body.deal_id==null){
        res.status(400).json({error_msg:"deal_id not found in body"});
        return;
    }
    models.Deals.update({is_active:0},{where:{id:req.body.deal_id},returning:true,plain:true}).then(function(){
        res.json({"msg":"Deal deactivated"});
    })
};

//Active-Deals API
exports.ActiveDeals = function(req,res,models,app){
    if(req.body.deal_id==undefined || req.body.deal_id==null){
        res.status(400).json({error_msg:"deal_id not found in body"});
        return;
    }
    models.Deals.update({is_active:1},{where:{id:req.body.deal_id},returning:true,plain:true}).then(function(){
        res.json({"msg":"Deal activated"});
    })
};
 

//get Deal-Details API
exports.getDealDetails = function(req,res,models,app){
    if(req.body.deal_id==undefined || req.body.deal_id==null){
        res.status(400).json({error_msg:"deal_id not found in body"});
        return;
    }
        var query = "Select d.*, (select count(*) from User_Deals_Purchase where deal_id="+req.body.deal_id +" and deal_status='PURCHASED') as purchase_count, (select count(*) from User_Deals_Purchase where deal_id="+req.body.deal_id +" and deal_status='REDEEMED') as redeemed_count,(select count(*) from User_Deals_Purchase where deal_id="+req.body.deal_id +" and deal_status='CANCELLED') as cancelled_count from Deals d where d.id = "+ req.body.deal_id +";";
        console.log(query);
        models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(data){
            if(data){
                res.json(data[0]);
            } else {
                res.status(400).json({error_msg: "No Deals found for this id"});
                return;
            }
        });
};

//get Transactions Details API
exports.getredeemedeals = function(req,res,models,app){
    if(req.body.deal_id==undefined || req.body.deal_id==null){
        res.status(400).json({error_msg:"deal_id not found in body"});
        return;
    }
    var query = "Select udp.*,udp.updatedAt as redeemed_date, t.transaction_mode as transaction_type from User_Deals_Purchase udp, Transactions t where udp.transaction_id = t.id and udp.deal_id =" + req.body.deal_id + " and udp.deal_status = 'REDEEMED'";
    models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT
    }).then(function(data){
        if(data){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No redeemed deals for this deal_id"});
            return
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//get Cancelled-Deals API
exports.getcancelleddeals = function(req,res,models,app){
    if(req.body.deal_id==undefined || req.body.deal_id==null){
        res.status(400).json({error_msg:"deal_id not found in body"});
        return;
    }
    models.User_Deals_Purchase.findAll({where:{deal_id:req.body.deal_id,deal_status:"CANCELLED"}
    }).then(function(data){
        if(data){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No cancelled deals for this deal_id"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg:"No cancelled deals for this deal_id"});
        return;
    })
};


//get Purchased-Deals API
exports.getPurchasedDeals = function(req,res,models,app){
    if(req.body.purchase_id==undefined || req.body.purchase_id==null){
        res.status(400).json({error_msg:"purchase_id not found in body"});
        return;
    }
    models.Business.findOne({where:{owner_id: req.employee_id}}).then(function(business){
        var query = "Select *, udp.id as purchase_id, udp.createdAt as purchased_on from User_Deals_Purchase udp, Deals d where udp.`deal_id` = d.`id` and d.business_id =" + business.id + " and udp.id=" + req.body.purchase_id +";" ;
        models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT
        }).then(function(data){
            if(data){
                res.json(data[0]);
                return;
            } else {
                res.status(400).json({error_msg:"No purchased deals for this deal_id"});
                return;
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg:"No purchased deals for this deal_id"});
            return;
        })
    })
};


//get Dashboard-Data API
exports.getDashboardData = function(req,res,models,app){
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
    console.log("business_id===>"+business.id);
    var query = "Select (select count(*) from Deals where business_id="+ business.id+" and is_active='1') as active_deals,"+
	   "(select count(*) from Deals where business_id="+ business.id+" and (TO_DAYS(valid_upto)-TO_DAYS(now()))<10) as expiring_soon,"+
	   "(select count(*) from User_Deals_Purchase where deal_id in (select id from Deals where business_id = "+ business.id+") and deal_status='REDEEMED') as redeemed_count,"+
	   "(select count(*) from User_Deals_Purchase where deal_id in (select id from Deals where business_id = "+ business.id+") and deal_status='CANCELLED') as cancelled_count,"+
       "(select count(*) from User_Deals_Purchase where deal_id in (select id from Deals where business_id = "+ business.id+") and deal_status='PURCHASED') as purchase_count,"+
       "(select sum(total_number_of_deals)-redeemed_count-cancelled_count-purchase_count from Deals where business_id = "+ business.id+") as total_left_count,"+
	   "(select count(*) from Business_appointment where business_id = "+ business.id+" and booking_status='PENDING') as pending_appointments,"+
   	   "(select count(*) from Business_appointment where business_id = "+ business.id+" and booking_status='APPROVED' and DATE(`booking_date_time`) = CURDATE()) as todays_appointment,"+
   	   "(select count(*) from Business_appointment where business_id = "+ business.id+" and booking_status='APPROVED' and DATE(`booking_date_time`) >= CURDATE()) as total_upcoming_appointment,"+
        "(select count(*) from Business_appointment where business_id = "+ business.id+" and booking_status='CANCELLED') as total_cancelled_appointment,"+
        "(select sum(price) from User_Deals_Purchase where deal_id in (select id from Deals where business_id = "+ business.id+") and deal_status='PURCHASED') as total_sales_expected,"+
	    "(select sum(price) from User_Deals_Purchase where deal_id in (select id from Deals where business_id = "+ business.id+") and deal_status='REDEEMED') as total_sales_achieved";
    console.log("query===>"+query);
        models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(data){
            if(data){
                res.json(data[0]);
            } else {
                res.status(400).json({error_msg: "No Deals found for this id"});
                return;
            }
        });
    })
};

//set Day-Closed API
exports.setDayClosed = function(req,res,models,app){
    console.log(req.body);  
    if(req.body.days==undefined || req.body.days==null){
        res.status(400).json({error_msg:"days not found in body"});
        return;
    }
    if(req.body.days.length==0){
        res.status(400).json({error_msg:"days cannot be empty found in body"});
        return;
    }
    var days = req.body.days;
    console.log(days);
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business){
            var dataArray = [];
            for(var i=0;i<days.length;i++){                
                dataArray[i] = {};
                dataArray[i].business_id = business.id;
                dataArray[i].day = days[i];
                dataArray[i].closed = true;
                dataArray[i].open_time=null;
                dataArray[i].close_time=null; 
            }
            models.Business_hours.bulkCreate(dataArray,{updateOnDuplicate: ["open_time","close_time","closed"]}).then(function(){
                models.Business_hours.findAll({where:{business_id: business.id}}).then(function(data){
                    res.json(data);
                })
            })
        }
    })
};

//@getAppointmentById API 
exports.getAppointmentById = function(req,res,models,app){
    if(req.body.appointment_id==undefined || req.body.appointment_id==null){
        res.status(400).json({error_msg:"appointment_id not found in body"});
        return;
    }
    models.Business_appointment.findOne({where:{id:req.body.appointment_id},
        returning:true,plain:true})
        .then(function(data){
            if(data){
                var response = {};
                response.appointment_details = data;
                var query = "SELECT `Appointment_services`.*,`Services`.`name`  FROM `Appointment_services` AS `Appointment_services`, `Services` AS `Services` WHERE `Appointment_services`.`appointment_id` =" + data.id + " AND `Appointment_services`.`service_id` = `Services`.`id`;"
                models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(appointment_services){
                    response.appointment_services = appointment_services;
                    res.json(response);
                    return;
                })
            } else {
                res.status(400).json({error_msg:"No business appointment found for this appointment_id"});
            }
        }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//get Appointment-By-Date API
exports.getAppointmentByDate = function(req,res,models,app){
    if(req.body.date==undefined || req.body.date==null){
        res.status(400).json({error_msg:"date not found in body"});
        return;
    }
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        var query = "SELECT `Business_appointment`.*, count(`Appointment_services`.`id`) as service_count "+
                    " FROM `Business_appointment` as `Business_appointment` LEFT JOIN `Appointment_services` as `Appointment_services` " +
                    " ON `Business_appointment`.`id` = `Appointment_services`.`appointment_id` " +
                    " WHERE `Business_appointment`.`business_id` = " + business.id +
                    " AND DATE(`Business_appointment`.`booking_date_time`) = '" + req.body.date + "' "+ 
                    " GROUP BY `Business_appointment`.`id`;";                        
        models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(data){
            if(data){                
                res.json(data);
            } else {
                res.status(400).json({error_msg: "No Deals found for this id"});
                return;
            }
        });
    })
};

//Approve-Appointment API
exports.approveAppointment = function(req,res,models,app){
    if(req.body.appointment_id==undefined || req.body.appointment_id==null){
        res.status(400).json({error_msg:"appointment_id not found in body"});
        return;
    }
    models.Business_appointment.findOne({where:{id: req.body.appointment_id}}).then(function(appointment){
        if(appointment!=null){
            if(appointment.booking_status=="APPROVED"){
                res.status(400).json({error_msg:"Appointment already approved"});
                return;
            }
            appointment.update({booking_status:'APPROVED'},{where:{id:req.body.appointment_id},
            returning:true,plain:true}).then(function(appointment){
                if(appointment){
                    //send Notification
                    console.log("Notification Call =>");
                    notificationsForApprovedAppointment(req,res,models,appointment);
                    res.json(appointment);
                    return;
                }
            });
        } else {
            res.status(400).json({error_msg: "No appointment found for this id"});
            return;
        }
    })    
};


function notificationsForApprovedAppointment(req,res,models,appointment){
    models.Business_appointment.findOne({wher:{id:appointment.user_id}}).then(function(appointment){
        console.log("user : =>", appointment.user_id);
        models.Users.findOne({where:{user_id:appointment.user_id}}).then(function(users){
            console.log("firebase_token : => ",users.firebase_token);
            var message = {
                notification: {
                    title: "appointment status",
                    body: "your appointment has been approved on " + appointment.booking_date_time,
                },
                android: {
                    ttl: 3600 * 1000,
                    notification: {                    
                    color: '#f45342',
                    },
                },
                data: {
                    "appointment_id": ""+appointment.id
                },
                token: users.firebase_token
            };
            
            admin.messaging().send(message).then(function(response,err){
                console.log("Notification ID : =>", response)
                if(response){
                    //saveNotificationTodatabase(req,res,models,message,appointment);
                    console.log('Notification Send Successfully');
                    return;
                } else {
                    console.log("Notification not sent", err);
                }
            }).catch((error) => {
                console.log('Error sending message:', error);
            });
        })
    })
}

function saveNotificationTodatabase(req,res,models,message,appointment) {
    models.Notifications.findOrCreate({where:{sent_to:appointment.id, group_name:message.topic, notification_text:message.notification.body, payload:JSON.stringify(message.data),notificaiton_type:"APPOINTMENT",visible: 1}})
     .then(function(){
     }).catch(function(err){
         console.log(err);
         return;
     })
 };


//cancelled-Appointment API
exports.cancelAppointment = function(req,res,models,app){
    if(req.body.appointment_id==undefined || req.body.appointment_id==null){
        res.status(400).json({error_msg:"appointment_id not found in body"});
        return;
    }
    if(req.body.cancellation_reason==undefined || req.body.cancellation_reason==null){
        res.status(400).json({error_msg:"cancellation_reason not found in body"});
        return;
    }
    
    models.Business_appointment.findOne({where:{id: req.body.appointment_id}}).then(function(appointment){
        if(appointment!=null){
            if(appointment.booking_status=="CANCELLED"){
                res.status(400).json({error_msg:"Appointment already cancelled"});
                return;
            }
            appointment.update({booking_status:'CANCELLED', cancellation_reason: req.body.cancellation_reason},{where:{id:req.body.appointment_id},
            returning:true,plain:true}).then(function(appointment){
                console.log(appointment);
                if(appointment){
                    // send Notification for Cancled
                    res.json(appointment);
                    return;
                }
            });
        } else {
            res.status(400).json({error_msg: "No appointment found for this id"});
            return;
        }
    })   
};

//get Dashboard-Data-Day API
exports.getDashboardDataDay = function(req,res,models,app){
    if(req.body.day==undefined || req.body.day==null){
        res.status(400).json({error_msg:"day not found in body"});
        return;
    }
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
    console.log("business_id===>"+business.id);
    var query =  "Select "+
    "(select count(*) from Deals where business_id="+ business.id+" and (TO_DAYS(valid_upto)-TO_DAYS(now()))<" + req.body.day + ") as expiring_soon,"+
    "(select count(*) from User_Deals_Purchase where deal_id in (select id from Deals where business_id = " + business.id + ") and (TO_DAYS(createdAt)-TO_DAYS(now()))<" + req.body.day + " and deal_status='REDEEMED') as redeemed_count,"+
    "(select count(*) from User_Deals_Purchase where deal_id in (select id from Deals where business_id = " + business.id + ") and (TO_DAYS(createdAt)-TO_DAYS(now()))<" + req.body.day + " and deal_status='CANCELLED') as cancelled_count,"+
    "(select count(*) from User_Deals_Purchase where deal_id in (select id from Deals where business_id = " + business.id + ") and (TO_DAYS(createdAt)-TO_DAYS(now()))<" + req.body.day + " and deal_status='PURCHASED') as purchase_count,"+
    "(select sum(total_number_of_deals)-redeemed_count-cancelled_count-purchase_count from Deals where business_id = "+ business.id+") as total_left_count,"+
    "(select count(*) from Business_appointment where business_id = "+ business.id+" and booking_status='PENDING') as pending_appointments,"+
    "(select count(*) from Business_appointment where business_id = "+ business.id+" and booking_status='APPROVED' and DATE(`booking_date_time`) = CURDATE()) as todays_appointment,"+
    "(select count(*) from Business_appointment where business_id = "+ business.id+" and booking_status='APPROVED' and DATE(`booking_date_time`) >= CURDATE() and DATE(`booking_date_time`)<=1)  as total_upcoming_appointment,"+
    "(select count(*) from Business_appointment where business_id = "+ business.id+" and booking_status='CANCELLED') as total_cancelled_appointment,"+
    "(select sum(price) from User_Deals_Purchase where deal_id in (select id from Deals where business_id = "+ business.id+") and deal_status='PURCHASED') as total_sales_expected,"+
    "(select sum(price) from User_Deals_Purchase where deal_id in (select id from Deals where business_id = "+ business.id+") and deal_status='REDEEMED') as total_sales_achieved";
       console.log("query===>"+ query);
       models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(data){
            if(data){
                res.json(data[0]);
            } else {
                res.status(400).json({error_msg: "No Deals found for this id"});
                return;
            }
        });
    })
};

//get Redeeme_Deals_For_Day API
exports.getRedeemeDealsForDay = function(req,res,models,app){
    if(req.body.day==undefined || req.body.day==null){
        res.status(400).json({error_msg:"day not found in body"});
        return;
    }
    var query = "Select * from User_Deals_Purchase where deal_status='REDEEMED' and date(createdAt) >= ( CURDATE() - INTERVAL " + req.body.day + " DAY)";
    models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT
    }).then(function(data){
        if(data){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No redeemed deals for this day"});
            return
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};


//get_Cancelled_Deals_For_Day API
exports.getCancelledDealsForDay = function(req,res,models,app){
    if(req.body.day==undefined || req.body.day==null){
        res.status(400).json({error_msg:"day not found in body"});
        return;
    }
    var query = "Select * from User_Deals_Purchase where deal_status='CANCELLED' and date(createdAt) >= ( CURDATE() - INTERVAL " + req.body.day + " DAY)";
    models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT
    }).then(function(data){
        if(data){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No cancelled deals for this day"});
            return
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};



//get_Purchased_Deals_For_Day API
exports.getPurchasedDealsForDay = function(req,res,models,app){
    if(req.body.day==undefined || req.body.day==null){
        res.status(400).json({error_msg:"day not found in body"});
        return;
    }
    var query = "Select * from User_Deals_Purchase where deal_status='PURCHASED' and date(createdAt) >= ( CURDATE() - INTERVAL " + req.body.day + " DAY)";
    models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT
    }).then(function(data){
        if(data){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No purchased deals for this day"});
            return
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

var isEmpty = function(string){
    if(string==undefined || string=="" || string==null){
        return true;
    } else {
        return false;
    }
}
//activated Business API
exports.activatebusiness = function(req,res,models,app){
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business){
            console.log("business_id==>"+business.id);
            if(isEmpty(business.description)){
                res.status(400).json({error_msg:"Please enter few words which describes your salon"});
                return;
            } else if (isEmpty(business.contact_number)) {
                res.status(400).json({error_msg:"Please enter your salon's contact number"});
                return;
            } else if (isEmpty(business.email_address)) {
                res.status(400).json({error_msg:"Please enter your salon's email address"});
                return;
            } else if (isEmpty(business.address)){
                res.status(400).json({error_msg:"Please enter your salon's address"});
                return;
            } else if (isEmpty(business.address_lat) || isEmpty(business.address_long)){
                res.status(400).json({error_msg:"Please set your salon's location on map"});
                return;
            }
            else{
                workingHours(req,res,models,business);
            }            
        } 
    })
};

var workingHours = function(req,res,models,business){
    models.Business_hours.findOne({business_id:business.id}).then(function(workinghours){
        if(workinghours==null){
            res.status(400).json({error_msg:"Please set you salon working hours"});
        } else {
            Amenities(req,res,models,business);            
        }
    })
}
Amenities = function(req,res,models,business){
    models.Business_amenities.findOne({business_id:business.id}).then(function(amenities){
        if(amenities==null){
            res.status(400).json({error_msg:"Please add amenities"});
        } else {
            Photos(req,res,models,business);
        }
    })
}
Photos = function(req,res,models,business){
    models.Business_media.findOne({business_id:business.id}).then(function(image){
        if(image==null){
            res.status(400).json({error_msg:"Please set salon profile picture"});
        } else {
            serviceAndPricing(req,res,models,business);
        }
    })
}
serviceAndPricing = function(req,res,models,business){
    models.Business_Service.findOne({business_id:business.id}).then(function(service){
        if(service==null){
            res.status(400).json({error_msg:"Please add your services and their pricing"});
        } else {
            models.Business.update({is_active:1},{where:{id:business.id},returning:true,plain:true})
            .then(function(){
                res.json({"msg":"Your business is now active! Let's get started"});
                return;
            })
        }
    })
}

exports.updateFirebaseToken = function(req,res,models,app){
    if(req.body.firebase_token==undefined || req.body.firebase_token==null){
        res.status(400).json({error_msg:"firebase_token not found"});
        return;
    }
    models.Employee.update({firebase_token:req.body.firebase_token},{where:{
        id:req.employee_id},returning:true,plain:true}).then(function(){
            res.json({"msg":"firebase_token updated Successfully"});
        return
    })
};

//Search_Deals API
exports.searchDeals = function(req,res,models,app){
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business){
            console.log("business_id==>"+business.id);
            var query = "SELECT * FROM `Deals` where business_id="+business.id+" and deal_title LIKE '%%"+ req.body.search_parameter + "%%' or id='" + req.body.search_parameter +"';";
            console.log("Query==>"+query);
            models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(deals){
                if(deals!=null && deals.length>0){
                    res.json(deals);
                    return;
                } else {
                    res.status(400).json({error_msg: "There are no deals found."});
                    return;
                }
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg: "Something went wrong"});
                return;
            })
        }
    })
};


//Search_Booking API
exports.searchBooking = function(req,res,models,app){
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business){
            console.log("business_id==>"+business.id);
            var query = "SELECT * FROM `Business_appointment` where business_id="+business.id+" and customer_name LIKE '%%"+ req.body.search_parameter + "%%' or customer_contact_number='" + req.body.search_parameter +"' or email_address='" + req.body.search_parameter +"' or id='" + req.body.search_parameter +"';";
            console.log("Query==>"+query);
            models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(booking){
                if(booking!=null && booking.length>0){
                    res.json(booking);
                    return;
                } else {
                    res.status(400).json({error_msg: "There are no business booking found."});
                    return;
                }
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg: "Something went wrong"});
                return;
            })
        }
    })
};

//updat_Business_Type API
exports.updateBusinessType = function(req,res,models,app){
    if(req.body.business_type_id==undefined || req.body.business_type_id==null){
        res.status(400).json({error_msg:"business_type_id not found in body"});
        return;
    }
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business){        
            models.Business.update({business_type:req.body.business_type_id},{where:{id:business.id},returning:true,plain:true})
            .then(function(){
                res.json({"msg":"business_type updated successfully"});
                return;
            })
        }
    })
};

//generate_Otp_API
exports.generateOtp = function(req,res,models,app){
    models.Employee.findOne({where:{id:req.employee_id}}).then(function(employee){
        console.log("employee_id==>"+employee.id);
        if(employee.otp==null || employee.otp==""){
            var response = {};
            var otp = Math.floor(1000 + Math.random() * 9000);
            response.otp = otp
            models.Employee.update({otp:otp},{where:{id:employee.id}}).then(function(otp){
                res.json(response);
                console.log("Otp: " + otp +  " Otp Generate Successfully.!");
                return;
            })
        } else {
            models.Employee.findOne({where:{id:employee.id}}).then(function(employee){
                var response = {}
                response.otp = employee.otp;
                res.json(response);
                return;
            })
        }
    })
};

//set_Bank_Account_Details API
exports.setBankAccountDetails = function(req,res,models,app){
    if(req.body.bank_name==undefined || req.body.bank_name==null){
        res.status(400).json({error_msg:"bank_name not found in body"});
        return;
    }
    if(req.body.account_number==undefined || req.body.account_number==null){
        res.status(400).json({error_msg:"account_number not found in body"});
        return;
    }
    if(req.body.account_holder_name==undefined || req.body.account_holder_name==null){
        res.status(400).json({error_msg:"account_holder_name not found in body"});
        return;
    }
    if(req.body.pan_card_number==undefined || req.body.pan_card_number==null){
        res.status(400).json({error_msg:"pan_card_number not found in body"});
        return;
    }
    if(req.body.account_type==undefined || req.body.account_type==null){
        res.status(400).json({error_msg:"account_type not found in body"});
        return;
    }    
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        console.log("business_id==> "+ business.id);
        if(business==null){
            res.status(400).json({error_msg:"No business found for this token"});
        } else {
            var defaults = {
                bank_name:req.body.bank_name, 
                        ifsc_code:req.body.ifsc_code, 
                        account_number:req.body.account_number, 
                        branch_name:req.body.branch_name, 
                        account_holder_name:req.body.account_holder_name, 
                        pan_card_number: req.body.pan_card_number,
                        account_type : req.body.account_type,
                        gst_number: req.body.gst_number
            }
            models.Business_bank_details.findOrCreate({where:{business_id:business.id}, defaults}).spread(function(result,created){
                if(created){
                    res.json({"msg":"Your bank details created Successfully."});
                    return;
                } else {
                    models.Business_bank_details.update(defaults,{where:{id: result.id}}).then(function(){
                        res.json({"msg":"Your bank details updated Successfully."});
                        return;
                    });
                }
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg: "Something went wrong"});
                return;
            })

        }
    })
};


//get_Bank_Account_Details API
exports.getBankAccountDetails = function(req,res,models,app){
    models.Business.findOne({where:{owner_id:req.employee_id}}).then(function(business){
        if(business==null){
            res.status(400).json({error_msg:"No business found for this token"});
        } else {
            models.Business_bank_details.findOne({where:{business_id:business.id}}).then(function(data){
                if(data){
                    res.json(data);
                    return;
                } else {
                    res.status(400).json({error_msg:"No Bank_details found."});
                    return;
                }
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg: "Something went wrong"});
                return;
            })
        }
    })
};

//delete_owner_profile_picture API
exports.deleteOwnerProfilePicture = function(req,res,models,s3){             
    models.Employee.findOne({where:{id: req.employee_id}}).then(function(employee){
        if(employee.profile_picture_url==null || employee.profile_picture_url==undefined || employee.profile_picture_url.length<5){
            res.status(400).json({error_msg:"No profile picture found"});
            return;
        }
        var parts = employee.profile_picture_url.split("://")[1];
        var key = parts.split('/').slice(1).join("/");
        var params = {    
            Bucket: "uploads-dev-ez",
            Key: key
        };
        s3.deleteObject(params, function(err, data) {
            if (err) {
                console.log(err, err.stack)
                res.status(400).json({error_msg: "Something want wrong"});
                return;
            };
            models.Employee.update({profile_picture_url: ""},{where:{id: req.employee_id}}).then(function(){    
                res.json({"msg":"Profile Picture Deleted successfully"});
                return;        
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg: "Something want wrong"});
                return;
            })    
        })
    })
};

//delete_business_profile_picture API
exports.deleteBusinessProfilePicture = function(req,res,models,s3){
    models.Business.findOne({where:{owner_id: req.employee_id}}).then(function(business){
        if(business.profile_picture_url==null || business.profile_picture_url==undefined || business.profile_picture_url.length<5){
            res.status(400).json({error_msg:"No profile picture found"});
            return;
        }
        var parts = business.profile_picture_url.split("://")[1];
        var key = parts.split('/').slice(1).join("/");
        var params = {    
            Bucket: "uploads-dev-ez",
            Key: key
        };
        s3.deleteObject(params, function(err, data) {
            if (err) {
                console.log(err, err.stack)
                res.status(400).json({error_msg: "Something want wrong"});
                return;
            };
            models.Business.update({profile_picture_url: ""},{where:{owner_id: req.employee_id}}).then(function(){    
                res.json({"msg":"Profile Picture Deleted successfully"});
                return;        
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg: "Something want wrong"});
                return;
            })    
        })
    })
};

exports.updateBusinessContact = function(req,res,models,s3){
    models.Business.update({contact_number: req.body.contact_number, 
                            alternate_contact_number: req.body.alternate_contact_number,
                            email_address: req.body.email,
                            address: req.body.address,
                            website: req.body.website
                            },{where: {owner_id: req.employee_id}}).then(function(business){
                                res.json({"msg": "contact details updated successfully"});
                                return;

    })
}


//get_Notifications_By_Group_Name API
exports.getNotificationsByGroupName = function(req,res,models,app){
    if(req.body.group_name==undefined || req.body.group_name==null){
        res.status(400).json({error_msg:"group_name not found in body"});
        return;
    }
    models.Notifications.findAll({where:{group_name:req.body.group_name}})
    .then(function(data){
        if(data){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No notifications_details found."});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//get_Notifications_By_EmployeeId API
exports.getNotificationsByEmployeeId = function(req,res,models,app){
    models.Notifications.findAll({where:{sent_to:req.employee_id}}).then(function(data){
        if(data){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No notifications found"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })    
};

//Clear_All_Notifications API
exports.clearAllNotifications = function(req,res,models,app){
    models.Notifications.update({visible:'0'},{where:{sent_to:req.employee_id},returning:true,plain:true})
    .then(function(){
        res.json({"msg": "notifications clear successfully"});
        return;
    })
};


//Mark_notificationasread API
exports.markNotificationAsRead = function(req,res,models,app){
    if(req.body.notification_id==undefined || req.body.notification_id==null){
        res.status(400).json({error_msg:"notification_id not found in body"});
        return;
    }
    models.Notifications.update({visible:'0'},{where:{id:req.body.notification_id},returning:true,plain:true})
    .then(function(){
        res.json({"msg": "notifications mark successfully"});
        return;
    })
};

//send_Application_Feedback API
exports.sendApplicationFeedback = function(req,res,models,app){
    var defaults = {        
        contact_number:req.body.contact_number,
        email_address:req.body.email_address,
        feedback:req.body.feedback
    }
    models.Application_feedback.findOrCreate({where:{employee_id:req.employee_id},defaults})
    .spread(function(result,created){
        console.log(created);
        if(created){
            res.json({"msg":"Feedback created successfully"});
            return;
        } else {
            res.json({error_msg: "Feedback already exists"});
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};