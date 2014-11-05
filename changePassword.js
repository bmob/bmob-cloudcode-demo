function onRequest(request, response, modules) {
    var username = request.body.phone;//用户名
    var pwd = request.body.password;//新密码
    var db = modules.oData;
    var id = "";
    db.find({
        "table":"_User",
        "where":{"username":username},
    },function(err,data){
        if(data){
            var resultObject= JSON.parse(data);
            objectId = resultObject.results[0].objectId;
            db.setHeader({"X-Bmob-Master-Key":"这里填写masterkey信息"});
            db.updateUserByObjectId({"objectId":objectId, data:{"password":pwd}},function(err,data){
                response.end("更新成功");
            });
        }

    });

}                         
