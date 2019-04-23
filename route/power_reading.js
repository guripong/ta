var express = require('express');
const request = require('request');
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
    clientId: `power_reading`,
});

router.post('/', ap);
ap.intent('Answer', (conv, input) => {
    console.log('@@@@@@@@@@@@Answer@@@@@@@@@@@@@');
   

    var speak=conv.arguments.raw.input.text.rawText;
    console.log('speak:',speak);

    conv.ask(new BasicCard({
        text: `BasicCard Example! \n Speak: ${speak}!!`, // Note the two spaces before '\n' required for
                                     // a line break to be rendered in the card.
        subtitle: 'This is a subtitle',
        title: 'Title: this is a title',
        buttons: new Button({
          title: 'This is a button',
          url: 'https://assistant.google.com/',
        }),
        image: new Image({
          url: 'https://s3.amazonaws.com/eduai/test_image/cat1.jpg',
          alt: 'Image alternate text',
        }),
        display: 'CROPPED',
      }));
    /*
    ////////////////Image 예제////////
    conv.ask(`you said that ${speak}`);
    conv.ask(new Image({
        url: 'https://s3.amazonaws.com/eduai/test_image/cat1.jpg',
        alt: 'A cat',
    }))
    conv.ask(`say anything again!`);
    */
});


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
});
ap.intent('Default Fallback Intent', conv => {
    //console.log('conv:', conv);
    conv.contexts.set('mysession', 1, parameters); //다음발화때 유용함
    conv.ask(`I didn't understand. Can you tell me something else?`)
});

ap.intent('Oauth', (conv, params, signin) => {
    console.log('######################Oauth@@@@@@@@@@@@@@@@@@');
    if (signin.status === 'OK') {
   
        console.log('#######################conv.user.access.token#######################');
        console.log(conv.user.access.token);
        console.log('##########################################################');
        var token = conv.user.access.token;
        var options = {
            url: `https://devoauth.koreapolyschool.com:443/api/user/profile`,
            headers: { 'Authorization': 'Bearer ' + token },
        };//oauth2.0 option설정

        if (token) {
            ////////////오쓰 요청
            return new Promise(function (resolve1, reject) {
                request.get(options, (error, response, body) => {
                    if (error) {
                        console.log(`###############` + `resolve false` + `###############`);
                        reject(false);
                    }
                    else {
                        body = JSON.parse(body);
                        console.log(body);
                        console.log(`###############` + `resolve body` + `###############`);
                        resolve1(body);
                    }
                });
            }).then(function (body) {
                console.log(`###############` + `oauth 성공` + `###############`);
                console.log(`id:`, body.user_id);
                return body;
            }).catch(function (error) {
                console.log('my request oauth2.0 error:', error);
                conv.ask(`oauth2.0 request error`);
            }).then(function (body) {
                console.log('do another job:', body.user_id);

               conv.ask(`Welcome to Power Reading! say anythings!`);


             
            });
        }
        else {
            console.log('access token이 없음');
            conv.close(`accesstoken error, does not exist`);
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

ap.intent('Stop', conv => {

    conv.close(`OK. Close Power Reading. Bye.`);
   
});

module.exports = router;
