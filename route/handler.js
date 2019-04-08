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
    console.log('conv.contexts.output.location:',conv.contexts.output['location']);
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
        console.log('###########conv###############');
        JSON.parse(JSON.stringify(conv));
        console.log(conv);

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
                return new Promise(function(resolve2,reject2){
                    var sql;
                    var connection;
                    //성공했으면 DB에 기록합니다
                    mysql.createConnection(config).then(function(conn){
                 
                       // console.log(`body.user_id`,body.user_id);
                       // console.log(`body.name`,body.name);
                       // console.log(`body.email`,body.email);
                       //oauth_user_id=body.user_id;
                        console.log(`%%% Lanuch에서 new_skill_launch 프로시저 실행시도`);
                        sql=`call final_skill_launch("`+body.user_id+`","`+body.name+`","`+body.email+`");`;
                        oauth_user_id=body.user_id;
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
           

                    conv.ask(`I got data`);
                    const User_Contexts={
                    }
                    conv.contexts.set('location',location,User_Contexts);
                    
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
