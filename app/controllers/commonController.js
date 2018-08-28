var exports = module.exports = {}
var jwt    = require('jsonwebtoken');
var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');

//@Country Api
exports.getCountry = function(req,res,models,app){
    models.Country_master.findAll()
        .then(function(data){
            if(data!= undefined && data.length>0){
                console.log("DATA===="+data);
                res.json(data);
                return;
            } else{
                res.status(400).json({error_msg:"No country found"});
                return;
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
    })
};

exports.getCountryById = function(req,res,models,app){
    if(req.body.country_id==undefined || req.body.country_id==null){
        console.log("ID==="+req.body.country_id);
        res.status(400).json({error_msg:"Country_id not found in body"});
        return;
    }
    models.Country_master.findOne({where:{id:req.body.country_id},
        returning:true,
        plain:true})
    .then(function(data){
        if(data){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No country found with this id"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//@States Api
exports.getStates = function(req,res,models,app){
    models.State_master.findAll()
        .then(function(data){
            if(data!= undefined && data.length>0){
                res.json(data);
                return;
            } else {
                res.status(400).json({error_msg:"No states found"});
                return;
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
    })
};

exports.getStateById = function(req,res,models,app){
    if(req.body.state_id==undefined || req.body.state_id==null){
        res.status(400).json({error_msg:"state_id not found in body"});
        return;
    }
    models.State_master.findOne({where:{id:req.body.state_id}, returning: true, plain: true})
        .then(function(data){
            if(data){
                res.json(data);
                return;
            } else {
                res.status(400).json({error_msg:"No state found with this id"});
                return;
            }
        }).catch(function(err){
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

exports.getstatebycountryid = function(req,res,models,app){
    if(req.body.country_id==undefined || req.body.country_id==null){
        res.status(400).json({error_msg:"Country_id not found in body"});
        return;
    }

    models.State_master.findAll({where:{country_id:req.body.country_id},
        returning: true
    }).then(function(data){
        if(data!= undefined && data.length>0){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No state found for this country_id"});
            return;
        }
    }).catch(function(err){
        res.status(400).json({error_msg: "country id not found."});
        return;
    })
};


//@City Api
exports.getCities = function(req,res,models,app){
    models.City_master.findAll()
        .then(function(data){
            if(data!= undefined && data.length>0){
                res.json(data);
                return;
            } else {
                res.status(400).json({error_msg:"No cities found"});
                return;
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
    })
};


exports.getCityById = function(req,res,models,app){
    if(req.body.city_id==undefined || req.body.city_id==null){
        res.status(400).json({error_msg:"City_id not found in body"});
        return;
    }
    models.City_master.findOne({where:{id:req.body.city_id},returning:true,plain:true})
        .then(function(data){
            if(data){
                res.json(data);
                return;
            } else {
                res.status(400).json({error_msg:"No city found with this id"});
                return;
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
    })
};


exports.getCityByState = function(req,res,models,app){
    if(req.body.state_id==undefined || req.body.state_id==null){
        res.status(400).json({error_msg:"state id not found in body"});
        return;
    }
    models.City_master.findAll({where:{state_id:req.body.state_id},
        returning:true
    }).then(function(data){
        if(data!= undefined && data.length>0){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No city found for this state id"});
            return;
        }
    }).catch(function(err){
        res.status(400).json({error_msg: "state id not found"})
        return;
    })
};

//@serviceCategory API
exports.AllServicesCategory = function(req,res,models,app){
    models.Service_category.findAll()
        .then(function(data){
            if(data && data.length>0){
                res.json(data);
                return;
            } else {
                res.status(400).json({error_msg:"There are no service category yet"});
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
    })
};


exports.serviceCategoryById = function(req,res,models,app){
    if(req.body.category_id==undefined || req.body.category_id==null){
        res.status(400).json({error_msg:"category_id not found in body"});
        return;
    }
    models.Service_category.findOne({where:{id:req.body.category_id},
        returning:true,plain:true})
        .then(function(data){
            if(data){
                res.json(data);
                return;
            } else {
                res.status(400).json({error_msg:"There are no service category with this id"});
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
    })
};

//@Services Api
exports.getAllServices = function(req,res,models,app){
    models.Services.findAll()
        .then(function(data){
            if(data && data.length > 0){
                res.json(data);
                return;
            } else {
                res.status(400).json({error_msg:"There are no services yet"});
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
    })
};


exports.getServicesByid = function(req,res,models,app){
    if(req.body.service_id==undefined || req.body.service_id==null){
        res.status(400).json({error_msg:"service_id not found in body"});
        return;
    }
    models.Services.findOne({where:{id:req.body.service_id},
        returning:true,plain:true})
        .then(function(data){
            if(data){
                res.json(data);
                return;
            } else {
                res.status(400).json({error_msg:"No services found for this service_id"});
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
    })
};


exports.getServicesbyCategoryId = function(req,res,models,app){
    if(req.body.category_id==undefined || req.body.category_id==null){
        res.status(400).json({error_msg:"category_id not found in body"});
        return;
    }
    models.Services.findAll({where:{category_id:req.body.category_id},
        returning:true})
        .then(function(data){
            if(data && data.length>0){
                res.json(data);
                return;
            } else {
                res.status(400).json({error_msg:"No services found for this category_id"});
                return;
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
    })
};


//@Get_All_Amenities API
exports.getAllAmenities = function(req,res,models,app){
    models.Amenities_master.findAll({order: [['name', 'ASC']]})
        .then(function(data){
            if(data!= undefined && data.length>0){
                res.json(data);
                return;
            } else{
                res.status(400).json({error_msg:"No amenities found"});
                return;
            }
        }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

exports.getCategoryByGender = function(req,res,models,app){
    if(req.body.gender==undefined ||  req.body.gender==null){
        res.status(400).json({error_msg:"gender not found in body"});
        return;
    }
    var gender = req.body.gender.toUpperCase();
    
    console.log(gender);
    if(!(gender=="M" || gender=="F")){
        res.status(400).json({error_msg:"Gender must be M or F"});
        return;
    }

    models.Service_category.findAll({where:{category_gender: gender}})
        .then(function(gender){        
            if(gender){
                res.json(gender);
                return;
            } else {
                res.status(400).json({error_msg:"There are no gender found"});
                return;
            }
        }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//@getAllActiveBusiness (is_active Business) API
exports.getAllActiveBusiness = function(req,res,models,app){
    models.Business.findAll({where:{is_active: 1}}).then(function(data){
        if(data && data.length>0){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"there are no active business found"});
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};




//@get_All_City_Areas
exports.getAllCityAreas = function(req,res,models,app){
    if(req.body.city_id == undefined || req.body.city_id == null){
        res.status(400).json({error_msg:"city_id not found in body"});
        return;
    }
    models.City_areas.findAll({where:{city_id:req.body.city_id},returning: true
    }).then(function(data){
        if(data!= undefined && data.length>0){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No city areas found for this city"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
         return;
    })
};

exports.addAppFeedback = function(req,res,models,app){
    if(req.body.added_by == undefined || req.body.added_by == null){
        res.status(400).json({error_msg:"added_by not found in body"});
        return;
    }
    if(req.body.feedback == undefined || req.body.feedback == null){
        res.status(400).json({error_msg:"feedback not found in body"});
        return;
    }
    if(req.body.feedback == undefined || req.body.feedback == null){
        res.status(400).json({error_msg:"feedback not found in body"});
        return;
    }
    if(req.headers['token']==undefined || req.headers['token']==null){
        res.status(400).json({error_msg:"token must be present in header to enter feedback"});
        return;
    }
    modes.Feedback.create({})
    
}

//get_Media_Type API
exports.getMediaType = function(req,res,models,app){
    models.Media_type.findAll()
        .then(function(data){
            if(data && data.length > 0){
                res.json(data);
                return;
            } else {
                res.status(400).json({error_msg:"There are no media found"});
            }
        }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;s
    })
};

//add App-Feedbac API
exports.addAppFeedback = function(req,res,models,app){    
    if(req.body.feedback==undefined || req.body.feedback==null){
        res.status(400).json({error_msg:"feedback not found in body"});
        return;
    }
    var params = {
        feedback: req.body.feedback,
    }
    if(req.body.contact_number!=undefined && req.body.contact_number!=null){
        params.contact_number=req.body.contact_number;
    }
    if(req.body.email_address!=undefined && req.body.email_address!=null){
        params.email_address=req.body.email_address;
    }
    if(req.body.preferred_contact_mode!=undefined && req.body.preferred_contact_mode!=null){
        params.preferred_contact_mode=req.body.preferred_contact_mode;
    }
    var where = {};
    if(req.body.user_id!=undefined && req.body.user_id!=null){
        models.Users.findOne({where:{user_id:req.body.user_id}}).then(function(user){
            if(user==null){
                res.status(400).json({error_msg:"No user found for this user_id"});
            } else {
                params.user_id = req.body.user_id;
                where.user_id = req.body.user_id;
                checkEmployee(models,req,res,params,where);           
            }
        })   
    } else {
        checkEmployee(models,req,res,params,where);
    }
};

checkEmployee = function(models,req,res,params,where){
    if(req.body.employee_id!=undefined && req.body.employee_id!=null) {
        models.Employee.findOne({where:{id:req.body.employee_id}}).then(function(employee){
            if(employee){
                params.employee_id = req.body.employee_id;                
                where.employee_id = req.body.employee_id;
                addFeedback(models,req,res,params,where);
            } else{
                res.status(400).json({error_msg:"No employee found for this employee_id"});
            }
        })
    } else {
        addFeedback(models,req,res,params,where);
    }     
}

addFeedback = function(models,req,res,params,where){
    var finalParams = {}
    if(where.user_id!=undefined || where.employee_id!=undefined){            
        finalParams.where = where;
        finalParams.defaults = params;
        console.log(finalParams);
        models.Application_feedback.findOrCreate(finalParams)
        .spread(function(result,created){
            console.log(created);
            if(created){
                res.json({"msg":"feedback created successfully where where"});
                return;
            } else {
                res.json({"msg":"feedback already exists"})
            }
        })
    } else {
        console.log(params);
        models.Application_feedback.create(params)
        .then(function(){            
            res.json({"msg":"feedback created successfully"});                
        }).catch(function(err){
            res.status(400).json({error_msg:"Something went wrong"});
        })
    }
}

//get_Business-Hours API
exports.getBusinessHours = function(req,res,models,app){
    if(req.body.business_id == undefined || req.body.business_id == null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    if(req.body.day != undefined || req.body.day != null){    
        var days_of_week = ["1","2","3","4","5","6","7"];
        if(days_of_week.indexOf(req.body.day)<0){
            res.status(400).json({error_msg:"Selected day must be between [1-7], where 1 is Sunday"});
            return;
        } 
    }
    models.Business.findOne({where:{id:req.body.business_id}}).then(function(business){
        if(business){
            if(req.body.day!=undefined && req.body.day!=null){
                models.Business_hours.findOne({where:{day:req.body.day,business_id:business.id}}).then(function(data){
                    if(data){
                        res.json(data);
                        return;
                    } else{
                        console.log(err);
                        res.status(400).json({error_msg: "Business hours not set for this date"});
                        return;
                    }
                }).catch(function(err){
                    console.log(err);
                    res.status(400).json({error_msg: "Something want wrong"});
                    return;
                })
            } else{
                models.Business_hours.findAll({order:[['day', 'ASC']],where:{business_id:business.id}}).then(function(hours){
                    if(hours!=undefined && hours.length>0){
                        res.json(hours)
                    } else {
                        res.status(400).json({error_msg: "Business hours not set for this business"});
                        return;
                    }
                });
            }
        }else {
            res.status(400).json({error_msg:"No business_id found"});
            return;
        }
    })
};
//get_Business-Amenities API
exports.getBusinessAmenities = function(req,res,models,app){
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    models.Business_amenities.findOne({where:{business_id:req.body.business_id}}).then(function(business){
        if(business){
            var query = "Select * from `Amenities_master` a where id in (select b.amenity_id from `Business_amenities` b where b.business_id=" + business.business_id +")";
            models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT})
            .then(function(data){
                if(data){
                    res.json(data);
                } else {
                    res.json({error_msg: "No Amenities found for this business"});
                return;
                }
            })
        } else {
            res.json({error_msg:"No amenites found for this business"});
            return;
        }
    })
};

exports.getBusinessCategoryAndServices = function(req,res,models,app){    
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }        
    models.Business_Service.findAll({where:{business_id:req.body.business_id}}).then(function(business_services){
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
                                    cat_ser.push(services[l]);
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
};

//get_Business-Media API
exports.getBusinessMedia = function(req,res,models,app){
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }

    models.Business_media.findAll({where:{business_id:req.body.business_id},returning: true
    }).then(function(data){
        if(data!=undefined && data.length>0){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No media found for this business"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
         return;
    })
};

//delete-business_media API
exports.deletebusinessmedia = function(req,res,models,app){
    if(req.body.media_id==undefined || req.body.media_id==null){
        res.status(400).json({error_msg:"media_id not found in body"});
        return;
    }
    models.Business_media.destroy({where:{id:req.body.media_id}}).then(function(destroy){
        if(destroy){
            res.json({"msg":"business media Deleted successfully"});
            return;
            } else {
                res.status(400).json({error_msg:"media_id not found for this business_media."});
            }
        }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//get Deals API
exports.getDeals = function(req,res,models,app){
    if(req.body.business_id==undefined || req.body.business_id==null){
        res.status(400).json({error_msg:"business_id not found in body"});
        return;
    }
    models.Deals.findAll({where:{business_id:req.body.business_id},returning: true
    }).then(function(deals){
        if(deals!=undefined && deals.length>0){
            res.json(deals);
            return;
        } else {
            res.status(400).json({error_msg:"No deals found for this business"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
         return;
    })
};

// get Deals-Terms-Of-Use API
exports.getDealsTermsOfUse = function(req,res,models,app){
    if(req.body.deal_id==undefined || req.body.deal_id==null){
        res.status(400).json({error_msg:"deal_id not found in body"});
        return;
    }
    var query = "Select toum.*,tou.deal_id as deal_id from `Deals_terms_of_use` tou, `Deals_terms_of_uses_master` toum where tou.`deal_terms_of_use_master_id` = toum.`id` and tou.`deal_id` =" + req.body.deal_id+ ";";
    models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT
    }).then(function(data){
        if(data!=undefined && data.length>0){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No deals terms of use found."});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
         return;
    })
};

exports.getalldealstermsofuse = function(req,res,models,app){    
    models.Deals_terms_of_uses_master.findAll().then(function(data){
        if(data!=undefined && data.length>0){
            res.json(data);
            return;
        } else {
            res.status(400).json({error_msg:"No deals terms of use found."});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
         return;
    })
};

//redeemed-Deals API
exports.redeemDeals = function(req,res,models,app){
    if(req.body.deal_code==undefined || req.body.deal_code==null){
        res.status(400).json({error_msg:"deal_code not found in body"});
        return;
    }
    var query = "Select udp.deal_id as deal_id, udp.transaction_id as transaction_id, udp.deal_status as deal_status, udp.createdAt as purchase_date, d.deal_title as deal_title from User_Deals_Purchase udp, Deals d, Business b where udp.`deal_id` = d.`id` and d.`business_id` = b.`id` and udp.`deal_code` ='" + req.body.deal_code +"';";
    models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(dealcode){
        console.log(dealcode[0]);
        if(dealcode[0]==undefined || dealcode[0]==null){
            res.status(400).json({error_msg:"deal_code not valid"});
            return;
        }
        console.log("deal_status==>"+dealcode[0].deal_status);
        if(dealcode[0].deal_status=="REDEEMED"){
            res.status(400).json({error_msg:"Deal already Redeemed"});
            return;
        } else if(dealcode[0].deal_status=="CANCELLED"){
            res.status(400).json({error_msg:"Cannot redeem cancelled deal"});
            return;
        } else {
            models.User_Deals_Purchase.update({deal_status:'REDEEMED'},
                {where:{deal_code:req.body.deal_code},returning:true,plain:true})
                .then(function(){
                    res.json(dealcode[0]);
            })   
        }
    })
};


//canceled-Deals API
exports.cancelDeal = function(req,res,models,app){
    if(req.body.deal_code==undefined || req.body.deal_code==null){
        res.status(400).json({error_msg:"deal_code not found in body"});
        return;
    }
    models.User_Deals_Purchase.findOne({where:{deal_code:req.body.deal_code}}).then(function(dealcode){
        if(dealcode==undefined || dealcode==null){
            res.status(400).json({error_msg:"deal_code not valid"});
            return;
        }
        if(dealcode.deal_status=="REDEEMED"){
            res.status(400).json({error_msg:"Deal already Redeemed, cannot cancel"});
            return;
        } else if(dealcode.deal_status=="CANCELLED"){
            res.status(400).json({error_msg:"Deal already cancelled"});
            return;
        } else{
            models.User_Deals_Purchase.update({deal_status:'CANCELLED'},
                {where:{deal_code:req.body.deal_code},returning:true,plain:true})
                .then(function(){
                    res.json({"msg":"Deal Cancelled Successfully"
                });
            })   
        }
    })
};

exports.getSearchKeywords = function(req,res,models,app){
    var query = [];
    query[0] = "Select deal_title as element_name, id as element_id, 'Deals' as element_category from Deals where is_active=1";
    query[1] = "Select business_name as element_name, id as element_id, 'Business' as element_category from Business where is_active=1";
    query[2] = "Select name as element_name, id as element_id, 'Services' as element_category from Services";
    query[3] = "Select area_name as element_name, id as element_id, 'City' as element_category from City_areas";
    var promises = [];

    for(var i = 0;i<query.length ; i++ ){
        promises.push(models.sequelize.query(query[i],{type: models.sequelize.QueryTypes.SELECT}))
    }
    var response = {};
    Promise.all(promises).then(function(data){
        if(data!=undefined && data.length>0){
            response = data[0].concat(data[1]).concat(data[2]).concat(data[3]);
            for(var j=0; j<response.length;j++){
                response[j].id=j+1;
            }
            console.log(response);
            res.json(response);
            return;
        } else {}
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
        })
};

//get Deals-Details API
exports.getDealsDetails = function(req,res,models,app){ 
    models.Deals.findOne({where:{id:req.body.deal_id}}).then(function(deal){
    if(deal!=undefined && deal!=null){
        res.json(deal);
        return;
    } else {
        res.status(400).json({error_msg:"No deals found for this deal_id."});
        return;
    }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

exports.notifications = function(req,res,models,admin){
        // var fcm = new FCM("AIzaSyB-ELDh8rLx_JQGKruLvTj7eLNhivTRh18");
        var data=req.body;
        var message="Hello! you got this notification.";
        var title="ezzy server Notification";
        var token="fYg-ah9M4so:APA91bFoOZ2qYw4-s-pYg1Os0xW47aFKDGRmYrpk5s-jjLCKojqBJGRhmYnaRUso-U-pwP31q3-UrOBqCTNQSkleeVaMMa-gLMEnK0UmB41xe33CHYyb4N5E3BDmH0KYqHGix5XAObZz";
        var message = { 
            token: token         
            // data: data //payload you want to send with your notification
        };
        
        admin.messaging().send(message).then(function(response,err){
            if (response) {
                console.log("Successfully sent with response: ", response);
                res.json({success:true, message: "Successfully sent"});
                return;
            } else {
                console.log("Notification not sent", err);
                res.json({success:false, message: "Notification not sent"});
            }
        }).catch(function(err){
            console.log("Notification not sent", err);
            res.json({success:false, message: "Notification not sent"});
        });        
};

generatePassword = function() {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$ABCDEFGHIJKLMNOP1234567890";
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

//forgot-Password API
exports.forgotPassword = function(req,res,models,app){
    if(req.body.email_address==undefined || req.body.email_address==null){
        res.status(400).json({error_msg: "No Email Address provided"});
        return;
    }
    models.Employee.findOne({where:{email_address: req.body.email_address}}).then(function(employee){
        if(employee==undefined || employee == null){
            res.status(400).json({error_msg: "No user found for provided Email Address"});
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
                subject: "Your new password",                
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
                    res.json({ message:"Thank you! An email has been sent to "+employee.email_address+". Please check your inbox."});
                    return;
                }
            });

        })                
    })
};

//get_all_Business_Type API
exports.getallBusinessType = function(req,res,models,app){
    models.Business_type.findAll().then(function(data){
            if(data!= undefined && data.length>0){
                res.json(data);
                return;
            } else{
                res.status(400).json({error_msg:"No business_type found"});
                return;
            }
        }).catch(function(err){
            console.log(err);
            res.status(400).json({error_msg: "Something want wrong"});
            return;
    })
};


//get_all_Users API
exports.getallUsers = function(req,res,models,app){
    models.Users.findAll().then(function(data){
        if(data!= undefined && data.length>0){
            res.json(data);
            return;
        } else{
            res.status(400).json({error_msg:"No users found"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};

//get_All_Roles API
exports.getAllRoles = function(req,res,models,app){
    models.Roles_master.findAll().then(function(data){
        if(data!= undefined && data.length>0){
            res.json(data);
            return;
        } else{
            res.status(400).json({error_msg:"No users found"});
            return;
        }
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something want wrong"});
        return;
    })
};


exports.encodeHash = function(req,res){
    if(req.body.inpString==undefined || req.body.inpString==null){
        res.status(400).json({error_msg:"No input string found in body"})
        return;
    }
    var sha512 = require('js-sha512');
    var stringToEncode = req.body.inpString;
    var hash = sha512(stringToEncode);
    res.json({hash: hash});
}