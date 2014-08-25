/**
*Bmob�ṩ�Ļ�ȡĳ�����ǰN�����ݵ����е��㷨, N<1000
*/
function onRequest(request, response, modules) {


	//tableName����Ҫ�õ�����ı��������Ը������ʵ���������
    var tablename= "GameScore";
	//scoreField����Ҫ������ֶ���
    var scoreField="score";
	//����ǰorderNum��
    var orderNum = 10;  

    var db = modules.oData;
    var ep = modules.oEvent;  //eventproxyģ�飬����첽�ص�������
    var bat = modules.oBatch;
    
    var str ="";
    var arr = new Array(); //��¼��ÿ�������ж��ٸ��û�  
    var searchNum=0;   //�������������sql�����
    var limitnum=1000; //Ĭ����෵��1000����¼
    var runcount= 0;
    
    db.find({
      "table":tablename,
      "count":1 
    },function(err,data1){     
        
        var resultObject= JSON.parse(data1);
        searchNum=resultObject.count;
		runcount= parseInt(searchNum/1000);
		
		//��ȡ���а�ͳ�����ݺ����
		ep.after('got_data', runcount+1, function (list) {
			
            var scoreLine=0; //��¼����orderNum�ķ�����
            var totalOrder=0;     

            for(var i=arr.length;i>=0;i--){
              if(isNaN(arr[i])){    
              }else{
                  totalOrder=totalOrder+arr[i]; //��¼���Ѿ��Ź��ķ���
                  str=str+" "+i+":"+totalOrder;
                  if( totalOrder>=orderNum ){
                      scoreLine=i;  //��ʱ��i���Ƿ�����
                      break;
                  }
              }
            }

    		db.find({
              "table":tablename,          //����
              "where":{"score":{"$gte":scoreLine}},       //��ѯ�����Ǵ��ڷ�����
              "order":"-"+scoreField,         //�����б�[-]�ֶ�����,-��ʾ����Ĭ��Ϊ����
              "limit":orderNum,            //
             },function(err,data){    //�ص�����
             
                response.end(data+"");
             }); 

		});		
		
		
        //�ֶ�λ�ȡ��¼����Ϊÿ��ֻ�ܻ�ȡ1000��
        for(var i=0;i<=runcount; i++){
            var skipNum= 1000*i;
            if( i==runcount ) {
               limitnum=searchNum-1000;
            } else {
               limitnum=1000;
            }
            db.find({
                "table":tablename,
                  "limit":limitnum,            
                  "skip":skipNum
              },function(err,data){ 
                  var resultObject= JSON.parse(data);
                  //�������Json����
                  for(var results in resultObject)
                  {
                       var resultArr = resultObject[results];
                       for(var oneline in resultArr){
                          var tempScore= resultArr[oneline].score; 
                
                           if(  isNaN(arr[tempScore] )){  //���±껹�����ڣ�
                               arr[tempScore]=1
                           }else{ //����±���ڣ�������±����Ŀ�ļ�1
                               arr[tempScore]= arr[tempScore]+1;
                           }
                        }
                  }
                         
                 ep.emit('got_data', 1);
    
            });//end db find
        }//end for 
    });
    
}                                                                                                                                                