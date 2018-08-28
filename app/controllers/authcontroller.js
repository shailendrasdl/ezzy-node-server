var exports = module.exports = {}
var jwt    = require('jsonwebtoken');
// var fetch = require("node-fetch");
// var path = require("path");
// var smsconfig = require(path.join(__dirname,'..', 'config', 'config.json'))["smssettings"];

exports.generateOtp = function(req, res,models) {
    var otp_response = {};
    var otp = Math.floor(1000 + Math.random() * 9000);
    otp_response.otp = otp;
    otp_response.mobile_number = req.body.mobile_number;
    console.log(req.body.mobile_number);
    var current_date_time = new Date();
    var queryCondition = {where: {mobile_number: req.body.mobile_number},defaults: {
        otp: otp,
        createdAt: current_date_time}              
    }
    models.Users.findOrCreate(queryCondition).spread((user,created)=>{   
        // If new user is created update create time                             
        if(created){                               
            otp_response.new_user = true;
            res.json(otp_response);            
        } else {
            if(req.body.resend && user.otp!=undefined){
                otp_response.otp = user.otp;
                otp_response.new_user = false;
                otp_response.resent = true;
                res.json(otp_response);
            } else {
                models.Users.update({otp: otp},{where:{mobile_number: user.mobile_number},returning: true,
                    plain: true}).then(function(){
                        otp_response.new_user = false;
                        res.json(otp_response);
                })
            } 
        }
    }).catch(function(error){
        console.error(queryCondition, error); // add this and check the output
        // callback && callback(null, null, error);
        res.status(400).json({error_msg: "Something went wrong!"});
    });
}


// exports.generateOtp = function(req, res,models) {
//     var otp_response = {};
//     var otp = Math.floor(1000 + Math.random() * 9000);
//     // otp_response.otp = otp;
//     otp_response.mobile_number = req.body.mobile_number;
//     console.log(req.body.mobile_number);
//     var current_date_time = new Date();
//     var queryCondition = {where: {mobile_number: req.body.mobile_number},defaults: {
//         otp: otp,
//         createdAt: current_date_time}              
//     }
//     var smsMessage = "Welcome to EZEE Salon Application! Please verify your mobile number using OTP: " + otp + ", Thank you!";
//     models.Users.findOrCreate(queryCondition).spread((user,created)=>{   
//         var otpUrl = "http://sms.hspsms.com/sendSMS?username="+ smsconfig.username +"&message=" + encodeURI(smsMessage) + "&sendername=" + smsconfig.sendersName + "&smstype=" + smsconfig.smsType + "&numbers=" + user.mobile_number + "&apikey=" + smsconfig.apiKey;
//         console.log(otpUrl);
//         // If new user is created update create time                             
//         if(created){                               
//             otp_response.new_user = true;
//             return fetch(otpUrl);     
//         } else {
//             if(req.body.resend && user.otp!=undefined){
//                 // otp_response.otp = user.otp;
//                 otp_response.new_user = false;
//                 otp_response.resent = true;
//                 return fetch(otpUrl);
//             } else {
//                 models.Users.update({otp: otp},{where:{mobile_number: user.mobile_number},returning: true,
//                     plain: true}).then(function(){
//                         otp_response.new_user = false;
//                         return fetch(otpUrl);
//                 })
//             } 
//         }
//     }).then(function(resp){
//         console.log(resp);
//         if(resp){
//             otp_response.smsresponse = resp.json();
//             res.json(otp_response);
//         } else {
//             console.log("something went wrong");
//             res.status(400).json({error_msg: "Something went wrong!"});
//         }
//     })     
//     .catch(function(error){
//         console.error(queryCondition, error); // add this and check the output
//         // callback && callback(null, null, error);
//         res.status(400).json({error_msg: "Something went wrong!"});
//     });
// }

exports.verifyOtp = function(app,req,res,models){   
    if(req.body.mobile_number==undefined){
        res.status(400).json({error_msg: "mobile_number cannot be blank"});     
        return;
    }
    if(req.body.mobile_number.length!=10){
        res.status(400).json({error_msg: "mobile_number invalid"});    
        return;
    }
    if(req.body.otp==undefined){
        res.status(400).json({error_msg: "OTP cannot blank"});
        return;
    }
    if(req.body.otp.length!=4){ 
        res.status(400).json({error_msg: "Invalid OTP"});
        return;
    }
    if(req.body.firebase_token==undefined || req.body.firebase_token==null) {
        res.status(400).json({error_msg: "Firebase token not found in body"});
        return;
    }
    models.Users.findOne({where:{mobile_number:req.body.mobile_number}}).then(user=>{
        if(user!=null){
            if(user.otp==req.body.otp){
                // OTP verified mast mobile number verfied then check for existing sessions
                models.Users.update({mobile_verified:true, firebase_token: req.body.firebase_token},{where:{mobile_number:user.mobile_number}}).then(function(){
                    console.log("Mobile number verified successfully");
                    
                    //Look for existing active sessions
                    models.Users_Sessions.findOne({where:{user_id: user.user_id,active:1}}).then(
                        function(user_session){
                            if(user_session!=null){
                                //If existing active session found return with response
                                if(decodeJwtForUserId(user_session.session_token,app)!=null){
                                    var response = {
                                        otp_verified: true,
                                        user: user,
                                        token: user_session.session_token
                                    }
                                } else {
                                    models.Users_Sessions.update({active:0},{where:{session_token:user_session.session_token}}).then(function(){
                                        create_session(app,req,res,user.user_id,models);                     
                                    });
                                }
                            } else {                                
                                create_session(app,req,res,user.user_id,models);                                                 
                            }
                        });
                }).catch(function(err){
                    res.status(400).json({error_msg: "Mobile number verified but not updated in database; Error: " + err}); 
                    console.log("Mobile number verified but not updated in database; Error: " +err);                    
                });       
            } else {
                res.json({otp_verified:false})
            }
        } else {
            res.status(400).json({error_msg: "User not found"});         
        }
    });
}

