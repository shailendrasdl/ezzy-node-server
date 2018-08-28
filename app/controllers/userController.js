var exports = module.exports = {}
var jwt    = require('jsonwebtoken');
var geo = require('geolib');
var geodist = require('geodist');
var admin = require('firebase-admin');
var moment = require('moment');
 
exports.getUserDetails = function(app,req,res,models){
    models.Users.findOne({where: {user_id:req.user_id}}).then(function(user){
        if(user){
            res.json(user);
        } else {
            res.status(400).json({error_msg: "User not found"});
            return
        }
    });
}


exports.updateUserLocation = function(app,req,res,models,config){
    var currentLocation = {latitude: req.body.lat, longitude: req.body.long};
    if(currentLocation.latitude==null || currentLocation.longitude==null){
        res.status(400).json({error_msg: "Lat or Long parameter not found in body"});
        return
    };
    models.Users_Sessions.findOne({where: {user_id:req.user_id, active:1}}).then(function(session){        
        var prevLocation = {latitude: session.last_known_lat, longitude: session.last_known_long};
        if(prevLocation.latitude!=null && prevLocation.longitude!=null){
            var distance = geo.getDistance(prevLocation,currentLocation);
            if(distance>config.distance_threshold_for_location_change){
                models.Users_Sessions.update({last_known_lat: req.body.lat, last_known_long: req.body.long},{where:{user_id:req.user_id, active:1}}).then(function(){
                    res.json({"msg": "Location changed"});
                });            
            } else {
                models.Users_Sessions.update({last_known_lat: req.body.lat, last_known_long: req.body.long},{where:{user_id:req.user_id, active:1}}).then(function(){
                    res.json({"msg":"No change in location"});
                });
            }
        } else {
            models.Users_Sessions.update({last_known_lat: req.body.lat, last_known_long: req.body.long},{where:{user_id:req.user_id, active:1}}).then(function(){
                res.json({"msg":"Initial location set"});
            });
        }
    })
}

//@ Create_Business_Appointment API
exports.CreateBusinessAppointment = function(req,res,models,app){

    if(req.body.booked_by==undefined || req.body.booked_by==null){
        res.status(400).json({error_msg:"booked_by not found in body"});
        return;
    }
    if(req.body.booked_for==undefined || req.body.booked_for==null){
        res.status(400).json({error_msg:"booked_for not found in body"});
        return;
    }
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    if(req.body.name==undefined || req.body.name==null){
        res.status(400).json({error_msg:"name not found in body"});
        return;
    }
    if(req.body.email_address==undefined || req.body.email_address==null){
        res.status(400).json({error_msg:"email_address not found in body"});
        return;
    }
    // if(req.body.address==undefined || req.body.address==null){
    //     res.status(400).json({error_msg:"address not found in body"});
    //     return;
    // }
    if(req.body.booking_date_time==undefined || req.body.booking_date_time==null){
        res.status(400).json({error_msg:"booking_date_time not found in body"});
        return;
    }
    
    if(req.body.customer_contact_number==undefined || req.body.customer_contact_number==null){
        res.status(400).json({error_msg:"customer_contact_number not found in body"});
        return;
    }

    // if(req.body.city_id==undefined || req.body.city_id==null){
    //     res.status(400).json({error_msg:"city_id not found in body"});
    //     return;
    // }
    
    if(req.body.gender==undefined || req.body.gender==null){
        res.status(400).json({error_msg:"gender not found in body"});
        return;
    }

    var validDate = function(value){
        return moment(value,"YYYY.MM.DD HH:mm:ss").isValid();
    }

    if(!validDate(req.body.booking_date_time)){
        res.status(400).json({error_msg:"booking_date_time not in correct format, format should be: YYYY.MM.DD HH:mm:ss"});
        return;
    }

    var defaults = {        
        business_id:req.body.business_id,
        customer_name:req.body.name,
        email_address:req.body.email_address,
        // customer_address:req.body.address,
        booking_date_time:req.body.booking_date_time,    
        customer_contact_number:req.body.customer_contact_number,        
        booked_by:req.body.booked_by,        
        booked_for:req.body.booked_for,  
        // city_id: req.body.city_id,
        gender: req.body.gender,
        booking_status: "PENDING"

    }

    if(req.body.special_instructions){
        defaults.special_instructions = req.body.special_instructions;
    }
    if(req.body.booked_for=="User"){
        updateUserDetail(req,models,app);
    }
    findBusinessAndCreateAppointment(defaults,req,res,models)
};

//TODO return appointment id and check for date format
function findBusinessAndCreateAppointment(defaults,req,res,models){
    models.Business.findOne({where:{id:req.body.business_id}}).then(function(business){
        if(business!=null){       
            console.log("Booking date time: " + req.body.booking_date_time);                        
            models.Business_appointment.findOrCreate({where:{user_id:req.user_id,booking_date_time: req.body.booking_date_time},
                defaults}).spread(function(result,created){
                    console.log(created);
                    if(created){
                        notificationsForAppointment(req,res,business, result.id,models);
                        res.json({"msg":"Appointment created successfully", "appointment_id": result.id});
                    } else {
                        res.json({"msg":"Appointment already exists"})
                    }
                })                            
        } else {
            res.status(400).json({"error_msg":"No business found for this business_id"})
        }
    })
}

var updateUserDetail = function(req,models,app,res){
    var updated=false;
    if(req.body.email_address!=undefined && req.body.email_address!=""){
        updateEmail(req,req.body.email_address, models);
        updated=true;
    }
    if(req.body.address!=undefined && req.body.address!=""){
        updateAddress(req,req.body.address, models);
        updated=true;
    }
    if(req.body.name!=undefined && req.body.name!=""){
        updateName(req,req.body.name, models);
        updated=true;
    }
    if(req.body.city_id!=undefined && req.body.city_id!=""){
        updateCity(req,req.body.city_id, models);
        updated=true;
    }
    if(req.body.gender!=undefined && req.body.gender!=""){
        updateGender(req,req.body.gender, models);
        updated=true;
    }
    // if(req.body.customer_contact_number!=undefined && req.body.customer_contact_number!=""){
    //     updateContactNumber(req.body.customer_contact_number);
    //     updated=true;
    // }   

    if(res && !updated){
        res.json({"msg":"Nothing to update"});
    } else if(res && updated){
        res.json({"msg":"Updated successfully"});
    } else if(updated){
        console.log("Updated successfully");
    } else {
        console.log("Nothing to Update");
    }
     
}

function updateEmail(req,email_address, models){
    models.Users.update({email_address: email_address},{where:{user_id: req.user_id}}).then(function(){
        console.log("email_address updated successfully");
    });
}

function updateAddress(req,address, models){
    models.Users.update({address: address},{where:{user_id: req.user_id}}).then(function(){
        console.log("customer_address updated successfully");
    });
}

