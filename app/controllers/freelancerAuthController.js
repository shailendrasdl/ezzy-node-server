var exports = module.exports = {}
var fetch = require("node-fetch");
var path = require("path");
var smsconfig = require(path.join(__dirname,'..', 'config', 'config.json'))["smssettings"];


exports.addFreelancerDocuments = function(req,res,models,app,s3){
    if(req.body.freelancer_id==undefined || req.body.freelancer_id==null){
        res.status(400).json({error_msg:"freelancer_id not found in body"});
        return;
    }
    if(req.body.document_type==undefined || req.body.document_type==null){
        res.status(400).json({error_msg:"document_type not found in body"});
        return;
    }
    if(req.body.base64document==undefined || req.body.base64document==null){
        res.status(400).json({error_msg:"base64document parameter not found in body"});
        return;
    }
    var base64 = req.body.base64document;
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
    var defaults = {
        document_type:req.body.document_type,
        //document_url: req.body.base64document,
        document_verified: 0
    }

    s3.upload(params, function(err, data) {
        if(err)
            res.status(400).json({"err":err});
        else{  
            models.Freelancer_documents.findOrCreate({document_url: data.Location}, {where:{freelancer_id:req.body.freelancer_id}, defaults})
            .then(function(){
                res.json({"msg":" Freelancer Documents upload successfully"})
            }).catch(function(err){
                console.log(err);
                res.status(400).json({error_msg: "Something want wrong"});
                return;
            })
            
        }
    });
};


exports.sendMessage = function(req,res,models,app){
    var response = {};
    var otp = Math.floor(1000 + Math.random() * 9000);
    response.mobile_number = req.body.mobile_number;
    console.log("Mobile_Number => ",req.body.mobile_number);

    var queryCondition = {where: {mobile_number: req.body.mobile_number},defaults: { otp: otp }}
    var smsMessage = " OTP : " + otp;
    models.Users.findOrCreate(queryCondition).spread((user,created)=>{
        var otpUrl = "http://sms.hspsms.com/sendSMS?username="+ 
                        smsconfig.username +"&message=" + 
                        encodeURI(smsMessage) + "&sendername=" + 
                        smsconfig.sendersName + "&smstype=" + 
                        smsconfig.smsType + "&numbers=" + 
                        user.mobile_number + "&apikey=" + 
                        smsconfig.apiKey;
                        console.log(otpUrl);
                        if(user){
                            console.log("first_name =>", user.first_name);                            
                            return fetch(otpUrl);     
                        }
    }).then(function(response){
        console.log(response);
        res.json(smsMessage);
        console.log("Message SuccessFully Submitted");
    })
};

exports.generaePassword = function(req,res,models,app){
    var generator = require('generate-password');
    var password = generator.generate({
        length: 8,
        numbers: true
    });
    res.json({password});
}