create_session = function(app,req,res,user_id,models){
    const payload = {
        user_id: user_id 
    };
    var token = jwt.sign(payload, app.get('superSecret'), {
        expiresIn: 60*60*24*365 // expires in 24*365 hours
    });    
    var defaults = {
        session_token: token,    
        device_id:req.headers['deviceid'],
        login_source: req.headers['source'],        
    };
    if(req.headers['current_screen']!=undefined){
        defaults.current_screen = req.headers['current_screen']
    }
    models.Users_Sessions.findOrCreate({where:{user_id:user_id,device_id:req.headers['deviceid'],active:1},defaults}).spread((session,created)=>{
        if(created){
            console.log("New session created");
            var response = {               
                token: session.session_token
            }
            res.json(response);
        } else {
            console.log("found a newer session which was created on: " + session.createdAt);
            var response = {               
                token: session.session_token
            }
            res.json(response);
        }
    }).catch(function(error){
        console.error(error); // add this and check the output
        // callback && callback(null, null, error);
        res.status(400).json({error_msg: "Something went wrong while creating session!"}); 
    });
}


exports.createAccount = function(app,req,res,models){
    if(req.headers['token']==undefined){
        res.status(400).json({error_msg: "token not found in request header"});        
        return;
    }
    var decoded = decodeJwtForUserId(req.headers['auth_token'],app);
    jwt.verify(req.headers['token'],app.get('superSecret'),function(err,decoded){
        if(err){
            console.log("Token expired");
            return null;            
        } else {
            var data = {};
            if(req.body.full_name!=undefined || req.body.full_name!=""){
                if(req.body.full_name.split(' ').length>0){
                    var a = req.body.full_name.lastIndexOf(' '); // last occurence of space
                    var first_name = req.body.full_name.substring(0, a); // Paul Steve
                    var last_name = req.body.full_name.substring(a+1); // Panakkal
                    data.first_name = first_name;
                    data.last_name = last_name;
                } else {
                    data.first_name = req.body.full_name;
                }
            }

            if(req.body.email!=undefined && req.body.email!="" && req.body.email.length>3){
                console.log(req.body.email);                
                if(!validateEmail(req.body.email)){
                    res.status(400).json({error_msg: "Invalid Email"});
                    return;
                } else {
                    data.email_address = req.body.email;
                }
            }

            if(req.body.dob!=undefined || req.body.email!=""){
                data.date_of_birth = req.body.dob;
            }

            if(req.body.gender!=undefined || req.body.gender!=""){
                data.gender = req.body.gender;
            }

            if(req.body.google_token!=undefined || req.body.google_token!=""){
                data.google_token = req.body.google_token;
            }

            if(req.body.facebook_token!=undefined || req.body.facebook_token!=""){
                data.facebook_token = req.body.facebook_token;
            }

            if(req.body.twitter_token!=undefined || req.body.twitter_token!=""){
                data.twitter_token = req.body.twitter_token;
            }
            
            models.Users.update(data,{where:{user_id:decoded.user_id},returning: true,
                plain: true}).then(function(user){
                    console.log(user);
                    res.json({msg:"User updated successfully!"});
            });
            }
    });
        
}

var validateEmail = function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
}

exports.verifyToken = function(app,req,res,models){
    if(req.headers['token']==undefined){
        res.status(400).json({error_msg: "token not found in request header"});        
        return;
    }
    if(req.body.firebase_token==undefined || req.body.firebase_token==null){
        res.status(400).json({error_msg: "firebase token not found in request body"});        
        return;
    }
    if(decodeJwtForUserId(req.headers['token'],app)==null){
        console.log("Token expired, regenerate token");
        regenerateToken(req,res,app,models,req.headers['token']);
    } else {
        var decoded = decodeJwtForUserId(req.headers['token'],app);
        modesl.Users.update({firebase_token: req.body.firebase_token}, {where:{user_id: decoded.user_id}})
        res.json({"token": req.header['token']})
    }
}

var regenerateToken = function(req,res,app,models,token){
    models.Users_Sessions.findOne({where:{session_token:token}}).then(function(session){
        if(session){
            models.Users_Sessions.update({active:0}, {where: {session_token: session.id}}).then(function(){
                create_session(app,req,res,session.user_id,models);
            });
        } else {
            res.status(400).json({error_msg: "token not found in existing database"});        
        }
    })
}

exports.updateUserLocation = function(app,req,res,models){
    if(req.headers['token']==undefined){
        res.status(400).json({error_msg: "token not found in request header"});        
        return;
    }    
    console.log(decodeJwtForUserId(req.headers['token'],app));
    if(decodeJwtForUserId(req.headers['token'],app)!=null){
        models.Users_Sessions.update({last_known_lat: req.body.lat, last_known_long: req.body.long},{where:{session_token:req.headers['token']}}).then(function(){
            res.json({"msg":"updated successfully"});
        });
    } else {
        res.status(400).json({error_msg: "token expired"});        
        return;
    }
}

var decodeJwtForUserId = function(token,app){
    jwt.verify(token,app.get('superSecret'),function(err,decoded){
        if(err){
            console.log("Token expired" + err);
            return null;            
        } else {
            return decoded;
        }
    });
}