function updateName(req,name, models){
    models.Users.update({first_name: name},{where:{user_id: req.user_id}}).then(function(){
        console.log("name updated successfully");
    });
}

function updateCity(req,city_id, models){
    models.Users.update({city_id: city_id},{where:{user_id: req.user_id}}).then(function(){
        console.log("city updated successfully");
    });
}

function updateGender(req,gender, models){
    models.Users.update({gender: gender},{where:{user_id: req.user_id}}).then(function(){
        console.log("gender updated successfully");
    });
}


function notificationsForAppointment(req,res,business, appointment_id,models){
    var data=req.body;    
    var message = {
        notification: {
            title: "You've a new booking",
            body: "You've got a new booking for " + req.body.booking_date_time,
        },
        android: {
            ttl: 3600 * 1000,
            notification: {                     
            color: '#f45342',
            },
        },
        data: {
            "appointment_id": ""+appointment_id
        },
        topic: business.id +"_"+ business.business_name.replace(/\s/g,'') 
        };
    admin.messaging().send(message).then(function(response,err){
        if (response) {            
            saveAppNotificationTodatabase(req,res,models,message,business);
            console.log("Successfully sent with response: ", response);            
            return;
        } else {
            console.log("Notification not sent", err);            
        }
    }).catch(function(err){
        console.log("Notification not sent", err);    
    }); 
}

function saveAppNotificationTodatabase(req,res,models,message,business) {
   models.Notifications.findOrCreate({where:{sent_to:business.owner_id, group_name:message.topic, notification_text:message.notification.body, payload:JSON.stringify(message.data),notificaiton_type:"BOOKING",visible: 1}})
    .then(function(){
    }).catch(function(err){
        console.log(err);
        return;
    })
};

exports.updateUserDetails = function(app,req,res,models){
    updateUserDetail(req,models,app,res);
}

// function updateContactNumber(customer_contact_number){
//     models.Users.update({mobile_number: email_address},{where:{user_id: req.user_id}}).then(function(){
//         console.log("email_address updated successfully");
//     });
// }

// //@getAppointmentById API
// exports.getAppointmentById = function(req,res,models,app){
//     if(req.body.appointment_id==undefined || req.body.appointment_id==null){
//         res.status(400).json({error_msg:"appointment_id not found in body"});
//         return;
//     }
//     models.Business_appointment.findOne({where:{id:req.body.appointment_id},
//         returning:true,plain:true})
//         .then(function(data){
//             if(data){
//                 res.json(data);
//                 return;
//             } else {
//                 res.status(400).json({error_msg:"No business appointment found for this appointment_id"});
//             }
//         }).catch(function(err){
//         console.log(err);
//         res.status(400).json({error_msg: "Something want wrong"});
//         return;
//     })
// };


exports.addServiceForAppoitment = function(req,res,models,app){
    if(req.body.appointment_id==undefined || req.body.appointment_id==null){
        res.status(400).json({error_msg:"appointment_id not found in body"});
        return;
    }
    if(req.body.service_ids==undefined || req.body.service_ids==null && req.body.service_ids.length>0){
        res.status(400).json({error_msg:"appointment_id not found in body"});
        return;
    }

    var service_ids = req.body.service_ids.split(',');;

    models.Services.findAll({where: {id: service_ids}}).then(function(services){
        if(services.length!=service_ids.length){            
            res.status(400).json({error_msg:"some of the services do not exists in service master"});
            return;
        } else {
            var promises = []
            for(var i=0; i<services.length; i++){
                promises[i] = models.Appointment_services.findOrCreate({where:{appointment_id:req.body.appointment_id,service_id:services[i].id}});                    
            }
            Promise.all(promises).then(function(result){
                console.log(result);
                res.json({"msg":"Services added to Appointment successfully"});
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg:"Error creating appointment"})
            });                    
        }
    })

}

exports.updateProfilePicture = function(req,res,models,s3){
    if(req.body.base64image==undefined || req.body.base64image==null){
        res.status(400).json({error_msg:"base64image parameter not found in body"});
        return;
    }
    var base64 = req.body.base64image;
    var base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    var key = "user_profiles/" + req.user_id + "_profile"+Date.now()+"." + base64.split(';')[0].split('/')[1];
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
            models.Users.update({profile_picture_url: data.Location}, {where:{user_id:req.user_id}}).then(function(){
                res.json({"profile_picture_url":data.Location})
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg: "Something want wrong"});
                return;
            })
            
        }
    });
}

 //data:image/png;base64,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//


//@set business_Reviews API
exports.setbusinessReviews = function(req,res,models,app){
    if(req.body.business_id == undefined || req.body.business_id == null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    if(req.body.maintainance_rating == undefined || req.body.maintainance_rating == null){
        res.status(400).json({error_msg:"maintainance_rating not found in body"});
        return;
    }
    if(req.body.cleanliness_rating == undefined || req.body.cleanliness_rating == null){
        res.status(400).json({error_msg:"cleanliness_rating not found in body"});
        return;
    }
    if(req.body.service_rating == undefined || req.body.service_rating == null){
        res.status(400).json({error_msg:"service_rating not found in body"});
        return;
    }
    if(req.body.staff_rating == undefined || req.body.staff_rating == null){
        res.status(400).json({error_msg:"staff_rating not found in body"});
        return;
    }
    if(req.body.pricing_rating == undefined || req.body.pricing_rating == null){
        res.status(400).json({error_msg:"pricing_rating not found in body"});
        return;
    }
    if(req.body.review == undefined || req.body.review == null){
        res.status(400).json({error_msg:"review not found in body"});
        return;
    }
    
    models.Bussiness_Reviews.findOne({where:{business_id:req.body.business_id,user_id:req.user_id,visible:1
            }}).then(function(result){
            if(result){
                if(req.body.avg_rating!=result.avg_rating && req.body.review!=result.avg_rating){
                    result.update({visible:0}).then(function(){
                        models.Bussiness_Reviews.create({business_id:req.body.business_id,user_id:req.user_id,visible:1,maintainance_rating:req.body.maintainance_rating,cleanliness_rating:req.body.cleanliness_rating,service_rating:req.body.service_rating,staff_rating:req.body.staff_rating,pricing_rating:req.body.pricing_rating,review:req.body.review}).then(function(){
                            setAvgRating(req,res,models);
                            res.json({"msg":"Bussiness Reviews updated successfully"});
                            return;
                        });                     
                    });
                }else {
                    res.json({"msg":"No changes"});
                    return;
                }
            } else {
                models.Bussiness_Reviews.create({business_id:req.body.business_id,user_id:req.user_id,visible:1,maintainance_rating:req.body.maintainance_rating,cleanliness_rating:req.body.cleanliness_rating,service_rating:req.body.service_rating,staff_rating:req.body.staff_rating,pricing_rating:req.body.pricing_rating,review:req.body.review}).then(function(){
                    setAvgRating(req,res,models);
                    res.json({"msg":"Bussiness Reviews created"});
                })
            }
        }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;

    })
};

