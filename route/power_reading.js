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
  LinkOutSuggestion,
  BrowseCarousel,
  BrowseCarouselItem,

} = require('actions-on-google')

const ap = dialogflow({
  debug: true,
  clientId: `power_reading`,
});
const kind_of_suggestions = [
  'type 1',
  'type 2',
  'type 3',
  'type 4',
  'type 5',
];

router.post('/', ap);
ap.intent('Answer', (conv, input, option) => {
  console.log('@@@@@@@@@@@@Answer@@@@@@@@@@@@@');

  //console.log('option:',option);
  var speak = conv.arguments.raw.input.text.rawText;
  var parameters = conv.contexts.input.mysession.parameters;
  if (speak) speak = speak.toLowerCase();
  else {
    conv.close('something is wrong, plz talk to john');
  }
  console.log('speak:', speak);

  if (parameters.location == 'first' && parameters.QN == 0) {
    /////////////첫메뉴의 경우임
    if (speak.indexOf('1') != -1 || speak.indexOf('one') != -1 || speak.indexOf('pre-reading overview') != -1) {
      console.log('E1처음');
      parameters.QN = 1;
      parameters.location = 'E1';
      conv.contexts.set('mysession', 1, parameters);
      conv.ask(new SimpleResponse({
        speech: `Let's recall the story, Inchoworm's Tale. Do you remember where the story took place? Where was the story set?`,
        text: 'nothing.',
      }));
      conv.ask(new BasicCard({
        title: 'Story Overview',
        subtitle: `Inchworm's Tale`,
        text: `Let's recall the characters and the main theme of the sotry.`,

        image: new Image({
          url: 'https://s3.amazonaws.com/eduai/test_image/pre-reading_1.png',
          alt: 'Image alternate text',
          width: 500,
          heigh: 500,
        }),

        //display: 'WHITE', //WHITE(white bar) , CROPPED, DEFAULT(gray bar) //https://developers.google.com/actions/reference/rest/Shared.Types/ImageDisplayOptions
        //display  X 구글홈허브
      }));
    }
    else if (speak.indexOf('2') != -1 || speak.indexOf('two') != -1 || speak.indexOf('read') != -1) {
      console.log('E2처음');
      parameters.QN = 1;
      parameters.location = 'E2';
      conv.contexts.set('mysession', 1, parameters);
      conv.close(`your location is ${parameters.location}`);
    }
    else {

      conv.contexts.set('mysession', 1, parameters);
      conv.ask(new SimpleResponse({
        speech: `I didn't understand. Please choose 1 or 2. `,
        text: '1. Pre-Reading Overview \n 2. Let\'s Read \n',
      }));
      conv.ask(new Suggestions(['1. Pre-Reading Overview', '2. Let\'s Read \n']));
    }
  }////맨첫메뉴
  else if (parameters.location == 'E1') {
    if (parameters.QN == '1') {
      if (speak.indexOf('forest') != -1 || speak.indexOf('rock') != -1) {

        parameters.QN = 2;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Yay, you remembered! Let's see if you remember some of the characters. What were the names of the two children?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Story Overview',
          subtitle: `Inchworm's Tale`,
          text: `Let's recall the characters and the main theme of the sotry.`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/pre-reading_1.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),

          //display: 'WHITE', //WHITE(white bar) , CROPPED, DEFAULT(gray bar) //https://developers.google.com/actions/reference/rest/Shared.Types/ImageDisplayOptions
          //display  X 구글홈허브
        }));
      }
      else {
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Try again! Let's see if you remember some of the characters. What were the names of the two children?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Story Overview',
          subtitle: `Inchworm's Tale`,
          text: `Let's recall the characters and the main theme of the sotry.`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/pre-reading_1.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
    }
    else if (parameters.QN == '2') {
      if (speak.indexOf('anant and anika') != -1) {

        parameters.QN = 3;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Excellent job. Let's review the theme. This story was about how everyone has their own unique talent or feature. 
          Let’s have a quick discussion What animal is in the picture?
          `,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Theme',
          subtitle: `Unique talents and features.`,
          text: `What makes this animal unique?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/pre-reading_2.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),

          //display: 'WHITE', //WHITE(white bar) , CROPPED, DEFAULT(gray bar) //https://developers.google.com/actions/reference/rest/Shared.Types/ImageDisplayOptions
          //display  X 구글홈허브
        }));
      }
      else {

        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Try again. Let's review the theme. This story was about how everyone has their own unique talent or feature. 
          Let’s have a quick discussion What animal is in the picture?
          `,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Theme',
          subtitle: `Unique talents and features.`,
          text: `What makes this animal unique?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/pre-reading_2.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
    }
    else if (parameters.QN == '3') {
      if (speak.indexOf('giraffe') != -1) {
        parameters.QN = 4;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `That’s right. What makes this animal unique ?
        `,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Theme',
          subtitle: `Unique talents and features.`,
          text: `What makes this animal unique?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/pre-reading_2.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),

          //display: 'WHITE', //WHITE(white bar) , CROPPED, DEFAULT(gray bar) //https://developers.google.com/actions/reference/rest/Shared.Types/ImageDisplayOptions
          //display  X 구글홈허브
        }));
      }
      else {
        conv.close('not yet.');
      }
    }
    else if (parameters.QN == '4') {
      if (speak.indexOf('long neck') != -1) {

        parameters.QN = 5;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Great! Let’s move on.It’s your turn!
          Look at the choices above. Which animal are you most interested in?`,
          text: 'nothing.',
        }));
        conv.ask(new Suggestions(['Cheetah', 'Hummingbird', 'Giraffe']));
        conv.ask(new Carousel({
          items: {
            // Add the first item to the carousel
            'SELECTION_KEY_ONE': {
              synonyms: [
                'synonym 1',
                'synonym 2',
                'synonym 3',
              ],
              title: 'Cheetah',
              description: 'A large cat of the subfamily Felinae…',
              image: new Image({
                url: 'https://s3.amazonaws.com/eduai/test_image/c1.png',
                alt: 'Image alternate text',
              }),
            },
            // Add the second item to the carousel
            'SELECTION_KEY_GOOGLE_HOME': {
              synonyms: [
                'Google Home Assistant',
                'Assistant on the Google Home',
              ],
              title: 'Hummingbird',
              description: 'Native to the Americas…',
              image: new Image({
                url: 'https://s3.amazonaws.com/eduai/test_image/c2.png',
                alt: 'Google Home',
              }),
            },
            // Add third item to the carousel
            'SELECTION_KEY_GOOGLE_PIXEL': {
              synonyms: [
                'Google Pixel XL',
                'Pixel',
                'Pixel XL',
              ],
              title: 'Giraffe',
              description: 'It is the tallest living terrestrial…',
              image: new Image({
                url: 'https://s3.amazonaws.com/eduai/test_image/c3.png',
                alt: 'Google Pixel',
              }),
            },
          },
        }));


      }
      else {
        conv.close('not yet.');
      }
    }
    else if (parameters.QN == '5') {
      if (speak.indexOf('cheetah') != -1) {
        parameters.QN = 6;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `5)Okay ! Let’s find out more about the cheetah. 
          The cheetah is the fastest land animal in the world, 
          reaching speeds of up to 70 miles per hour. 
          They can accelerate from 0 to 68 miles per hour in just three seconds.
          Cheetahs are the only big cat that can turn in mid-air while sprinting.
          What do you think is the coolest feature of a cheetah?
          `,
          text: 'nothing.',
        }));
        conv.ask(new Suggestions(['yes', 'no']));
        conv.ask(new BasicCard({
          title: 'Cheetah.',
          subtitle: `The cheetah is the fastest land animal in the world, reaching speeds
           of up to 70 miles per hour. They can accelerate from 0 to 68 miles per hour in
            just three seconds. Cheetahs are the only big cat that can turn in mid-air while sprinting.`,
          text: `If you want to watch a video about the cheetah, please say: “Hey Google, play Nat Geo Wild’s Cheetahs 101 video from YouTube”`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/c4.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
          //display: 'WHITE', //WHITE(white bar) , CROPPED, DEFAULT(gray bar) //https://developers.google.com/actions/reference/rest/Shared.Types/ImageDisplayOptions
          //display  X 구글홈허브
        }));
      }
      else {
        conv.close('not yet.');
      }

    }
    else if (parameters.QN == '6') {
      if (speak.indexOf('fast') != -1) {
        parameters.QN = 0;
        parameters.location = 'first';
        conv.contexts.set('mysession', 1, parameters);

        conv.ask(new SimpleResponse({
          speech: 'I agree with you.  There are 2 Type exist.',
          text: '1. Pre-Reading Overview \n 2. Let\'s Read \n',
        }));
        conv.ask(new Suggestions(['1. Pre-Reading Overview', '2. Let\'s Read \n']));
      }
      else {
        conv.close('not yet. ');
      }
    }
    else {
      conv.close('not yet.');
    }
  }
  else if (parameters.location == 'E2') {
    conv.close('not yet. menu 2');

  }

});




