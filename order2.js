/**
*Bmob�ṩ�Ŀ��ٻ�ȡĳһ��objectId��������㷨
*�ϴ�һ��objectId��ȥ��ֱ��֪���������ݵ�ĳ���ֶ�ֵ���ƶ˴�������ָ�����������������
*/
function onRequest(request, response, modules) {


    var db = modules.oData;
	//tableName����Ҫ�õ�����ı��������Ը������ʵ���������
    var tableName= "GameScore";
	//���objectId����ͨ��request.body.������ ��SDK�д�����
    var objectId ="848f4ed06c";  
    
    //�Ȼ�ȡ�����ݵķ���
    db.findOne({
      "table":tableName,
      "objectId":objectId
    },function(err,dataScore){  
        // response.end(dataScore+"");
       var resultObject= JSON.parse(dataScore);
        //�������Json����
       if(resultObject.hasOwnProperty("error")==true && resultObject.hasOwnProperty("code")==true){ //��ʾ������Ϣ
           response.end(resultObject.error);
       }else{
			//score��Ҫ��������ݵ��ֶ���������Ը����Լ���ʵ������޸�
            var score= resultObject.score; 
            
            //��ȡ������������ж���������
            db.find({
                "table":tableName,          
                "where":{"score":{"$gte":score}},       
                "limit":1,
                "count":1            
            },function(err,dataGte){    //�ص�����
                resultGte= JSON.parse(dataGte);
                countGte = resultGte.count; //�������������������Ŀ
                
                //��ȡ������������ж���������
                db.find({
                    "table":tableName,          
                    "where":{"score":score},       
                    "limit":1,
                    "count":1            
                },function(err,dataEqu){    //�ص�����
                    resultEqu= JSON.parse(dataEqu);
                    countEqual = resultEqu.count; //�������������������Ŀ
                    
                    //����Ϊorder
                    order=countGte-countEqual+1;
					//������Ϣ���Ը����Լ���ʵ���������
                    response.end("����Ϊ"+order+"��");
                });                               
            });
       }          
    });    

    
}                                                                                                                                                