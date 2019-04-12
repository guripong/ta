var express = require('express');
const request = require('request');
const mysql = require('promise-mysql');
var router = express.Router();
const {
    dialogflow,
    Image,
    MediaObject,
    SimpleResponse,
    Button,
    Carousel,
    Suggestions,
    BasicCard,
    Table,
    List,
    SignIn,
} = require('actions-on-google')

const ap = dialogflow({
clientId: `power_wizard`,
});


router.post('/', ap);
//####################################################################################################
const Speed_E = ` </prosody> `;


function question(parameters,conv,resolve1){
    return new Promise(function(resolve2){
        console.log('question function call');
        //console.log('parameters:',parameters);
        //parameters.total_speech+=' question call success! ';
        var QN = parameters.QN;
        var location = parameters.location;
        var sql;
        var connection;
        var total_speech=parameters.total_speech;
        var QuerryLoad_Possible =parameters.QuerryLoad_Possible;
        var direction;
        var Rtype_doit_after_qnmove;
        var Rtype_donot_qnmove;

        //parameters.haha ='maerong';

        //console.log('parameters:',parameters);
        //console.log('set먹히나');
       // conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
               
        //console.log('ask 먹히나');
        //conv.ask('<speak>'+parameters.Speed_S+parameters.total_speech+Speed_E+'</speak>');

        
      
      

        
        /////////////////////////////////복붙후 고칠것///////////////////////
        if(QuerryLoad_Possible==1)
        {
            QuerryLoad_Possible=0;
            parameters.QuerryLoad_Possible=0;
            mysql.createConnection(config).then(function(conn){
                sql =`call final_skill_question("`+QN+`","`+location+`");`;
                //프로시저 호출
                console.log(`sql:`,sql);
                connection = conn;
                return conn.query(sql);
                
            }).then(function(results){
                //console.log(`results:`,results);
                results = JSON.parse(JSON.stringify(results));
    //            console.log(`results:`,results);
                
                //console.log(`results[0]:`,results[0]); //direction 스크립트값이 들어있음 stype reask_chacne set_num direction activity analysis_flag
                //console.log(`results[1]:`,results[1]); //question 스크립트값이 들어있음 readnumber,question
                
                if(results[0].length!=0)
                {
                    //console.log(`results[0].length:`,results[0].length);
                    //console.log(`results[0][0].stype:`,results[0][0].stype);
                    //console.log(`results[0][0].reask_chance:`,results[0][0].reask_chance);
                    //console.log(`results[0][0].set_num:`,results[0][0].set_num);
                    //console.log(`results[0][0].direction:`,results[0][0].direction);
                    direction= results[0][0].direction;
                    
                    parameters.analysis_flag= results[0][0].analysis_flag;
                    parameters.activity = parseInt(results[0][0].activity,10);
                    //console.log(`aaaaaaaaaaaaaaaaaaa:`,parameters.['activity']);
                    parameters.type=results[0][0].stype;
                    parameters.setheadQN = QN;    
                    if(parseInt(results[0][0].set_num ,10)!=0) parameters.is_set=`Y`;
                    else  parameters.is_set=`N`;   
                                /////////////////위에는공통
                    if(parameters.is_set=='N')
                    {
                        if(parameters.type=='R'){
                            
                            if(parameters.isR_ing!=1)
                            {
                                //results[0][0].direction
                                
                                // R타입에서 구할 location, activity에대한 오답 발화를 가지고옴..
                                var target_location_activity=new Array();
                                for(var i = 0 ; i<results[1].length;i++)
                                {
                                    target_location_activity[i]={};
                                    target_location_activity[i].location= results[1][i].question.split('/')[0];
                                    target_location_activity[i].activity= results[1][i].question.split('/')[1].split('_')[1];
                                }
                                //R타입에서 구할 location ,activity 들 즉 타겟을 찾았음
                                console.log(`목표 location,activity에 대한 정보`);
                                console.log(target_location_activity);
                                //해당 activity들의 정답률을 구해야함.. analysisflag 가 1인녀석으로..모두 조회..
                                
                                //실제 타겟에 대한 발화정보를 가져옴 , 여기서 가져온 location,qn은 틀린것들임
                                
                                sql=`SELECT location,qn FROM EDUAI.final_skill_say_log where (location,qn) 
                                in(SELECT location,qn FROM EDUAI.final_skill_direction where (`;
                                for(var i = 0 ; i<target_location_activity.length;i++){
                                    if(i+1==target_location_activity.length){
                                       sql = sql+`(location="`+target_location_activity[i].location+`" and activity="`+target_location_activity[i].activity+`") `;
                                    }
                                    else{
                                          sql = sql+`(location="`+target_location_activity[i].location+`" and activity="`+target_location_activity[i].activity+`") or `;
                                    }
                                }
                                sql=sql+`) and analysis_flag=1)
                                and oauth_id="`+parameters.oauth_user_id+`" and (case_num = "0" or case_num ="1");`;
                                console.log(`R타입에서 특정학생의 타겟location,activity에 대한 sql 과 case_array`);
                              
                                sql=sql+`SELECT case_num,feedback,qn_move FROM EDUAI.final_skill_case where location="`+location+`" and qn="`+QN+`";`;
                                console.log(sql);
                                return connection.query(sql);
                            }
                            else{//R타입의 남은 큐를 확인해서 가야함
                            
                                console.log('아직1');
                                return 1;
                            }
                            
                        }
                        else if(parameters.type=='G' || parameters.type=='C' || parameters.type=='M' ||  parameters.type=='S'  )
                        {
                             var Random_Number=(Math.floor(Math.random() * results[1].length));  
                                //console.log(`results[1][Random_Number].read_number:`,results[1][Random_Number].read_number);
                                //console.log(`results[1][Random_Number].question:`,results[1][Random_Number].question);
                                
                            if(results[0][0].direction)total_speech = total_speech.concat(results[0][0].direction+` `);
                                
                            if(results[1][Random_Number].question)
                            {
                                    total_speech = total_speech.concat(results[1][Random_Number].question+` `);
                                    parameters.question =results[1][Random_Number].question;
                            }
                                
                            parameters.read_number=parseInt(results[1][Random_Number].read_number,10);    
                                
                            parameters.reask_chance = results[0][0].reask_chance;
                            parameters.type.total_speech = total_speech;
                      
             
                 
                            parameters.total_speech = total_speech;
                        
                            return 1;
                            
                        }/////////////셋트가 아닌경우 question을 랜덤하게 가져옴//////////////
                        else if(parameters.type=='E')
                        {
                            
                            total_speech = total_speech.concat(` `+results[0][0].direction);
                            
                            var nextqn = results[1][0].question;
                            nextqn = nextqn.split('/');
                            var savelocation = nextqn[0];
                            var saveqn = nextqn[1];
                            ////sql은 final_skill_student_info를 업데이트 해준다
                            //location 하고 qn을
                       
                            
                             sql=`call final_skill_etype("`+parameters.oauth_user_id+`","`+
                             parameters.location+`","`+parameters.type+`","`+parameters.QN+`","`+
                             total_speech+`##stop by Etype##`+`","`+saveqn+`","`+savelocation+`");`;
                            
                            console.log(`sql:`,sql);
                
                            return connection.query(sql);
                        }
                    }  
                    else // 셋트로 묵는경우임parameters.['is_set']=='Y' 상태
                    {
                        if(parameters.set_start==0) ////////첫셋트인경우 세트로 묶은 새로운 질문번호중 하나의 정보를 새롭게 가져와야함
                        {
                            //첫 셋트인경우
                            if(results[0][0].direction)total_speech = total_speech.concat(results[0][0].direction+` `);
                            
                            parameters.set_start=1;  //set_start 가 1이면 처음  2이면 중간 0이면 셋트아님
                                //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                                //여기서 read_number따로 기억 dynamoDB
                                //parameters.['is_set']=`Y`;
                                //SELECT qn FROM EDUAI.final_skill_direction where location='test4' and set_num='1';
                            sql =`SELECT qn FROM EDUAI.final_skill_direction where location='`+parameters.location+
                                 `' and set_num='`+parseInt(results[0][0].set_num ,10)+`'`;
                            console.log(`sql:`,sql);
                                //parameters.
                            return connection.query(sql);
                        }
                        else //첫셋트가 아닌경우에는... 셋트중간인거임
                        {
                            return 222;
                        }
                    }
                    ///////////////////////////////////////////여기 수정할것    
                   
                    
                }/////////////////direction load 성공
                else
                {
                    /////////////////direction load 실패
                    return -1;
                }
            }).then(function(results){
                if(results ==-1)
                {
                    return -1; //디렉션 못가져온경우
                }
                else 
                {
                        if(parameters.is_set=='N')//세트가아님
                        {
                            if(parameters.type=='R'){
                                //R타입의경우
                                //results값을 확인
                                if(parameters.isR_ing!=1){
                                    
                                  
                                    results = JSON.parse(JSON.stringify(results));
                                    console.log(`타겟의 오답발화모음`);
                                    console.log(results[0]);
                                    console.log(`case_array R타입`)
                                    console.log(results[1]);
                                    if(results[1]){
                                        Rtype_doit_after_qnmove=results[1][0].qn_move;
                                        Rtype_donot_qnmove=results[1][1].qn_move;
                                        
                                        var Rtype_wrong_count=0;
                                        var Rtype_wrong_data=new Array();
                                        for(var i = 0 ; i<results[0].length ; i++){
                                            
                                            var isnew=1;
                                            for(var j = 0 ; j<Rtype_wrong_count;j++){
                                                if(Rtype_wrong_data[j].location==results[0][i].location && Rtype_wrong_data[j].qn==results[0][i].qn)
                                                {
                                                    isnew=0;
                                                    Rtype_wrong_data[j].count++;
                                                    break;
                                                }
                                            }
                                            
                                            if(isnew==1){
                                                Rtype_wrong_data[Rtype_wrong_count]={};
                                                Rtype_wrong_data[Rtype_wrong_count].location=results[0][i].location;
                                                Rtype_wrong_data[Rtype_wrong_count].qn=results[0][i].qn;
                                                Rtype_wrong_data[Rtype_wrong_count].count=1;
                                                Rtype_wrong_count++;
                                            }
        
                                        }
                                        
                                        console.log(`타겟의 R타입 목표물 충족확인`);
                                        console.log(Rtype_wrong_data);
                                        Rtype_wrong_data.sort(function(a, b) { // 오름차순
                                            return ((a.count > b.count) ? -1 : ((a.count < b.count) ? 1 : 0));
                                        });
                                        console.log(`정렬 후 타겟의 R타입 목표물 충족확인`);
                                        console.log(Rtype_wrong_data);
                                        
                                        
                                        console.log(`그래서 몇개:`,Rtype_wrong_count);
                                        console.log(`충족할경우 갈곳:`,Rtype_doit_after_qnmove);
                                        console.log(`충족안할경우 갈곳:`,Rtype_donot_qnmove);
                                        
                                        var rule_overequal_doit_count=results[1][0].feedback.split('/')[0].replace(/[^0-9]/g,"");
                                        var rule_select_max_Rtype_data=results[1][0].feedback.split('/')[1].replace(/[^0-9]/g,"");
                                        
                                        console.log(`Rtype_wrong_data개수가 이숫자 이상이면 함:`,rule_overequal_doit_count);
                                        console.log(`Rtype_wrong_data 추출 개수제한:`,rule_select_max_Rtype_data);
                                        if(Rtype_wrong_count>=rule_overequal_doit_count){
                                            ///////////////첫합격 경축////////
                                            total_speech+=direction;
                                            parameters.isok_bringnextR_que=1;
                                            
                                            parameters.R_number=1;
                                            
                                            console.log('합격 이제 Rtype_wrong_data 에서 목표한 6개를 추출..오답의 개수순서 동일시 랜덤뽑기');
                                            console.log('랜덤 퀘스천 X개 돌린후 갈곳은:',Rtype_doit_after_qnmove);
                                            
                                            var largecount=-100;
                                            var okcount=0;
                                            var gozero=0;
                                            //@@@@망가짐 고쳐야함
                                            for(var i = 0 ; i<Rtype_wrong_data.length; i++){
                                                if(gozero==0)
                                                {
                                                    if(i==0){
                                                        largecount=Rtype_wrong_data[i].count;
                                                        okcount++;
                                                        Rtype_wrong_data[i].choose=1;
                                                    }else{
                                                        if(largecount == Rtype_wrong_data[i].count){
                                                            okcount++;
                                                            Rtype_wrong_data[i].choose=1;
                                                        }
                                                        else{
                                                         
                                                            if(okcount<rule_select_max_Rtype_data){
                                                                largecount=Rtype_wrong_data[i].count;
                                                                okcount++;
                                                                Rtype_wrong_data[i].choose=1;
                                                            }else{
                                                                Rtype_wrong_data[i].choose=0;
                                                               gozero=1;
                                                            }
                                                        }
                                                    }
                                                }
                                                else{
                                                     Rtype_wrong_data[i].choose=0;
                                                }
                                            }
                                            
                                            console.log('선택결과',Rtype_wrong_data);
                                            console.log('largecount:',largecount);
                                            console.log('okcount:',okcount);
                                            console.log('rule_select_max_Rtype_data:',rule_select_max_Rtype_data);
                                            if(okcount>rule_select_max_Rtype_data){
                                                var deletecount=okcount-rule_select_max_Rtype_data;
                                                console.log(`지워야하는녀석들개수 :`,deletecount);
                                                //랜덤 숫자 0,1 찍자
                                                while(1){
                                                    for(var i = 0 ; i<Rtype_wrong_data.length; i++){
                                                        if(Rtype_wrong_data[i].choose==1 && Rtype_wrong_data[i].count==largecount){
                                                            //랜덤숫자 뽑아서
                                                            //choose 를 1로 만들고 deletecount를 하나빼줌
                                                            //deletecount==0 이면 break 두번 (여기 for문 밖에도 for문 필요)
                                                            var rn=Math.floor(Math.random() * 2);
                                                            if(rn==1){
                                                                Rtype_wrong_data[i].choose=0;  
                                                                deletecount--;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    if(deletecount==0) break;
                                                }
                                
                                            }
                                             console.log('삭제결과',Rtype_wrong_data);
                                      
                                      
                                            var Rtype_doit_que_index=0;
                                            var Rtype_doit_que=[];
                                            for(var i = 0 ; i <Rtype_wrong_data.length; i++){
                                                if(Rtype_wrong_data[i].choose==1){
                                                    Rtype_doit_que[Rtype_doit_que_index]= Rtype_wrong_data[i];
                                                    Rtype_doit_que_index++;
                                                }
                                            }
                                            
                                            console.log(`최종choose결과:`,Rtype_doit_que);
                                                 
                                                 
                                          
                                            var j, x, i;
                                            for (var i = Rtype_doit_que.length; i; i -= 1) {
                                                    j = Math.floor(Math.random() * i);
                                                    x = Rtype_doit_que[i - 1];
                                                    Rtype_doit_que[i - 1] = Rtype_doit_que[j];
                                                    Rtype_doit_que[j] = x;
                                            }
                                        
                                            console.log(`섞은후최종결과:`,Rtype_doit_que);
                                            parameters.Rtype_doit_que_index=Rtype_doit_que_index;
                                            parameters.Rtype_doit_que = Rtype_doit_que;
                                            parameters.Rtype_doit_after_qnmove=Rtype_doit_after_qnmove;
                       
                                            parameters.isR_ing=1;
                                            
                                            
                                            //,rule_select_max_Rtype_data
                                            var systemlog='[R Type] START: Incorrect Answer :'+Rtype_wrong_count+'('+rule_overequal_doit_count+')'+
                                            '/ Max. Question '+rule_select_max_Rtype_data+
                                            ': [';
                                            for(var i = Rtype_doit_que_index-1; i!=-1 ; i--){
                                                if(i!=0){
                                                 systemlog=systemlog+parameters.Rtype_doit_que[i].location+'/'+parameters.Rtype_doit_que[i].qn+'→';
                                                }
                                                else{
                                                 systemlog=systemlog+parameters.Rtype_doit_que[i].location+'/'+parameters.Rtype_doit_que[i].qn;
                                                }
                                            }
                                            systemlog = systemlog+'] / QN_Move_'+Rtype_doit_after_qnmove;
                                          
                                             console.log(`R타입 시스템 기록쿼리만들기`);
                                             sql=`INSERT INTO EDUAI.final_skill_say_log VALUES (default,"`+parameters.oauth_user_id+`","`
                                             +parameters.location+`","`+parameters.type+`","`+parameters.QN
                                             +`","SYSTEM","`+systemlog+`",now(),-3);`;
                                             console.log(`R타입 기록 sql:`,sql);
                                            
                                            return connection.query(sql);
                                        
                                       
                                        
                                        }
                                        else{
                                            console.log(`불합격`);
                                            console.log(`R타입 안돌리고 바로 갈곳:`,Rtype_donot_qnmove);
                                            parameters.isR_ing=0;
                                            
                                            var systemlog='[R Type] PASS: Incorrect Answer :'+Rtype_wrong_count+'('+rule_overequal_doit_count+')'+
                                            '/ Max. Question '+rule_select_max_Rtype_data
                                            +':[] / QN_MOVE_'+Rtype_donot_qnmove;
                                            
                                             console.log(`R타입 시스템 기록쿼리만들기`);
                                             sql=`INSERT INTO EDUAI.final_skill_say_log VALUES (default,"`+parameters.oauth_user_id+`","`
                                             +parameters.location+`","`+parameters.type+`","`+parameters.QN
                                             +`","SYSTEM","`+systemlog+`",now(),-3);`;
                                             console.log(`R타입 기록 sql:`,sql);
                                            
                                         
                                            return connection.query(sql);
                                            
                                  
                                        }
                                    }//결과가 있음
                                    else{//결과가 없음 오류임
                                        
                                        console.log('오류');
                                        return -1;
                                    }
                                 
                                }
                                else{
                                    console.log('아직2');
                                    return 1;
                                }
                            }
                            else if(parameters.type=='G' || parameters.type=='C' ) /////여기서 C타입도 추가해주면 될거 같음 셋트건 뭐건
                            {
                                return 1; //정상
                            }// 여기서부터 S타입 question 가져오는일부터 한다
                          
                            else if(parameters.type=='M'||parameters.type=='S') ////메모리타워랑 센탠스배틀
                            {
                                //메모리타워 단어DB가 뭔지 가져옴
                                sql=`SELECT case_array FROM EDUAI.final_skill_case where location='`+parameters.location
                                +`' and qn='`+parameters.QN+`';`;
                                return connection.query(sql);
                            }
                            else if(parameters.type=='E')
                            {
                                  return 1; //정상종료할것
                            }
                        }//세트가아님
                        else///////////////////////////////////////////셋트인경우
                        {  
                            if(parameters.set_start==1)
                            {//같은 셋트 qn을 긁어온상태
                                parameters.set_start=2;
                                //console.log(`세트경우:`,results);
                                results = JSON.parse(JSON.stringify(results));
                                console.log(`세트경우:`,results);
                                var decided_order_set=new Array();
                                
                                for(var i = 0 ; i <results.length; i++)
                                {
                                    decided_order_set[i]=results[i].qn;
                                   
                                }
                                console.log(`안섞은순서!!!!:`,decided_order_set);
                                //decided_order_set.sort(() => Math.random() - 0.5);
                                 for (var i = decided_order_set.length - 1; i > 0; i--)
                                 {
                                   let j = Math.floor(Math.random() * (i + 1));
                                    [decided_order_set[i], decided_order_set[j]] = [decided_order_set[j], decided_order_set[i]];
                                }
                                console.log(`섞은순서!!!!:`,decided_order_set);
                                var db_decided_order_set =` `;//
                                for(var i = 0 ; i<decided_order_set.length ; i++)
                                {
                                    if(i+1!=decided_order_set.length)
                                    {
                                        if(i==0)
                                        {
                                            QN=parseInt(decided_order_set[i],10);
                                            parameters.QN=QN;
                                        }
                                        else
                                        {
                                            db_decided_order_set = db_decided_order_set.concat(decided_order_set[i]+'/');
                                        }
                                    }
                                    else
                                    {
                                        db_decided_order_set = db_decided_order_set.concat(decided_order_set[i]);
                                    }
                                }

                                console.log(`저장할 순서->`,db_decided_order_set);
                                parameters.db_decided_order_set=db_decided_order_set;
                                parameters.should_read = 1;
                                console.log(`가져와야할QN:`,QN);
                                
                            
                                parameters.Dcheck=0;
                                if(parameters.type=='D')
                                {
                                    
                                    parameters.Dcheck=3;
                                }
                               
                                  
                               
                                
                                parameters.QN =QN;
                                ///////////////여기서 셋트 처음 qn에 대해서 질문을 가져와야함
                                //sql 처음꺼 return 해야함
                                //sql = 프로시저 question꺼 다시 가져오면될듯
                                //ㅈㅈㅈㅈㅈㅈㅈㅈㅈㅈㅈㅈㅈ
                               
                              
                              
                                
                                sql =`call final_skill_question("`+QN+`","`+location+`");`;
                                console.log(`새로운 set의 qn을 가져옴 sql:`,sql);
                                //return 221; //셋트인경우처음꺼임
                                return connection.query(sql);
                            }//첫셋트
                            else//parameters.['set_start'] 가 2인경우임 셋트중임
                            {
                                //parameters.['db_decided_order_set'] 확인후 마지막일경우
                                //더이상없으면 is_set 값 N 로 바꾸고
                                //어짜피 쿼리는 위에랑 똑같이 새로운 QN에 대해 가져와야함
                               
                                sql =`call final_skill_question("`+QN+`","`+location+`");`;
                                console.log(`2번이상부터 새로운 set의 qn을 가져옴 sql:`,sql);
                                //return 221; //셋트인경우처음꺼임
                                return connection.query(sql);
                            }//셋트중간
                        }///셋트인경우

                }//디렉션을 잘 가져온경우
            }).then(function(results){
                if(results==-1) 
                {
                    return -1;
                }
                else
                {
                        if(parameters.is_set=='N')
                        {
                            if(parameters.type=='R')
                            {
                                 if(parameters.isR_ing!=1){
                                 
                                  //R타입 로드 조건 충족 안댐..
                                  //여기는 불합격했을때임
                                     return 1;
                                 }
                                 else{
                                     //합격했고
                                     //큐에 따라서 뽑아보자
                                     //인덱스번째인걸 한번 해봐
                                     
                                     //@@@@여기서 rtype next가 1인지 확인
                                     //충족된 상태임
                                     
                                     if(parameters.isok_bringnextR_que==1){
                                         console.log(`뽑기값:`,parameters.Rtype_doit_que[parameters.Rtype_doit_que_index-1]);
                                         sql = `call final_skill_question("`+parameters.Rtype_doit_que[parameters.Rtype_doit_que_index-1].qn
                                         +`","`+parameters.Rtype_doit_que[parameters.Rtype_doit_que_index-1].location+`")`;
                                         console.log('새로가져오는 값:',sql);
                                     
                                     
                                     
                                         return connection.query(sql);
                                     }
                                     else{
                                         return 1;
                                     }
                                    // return 1;
                                 }
                                
                            }
                            else if(parameters.type=='G' || parameters.type=='C') ///
                            {
                                return 1; //정상
                            }
                            else if(parameters.type=='S')
                            {
                                
                                results=JSON.parse(JSON.stringify(results));
                                parameters.alexa_lost_percentage=results[0].case_array;
                                parameters.alexa_cannotremember_say=results[1].case_array;
                                parameters.S_A_point=0;
                                parameters.S_S_point=0;
                                //var S_sentences = results[2].case_array.toLowerCase();
                                var S_sentences = new Array();
                                var S_sentences_check = new Array();
                                for(var i = 2 ; i<results.length;i++)
                                {
                                    S_sentences_check[i-2] = 0;
                                    S_sentences[i-2] = results[i].case_array.toLowerCase();
                                    S_sentences[i-2] = S_sentences[i-2].split(`/`);
                                }
                                if(S_sentences.length<6)//오류
                                {
                                    parameters.S_sentences_count=0;
                                    return -1;
                                }
                                else
                                {
                                    parameters.S_sentences_count = S_sentences.length;
                                    parameters.S_sentences_check=S_sentences_check;
                                    parameters.S_sentences=S_sentences;
                                    if(S_sentences.length>=6 && S_sentences.length<8)parameters.S_should_say_count=3;
                                    else parameters.S_should_say_count=4;
                                }
                              
                                
                                //저장은 다했고 랜덤으로 골라내자 랜덤확률에 의해서   S타입중임
                                //losepercent 안에는 알렉사가 질 확률이 들어있음
                                var losepercent_split = parameters.alexa_lost_percentage.split(`/`);
                                var losepercent;
                                losepercent = parseInt(losepercent_split[0],10);
                                /////////////////////////////////////////
                                var mytemp=` `;
                                

                                    for(var i =1 ; i<losepercent_split.length;i++)
                                    {
                                                if(i+1==losepercent_split.length)
                                                {
                                                    mytemp =mytemp.concat(losepercent_split[i]);
                                                }
                                                else
                                                {
                                                    mytemp =
                                                    mytemp.concat(losepercent_split[i]);
                                                    mytemp=mytemp.concat(`/`);
                                                }
                                    }
                                if(losepercent_split.length>1)parameters.alexa_lost_percentage= mytemp;
                           
                           /////////////////
                                var Random_Number=(Math.floor(Math.random() * 100));  
                                if(Random_Number<losepercent)
                                {
                                    //console.log(`알렉사가 지는확률걸림 알렉사의실수피드백`);
                                    //질경우임 losepercent가 80일때 Random_Number가 80보다 작게 나올경우에만
                                    //지는피드백을 붙여주고 니턴이라고 하고 보내자
                                    //왜 저징이 안됩니까? 이해할수 없어
                                    total_speech = total_speech.concat(` `+parameters.alexa_cannotremember_say+` `);
                                    parameters.total_speech = parameters.total_speech.concat(` `+parameters.alexa_cannotremember_say+` `);
                                }
                                else
                                {
                                    //console.log(`알렉사가 제대로하는확률걸림 알렉사의 제대로피드백`);
                                    //이길경우 알렉사가 제대로말함
                                    //랜덤체크중에 하나를 랜덤으로 뽑아내자
                                    parameters.S_A_point++;
                                    while(1)
                                    {
                                        Random_Number =  (Math.floor(Math.random() * parameters.S_sentences_count));   
                                        if(parameters.S_sentences_check[Random_Number] ==0 && Random_Number<=30) break;
                                    }
                                    
                                    total_speech = total_speech.concat(` `+parameters.S_sentences[Random_Number][0]);
                                    parameters.total_speech = parameters.total_speech.concat(` `+parameters.S_sentences[Random_Number][0]);
                                    parameters.S_sentences_check[Random_Number]=1;
                                }
                                // question중 첫 1번
                                // SB개편 question부분 끝
                                return 1;
                            }////S타입끝
                            else if(parameters.type=='M')
                            {
                                results=JSON.parse(JSON.stringify(results));
                               // console.log(`가져온 case_array 메모리타워에서 알렉사 처음말할꺼임`,results);
                                //console.log(`확인:`,results[0].case_array); //여기에 확률 들어 있음
                                parameters.alexa_lost_percentage=results[0].case_array;
                                
                                var should_readdbname = results[1].case_array.substring(1,results[1].case_array.length-1);
                                
                                sql = `SELECT word FROM EDUAI.final_skill_words where name='`+should_readdbname+`';`;
                                
                                return connection.query(sql);
                            }
                            else if(parameters.type=='E')
                            {
                                  return 1; //정상종료할것
                            }
                        }
                        else//셋트경우 처음이건 나중이건 공통임
                        {//셋트의경우임  순서에따른 새로운 question을 긁어온상태임 
                            if(parameters.set_start==2)
                            { //question 처음이라고 보시면됨
                               
                                results =JSON.parse(JSON.stringify(results));
                                //새로가져온결과 :`,results);
                                
                                 var Random_Number=(Math.floor(Math.random() * results[1].length));  
                                parameters.activity = parseInt(results[0][0].activity,10);
                                //console.log(`bbbbbbbbbbbbbb:`,parameters.['activity']);
                                //if(results[0][0].direction)total_speech = total_speech.concat(results[0][0].direction+` `);
                                parameters.type=results[0][0].stype;
                                
                                parameters.read_number=parseInt(results[1][Random_Number].read_number,10);
                                if( parameters.read_number==1)
                                {
                                    total_speech = total_speech.concat(`number `+parameters.should_read+`. `);
                                    parameters.should_read++;
                                    
                                }
                                if(results[1][Random_Number].question)
                                {
                                        total_speech = total_speech.concat(results[1][Random_Number].question+` `);
                                        parameters.question =results[1][Random_Number].question;
                                }
                                    
                                    
                                    
                                parameters.reask_chance = results[0][0].reask_chance;
                                parameters.total_speech = total_speech;
                        
                            
                                
                               
                                if(parameters.Dcheck==3)
                                {
                                        parameters.Dcheck=2;
                                        
                                        sql =`SELECT  case_array,feedback from EDUAI.final_skill_case where qn ='`+parameters.setheadQN
                                        +`' and location ='`+parameters.location+`'; `;
                                        
                                        console.log(`D타입 처음에대한 sql:`,sql);
                                        return connection.query(sql);
                                }
                                else
                                {
                                    return 222;
                                }
                                
                                //여기가 셋트 공통인데 D타입의경우만 222리턴 말고 쿼리 한번 불러오자
                                //parameters.['setheadQN'] 에 대해서 case_array랑  feedback 가져오면댐
                                // location은 그대로
                                //Dcheck이 3인경우만 그렇게 하고 Dcheck을 2으로 바꿔준다 구리고 셋팅하고 0으로 해줘야함
                                
                          
                            }
                            else
                            {
                                
                                return 1;
                            }
                            
                        }
                }
            }).then(function(results){
                 if(results==-1) 
                {
                    return -1;
                }
                else
                {
                    if(parameters.is_set=='N')
                    {
                        if(parameters.type=='R')
                        {
                            if(parameters.isR_ing!=1){//불합격
                                     //R타입 초기셋팅 단계임
                                     //질문 큐를 만들어야함
                                     //랜덤으로 뽑았어야함
                               
                                  return 1;
                                 
                            }
                            else{//진행중일때!
                                if(parameters.isok_bringnextR_que==1){
                                    results= JSON.parse(JSON.stringify(results));
                                    console.log('새로가져온results:',results);
                                    //큐값도 빼주시고.
                                    //results[0][0].direction
                                    //results[0][0].activity
                                    //results[0][0].reask_chance
                    
                                    //results[1][0].question
                                    // question 여러개중에 랜덤으로 골라야 하는가?
                                    //results[1][0].read_number 에 따라서 무조건?
                                    //question 에서 number x.  짤라서 없애자
                                    //@@@@@@@@@@@@@@@@@@@@
                                    console.log('바뀌기전 question:',results[1][0].question);
                                    for(var i = 1 ; i<15;i++){
                                         results[1][0].question=results[1][0].question.replace("number "+i+".","");
                                    }
                                    console.log('number x.제거후:',results[1][0].question);
                                    
                                    parameters.reask_chance=results[0][0].reask_chance;
                                    parameters.R_activity=results[0][0].activity;
                                    
                                    
                                    parameters.number_and_question=' number '+parameters.R_number+'. '+results[1][0].question;
                                    console.log('새로운 number x+question',parameters.number_and_question);
                                    total_speech = total_speech + results[0][0].direction+parameters.number_and_question;
                                    
                                    
                                     return 1;
                                }
                                else{
                                    console.log(`reask_chance가 남았음`);
                                    
                                    total_speech = total_speech + parameters.number_and_question;
                                    
                                    return 1;
                                }
                            }
                                 
                        
                        }
                        else if(parameters.type=='M')
                        {
                            results=JSON.parse(JSON.stringify(results));
                            
                           // console.log(`가져온 메모리타워에서 사용할 DB:`,results);
                            var M_worddb_array = new Array();
                            var M_worddb_array_check = new Array();
                            var Order_total_word = new Array();
                            for( var i = 0 ; i<results.length ; i++)
                            {
                                M_worddb_array[i] =results[i].word.toLowerCase();
                                M_worddb_array_check[i] = 0;
                            }
                            parameters.M_worddb_array =M_worddb_array;
                            parameters.M_worddb_array_check =M_worddb_array_check;
                            //console.log(`(순수추출)M_worddb_array:`,M_worddb_array);
                            var Random_Number=(Math.floor(Math.random() * M_worddb_array.length));  
                            
                           
                            
                            Order_total_word[0] = parameters.M_worddb_array[Random_Number];
                            parameters.Order_total_word= Order_total_word;
                             
                             
                            parameters.M_worddb_array_check[Random_Number] = 1;
                            parameters.total_speech = parameters.total_speech.concat(parameters.M_worddb_array[Random_Number]+`. `);
                            parameters.M_wordcount =1 ;
                            
                            //이걸 지우고
                            //parameters.['question'] = parameters.['question'].concat(parameters.['Order_total_word'][0]+`. `);
                            
                            
                            total_speech = parameters.total_speech;
                            
                            parameters.M_student_should_say = 2;
                            parameters.M_polyrepeat = 0 ;
                            parameters.M_studentpass_index= 0;
                            parameters.M_onlyding=0;
                            
                            return 1;
                            //메모리타워 첫발화 끝
                            
                            
                        }
                        else//G C E S D 셋트가 아닌경우임
                        {
                            
                   
                         console.log(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%:`,total_speech); 
                       
                            return 1;
                            
                        }
                    }
                    else//셋트경우 처음이건 나중이건 공통임
                    {
                        if(parameters.Dcheck==2)
                        {
                            parameters.Dcheck=0;
                            results=JSON.parse(JSON.stringify(results));
                            console.log(`D타입 처음의 결과:`,results);
                                //  여기는 딱한번이라서 여기말고 다른데서 각놈들에 대한 포인트를 다 구해야할듯 그래서 니 점수 이거 맞추면 몇점이야 말해야함
                                
                                //[3]feedback  걍못하고 통과못함
                                //[4]feedback  마지막은 맞췄는데 점수 못얻음
                                //[5]feedback  중간에 통과함
                                //[1]case_array  D셋트의 통과점수
                                parameters.D_final_no_fail = results[3].feedback;
                                parameters.D_final_ok_fail = results[4].feedback;
                                parameters.D_final_ok_pass= results[5].feedback;
                                parameters.D_pass_grade = parseInt(results[1].case_array,10);
                                parameters.D_student_grade=0;
                                
                            return 1;
                        }
                        else
                        {
                            return 1;
                        }
                    }
                }
                
            }).then(function(results){
                connection.end();
                if(results==-1)
                {
                    console.log(`Error! can not load Direction`);
                    resolve1('ok resolve1');
                    resolve2('ok resolve2');
                    conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                    conv.close('<speak>'+`Error! can not load Direction`+'</speak>');
                    //this.emit(':tell',`Error! can not load Direction`);
                }
                else if(parameters.is_set=='N') //세트로 안묵는경우
                {
                    if(parameters.type=='R')
                    {
                        if(parameters.isR_ing==1){
                              var realthis=this;
                              
                              parameters.total_speech=total_speech;
                            
                            //
                            
                               set_total_speech(total_speech,parameters.Speed_S,parameters).then(function(results){
                                    total_speech=results;
                                    console.log(`*************************************************************************`);
                                    console.log(`***alexa say:`,total_speech,`***`);
                                    console.log(`*************************************************************************`);

                                    //   conv.ask('<speak>'+parameters.Speed_S+parameters.total_speech+Speed_E+'</speak>');
                                    resolve1('ok resolve1');
                                    resolve2('ok resolve2');
                                    conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                                    conv.ask('<speak>'+parameters.Speed_S+parameters.total_speech+Speed_E+'</speak>');
                                    //realthis.emit(':ask', `${Speed_S}${total_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                                });
                        }
                        else{
                            parameters.QN=Rtype_donot_qnmove;
                            parameters.QuerryLoad_Possible=1;
                            //total_speech+=` R type doesn't satisfied. `;///////수정요망
                            parameters.total_speech=total_speech;
                            parameters.isR_ing=0;
                            //R타입 조건 충족 못하는경우...
                            //#@!
                       
                            question(parameters,conv,resolve1)
                            .then(function(results_resolve3){
                                console.log(results_resolve3);
                            });

                            //this.emit('Question');  
                        }
                            
                    }
                    else if(parameters.type=='E')
                    {
                       
                        var realthis=this;
                        set_total_speech(total_speech,parameters.Speed_S,parameters).then(function(results){
                            total_speech=results;
                            console.log(`*************************************************************************`);
                            console.log(`***alexa say:`,total_speech,`***`);
                            console.log(`*************************************************************************`);
                            resolve1('ok resolve1');
                            resolve2('ok resolve2');
                            conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                            conv.close('<speak>'+parameters.Speed_S+parameters.total_speech+Speed_E+'</speak>');
                            //realthis.emit(':tell', `${Speed_S}${total_speech}${Speed_E}`);  
                        });
                        
                                                  
                        

                    }
                    else //G C E M S
                    {
                     
                   
                        set_total_speech(total_speech,parameters.Speed_S,parameters).then(function(results){
                            total_speech=results;
                            console.log(`*************************************************************************`);
                            console.log(`***alexa say:`,total_speech,`***`);
                            console.log(`*************************************************************************`);
                            resolve1('ok resolve1');
                            resolve2('ok resolve2');
                            conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                            conv.ask('<speak>'+parameters.Speed_S+parameters.total_speech+Speed_E+'</speak>');
                        });
                      
                    }
                }
                else if(parameters.is_set=='Y') // G C
                {
              
                        set_total_speech(total_speech,parameters.Speed_S,parameters).then(function(results){
                            total_speech=results;
                             console.log(`*************************************************************************`);
                            console.log(`***alexa say:`,total_speech,`***`);
                            console.log(`*************************************************************************`);
                           // realthis.emit(':ask', `${Speed_S}${total_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                           resolve1('ok resolve1');
                           resolve2('ok resolve2');
                           conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                          conv.ask('<speak>'+parameters.Speed_S+parameters.total_speech+Speed_E+'</speak>');
                        });
           
                           
                   
                }
                else
                {
                    resolve1('ok resolve1');
                    resolve2('ok resolve2');
                    conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                    conv.close('<speak>'+parameters.Speed_S+`error can not load is_set at parameters!`+Speed_E+'</speak>');
                   // this.emit(':tell',`error can not load is_set at parameters!`);
                }
            }.bind(this));
        }//QuerryLoad_Possible ==1 경우만
        
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        else//QuerryLoad_possible =0 경우
        {
            var total_speech=parameters.total_speech;
            if(parameters.type=='G' || parameters.type=='C' || parameters.type=='D')
            {
                
                if( parameters.read_number==1) total_speech = total_speech.concat(`number `+(parameters.should_read-1)+`. `);
                
                total_speech = total_speech.concat(` `);
                total_speech = total_speech.concat(parameters.question);
                parameters.total_speech = total_speech;
                
               // var realthis=this;
                set_total_speech(total_speech,parameters.Speed_S,parameters).then(function(results){
                     total_speech=results;
                        console.log(`*************************************************************************`);
                    console.log(`***alexa say:`,total_speech,`***`);
                    console.log(`*************************************************************************`);
                    
                   // realthis.emit(':ask', `${Speed_S}${total_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                   resolve1('ok resolve1');
                   resolve2('ok resolve2');
                   conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                   conv.ask('<speak>'+parameters.Speed_S+parameters.total_speech+Speed_E+'</speak>');
                });
              
                 
                    
             
                   
            }// question중 2번쨰이상부터
            else if(parameters.type=='S')
            {
                //var realthis=this;
                set_total_speech(total_speech,parameters.Speed_S,parameters).then(function(results){
                    total_speech=results;
                     console.log(`*************************************************************************`);
                console.log(`***alexa say:`,total_speech,`***`);
                console.log(`*************************************************************************`);
                resolve1('ok resolve1');
                resolve2('ok resolve2');
                conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                conv.ask('<speak>'+parameters.Speed_S+parameters.total_speech+Speed_E+'</speak>');
                //realthis.emit(':ask', `${Speed_S}${total_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                });
            
                  
                    
              
               
                
            }
            else if(parameters.type=='M')
            {
                if(parameters.M_onlyding==1)
                {
                    //total_speech = `say next!`;
                    total_speech = ``;
                    //
                    //여기엔 니가 여기까지 이야기했어 라고 한번 해주자
                
                    console.log(`*************************************************************************`);
                    console.log(`***alexa say:`,total_speech,`***`);
                    console.log(`*************************************************************************`);
                    resolve1('ok resolve1');
                    resolve2('ok resolve2');
                    conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                    conv.ask('<speak>'+parameters.Speed_S+parameters.total_speech+Speed_E+'</speak>');
                    //this.emit(':ask', `${Speed_S}${total_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                }
                else if(parameters.M_onlyding==0 && parameters.M_polyrepeat==1)
                {
                    parameters.M_polyrepeat=0;
                    total_speech = total_speech.concat(` `);
                    total_speech = total_speech.concat(parameters.question+` `);
                    for(var i = 0 ; i <parameters.M_wordcount; i++)
                    {
                        total_speech = total_speech.concat(parameters.Order_total_word[i]+`. `);
                    }
                    parameters.total_speech = total_speech;
    
                    //var realthis=this;
                    set_total_speech(total_speech,parameters.Speed_S,parameters).then(function(results){
                        total_speech=results;
                        console.log(`*************************************************************************`);
                        console.log(`***alexa say:`,total_speech,`***`);
                        console.log(`*************************************************************************`);
                        resolve1('ok resolve1');
                        resolve2('ok resolve2');
                        conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                        conv.ask('<speak>'+parameters.Speed_S+parameters.total_speech+Speed_E+'</speak>');
                      //  realthis.emit(':ask', `${Speed_S}${total_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                        
                    });
                 
                       
                        
                    
                 
                }
                else
                {
                    //var realthis=this;
                    set_total_speech(total_speech,parameters.Speed_S,parameters).then(function(results){
                        total_speech=results;
                        console.log(`*************************************************************************`);
                        console.log(`***alexa say:`,total_speech,`***`);
                        console.log(`*************************************************************************`);
                        resolve1('ok resolve1');
                        resolve2('ok resolve2');
                        conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                        conv.ask('<speak>'+parameters.Speed_S+parameters.total_speech+Speed_E+'</speak>');
                       // realthis.emit(':ask', `${Speed_S}${total_speech}${Speed_E}${beep}`, `Please say that again.${beep}`);
                        
                    });
             
                }
            }
            else
            {
                //this.emit(':tell',`QuerryLoad_Possible=0 -> elsetype not yet`);
                resolve1('ok resolve1');
                resolve2('ok resolve2');
                conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                conv.close('<speak>'+parameters.Speed_S+`QuerryLoad_Possible=0 -> elsetype not yet`+Speed_E+'</speak>');
            }
        }//QuerryLoad_possible=0 경우
     
    });
}


//####################################################################################################



// Register handlers for Dialogflow intents
ap.intent('Default Welcome Intent', conv => {
    //console.log('conv:',conv);

    console.log('@@@@@@@@@@@@Default Welcome Intent@@@@@@@@@@@@@');
    conv.ask(new SignIn('To get your account details'));
    /*
    conv.ask(`this is my cat picture`);
    conv.ask(new Image({
        url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
        alt: 'A cat',
    }))
    conv.ask(`is it cute`);
    */
})

ap.intent('Answer', (conv, input) => {
    console.log('@@@@@@@@@@@@Answer@@@@@@@@@@@@@');
    console.log('conv:',conv);

    var location = conv.contexts.input.mysession.parameters.location;
    var QN = conv.contexts.input.mysession.parameters.QN;

    console.log(`location:`,location);
    console.log(`QN:`,QN);

    const parameters = { // Custom parameters to pass with context
        'location': location,
        'QN':QN,
        'total_speech':total_speech,
        'oauth_user_id':oauth_user_id,
    };

    conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
    console.log('############################');
    
    /*
    console.log('input:',input);
   
    console.log(`input.any:`, input.any);
    */
    //Carousel  예제

    conv.ask(new SimpleResponse(`Answer Intent! you said that! ${input.any}`));
});

// 여기서 시작하면 XXX
ap.intent('SignIn POLY', (conv,params, signin) => {
   
      if (signin.status === 'OK') {
        //console.log('###########conv###############');
        //console.log(conv);

        /*
        console.log(`params:`,params);
        console.log(`signin:`,signin);
       
       console.log('#######################conv.user#######################');
       console.log(conv.user);
       */
       console.log('#######################conv.user.access.token#######################');
       console.log(conv.user.access.token);
       console.log('##########################################################');
       var token = conv.user.access.token;
       var options={
        url:`https://devoauth.koreapolyschool.com:443/api/user/profile`,
        headers:{'Authorization':'Bearer '+token},
       };//oauth2.0 option설정

       if(token){
        ////////////오쓰 요청
            return new Promise(function (resolve1,reject){
                request.get(options,(error,response,body)=>{
                    if(error){
                        console.log(`###############`+`resolve false`+`###############`);
                       reject(false);
                    }
                    else{
                       body = JSON.parse(body);
                       console.log(body);
                       console.log(`###############`+`resolve body`+`###############`);
                       resolve1(body);
                    }
               });
            }).then(function(body){
                console.log(`###############`+`oauth 성공`+`###############`);
                console.log(`id:`,body.user_id);
               return body;
            }).catch(function(error){
                console.log('my request oauth2.0 error:',error);
                conv.ask(`oauth2.0 request error`);
            }).then(function(body){
                console.log('do another job:',body.user_id);
              
              
                var sql;
                var connection;
                var total_speech='Welcome to Power Wizard. ';

                const parameters = { // Custom parameters to pass with context
                    'location': 'not yet location',
                    'QN':'not yet qn',
                    'total_speech':total_speech,
                    'oauth_user_id':'not yet oauth user id',
                    'Speed_S': ` <prosody rate="x-fast">  `,
                    'QuerryLoad_Possible':1,
                };

                return new Promise(function(resolve2,reject2){
                 
                    //성공했으면 DB에 기록합니다
                    mysql.createConnection(config).then(function(conn){
                 
                       // console.log(`body.user_id`,body.user_id);
                       // console.log(`body.name`,body.name);
                       // console.log(`body.email`,body.email);
                       //oauth_user_id=body.user_id;
                        console.log(`%%% Lanuch에서 new_skill_launch 프로시저 실행시도`);
                        sql=`call final_skill_launch("`+body.user_id+`","`+body.name+`","`+body.email+`");`;

                        parameters.oauth_user_id=body.user_id;
                        console.log(`sql:`,sql);
                        connection = conn;
                        return conn.query(sql);
                    }).then(function(results){
                        connection.end();
                        resolve2(results);
                        console.log('resolve2호출함');
                    });
                }).then(function(resolve2){
                    console.log('resolve2상태');
                    resolve2 =JSON.parse(JSON.stringify(resolve2[0]));
                    resolve2 = resolve2[0];
                    //console.log(`results.qn:`,results.qn);
                    
                    parameters.QN=parseInt(resolve2.qn,10);
                    parameters.location = resolve2.location;

                    console.log('location:',parameters.location);
                    console.log('QN:',parameters.QN);
                    //console.log('ap.getContext():',ap.getContext());
                    ////////////////////////////// dialogflow session 찾아볼것!!!
                    //console.log(conv);


                    var location = parameters.location;

                    if(location.substr(0,2)=='sw')
                    {
                        var u_n=location.substr(6,8);
                        var p_n=location.substr(10,12);
                        if(u_n[0]=='0')
                        {
                            u_n = u_n[1];
                        }
                        if(p_n[0]=='0')
                        {
                            p_n = p_n[1];
                        }
                              if(parameters.QN<=1)
                              {
                                  //처음
                                  total_speech+=` Unit `+u_n+`. Period `+p_n+`. `;
                              }
                              else
                              {
                                 total_speech+=` Last time, we were studying Unit `
                                   +u_n+`. Period `+p_n+`. Let's continue that lesson. `;
                              }
                    }

                    parameters.total_speech = total_speech;

                    return new Promise(function(resolve1){

                        question(parameters,conv,resolve1)
                        .then(function(results_resolve2){
                            console.log(`resolve2:`,results_resolve2);
                            
                        });
                   
                    }).then(function(results_resolve1){
                        console.log(`resolve1:`,results_resolve1);
                        //console.log(parameters);
                    });

                      
                }).catch(function(error){
                    if(connection && connection.end) connection.end();
                    console.log(`mysql DB 엑세스 에러:`,error);
                });
            });    
       }
       else{
         console.log('access token이 없음');
         conv.ask(`accesstoken error, does not exist`);
       }

      } 
      else { //signin.status  isn't "ok"
            /*
            console.log(`conv:`,conv);
            console.log(`params:`,params);
            console.log(`signin:`,signin);
            */
          console.log('dialogflow에서 건너온 데이터 status 가 ok가 아님');
          conv.ask(`I won't be able to save your data, but what do you want to do next?`);
      }
});

ap.intent('Stop',conv=>{
    console.log('conv:',conv);
    conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
    conv.close('good bye bye bye!');
});
   

ap.intent('Default Fallback Intent', conv => {
    console.log('conv:',conv);
    conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
    conv.ask(`I didn't understand. Can you tell me something else?`)
});



function set_feedback_dbname(dbdata,feedback){
    console.log(`@@@ set_feedback_dbname@@@`);
    var changed_feedback=``;
    var splitfeedback=``;
    if(feedback) splitfeedback= feedback.split(`/`);
    
    for(var i = 0 ; i<splitfeedback.length;i++)
    {
        if(splitfeedback[i].substring(0,4)==`%fb_`)
        {
            ///dbdata에 맞는 name을 검사해서 랜덤으로 하나 뽀ㅃ아서 바꿔줘야함
            var finddb = splitfeedback[i].substring(4,splitfeedback[i].length);
            console.log(`finddb:`,finddb);
            var isok=0;
            
            var gatherdb =new Array();
            var gatherdbindex=0;
            
            for(var j = 0 ; j<dbdata.length ; j++)
            {
                if(finddb == dbdata[j].name)
                {
                    isok=1;
                    gatherdb[gatherdbindex] =dbdata[j].feedback;
                    gatherdbindex++;
                }
            }
            
            if(isok==1)
            {
                console.log(`@@@@@@@@@@@@@@@gatherdb 확인:`,gatherdb);
                
                var Random_Number=(Math.floor(Math.random() * gatherdb.length));  
                //gatherdb.length 만큼 random 숫자 뽑아서 gatherdb[random숫자] 를 concat
                changed_feedback = changed_feedback.concat(gatherdb[Random_Number]);
            }
            
            if(isok==0)
            {
                changed_feedback = changed_feedback.concat(`#can't find data#`);
            }
        }
        else if(splitfeedback[i].substring(0,1)==`%`||splitfeedback[i].substring(0,1)==`#`)
        {
            changed_feedback = changed_feedback.concat(`/`+splitfeedback[i]+`/`);
        }
        else
        {
            changed_feedback = changed_feedback.concat(splitfeedback[i]);
        }
    }
    return changed_feedback; 
}

function get_feedback_dbname(checkfeedback){
    console.log(`@@@ get_feedback_dbname @@`);
    var dbnameindex=0;
    var dbarray = new Array();
    for(var i = 0 ; i<checkfeedback.length;i++)
    {
        
       //console.log(`갈갈갈:`,checkfeedback[i].substring(0,4));
       if(checkfeedback[i].substring(0,4)== '%fb_')
       { 
           dbarray[dbnameindex] = checkfeedback[i].substring(4,checkfeedback[i].length);
           dbnameindex++;
       }
    }
    return dbarray;
}


function set_total_speech(speech2,originspeed,parameters){
    return new Promise(function(resolve){
        
    
        console.log(`@@@ set_alexa_speech@@`);
        var state=0;
        var speech_when_state1;
        var set_new_speech=``;
        var speech;
        if(speech2) speech= speech2.split('/');

     
     
        function forEachPromise(speech,fn){
            return speech.reduce(function(promise,item){
                return promise.then(function(){
                   return fn(item);//speech[0]이 끝나고나서 speech[1]을 함 
                });
            },Promise.resolve());
        }
        
        
        function logItem(speech){
            //반복문이 여기서 실행됨
            return new Promise((resolve,reject)=>{
                process.nextTick(()=>{
                    
                
               if( speech[0]== '%')
                    {
                        console.log(`% 들어옴!`);
                        
                       // console.log(`speech[i].substring(1,5)`,speech[i].substring(1,5));
                        if(speech.substring(1,5)=='wait')
                        {
                            
                            set_new_speech = set_new_speech.concat(`<break time='`);
                            set_new_speech = set_new_speech.concat(parseInt(speech.substring(6,7),10));
                            set_new_speech = set_new_speech.concat(`00ms'/>`);
                            //console.log(`set_new_speech:`,set_new_speech);
                        
                        }
                        else if(speech.substring(1,8)=='shuffle')
                        {
                            console.log(`shuffle 들어옴!!`);
                            if(speech.substring(9,10)=='s')
                            {
                                console.log(`shuffle _s들어옴!!`);
                                state=1;
                                
                            }
                            else if(speech.substring(9,10)=='e')
                            {
                                 console.log(`shuffle _e들어옴!!`);
                                state=0;
                                
                                for (var k = speech_when_state1.length - 1; k > 0; k--)
                                {
                                       let j = Math.floor(Math.random() * (k + 1));
                                        [speech_when_state1[k], speech_when_state1[j]] = [speech_when_state1[j], speech_when_state1[k]];
                                }
                                
                                for( var k = 0  ; k <speech_when_state1.length ; k++)
                                {
                                    set_new_speech = set_new_speech.concat(` `+speech_when_state1[k]+`. `);
                                }
                                set_new_speech = set_new_speech.concat(` `);
                                    
                            }
                      
                        }
                        else if(speech.substring(1,6)=='today')
                        {
                            console.log(`today 들어옴!`);
                            if(speech.substring(7,10)=='day')
                            {
                            
                                var aa = new Date();
                                var day= aa.getDay(); //요일
                                if(day==1) set_new_speech = set_new_speech.concat(`Monday! `);
                                else if(day==2) set_new_speech = set_new_speech.concat(`Thuesday! `);
                                else if(day==3) set_new_speech = set_new_speech.concat(`Wednesday! `);
                                else if(day==4) set_new_speech = set_new_speech.concat(`Thursday! `);
                                else if(day==5) set_new_speech = set_new_speech.concat(`Friday! `);
                                else if(day==6) set_new_speech = set_new_speech.concat(`Saturday! `);
                                else if(day==7) set_new_speech = set_new_speech.concat(`Sunday! `);
                            }
                            else if(speech.substring(7,14)=='weather')
                            {
                                
                                        set_new_speech = set_new_speech.concat(parameters.weather);
    
                            }
                            
                      
                        }
                        else if(speech.substring(1,5)=='beep')
                        {
                            set_new_speech = set_new_speech.concat(` <say-as interpret-as='expletive'>.ong.</say-as> `);
                       
                        }
                        else if(speech.substring(1,6)=='sound')
                        {
                            
                            var soundfilename = speech.substring(7,speech.length);
                            //console.log(`변환중 soundfilename:`,soundfilename);
                            var soundfilenamesplit = soundfilename.split(`-`);
                            //console.log(`soundfilenamesplit:`,soundfilenamesplit);
                            set_new_speech = set_new_speech.concat(`<audio src='https://s3.amazonaws.com/eduai/`+soundfilenamesplit[0]+`/`);
                            if(soundfilenamesplit[1][0]=='u')
                            {
                                
                                set_new_speech = set_new_speech.concat(soundfilenamesplit[1]+`/`+soundfilenamesplit[2]+`/`+soundfilename+`.mp3'/> `);
                            }
                            else
                            {
                                set_new_speech = set_new_speech.concat(soundfilename+`.mp3'/> `);
                            }
                         
                            
                        }
                        else if(speech.substring(1,6)=='speed')
                        {
                            var speed = parseInt(speech.substring(7,8),10);
                            var startorstop = speech.substring(9,10);
                            var Speed_S =`<prosody rate='medium'>` ;
                            if(speed==1)
                            {
                                Speed_S =`<prosody rate='x-slow'>` ;
                            }
                            else if(speed ==2)
                            {
                                Speed_S =`<prosody rate='slow'>` ;
                            }
                            else if(speed ==3)
                            {
                                Speed_S =`<prosody rate='medium'>` ;
                            }
                            else if(speed ==4)
                            {
                                Speed_S =`<prosody rate='fast'>` ;
                            }
                            else if(speed ==5)
                            {
                                Speed_S =`<prosody rate='x-fast'>` ;
                            }
                            
                            if(startorstop =='s')
                            {
                                set_new_speech = set_new_speech.concat(Speed_E+` `+Speed_S);
                            }
                            else if(startorstop=='e')
                            {
                                set_new_speech = set_new_speech.concat(Speed_E+` `+originspeed);//여기 인자로 받아올것
                            }
                            
                        }
                        else
                        {
                            set_new_speech = set_new_speech.concat(`/`+speech+`/`);
                        }
                        
                        resolve();  
                    }
                    else if(speech[0]== '#')
                    {
                       var dbname = speech.substring(1,speech.length-1);
                        //console.log(`으아:`,dbname);
                    
                       
                                   
                           
                            get_specialdb(parameters.oauth_user_id,dbname).then(function (results){
                   
                                if(results&&results[0].remember_data){
                                      //console.log(`꺅`+results[0].remember_data);
                                    set_new_speech=set_new_speech.concat(results[0].remember_data+` `);
                                    console.log(`꺅`+set_new_speech);
                                }
                                else{
                                      set_new_speech = set_new_speech.concat(`#can't load things# `);
                                }
                                resolve();    
                            });
                           
                       
                          
                          
                        
                    }
                    else
                    {
                        if(state==0)
                        {
                            set_new_speech = set_new_speech.concat(speech);
                        }
                        else
                        {
                            speech_when_state1 = speech.split(` `);
                        }
                        resolve();  
                    }
                    
                    
                });
                
            });
        }
        
        
        
        forEachPromise(speech, logItem).then(()=>{ 
          
             //다하고나서 최종임
             
              resolve(set_new_speech);
        });
    
    });  
}


function set_specialdb(oauth_id,dbname,dbdata){
    console.log(`#####set_specialdb####`);
    
    get_specialdb(oauth_id,dbname).then(function(results){
          results=JSON.parse(JSON.stringify(results));
         // console.log(`*************************`+results);
        if(results[0]){
            var connection;
            var sql=`Update EDUAI.final_skill_student_info_temp 
            set remember_data="`+dbdata+`" where idx_student_info=(select idx from EDUAI.final_skill_student_info
            where oauth_id="`+oauth_id+`") and dbname="`+dbname+`";`;
            mysql.createConnection(config).then(function (conn) {
                //console.log(`sql:`, sql);
                connection = conn;
                return conn.query(sql);
            }).then(function (results) {
                connection.end();
    
            });
        }
        else{
            var connection;
            var sql=`insert into EDUAI.final_skill_student_info_temp 
            values(default,(select idx from EDUAI.final_skill_student_info where oauth_id="`+oauth_id+`"),"`+dbname+`","`+dbdata+`");`;
       
            mysql.createConnection(config).then(function (conn) {
                //console.log(`sql:`, sql);
                connection = conn;
                return conn.query(sql);
            }).then(function (results) {
                connection.end();
    
            });
            
        }
    });
   
}


function get_specialdb(oauth_id ,dbname){
    return new Promise(function(resolve1){
         console.log(`#####get_specialdb####`);
        var connection;
        var sql=`SELECT l.remember_data FROM EDUAI.final_skill_student_info_temp AS l 
        Join EDUAI.final_skill_student_info As r ON l.idx_student_info = r.idx
        where r.oauth_id = "`+oauth_id+`" and l.dbname="`+dbname+`";`;
   
        mysql.createConnection(config).then(function (conn) {
            //console.log(`sql:`, sql);
            connection = conn;
            return conn.query(sql);
        }).then(function (results) {
            connection.end();
            results=JSON.parse(JSON.stringify(results));
            resolve1(results);
        });
        
    });
}


var config = {
    host     : '125.60.70.36',//'10.0.0.108,53380',
    port     : '43306',
    user     : 'app_eduai',
    password : 'Dpebdpdldkdl12%#%',
    database : 'EDUAI',
    multipleStatements: true,
};
  
  

module.exports = router;
