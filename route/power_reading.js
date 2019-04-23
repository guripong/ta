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
ap.intent('Answer', (conv, input,option) => {
    console.log('@@@@@@@@@@@@Answer@@@@@@@@@@@@@');
   

    var speak=conv.arguments.raw.input.text.rawText;
    console.log('speak:',speak);

    if(speak.indexOf('type 1')!==-1)
    {
        conv.ask(`you said that ${speak}.  here is basic card example`);
        conv.ask(new Suggestions(['suggestion 1', 'suggestion 2']));
        conv.ask(new BasicCard({
            title: 'My Cat',
            subtitle: `what i heard: ${speak}`,
            text: `   😂😃😄😅 📱.  \n
            MY NAME IS **JOHN**  \n
            https://www.fileformat.info/info/unicode/block/emoticons/list.htm  \n
            overflow \n
            overflow \n
            `, // Note the two spaces before '\n' required for a line break to be rendered in the card.    
            buttons: new Button({
            title: 'This is a button',
            url: 'https://assistant.google.com/',
            }),
            //buttons X 구글홈허브
            image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/cat1.jpg',
            alt: 'Image alternate text',
            width : 200,
            heigh : 200,
            }),
            
            //display: 'WHITE', //WHITE(white bar) , CROPPED, DEFAULT(gray bar) //https://developers.google.com/actions/reference/rest/Shared.Types/ImageDisplayOptions
            //display  X 구글홈허브
        }));
    }
    else if(speak.indexOf('type 2')!==-1){
        console.log('음악예제');
   
        conv.ask(new SimpleResponse(`you said that ${speak}. here is MediaObject example`));
        conv.ask(new Suggestions(['suggestion 1', 'suggestion 2']));
        conv.ask(new MediaObject({
          name: 'Jazz in Paris',
          url: 'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
          description: 'A funky Jazz tune',
          icon: new Image({
            url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
            alt: 'Ocean view',
          }),
        }));
        
    }
    else if(speak.indexOf('type 3')!==-1){
        conv.ask(new SimpleResponse(`you said that ${speak}. here is List example`));
        conv.ask(new Suggestions(['suggestion 1', 'suggestion 2']));
        conv.ask(new List({
            title: 'List Title',
            items: {
              // Add the first item to the list
              'SELECTION_KEY_ONE': {
                synonyms: [
                  'apple',
                  'synonym 2',
                  'synonym 3',
                ],
                title: 'Title of First List Item',
                description: 'This is a description of a list item.',
                image: new Image({
                  url: 'https://s3.amazonaws.com/eduai/test_image/cat1.jpg',
                  alt: 'Image alternate text',
                }),
              },
              // Add the second item to the list
              'SELECTION_KEY_GOOGLE_HOME': {
                synonyms: [
                  'Google Home Assistant',
                  'Assistant on the Google Home',
              ],
                title: 'Google Home',
                description: 'Google Home is a voice-activated speaker powered by ' +
                  'the Google Assistant.',
                image: new Image({
                  url: 'https://s3.amazonaws.com/eduai/test_image/cat1.jpg',
                  alt: 'Google Home',
                }),
              },
              // Add the third item to the list
              'SELECTION_KEY_GOOGLE_PIXEL': {
                synonyms: [
                  'Google Pixel XL',
                  'Pixel',
                  'Pixel XL',
                ],
                title: 'Google Pixel',
                description: 'Pixel. Phone by Google.',
                image: new Image({
                  url: 'https://s3.amazonaws.com/eduai/test_image/cat1.jpg',
                  alt: 'Google Pixel',
                }),
              },
            },
          }));
    }
    else{
        conv.ask(`you said that ${speak}`);
    }


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

ap.intent('actions.intent.OPTION', (conv, params, option) => {
    console.log(option);
    let response = 'You did not select any item';
    if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
      response = SELECTED_ITEM_RESPONSES[option];
    }
    conv.ask(response);
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

               conv.ask(`Welcome to Power reading! say anythings!`);


             
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

    conv.close(`OK. Close 'Power reading'. Bye.`);
   
});

module.exports = router;
