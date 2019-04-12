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
const Speed_S = ` <prosody rate='medium'> `;

function question(parameters){
    return new Promise(function(resolve1){
        console.log('question function call');
        console.log('parameters:',parameters);
        parameters.total_speech+=' question call success! ';
        console.log('parameters:',parameters);

        resolve1('okay');



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
              
                var oauth_user_id;
                var QN;
                var location;
                var sql;
                var connection;
                var total_speech='Welcome to Power Wizard. ';

                const parameters = { // Custom parameters to pass with context
                    'location': location,
                    'QN':QN,
                    'total_speech':total_speech,
                    'oauth_user_id':oauth_user_id,
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
                    
                    QN=parseInt(resolve2.qn,10);
                    location = resolve2.location;
                    console.log('location:',location);
                    console.log('QN:',QN);
                    //console.log('ap.getContext():',ap.getContext());
                    ////////////////////////////// dialogflow session 찾아볼것!!!
                    console.log(conv);


                    conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함


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
                              if(QN<=1)
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

                        question(parameters).then(function(results){
                            if(results=='okay'){
                                console.log('question 함수에서 잘 가져왔습니다');

                                resolve1('reokay');
                            }
                        })

                    }).then(function(results){
                        if(results=='reokay'){

                            console.log('reokay success');
                            conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                            conv.ask(parameters.total_speech);
                        }
                        else{
                            console.log('reokay fail');
                            conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
                            conv.ask(`reokay fail`);
                        }
                      
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
    conv.close('good bye bye bye!');
});
   

ap.intent('Default Fallback Intent', conv => {
    console.log('conv:',conv);
    conv.ask(`I didn't understand. Can you tell me something else?`)
});




var config = {
    host     : '125.60.70.36',//'10.0.0.108,53380',
    port     : '43306',
    user     : 'app_eduai',
    password : 'Dpebdpdldkdl12%#%',
    database : 'EDUAI',
    multipleStatements: true,
};
  
  

module.exports = router;