setAvgRating = function(req,res,models){
    models.Bussiness_Reviews.findOne({where:{business_id:req.body.business_id,user_id:req.user_id,visible:1}})
    .then(function(result){
        if(result!=undefined && result!=null){
            var query = "update Bussiness_Reviews br,(SELECT id,(sum(maintainance_rating)+sum(cleanliness_rating)+sum(service_rating)+sum(staff_rating)+sum(pricing_rating))/5 as avgs from Bussiness_Reviews where business_id="+result.business_id+" and user_id="+result.user_id+" GROUP BY id) a set br.avg_rating=a.avgs where br.id=a.id";
            models.sequelize.query(query,{type: models.sequelize.QueryTypes.UPDATE})
            .then(function(data){
                setAvgRatingOfBusiness(req,res,models);
                console.log("Avg set successfully")
            })
        } else {
            console.log("Review not found, therefore avg rating not set")
        }
    })
}

setAvgRatingOfBusiness = function(req,res,models){
    var query = "update Business b ,(SELECT sum(avg_rating)/count(*) as avg from Bussiness_Reviews where business_id="+req.body.business_id+" and visible=1) br set b.avg_rating=br.avg where b.id ="+req.body.business_id+";"
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.UPDATE}).then(function(data){
        console.log("Business rating updated");
    })
}


//@get_Business_Reviews API
exports.getbusinessreview = function(req,res,models,app){
    if(req.body.business_id == undefined || req.body.business_id == null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    var query = "SELECT br.id,br.business_id,br.user_id,u.first_name name,br.maintainance_rating,br.cleanliness_rating,br.service_rating,br.staff_rating,br.pricing_rating,br.avg_rating,br.review,br.visible,br.createdAt,br.updatedAt FROM `Bussiness_Reviews` br,Users u where br.user_id=u.user_id and visible=1 and br.business_id="+ req.body.business_id;
    if(req.body.self){
        query= query+" and br.user_id="+req.user_id+";";
    } else {
        query= query+";";
    }
    console.log("QUERY====>"+query);
    models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(data){
        if(data){
            res.json(data);
        } else {
            res.status(400).json({error_msg: "No user deals found."});
            return;
        }
    });
};

// exports.getbusinessreview = function(req,res,models){
//     if(req.body.business_id == undefined || req.body.business_id == null){
//         res.status(400).json({error_msg:"business_id not found in body"});
//         return;
//     }
//     var where = {business_id: req.body.business_id,visible:1};
//     if(req.body.self){
//         where.user_id=req.user_id;
//     }
//     models.Bussiness_Reviews.findAll({where}).then(function(review){
//         if(review){
//             res.json(review);
//         } else {
//             res.status(400).json({error_msg:"No review submitted for this business"});
//         }
//     })
// }

//set User-Favorite-Business API
exports.setFavoriteBusiness = function(req,res,models,app){    
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not found in body"})
    }
    models.User_favorite_business.findOrCreate({where:{user_id:req.user_id,business_id:req.body.business_id}}).then(function(created){
        if(created){
            res.json({"msg":"created successfully."});
            return;
        } else {
            res.json({"msg":"already exists"})
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
         return;
    })
};

//unset User-Favorite-Business API
exports.unSetFavoriteBusiness = function(req,res,models,app){    
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not found in body"})
    }
    models.User_favorite_business.destroy({where:{user_id:req.user_id,business_id:req.body.business_id}}).then(function(){
            res.json({"msg":"Removed successfully."});
            return;
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
         return;
    })
};

