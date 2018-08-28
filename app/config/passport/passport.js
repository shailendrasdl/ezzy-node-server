var ownerAuthController = require('../../controllers/ownerAuthController');
var bCrypt = require('bcrypt-nodejs');
var jwt    = require('jsonwebtoken');
 
module.exports = function(passport, models, app) {
    var Models = models;
    var LocalStrategy = require('passport-local').Strategy;

    // Serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        Models.Employee.find({where: {id: id}}).success(function(user){
        done(null, user);
        }).error(function(err){
        done(err, null);
        });
    });

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email', 
            passwordField: 'email',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            var password = Math.random()                        // Generate random number, eg: 0.123456
                               .toString(36)                    // Convert  to base-36 : "0.4fzyo82mvyr"
                               .slice(-8);                      // Cut off last 8 characters : "yo82mvyr"
            var query = "Select * from Employee where email_address='" + email + "' or mobile_number='" + req.body.mobile +"';";
            Models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT}).then(function(user) {
                if (user.length>0) {
                    return done("User already exists");
                } else {
                    // var userPassword = generateHash(password);
                    var data =
                        {
                            email_address: email,
                            password: password,
                            first_name: req.body.name,                    
                            mobile_number: req.body.mobile,
                            city_id: req.body.city_id,
                            postal_code: req.body.pin_code,
                            business_type: req.body.business_type_id,
                            referred_by: req.body.referred_by,
                            role_id: 1,
                            active: 0
                        };
                Models.Employee.create(data).then(function(newUser, created) {
                    var business_data = {
                        business_name: req.body.business_name,
                        owner_id: newUser.id,
                        created_by: newUser.id, 
                        is_active: 0,
                    }
                        Models.Business.create(business_data).then(function(newBusines,created){
                            if (!newUser) {
                                return done(null, false);
                            }
                            if (newUser) {
                                //sendOTP 
                                var response = {};
                                var otp = Math.floor(1000 + Math.random() * 9000);
                                response.otp = otp;
                                Models.Employee.update({otp: otp},{where: {id: newUser.id}}).then(function(){
                                    return done(null, response);
                                })
                            }
                        })                            
                    });
                }
            });
        }
    ));
    

    passport.use('local-login',new LocalStrategy(
        { 
            usernameField: 'email', 
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req,username,password,done) {                       
            Models.Employee.findOne({ where: { email_address: username }}).then(function(employee) {                
                if (!employee) {                
                    console.log('Unknown user');
                    done('Unknown user');
                }

                if (!bCrypt.compareSync(password,employee.password)) { 
                    console.log("Checking username: " + username + " & password: " + employee.password + " Unencrypted: " + password);
                    console.log('Invalid password');               
                    done('Invalid password');
                } 
                else if(employee.active == 0){
                    console.log("employee not active");
                    done("employee not active");
                }
                else{
                    Models.Business.findOne({where:{owner_id:employee.id}}).then(function(business){            
                    console.log("Login success, welcome " + employee.first_name);
                    ownerAuthController.createSession(app,req,done,employee,business,Models);
                })
            }
            }).catch(function(err){
                console.log("Error occured");
                console.log(err);
                done(err);
            });
        }
      ));

      passport.use('admin-login',new LocalStrategy(
        { 
            usernameField: 'username', 
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req,username,password,done) {            
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }          
            Models.Admin.findOne({ where: { [Models.sequelize.Op.or] : [{email_address: username}, {username: [username]}]}}).then(function(admin) {
            console.log("Checking username: " + username + " & password: " + admin.password + " Unencrypted: " + password);
            if (!admin) {                
                console.log('Unknown user');
                done('Unknown user');
                } else if (!isValidPassword(admin.password,password)) { 
                    console.log('Invalid password');               
                    done('Invalid password');
                } 
                else if(admin.active == 0){
                    console.log("admin not active");
                    done("admin not active");
                }
                else{                
                    console.log("Login success, welcome " + admin.first_name);
                    createSession(app,req,done,admin,models)                 
                }
            }).catch(function(err){
                console.log("Error occured");
                console.log(err);
                done("User not found");
            });
        }
    ));

    passport.use('freelancer-signup', new LocalStrategy({
        usernameField: 'email', 
        passwordField: 'email', 
        passReqToCallback: true
    },
        function(req, email, password, done){
            console.log("freelancer-signup call==>");
           var generateHash = function(password){
               return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            var password = Math.random().toString(36).slice(-8);
            var query = "Select * from Freelancer where email_address='" + email + "' or mobile_number='" + req.body.mobile +"';";
            Models.sequelize.query(query,{type: models.sequelize.QueryTypes.SELECT}).then(function(user){
                if(user.length>0) {
                    return done("User already exists");
                } else {
                    var data = {
                        full_name: req.body.full_name,
                        password: password,
                        mobile_number: req.body.mobile,
                        email_address: email,
                        date_of_birth: req.body.date_of_birth,
                        city_id: req.body.city_id,
                        address: req.body.address,
                        gender: req.body.gender,
                        postal_code: req.body.postal_code,
                        date_of_joining: new Date(),
                        active: 0
                    };
                    Models.Freelancer.create(data).then(function(newUser, created){
                        if (newUser) {
                            var response = {};
                            var otp = Math.floor(1000 + Math.random() * 9000);
                            response.otp = otp;
                            Models.Freelancer.update({otp: otp},{where: {id: newUser.id}}).then(function(){
                                return done(null, response);
                            })
                        }
                    })
                }
            })
        }
    ));

    var createSession = function(app,req,done,admin,models){
        var current_date_time = new Date();
        const payload = {
            admin: admin.id 
        };
        var token = jwt.sign(payload, app.get('superSecret'), {
            expiresIn: 60*60*24 // expires in 24*365 hours
        });
        var expiry = new Date();
        expiry.setHours(expiry.getHours() + 24);
        var defaults = {
            session_token: token,
            session_created_on: current_date_time,
            updatedAt: current_date_time,
            device_id:req.headers['deviceid'],
            login_source: req.headers['source'],
            expiry_on: expiry
        };
        if(req.headers['current_screen']!=undefined){
            defaults.current_screen = req.headers['current_screen']
        }
        models.Admin_Sessions.findOrCreate({where:{admin_id:admin.id ,device_id:req.headers['deviceid']},defaults}).spread((session,created)=>{
            if(created){
                console.log("New session created");
                admin.update({session_token: token},{returning:true, plain: true}).then(function(admin_updated){
                    var response = {                            
                        user: admin_updated                        
                    }                            
                    done(null, response);
                })
            } else {
                console.log("Existing session found");
                jwt.verify(session.session_token,app.get('superSecret'),function(err,decoded){
                    if(err){
                        console.log("Token expired, generating new token");
                        models.Admin_Sessions.update({
                            session_token: token,
                            updatedAt: current_date_time,
                            expiry_on: expiry
                        },{where: {admin_id:admin.id}}).then(function(){
                            admin.update({session_token: token},{returning:true, plain: true}).then(function(admin_updated){
                                var response = {                            
                                    user: admin_updated                        
                                }                            
                                done(null, response);
                            })
                        }).catch(function(error){
                            console.log("Error sending response: " + error);                        
                            done(error)
                        });
                    } else {
                        var response = {                        
                            user: admin
                        }                        
                        done(null, response);
                    }
                });
                
            }
        }).catch(function(error){
            console.error(error);            
            done(error)
        });
    }
}