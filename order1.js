/**
*Bmob�ṩ�Ķ����������������㷨
*/
function onRequest(request, response, modules) {

    var db = modules.oData;
	//eventproxyģ�飬����첽�ص�������
    var ep = modules.oEvent;  
    var bat = modules.oBatch;
    
    var str ="";
    var arr = new Array(); //��¼��ÿ�������ж��ٸ��û�  
    var searchNum=0;   //�������������sql�����
    var limitnum=1000; //Ĭ����෵��1000����¼
    var runcount= parseInt(searchNum/1000);
	//tableName����Ҫ�õ�����ı��������Ը������ʵ���������
    var tablename= "GameScore";
    

    
    db.find({
      "table":tablename,
      "count":1 
    },function(err,data1){     
        
        var resultObject= JSON.parse(data1);
        searchNum=resultObject.count;
		runcount= parseInt(searchNum/1000);
		
		
		//��ȡ���а�ͳ�����ݺ�Ը���
		ep.after('got_data', runcount+1, function (list) {
			 
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
                  var objOrderArr = new Array(); //��¼��ÿ���û�������  
                  var resultObject= JSON.parse(data);
                  var currentCount=0; //��ǰ���صļ�¼��
                  
                  //�������Json����
                  for(var results in resultObject)
                  {
                       var resultArr = resultObject[results];
                        response.end("resultArrlen:"+resultArr.length);
                       
                       currentCount=resultArr.length;  //�ѵ�ǰ�ļ�¼����ֵ
                       
                       for(var oneline in resultArr){
    					  var objectId= resultArr[oneline].objectId;
						  //resultArr[oneline].score�е�score����Ҫ������ֶ������ɸ���ʵ������޸�
    					  var score= resultArr[oneline].score;
    					  
    					  var count=0;
    					  var totalOrder=0;
    						for(var i=arr.length;i>=0;i--){
    						  if(isNaN(arr[i])){    
    						  }else{
    							  count++;
    							  if( score==i ) {
    								  if(count==1){ //���ǵ�һ������ʱ������Ϊ1
    									  objOrderArr[objectId]=1;
    								  } else {  //������ǵ�һ����������������totalOrder+1
    									  objOrderArr[objectId]= totalOrder+1 ;
    								  }
    							  }else{
    								  totalOrder=totalOrder+arr[i]; //��¼���Ѿ��Ź��ķ���
    							  }  
    						  }
    						}
                        }
                        
						//�������Ľ��    
						var tempCount=0;
						var totalCount=0;
						var batchArr=new Array();
						var flag=0;
						for(var i in objOrderArr){

							tempCount++;
							totalCount++;
							//order������˳��Ĵ洢�ֶΣ��ɸ����Լ���ʵ������޸�
							var tempDist= {"method": "PUT","path": "/1/classes/"+tablename+"/"+i,"body": {"order": objOrderArr[i]}};
							batchArr.push(tempDist);
							
							if( tempCount==50 ){     

								 bat.exec({
									"data":{
										"requests": batchArr
									  }
								  },function(err,data){
									 //�ص�����
								  });                
								  batchArr=new Array();
								  tempCount=0;
								
							}
							//����ʣ���Ҫ��������
							if( currentCount==totalCount ){
								 bat.exec({
									"data":{
										"requests": batchArr
									  }
								  },function(err,data){
									 //�ص�����
								  });                
							}
							
						}                        

                  }
            });//end db find
        }//end for 

        response.end("end");
        
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
                        // str="count:"+resultArr.length;
                       for(var oneline in resultArr){
						  //resultArr[oneline].score����Ҫ������ֶ������ɸ���ʵ������޸�
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