//get User-Favorite-Business API
exports.getFavoriteBusiness = function(req,res,models,app){
    var query = "Select b.*, ufb.id as favorite_id from Business b, User_favorite_business ufb where b.id = ufb.business_id and ufb.user_id =" + req.user_id + ";";
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(fb){
        if(fb!=undefined && fb.length>0){
            res.json(fb);
            return;
        } else {
            res.status(400).json({error_msg:"No favorite business found for this user"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
         return;
    })
};

//add Users-Deals
exports.addUsersDeals = function(req,res,models,app){
    if(req.body.deal_id==undefined || req.body.deal_id==null){
        res.status(400).json({error_msg:"deal_id not found in body"})
        return;
    }
    models.Deals.findOne({where:{id:req.body.deal_id,is_active:1}}).then(function(deals){  
        if(deals!=undefined && deals!=null){      
            if(deals.total_number_of_deals<1){  
                res.status(400).json({error_msg:"Max limit of deals exhausted:"});
                return;
            }
            models.User_Deals.findOrCreate({where:{deal_id:req.body.deal_id,user_id:req.user_id}})
            .spread(function(user_deal,created){
                var response = {}
                if(created){                    
                    user_deal.update({quantity:1,price:deals.net_price}).then(function(){
                        models.User_Deals.sum('quantity',{where:{user_id:req.user_id}}).then(function(total_quantity){
                            response.total_quantity = total_quantity;
                            models.User_Deals.sum('price',{where:{user_id:req.user_id}}).then(function(total_price){
                                response.total_price = total_price;
                                res.json(response);
                            });
                        })
                    })                   
                } else {
                    if(deals.total_number_of_deals<=user_deal.quantity){  
                        res.status(400).json({error_msg:"Max limit of deals exhausted"});
                        return;
                    }
                    user_deal.update({quantity:user_deal.quantity+1,price:deals.net_price*(user_deal.quantity+1)}).then(function(){
                        models.User_Deals.sum('quantity',{where:{user_id:req.user_id}}).then(function(total_quantity){
                            response.total_quantity = total_quantity;
                            models.User_Deals.sum('price',{where:{user_id:req.user_id}}).then(function(total_price){
                                response.total_price = total_price;
                                res.json(response);
                            });
                        })
                    })  
                }
            })
        } else {
            res.status(400).json({error_msg:"No active deal found with this deal_id"})
            return;
        }
    });
};

//remove Users-Deals API
exports.removeUsersDeals = function(req,res,models,app){
    if(req.body.deal_id==undefined || req.body.deal_id==null){
        res.status(400).json({error_msg:"deal_id not found in body"})
        return;
    }
    models.Deals.findOne({where:{id:req.body.deal_id,is_active:1}}).then(function(deals){  
        if(deals!=undefined && deals!=null){      
            models.User_Deals.findOne({where:{deal_id:req.body.deal_id,user_id:req.user_id}})
            .then(function(user_deal){
                    console.log(user_deal);
                    if(user_deal==undefined || user_deal==null){
                        res.status(400).json({error_msg:"No deals with this deal_id found for this user"})
                        return;
                    }
                    var response = {}                
                    if(user_deal.quantity==1){  
                        models.User_Deals.destroy({where:{id:user_deal.id}}).then(function(){
                            models.User_Deals.sum('quantity',{where:{user_id:req.user_id}}).then(function(total_quantity){
                                response.total_quantity = total_quantity;
                                models.User_Deals.sum('price',{where:{user_id:req.user_id}}).then(function(total_price){
                                    response.total_price = total_price;
                                    res.json(response);
                                });
                            })
                        })
                    } else {
                        user_deal.update({quantity:user_deal.quantity-1,price:deals.net_price*(user_deal.quantity-1)}).then(function(){
                            models.User_Deals.sum('quantity',{where:{user_id:req.user_id}}).then(function(total_quantity){
                                response.total_quantity = total_quantity;
                                models.User_Deals.sum('price',{where:{user_id:req.user_id}}).then(function(total_price){
                                    response.total_price = total_price;
                                    res.json(response);
                                });
                            })
                        })  
                    }
                })                        
        } else {
            res.status(400).json({error_msg:"No active deal found with this deal_id"})
            return;
        }
    });
};

exports.resetUserAllDeals = function(req,res,models,app){
    models.User_Deals.destroy({where:{user_id:req.user_id}}).then(function(){
        res.json({"msg":"All deals deleted successfully"});
    })
}

//get Deals API
exports.getDeals = function(req,res,models,app){
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    var query = "select d.*,ud.quantity as user_quantity from Deals d left join User_Deals ud on d.id = ud.deal_id and ud.user_id="+req.user_id+" where d.is_active = 1 and d.business_id="+req.body.business_id+";"
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(result){
        res.json(result);
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
         return;
    })
};

//get User-Purchase-Deals API //Not tested
exports.getUserPurchaseDeals = function(req,res, models,app){
    var query = "SELECT udp.*,d.deal_title,d.valid_upto,d.image_url as deal_picture, b.profile_picture_url as business_picture,b.business_name,b.id as business_id, b.email_address as business_email_address, b.contact_number as business_contact_number FROM `User_Deals_Purchase` udp,Deals d, Business b where udp.deal_id=d.id and udp.user_id="+req.user_id+" and d.business_id = b.id;"
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(data){
        if(data){
            res.json(data);
        } else {
            res.status(400).json({error_msg: "No user purchase deals found."});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//apply-Discount-Coupons API //Not tested
exports.applyDiscountCoupons = function(req,res,models,app){
    if(req.body.coupon_code==undefined || req.body.coupon_code==null){
        res.status(400).json({error_msg:"coupon_code not found in body"});
        return;
    }
    models.Discount_Coupons.findOne({where:{coupon_code:req.body.coupon_code}}).then(function(data){
        if(data){
            if(data.remaining_coupon>1){
                res.json(data);
                return;
            } else{
                res.status(400).json({error_msg:"No"});
                return;
            }
        } else {
            res.json({error_msg:"Coupon not found"});
            return;
        }
        }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;    

    })
};

//set User-Deals-Purchase //Not tested
exports.setUserDealsPurchase = function(req,res,models,app){
    if(req.body.total_amount==undefined || req.body.total_amount==null){
        res.status(400).json({error_msg:"total_amount not found in body"});
        return;
    }
    var total_amount = req.body.total_amount;
    if(req.body.net_payable==undefined || req.body.net_payable==null){
        res.status(400).json({error_msg:"net_payable amount not found in body"});
        return;
    }
    var net_payable = req.body.net_payable;
    if(req.body.transaction_mode==undefined || req.body.transaction_mode==null){
        res.status(400).json({error_msg:"transaction_mode not found in body"});
        return;
    }
    if(req.body.bank_transaction_id==undefined || req.body.bank_transaction_id==null){
        res.status(400).json({error_msg:"bank_transaction_id not found in body"});
        return;
    }
    if(req.body.transaction_status==undefined || req.body.transaction_status==null){
        res.status(400).json({error_msg:"transaction_status not found in body"});
        return;
    }
    if(req.body.deals_purchased==undefined || req.body.deals_purchased==null){
        res.status(400).json({error_msg:"deals_purchased not defined in body"});
        return;
    }
    if(req.body.deals_purchased.length<1){
        res.status(400).json({error_msg:"deals_purchased array cannot be blank"});
        return;
    }
    
    if(req.body.discount_price==undefined || req.body.discount_price==null){
        var discount_price = 0;
    } else {
        var discount_price = req.body.discount_price;
    }
    if(!req.body.force){
        if((total_amount-discount_price)!=net_payable){
            console.log((total_amount-discount_price) + "!=" +  net_payable);
            res.status(400).json({error_msg:"Net payable is not equal to total_amount-discount_price"});
            return;
        } else {
            var balance = 0;
        }
    } else{
        var balance = total_amount-discount_price-net_payable;
    }
    var resp = {}
    models.Transactions.findOrCreate({where: {bank_transaction_id:req.body.bank_transaction_id}}).spread(function(transaction,created){
        if(!created){
            res.status(400).json({error_msg:"transaction already done"});
            return;
        } else {
            transaction.update({
                                amount:net_payable,
                                transaction_mode:req.body.transaction_mode,
                                coupon_code:req.body.coupon_code,
                                discount:discount_price,
                                user_id:req.user_id,
                                balance: balance,
                                transaction_status: req.body.transaction_status
                              }).then(function(){
                                resp.transaction_update = true;
                                this.createDeals(req,res,resp,models,transaction);
                              }).catch(function(err){
                                res.status(400).json({error_msg:"something went wrong, transaction failed"});
                                transaction.update({transaction_status: "PARTIAL-FAILED"});
                                return;
                            });
        }
    })
};

createDeals = function(req,res,resp,models,transaction){
    var promises_user_deals = [];
    var promises_user_deals_purchase = [];
    var deals_purchase = req.body.deals_purchased;    
    for(var j=0;j<deals_purchase.length;j++){
        console.log(deals_purchase[j]);    
        if(deals_purchase[j]==undefined || deals_purchase[j].length<0){
            res.status(400).json({error_msg:"deals_purchased array cannot be blank"});
            return;
        }
        console.log("Creating deals: " + deals_purchase[j].deal_id + " quantity: " + deals_purchase[j].quantity);
        if(deals_purchase[j].deal_id==undefined || deals_purchase[j].deal_id==null){
            res.status(400).json({error_msg:"deal_id not found in deals_purchased array"});
            return;
        }
        if(deals_purchase[j].quantity==undefined || deals_purchase[j].quantity==null){
            res.status(400).json({error_msg:"quantity not found in deals_purchased array"});
            return;
        }
        if(deals_purchase[j].price==undefined || deals_purchase[j].price==null){
            res.status(400).json({error_msg:"price not found in deals_purchased array"});
            return;
        }
        promises_user_deals.push(models.User_Deals.findOne({where:{user_id:req.user_id, deal_id:deals_purchase[j].deal_id}}));
    }
    Promise.all(promises_user_deals).then(function(user_deal){        
        var deal_id;
        if(user_deal.length>0 && user_deal[0]!=null){
            if(user_deal!=undefined){
                console.log("Quantity: " + user_deal.length);
                for(var k=0;k<user_deal.length;k++){
                    for(var i=0;i<user_deal[k].quantity;i++){
                        var deal_code = this.generateCode();
                        var deal_id = user_deal[k].deal_id;
                        console.log("Creating: " + deal_code);
                        promises_user_deals_purchase.push(models.User_Deals_Purchase.findOrCreate({where:{user_id:req.user_id,deal_id: user_deal[k].deal_id,price:user_deal[k].price,deal_code:deal_code,transaction_id: transaction.id,deal_status:"PURCHASED"}}));                        
                    }
                    promises_user_deals_purchase.push(models.User_Deals.destroy({where:{id:user_deal[k].id}}));
                }
                Promise.all(promises_user_deals_purchase).then(function(){
                    if(req.body.coupon_code) {
                        models.Discount_Coupons.findOne({where:{coupon_code: req.body.coupon_code}}).then(function(coupon){
                            coupon.update({remaining_coupon:(coupon.remaining_coupon-1)}).then(function(){
                                resp.updated = "Updated successfully";                                
                                notifications(req,res,transaction,models,deal_id);
                                res.json(resp);
                                return;
                            })
                        });
                    } else {
                        resp.updated = "Updated successfully";                        
                        notifications(req,res,transaction,models,deal_id);
                        res.json(resp); 
                    }
                });
            } else {
                res.status(400).json({error_msg:"No deals found in cart"});
                transaction.update({transaction_status: "PARTIAL-FAILED"});
                return;
            }            
        } else {
            res.status(400).json({error_msg:"No deals found in cart"});
            transaction.update({transaction_status: "PARTIAL-FAILED"});
            return;
        }
    }).catch(function(err){
        res.status(400).json({error_msg:"Something went wrong"});
        transaction.update({transaction_status: "PARTIAL-FAILED"});
        return;
    });
}

function notifications(req,res,transaction,models,deal_id){    
    models.Deals.findOne({where:{id:deal_id}}).then(function(deals){
        var message = {
            notification: {
                title: "New deal purchased",
                body: "Your deal " + deals.deal_title + " has been purchased",
            },
            android: {
                ttl: 3600 * 1000,
                notification: {              
                color: '#f45342',
                },
            },
            data: {
                "deal_id": ""+deal_id
            }
        };
        models.Business.findOne({where:{id:deals.business_id}}).then(function(business){
            message.topic=business.id +"_"+ business.business_name.replace(/\s/g,'');
            admin.messaging().send(message).then(function(response,err){
                if (response) {            
                    saveNotificationTodatabase(req,res,transaction,models,deal_id,message,business);
                    console.log("Successfully sent with response: ", response);            
                    return;
                } else {
                    console.log("Notification not sent", err);            
                }
            }).catch(function(err){
                console.log("Notification not sent", err);    
            }); 
        });
    })
}

function saveNotificationTodatabase(req,res,transaction,models,deal_id,message,business) {
    console.log("save_notifications==>");
    models.Notifications.findOrCreate({where:{sent_to:business.id, group_name:message.topic, notification_text:message.notification.body, payload:JSON.stringify(message.data),notificaiton_type:"DEALS",visible: 1}})
     .then(function(){
     }).catch(function(err){
         console.log(err);
         return;
     })
 };

generateCode = function(){
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    var string_length = 8;
    var DealCode = '';
    var charCount = 0;
    var numCount = 0;
    for (var i=0; i<string_length; i++) { 
        if((Math.floor(Math.random() * 2) == 0) && numCount < 3 || charCount >= 5) {
            var rnum = Math.floor(Math.random() * 10);
            DealCode += rnum;
            numCount += 1;
        } else {
            var rnum = Math.floor(Math.random() * chars.length);
            DealCode += chars.substring(rnum,rnum+1);
            charCount += 1;
        }
    }
    return DealCode;
};


//get Transactions AP
exports.getTransactions = function(req,res,models){
    models.Transactions.findAll({where:{user_id:req.user_id}
    }).then(function(data){
        if(data!=undefined && data.length>0){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No Transactions found for this user"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};


//@getBusiness Details API
exports.getBusinessDetails = function(req,res,models,app){
    if(req.body.business_id == undefined || req.body.business_id == null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    var query = "select b.*, IF(ufb.id is NULL, false, true) as favorite from Business b Left join User_favorite_business ufb on ufb.business_id = b.id and ufb.user_id="+req.user_id+"  where b.id ="+ req.body.business_id +" and b.is_active=1";
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT})
        .then(function(data){
        if(data){
            
            // insert
            models.Visits.findOrCreate({where:{
                user_id:req.user_id,entity_id:req.body.business_id,entity_type:'business'}})
                .spread(function(result,created){
                    if(created){
                        return result.update({count:1}).then(function(){
                            res.json(data[0]);
                        })
                    } else {
                        return result.update({count:result.count+1}).then(function(){
                            res.json(data[0]);
                        })
                    }
                })
            return;
        } else {
            res.status(400).json({error_msg:"There are no business details active."});
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//get All-Business-Appointment API
exports.getAllBusinessAppointment = function(req,res,models,app){
    var resp = [];
    models.Business_appointment.findAll({where:{user_id:req.user_id}
    }).then(function(appointments_data){
        if(appointments_data!=undefined && appointments_data.length>0){
            var promises = []
            for(var i=0; i<appointments_data.length; i++){
                resp[i] = {};
                resp[i].appointment_details = appointments_data[i];
                promises.push(models.Business.findOne({where:{id:appointments_data[i].business_id}}));
            }
            Promise.all(promises).then(function(businesses){
                for(var j=0; j<businesses.length; j++){
                    resp[j].business_detail = businesses[j];
                }
                res.json(resp);
                return;
            });
        } else {
            res.status(400).json({error_msg:"No User_id found for this user"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
};

//get Recent-Visit-Business API
exports.getRecentVisitBusiness = function(req,res,models,app){
    var query = "SELECT b.* FROM Visits v, Business b   where v.user_id="+req.user_id+" and b.id = v.entity_id ORDER BY v.updatedAt DESC;"
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(visits){
        if(visits!=undefined && visits.length>0){
            res.json(visits);
            return;
        } else {
            res.status(400).json({error_msg:"No User_id found for this user"});
            return;
        }
    })
};

//add User-Services API
exports.addUserServices = function(req,res,models,app){
    if(req.body.service_id==undefined || req.body.service_id==null){
        res.status(400).json({error_msg:"service_id not found in body"})
        return;
    }
    models.Services.findOne({where:{id:req.body.service_id}}).then(function(service){
        if(service!=undefined && service!=null){
            if(service.total_number_of_service<1){  
                res.status(400).json({error_msg:"Max limit of service exhausted:"});
                return;
            }
            models.User_Services.findOrCreate({where:{service_id:req.body.service_id,user_id:req.user_id}})
            .spread(function(user_service, created){
                var response = {}
                if(created){ 
                    user_service.update({quantity:1,price:service.price,total_duration: service.duration}).then(function(){
                        var query = "Select sum(price) as total_price, sum(total_duration) as total_duration, sum(quantity) as total_quantity from User_Services where user_id=" + req.user_id+ ";";
                        models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(data){
                            res.json(data[0]);
                        });
                    })
                } else {
                    if(service.total_number_of_service<=user_service.quantity){  
                        res.status(400).json({error_msg:"Max limit of service exhausted"});
                        return;
                    }
                    user_service.update({quantity:user_service.quantity+1,price:service.price*(user_service.quantity+1), total_duration: service.duration*(user_service.quantity+1)})
                    .then(function(){
                        var query = "Select sum(price) as total_price, sum(total_duration) as total_duration, sum(quantity) as total_quantity from User_Services where user_id=" + req.user_id+ ";";
                        models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(data){
                            res.json(data[0]);
                        });
                    })
                }
            })
        } else {
            res.status(400).json({error_msg:"No User_Services found for this user_id"});
            return;
        }
    })
};


//remove User-Services API
exports.removeUserServices = function(req,res,models,app){
    if(req.body.service_id==undefined || req.body.service_id==null){
        res.status(400).json({error_msg:"service_id not found in body"})
        return;
    }
    models.Services.findOne({where:{id:req.body.service_id}}).then(function(service){
        if(service!=undefined && service!=null){
            models.User_Services.findOne({where:{service_id:req.body.service_id,user_id:req.user_id}}).then(function(user_service){
                console.log(user_service);
                if(user_service==undefined || user_service==null){
                    res.status(400).json({error_msg:"No service with this service_id found for this service"})
                    return;
                }
                var response = {} 
                if(user_service.quantity==1){
                    models.User_Services.destroy({where:{id:user_service.id}}).then(function(){
                        var query = "Select sum(price) as total_price, sum(total_duration) as total_duration, sum(quantity) as total_quantity from User_Services where user_id=" + req.user_id+ ";";
                        models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(data){
                            res.json(data[0]);
                        });
                    })
                } else {
                    user_service.update({quantity:user_service.quantity-1,price:service.price*(user_service.quantity-1),total_duration: service.duration*(user_service.quantity-1)}).then(function(){
                        var query = "Select sum(price) as total_price, sum(total_duration) as total_duration, sum(quantity) as total_quantity from User_Services where user_id=" + req.user_id+ ";";
                        models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(data){
                            res.json(data[0]);
                        });
                    })

                }
            })
        } else {
            res.status(400).json({error_msg:"No User_Services found for this user_id"});
            return;
        }
    })
};


//reset User-All-Services API
exports.resetUserAllServices = function(req,res,models,app){    
    models.User_Services.destroy({where:{user_id:req.user_id}}).then(function(){
            res.json({"msg":"Reset successfully."});
            return;
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
         return;
    })
};


//get User-Services API
exports.getUserServices = function(req,res,models,app){
    var query = "SELECT s.*,us.quantity, concat(sc.category_name, ' (',sc.category_gender,')') as service_category_name FROM User_Services us, Services s, Service_category sc where us.user_id="+req.user_id+" and s.id = us.service_id and s.category_id = sc.id;"
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(user_service){
        if(user_service!=undefined && user_service.length>0){
            res.json(user_service);
            return;
        } else {
            res.status(400).json({error_msg:"No User_id found for this user"});
            return;
        }
    })
};


//remove Users-All-Services API
exports.removeUsersAllServices = function(req,res,models,app){
    if(req.body.service_id==undefined || req.body.service_id==null){
        res.status(400).json({error_msg:"service_id not found in body"})
    }
    models.User_Services.destroy({where:{user_id:req.user_id,service_id:req.body.service_id}}).then(function(){
            res.json({"msg":"Service Removed successfully."});
            return;
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
         return;
    })
};


//get New-Deals API
exports.getNewDeals = function(req,res,models,app){
    var query = "SELECT * FROM `Deals` where is_active = 1 ORDER BY createdAt DESC;"
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(deals){
        if(deals!=undefined && deals.length>0){
            res.json(deals);
            return;
        } else {
            res.status(400).json({error_msg:"No Deals found. "});
            return;
        }
    })
};


//get Tranding-Business API
exports.getTrendingBusiness = function(req,res,models,app){
    var query = "SELECT b.* FROM Visits v, Business b   where v.user_id="+req.user_id+" and b.id = v.entity_id and v.entity_type='BUSINESS' ORDER BY v.count DESC;"
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(visits){
        if(visits!=undefined && visits.length>0){
            res.json(visits);
            return;
        } else {
            res.status(400).json({error_msg:"No User_id found for this user"});
            return;
        }
    })
};


//get near-by-business API
exports.getnearbybusiness = function(req,res,models,app){
    if(req.body.latitude==undefined || req.body.latitude==null){
        res.status(400).json({error_msg:"latitude not found in body"})
        return;
    }
    if(req.body.longitude==undefined || req.body.longitude==null){
        res.status(400).json({error_msg:"longitude not found in body"})
        return;
    }
    var query = "SELECT "+
    "*, ( "+
    " 6371 * acos ( "+
       " cos ( radians("+req.body.latitude+") )" +
       " * cos( radians( address_lat ) ) " +
       " * cos( radians( address_long ) - radians("+req.body.longitude+") )" + 
       " + sin ( radians("+req.body.latitude+") )" +
       " * sin( radians( address_lat ) ) " +
       ") ) AS distance " +
    " FROM Business " +
    " HAVING distance < 10 " + 
    " ORDER BY distance;"
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(business){
        if(business!=undefined && business.length>0){
            res.json(business);
            return;
        } else {
            res.status(400).json({error_msg:"No near by businesses found"});
            return;
        }
    })
};

//purchase-User-Services API
exports.purchaseUserServices = function(req,res,models,app){
    console.log("Part==> Transactions");
    if(req.body.net_payable==undefined || req.body.net_payable==null){
        res.status(400).json({error_msg:"net_payable not found in body"})
        return;
    }
    // if(req.body.coupon_code==undefined || req.body.coupon_code==null){
    //     res.status(400).json({error_msg:"coupon_code not found in body"})
    //     return;
    // }
    if(req.body.transaction_status==undefined || req.body.transaction_status==null){
        res.status(400).json({error_msg:"transaction_status not found in body"})
        return;
    }
    if(req.body.bank_transaction_id==undefined || req.body.bank_transaction_id==null){
        res.status(400).json({error_msg:"bank_transaction_id not found in body"})
        return;
    }
    if(req.body.transaction_mode==undefined || req.body.transaction_mode==null){
        res.status(400).json({error_msg:"transaction_mode not found in body"})
        return;
    }
    if(req.body.total_amount==undefined || req.body.total_amount==null){
        res.status(400).json({error_msg:"total_amount not found in body"});
        return;
    }
    var booking_date_time =  req.body.date + " " + req.body.time;
    if(req.body.booked_for==undefined || req.body.booked_for==null){
        res.status(400).json({error_msg:"booked_for not found in body"})
        return;
    }
    if(req.body.name==undefined || req.body.name==null){
        res.status(400).json({error_msg:"name not found in body"})
        return;
    }
    if(req.body.email==undefined || req.body.email==null){
        res.status(400).json({error_msg:"email not found in body"})
        return;
    }
    if(req.body.phone==undefined || req.body.phone==null){
        res.status(400).json({error_msg:"phone not found in body"})
        return;
    }
    if(req.body.address==undefined || req.body.address==null){
        res.status(400).json({error_msg:"address not found in body"})
        return;
    }
    if(req.body.gender==undefined || req.body.gender==null){
        res.status(400).json({error_msg:"gender not found in body"})
        return;
    }
    if(req.body.cart_purchased==undefined || req.body.cart_purchased==null){
        res.status(400).json({error_msg:"cart_purchased not found in body"})
        return;
    }
    if(req.body.discount_price==undefined || req.body.discount_price==null){
        var discount_price = 0;
    } else {
        var discount_price = req.body.discount_price;
    }
    var net_payable = req.body.net_payable;
    var total_amount = req.body.total_amount;
    var balance = total_amount-net_payable-discount_price;
    console.log(balance);

    models.Transactions.findOrCreate({where:{bank_transaction_id:req.body.bank_transaction_id,balance:balance}}).spread(function(transaction,created){
        if(!created){
            res.status(400).json({error_msg:"transaction already done"});
            return;
        } else {
            transaction.update({
                                transaction_status: req.body.transaction_status,
                                transaction_mode:req.body.transaction_mode,
                                coupon_code: req.body.coupon_code,
                                discount:req.body.discount_price,
                                amount: req.body.net_payable
            }).then(function(){
                this.serviceBooking(req,res,models,transaction,booking_date_time);
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg:"something went wrong, transaction failed"});
                return;
            })
        }
    })
};
serviceBooking = function(req,res,models,transaction,booking_date_time){
    console.log("transaction_id"+transaction.id);
    var defaults = {
        name: req.body.name,
        email: req.body.email,
        gender : req.body.gender,
        address: req.body.address,
        booked_for : req.body.type,
        contact_number : req.body.phone,
        booking_date_time:booking_date_time,
        special_instructions:req.body.special_instructions 
    };
    models.Service_Booking.findOrCreate({where:{transaction_id:transaction.id,booked_by:req.user_id},defaults}).then(function(result){
        console.log("Result===>" + result);
        res.json(result);
        serviceBookingServices(req,res,models,result);
    })
}
serviceBookingServices = function(req,res,models,result){
    console.log("serviceBooking_id==>"+result.id);
    var cart_purchased = req.body.cart_purchased;
    var promises_cart_purchased = [];
    
    for (var j = 0; j<cart_purchased.length; j++) {
        console.log(cart_purchased[j]);
        promises_cart_purchased.push(models.Service_Booking_Services.create({service_booking_id:result.id, service_id:cart_purchased[j].cart_id, price:cart_purchased[j].cart_price, quantity:cart_purchased[j].cart_quantity}));
    }
    Promise.all(promises_cart_purchased).then(function(service_booking_service){
        //console.log(service_booking_service);
        res.json(
            { msg: "Items purchsed successfully" }
        )
    }).catch(function(err){
        res.status(400).json({error_msg:"Item purchase not successful"});
    })
}

// verify_Number API
exports.verifyNumber = function(req,res,models,app){
    if(req.body.number==undefined || req.body.number==null){
        res.status(400).json({error_msg:"number not found in body"})
        return;
    }
    models.Users.findOne({where: {user_id:req.user_id}}).then(function(user){
        var response = {};
        var otp = Math.floor(1000 + Math.random() * 9000);
        response.otp = otp
        models.Users.update({otp: otp, mobile_number: req.body.number, mobile_verified: 0},{where:{user_id:user.user_id}}).then(function(){
            res.json(response);            
            return;
        })
    });
};

exports.getAllDeals = function(req,res,models,app){
    var query = "Select d.*, b.business_name, b.address, b.avg_rating, b.address_lat, b.address_long FROM `Deals`as d, `Business`as b where d.is_active = 1 and d.business_id=b.id ORDER BY createdAt DESC";
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(deals){
        if(deals!=undefined && deals.length>0){
            res.json(deals);
            return;
        } else {
            res.status(400).json({error_msg:"No Deals found."});
            return;
        }
    })
};

exports.setUserServicesPurchase = function(req,res,models,app){
    if(req.body.total_amount==undefined || req.body.total_amount==null){
        res.status(400).json({error_msg:"total_amount not found in body"});
        return;
    }
    var total_amount = req.body.total_amount;

    if(req.body.total_quantities==undefined || req.body.total_quantities==null){
        res.status(400).json({error_msg:"total_quantities not found in body"});
        return;
    }
    if(req.body.booked_for==undefined || req.body.booked_for==null){
        res.status(400).json({error_msg:"booked_for not found in body"});
        return;
    }
    req.body.booked_for
    if(req.body.booking_details==undefined || req.body.booking_details==null){
        res.status(400).json({error_msg:"booking details not found in body"});
        return;
    }
    if(req.body.booking_details.name==undefined || req.body.booking_details.name==null){
        res.status(400).json({error_msg:"name not found in booking details"});
        return;
    }
    if(req.body.booking_details.phone==undefined || req.body.booking_details.phone==null){
        res.status(400).json({error_msg:"phone not found in booking details"});
        return;
    }
    if(req.body.booking_details.address==undefined || req.body.booking_details.address==null){
        res.status(400).json({error_msg:"address not defined in booking details"});
        return;
    }
    if(req.body.booking_details.gender==undefined || req.body.booking_details.gender==null){
        res.status(400).json({error_msg:"gender not defined in booking details"});
        return;
    }
    if(req.body.booking_date_time==undefined || req.body.booking_date_time==null){
        res.status(400).json({error_msg:"booking_date_time not defined in body"});
        return;
    }
    if(req.body.ez_transaction_id==undefined || req.body.ez_transaction_id==null){
        res.status(400).json({error_msg:"ez_transaction_id not defined in body"});
        return;
    }
    if(req.body.payu_transaction_id==undefined || req.body.payu_transaction_id==null){
        res.status(400).json({error_msg:"payu_transaction_id not defined in body"});
        return;
    }
    if(req.body.transaction_status==undefined || req.body.transaction_status==null){
        res.status(400).json({error_msg:"transaction_status not defined in body"});
        return;
    }

    if(req.body.net_payable==undefined || req.body.net_payable==null){
        res.status(400).json({error_msg:"net_payable amount not found in body"});
        return;
    }
    var net_payable = req.body.net_payable;

    if(req.body.transaction_mode==undefined || req.body.transaction_mode==null){
        res.status(400).json({error_msg:"transaction_mode not found in body"});
        return;
    }
    
    if(req.body.discount_price==undefined || req.body.discount_price==null){
        var discount_price = 0;
    } else {
        var discount_price = req.body.discount_price;
    }
    if(!req.body.force){
        if((total_amount-discount_price)!=net_payable){
            console.log((total_amount-discount_price) + "!=" +  net_payable);
            res.status(400).json({error_msg:"Net payable is not equal to total_amount-discount_price"});
            return;
        } else {
            var balance = 0;
        }
    } else{
        var balance = total_amount-discount_price-net_payable;
    }
    var resp = {}
    models.Transactions.findOrCreate({where:{bank_transaction_id:req.body.payu_transaction_id}}).spread(function(transaction,created){
        if(!created){
            res.status(400).json({error_msg:"transaction already done"});
            return;
        } else {
                transaction.update({
                                amount:net_payable,
                                balance: balance,
                                user_id:req.user_id,
                                discount:discount_price,
                                coupon_code:req.body.coupon_code,
                                transaction_mode:req.body.transaction_mode,
                                transaction_status: req.body.transaction_status,
                                }).then(function(){
                                    resp.transaction_update = true;
                                    console.log("CREATE-SERVICES CALL==>");
                                    this.createServices(req,res,resp,models,transaction);
                                }).catch(function(err){
                                    res.status(400).json({error_msg:"something went wrong, transaction failed"});
                                    transaction.update({transaction_status: "PARTIAL-FAILED"});
                                    return;
                                })
                }

    })
};

createServices = function(req,res,resp,models,transaction){
    var promises_user_services = [];
    var defaults = {
        name: req.body.booking_details.name,
        email:req.body.booking_details.email,
        booked_for:req.body.booked_for,
        gender: req.body.booking_details.gender,
        address: req.body.booking_details.address,
        total_amount: req.body.total_amount,
        contact_number: req.body.booking_details.phone,
        booking_date_time:req.body.booking_date_time,
        special_instructions:req.body.special_instruction,
        booked_by: req.user_id,
        order_status:"BOOKING_DONE"
    }
    models.Service_Booking.findOrCreate({where:{transaction_id:req.body.payu_transaction_id},defaults})
    .spread(function(service_booking, created){
        var services = req.body.services;
        console.log("SERVICES==>",services);
        //var promises_create_services = [];
        for(var i=0; i<services.length; i++){
            if(services[i]==undefined || services[i].length<0){
                models.Service_Booking.destroy({where:{id: service_booking.id}}).then(function(){
                    res.status(400).json({error_msg:"services array cannot be blank"});
                    return;
                });
            }
            console.log("create Services: " + services[i].service_id + " quantity: " + services[i].quantity + "price: " + services[i].price);
            if(services[i].service_id==undefined || services[i].service_id==null){
                models.Service_Booking.destroy({where:{id: service_booking.id}}).then(function(){
                    res.status(400).json({error_msg:"service_id not found in services array"});
                    return;
                })
            }
            if(services[i].quantity==undefined || services[i].quantity==null){
                models.Service_Booking.destroy({where:{id: service_booking.id}}).then(function(){
                    res.status(400).json({error_msg:"quantity not found in services array"});
                    return;
                });
            }
            if(services[i].price==undefined || services[i].price==null){
                models.Service_Booking.destroy({where:{id: service_booking.id}}).then(function(){
                    res.status(400).json({error_msg:"price not found in services array"});
                    return;
                });
            }
            promises_user_services.push(models.User_Services.findOne({where:{user_id:req.user_id, service_id:services[i].service_id}}));
        }
        Promise.all(promises_user_services).then(function(user_services){
            console.log("promises_user_services");
            var service_id;
            if(user_services.length>0 && user_services[0]!=null){
                if(user_services!=undefined){
                    console.log("SERVICES=>: ", user_services.length);
                    var promises_services = []
                    for(var j=0; j<user_services.length; j++){
                        promises_services.push(models.Service_Booking_Services.findOrCreate({where:{service_booking_id:service_booking.id, service_id: user_services[j].service_id,price:user_services[j].price,quantity:user_services[j].quantity}}));
                    }
                    Promise.all(promises_services).then(function(){
                        models.User_Services.destroy({where:{user_id: req.user_id}}).then(function(){
                            res.json({msg: "Services purchased successfully"})
                        });
                    })
                }
            } else {
                res.status(400).json({error_msg:"No services found in cart"});
                transaction.update({transaction_status: "PARTIAL-FAILED"});
                return;
            }
        }).catch(function(err){
            res.status(400).json({error_msg:"Something went wrong"});
            transaction.update({transaction_status: "PARTIAL-FAILED"});
            return;
        })
    }) 
}

exports.getUserPurchaseServices = function(req,res,models,app){
    models.Service_Booking.findAll({where:{booked_by: req.user_id}}).then(function(bookings){
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

exports.getUserServicesPurchaseDetails = function(req,res,models,app){
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

exports.getAppointmentById = function(req,res,models,app){
    if(req.body.appointment_id==undefined || req.body.appointment_id==null){
        res.status(400).json({error_msg:"appointment_id not defined in body"});
        return;
    }
    models.Business_appointment.findOne({where:{id:req.body.appointment_id}}).then(function(result){
        if(result!=undefined && result!=null){
            models.Business.findOne({where:{id:result.business_id}}).then(function(details){
                var response = {};
                response.appointment_detail = result;
                response.business_details  = details;
                res.json(response);  
               return;
            })
        } else {
            res.status(400).json({error_msg:"No business appointment found for this appointment_id"});            
          return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
}

//send_Application_Feedback API
exports.sendApplicationFeedback = function(req,res,models,app){
    var defaults = {        
        contact_number:req.body.contact_number,
        email_address:req.body.email_address,
        feedback:req.body.feedback
    }
    models.Application_feedback.findOrCreate({where:{user_id:req.user_id},defaults})
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