ap.intent('actions.intent.OPTION', (conv, params, option) => {
  console.log(option);
  let response = 'You did not select any item';
  if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
    response = SELECTED_ITEM_RESPONSES[option];
  }
  conv.ask(response);
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

        var parameters = { // Custom parameters to pass with context
          'location': 'not yet location',
          'QN': 'not yet qn',
        };

        parameters.location = 'first';
        parameters.QN = 0;

        conv.contexts.set('mysession', 1, parameters);


        conv.ask(new SimpleResponse({
          speech: 'Welcome to Power reading! There are 2 Type exist.',
          text: '1. Pre-Reading Overview \n 2. Let\'s Read \n',
        }));
        conv.ask(new Suggestions(['1. Pre-Reading Overview', '2. Let\'s Read \n']));

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

ap.catch((conv, error) => {
  console.error(error);
  conv.ask('Error number 1. ask to john');
});



ap.intent('Stop', conv => {

  conv.close(`OK. Close 'Power reading'. Bye.`);

});
/*
ap.intent('Answer', (conv, input,option) => {
    console.log('@@@@@@@@@@@@Answer@@@@@@@@@@@@@');
   
    console.log('option:',option);
    var speak=conv.arguments.raw.input.text.rawText;
    if(speak) speak = speak.toLowerCase();
    else{
        conv.close('something is wrong, plz talk to john');
    }
    console.log('speak:',speak);

    if(speak.indexOf('type 1')!==-1 || speak.indexOf('type one')!==-1)
    {
        conv.ask(`you said that ${speak}.  here is basic card example`);
        conv.ask(new Suggestions(kind_of_suggestions));
        conv.ask(new BasicCard({
            title: 'My Cat',
            subtitle: `what i heard: ${speak}`,
            text: `   😂😃😄😅 📱.  \n
            MY NAME IS **JOHN**  \n
            https://www.fileformat.info/info/unicode/block/emoticons/list.htm  \n
            overflow \n
            overflow \n
            `,

            // Note the two spaces before '\n' required for a line break to be rendered in the card.    
            buttons: new Button({
            title: 'This is a button',
            url: 'https://www.youtube.com/watch?v=1rb1Ou_pim8',
            }),

            //buttons X 구글홈허브
            image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/cat1.jpg',
            alt: 'Image alternate text',
            width : 500,
            heigh : 500,
            }),
            
            //display: 'WHITE', //WHITE(white bar) , CROPPED, DEFAULT(gray bar) //https://developers.google.com/actions/reference/rest/Shared.Types/ImageDisplayOptions
            //display  X 구글홈허브
        }));
        conv.ask(new SimpleResponse({
            speech: 'This is the second simple response.',
            text: 'This is the 2nd simple response.',
        }));
    }
    else if(speak.indexOf('type 2')!==-1 || speak.indexOf('type two')!==-1){
        console.log('음악예제');
   
        conv.ask(`you said that ${speak}. here is MediaObject example`);
        conv.ask(new MediaObject({
          name: 'Jazz in Paris',
          url: 'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
          description: 'A funky Jazz tune',
          icon: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/cat1.jpg',
            alt: 'Ocean view',
          }),
        }));
        conv.ask(new Suggestions(kind_of_suggestions));
               
    }
    else if(speak.indexOf('type 3')!==-1 || speak.indexOf('type three')!==-1){
        conv.ask(new SimpleResponse(`you said that ${speak}. here is List example`));
        conv.ask(new Suggestions(kind_of_suggestions));
        conv.ask(new List({
            title: 'List Title',
            items: {
              // Add the first item to the list
              'SELECTION_KEY_ONE': {
                synonyms: [
                  'apple',
                  'Apple',
                  'I like an apple',
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
                  url: 'https://s3.amazonaws.com/eduai/test_image/cat2.jpg',
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
                  url: 'https://s3.amazonaws.com/eduai/test_image/cat3.PNG',
                  alt: 'Google Pixel',
                }),
              },
            },
          }));
    }
    else if(speak.indexOf('type 4')!==-1 || speak.indexOf('type four')!==-1){
        conv.ask(new SimpleResponse(`you said that ${speak}. here is Table example`));
        conv.ask(new Suggestions(kind_of_suggestions));
        conv.ask(new Table({
          title: 'Table Title',
          subtitle: 'Table Subtitle',
          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/cat1.jpg',
            alt: 'Actions on Google'
          }),
          buttons: new Button({
            title: 'This is a button',
            url: 'https://www.youtube.com/watch?v=1rb1Ou_pim8',
            }),
          columns: [
            {
              header: 'header 1',
              align: 'CENTER', //가운데
            },
            {
              header: 'header 2',
              align: 'LEADING',//왼쪽
            },
            {
              header: 'header 3',
              align: 'TRAILING',//뒤쪽
            },
          ],
          rows: [
            {
              cells: ['row 1 item 1', 'row 1 item 2', 'row 1 item 3'],
              dividerAfter: false, //1째줄 td 구분선
            },
            {
              cells: ['row 2 item 1', 'row 2 item 2', 'row 2 item 3'],
              dividerAfter: true, //2째줄 td 구분선
            },
            {
              cells: ['row 2 item 1', 'row 2 item 2', 'row 2 item 3'],
            },
          ],
      
        }));

    }
    else if(speak.indexOf('type 5')!==-1 || speak.indexOf('type five')!==-1){ //터치가능
        conv.ask(new SimpleResponse(`you said that ${speak}. here is Carousel example`));
        conv.ask(new Suggestions(kind_of_suggestions));
        //@ Carousel 은 items 에 2개이상 없으면 동작 안함
        conv.ask(new Carousel({
          buttons: new Button({
            title: 'This is a button',
            url: 'https://www.youtube.com/watch?v=1rb1Ou_pim8',
            }),
            items: {
              // Add the first item to the carousel
              'SELECTION_KEY_ONE': {
                synonyms: [
                  'synonym 1',
                  'synonym 2',
                  'synonym 3',
                ],
                title: 'cat1',
                description: 'This is a description of a carousel item.',
                image: new Image({
                  url: 'https://s3.amazonaws.com/eduai/test_image/cat1.jpg',
                  alt: 'Image alternate text',
                }),
                openUrlAction: {
                  "url": "https://www.youtube.com/watch?v=1rb1Ou_pim8"
                },
              },
              // Add the second item to the carousel
              'SELECTION_KEY_GOOGLE_HOME': {
                synonyms: [
                  'Google Home Assistant',
                  'Assistant on the Google Home',
              ],
                title: 'cat2',
                description: 'Google Home is a voice-activated speaker powered by ' +
                  'the Google Assistant.',
                image: new Image({
                  url: 'https://s3.amazonaws.com/eduai/test_image/cat2.jpg',
                  alt: 'Google Home',
                }),
              },
              // Add third item to the carousel
              'SELECTION_KEY_GOOGLE_PIXEL': {
                synonyms: [
                  'Google Pixel XL',
                  'Pixel',
                  'Pixel XL',
                ],
                title: 'cat3',
                description: 'Pixel. Phone by Google.',
                image: new Image({
                  url: 'https://s3.amazonaws.com/eduai/test_image/cat3.PNG',
                  alt: 'Google Pixel',
                }),
              },
            },
          }));

    }
    
   
    
    else if(speak.indexOf('type 6')!==-1 || speak.indexOf('type six')!==-1){
        conv.ask(new SimpleResponse(`you said that ${speak}. here is Suggestions example`));
       // conv.ask(new Suggestions(['apple', 'banana']));
        conv.ask(new LinkOutSuggestion({
          name: 'Suggestion Link',
          url: 'https://www.youtube.com/watch?v=1rb1Ou_pim8',
        }));
    }
    else if(speak.indexOf('type 7')!==-1 || speak.indexOf('type seven')!==-1){ //터치가능
      return conv.json({
       "payload": {
         "google": {
           "expectUserResponse": true,
           "richResponse": {
             "items": [
               {
                 "simpleResponse": {
                   "textToSpeech": "This is a basic card example."
                 }
               },
               {
                 "basicCard": {
                   "title": "Title: this is a title",
                   "subtitle": "This is a subtitle",
                   "formattedText": "This is a basic card.  Text in a basic card can include \"quotes\" and\n"+
                   "most other unicode characters including emoji 📱.Basic cards also support\n"+
                   "some markdown formatting like *emphasis* or _italics_, **strong** or\n"+
                   "__bold__, and ***bold itallic*** or ___strong emphasis___ as well as other\n"+
                   "things like line  \nbreaks",
                   "image": {
                     "url": "https://example.com/image.png",
                     "accessibilityText": "Image alternate text"
                   },
                   "buttons": [
                     {
                       "title": "This is a button",
                       "openUrlAction": {
                         "url": "https://assistant.google.com/"
                       }
                     }
                   ],
                   "imageDisplayOptions": "CROPPED"
                 }
               }
             ]
           }
         }
       }
     });
   }
    //안먹힘 폰만됨
    else{
        conv.ask(new Suggestions(kind_of_suggestions));
        conv.ask(`you said that ${speak}`);
    }
});
*/
module.exports = router;
