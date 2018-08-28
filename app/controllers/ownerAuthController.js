var exports = module.exports = {}
var jwt    = require('jsonwebtoken');
var bCrypt = require('bcrypt-nodejs');


exports.createSession = function(app,req,done,employee,business,models){
    var current_date_time = new Date();
    const payload = {
        employee_id: employee.id 
    };
    var token = jwt.sign(payload, app.get('superSecret'), {
        expiresIn: "365d" // expires in 24*365 hours
    });
    var expiry = new Date();
    expiry.setHours(expiry.getHours() + 60*60*24);
    var defaults = {
        session_token: token,        
        session_created_on: current_date_time,
        updatedAt: current_date_time,
        device_id:req.headers['deviceid'],
        login_source: req.headers['source'],
        expiry_on: expiry,
        active: 1
    };
    if(req.headers['current_screen']!=undefined){
        defaults.current_screen = req.headers['current_screen']
    }
    models.Employee_Sessions.findOrCreate({where:{employee_id:employee.id, device_id:req.headers['deviceid'], active:1},defaults}).spread((session,created)=>{
        if(created){
            console.log("New session created");
            employee.update({session_token: token, firebase_token: req.body.fb_token},{returning:true, plain: true}).then(function(employee_updated){
                var response = {                            
                    user: employee_updated,
                    business: business                                         
                }                            
                done(null, response);
            })
        } else {
            console.log("Existing session found");
            jwt.verify(session.session_token,app.get('superSecret'),function(err,decoded){
                if(err){
                    console.log("Token expired, generating new token");
                    models.Employee_Sessions.update({
                        session_token: token,
                        updatedAt: current_date_time,
                        expiry_on: expiry
                    },{where: {employee_id:employee.id}}).then(function(){
                        employee.update({session_token: token, firebase_token: req.body.fb_token},{returning:true, plain: true}).then(function(employee_updated){
                            var response = {                            
                                user: employee_updated,
                                business: business                                         
                            }                            
                            done(null, response);
                        })
                    }).catch(function(error){
                        console.log("Error sending response: " + error);
                        // res.status(400).json({error_msg: "Error sending response: " + error}); 
                        done(error)
                    });
                } else {                    
                    employee.update({session_token: session.session_token, firebase_token: req.body.fb_token},{returning:true, plain: true}).then(function(employee_updated){
                        var response = {                            
                            user: employee_updated,
                            business: business                                         
                        }                                                        
                        done(null, response);
                    });                    
                    // res.json(response);
                }
            });
        }
    }).catch(function(error){
        console.error(error); // add this and check the output
        // callback && callback(null, null, error);
        done(error)
        // res.status(400).json({error_msg: "Something went wrong while creating session!"}); 
    });
}

// verifyOtp API
exports.verifyOtp = function(req,res,models,app){
    console.log(req.body.mobile_number)
    if(req.body.mobile_number==undefined || req.body.mobile_number==null){
        res.status(400).json({error_msg:"mobile_number cannot be blank"});
        return;
    }
    if(req.body.mobile_number.length!=10){
        res.status(400).json({error_msg: "mobile_number invalid"});    
        return;
    }
    if(req.body.otp==undefined || req.body.otp==null){
        res.status(400).json({error_msg: "OTP cannot blank"});
        return;
    }
    if(req.body.otp.length!=4){ 
        res.status(400).json({error_msg: "Invalid OTP"});
        return;
    }
    models.Employee.findOne({where:{mobile_number:req.body.mobile_number}}).then(function(employee){
        if(employee!=null){
            if(employee.otp==req.body.otp){

                var response = {
                    otp_verified: true,
                    employee: employee,
                }
                models.Employee.update({mobile_verified:true, otp: ''},{where:{mobile_number:employee.mobile_number}})
                .then(function(){
                    console.log("Mobile number verified successfully");
                    res.json({employee: employee});
                }).catch(function(err){
                    res.status(400).json({error_msg: "Mobile number verified but not updated in database; Error: " + err}); 
                    console.log("Mobile number verified but not updated in database; Error: " +err);                    
                }); 

            } else {
                res.json({otp_verified:false})
            }
        } else {
            res.status(400).json({error_msg: "Employee not found"});         
        }
    });
}

//@logout API
exports.logout = function(req,res,models,app){
    var token = req.headers['token'];
    models.Employee_Sessions.update({active:0},{ where:{session_token:token}
    }).then(function(err){ 
        res.json({"msg":"Logout successfull."});   
                                
    }).catch(function(err){
        console.log(err);
        res.status(400).json({error_msg: "Something went wrong"});
        return;
    })
}    
