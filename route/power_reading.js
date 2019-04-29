var express = require('express');
const request = require('request');
const phrase = require('../resources/phrase');

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
  console.log(conv);


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
      ////////////////
      parameters.QN = 1;
      parameters.location = 'E1';
      conv.contexts.set('mysession', 1, parameters);
      //////////////

      conv.ask(new SimpleResponse({
        speech: `Let's recall the story, Inchoworm's Tale. What is the genre of Inchworm’s Tale?`,
        text: 'nothing.',
      }));
      conv.ask(new Suggestions(['Biography', 'Play', 'Folktale']));
      conv.ask(new BasicCard({
        title: 'Story Overview',
        subtitle: `Inchworm's Tale`,
        text: `What is the genre of Inchworm’s Tale?`,

        image: new Image({
          url: 'https://s3.amazonaws.com/eduai/test_image/1.jpg',
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
      parameters.QN = 0;
      parameters.location = 'first';
      conv.contexts.set('mysession', 1, parameters);

      conv.ask(new SimpleResponse({
        speech: 'number 2. not yet.',
        text: '1. Pre-Reading Overview \n 2. Let\'s Read \n',
      }));
      conv.ask(new Suggestions(['1. Pre-Reading Overview', '2. Let\'s Read \n']));
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
      if (speak.indexOf('folktale') != -1) {
        parameters.QN = 1.1;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new Suggestions(['yes', 'no']));
        conv.ask(new SimpleResponse({
          speech: `Excellent! Do you want to move onto the next question?`,
          text: `Excellent! 
          Do you want to move onto the next question?`,
        }));

      }
      else {
        parameters.QN = 2;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse(`That’s incorrect.
        Read the hints and answer the question. What is the genre of Inchworm’s Tale?`));
        conv.ask(new Suggestions(['Biography', 'Play', 'Folktale']));
        conv.ask(new List({
          title: 'What is the genre of Inchworm’s Tale?',
          items: {
            // Add the first item to the list
            'SELECTION_KEY_ONE': {
              synonyms: [
                'apple',
                'Apple',
                'I like an apple',
              ],
              title: 'Hint 1',
              description: 'It tries to explain the origin of something. In this case, the name of a big rock.',

            },
            // Add the second item to the list
            'SELECTION_KEY_GOOGLE_HOME': {
              synonyms: [
                'Google Home Assistant',
                'Assistant on the Google Home',
              ],
              title: 'Hint 2',
              description: 'The characters in the story have special abilities. In this case, the animals can talk.',

            },
          },
        }));
      }
    }
    else if (parameters.QN == '1.1') {
      if (speak.indexOf('yes') != -1) {

        parameters.QN = 3;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Let’s recall the setting of the story.
          What is the setting of the story?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Story Overview',
          subtitle: `Inchworm's Tale:Setting`,
          text: `What is the setting of the story?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/3forest.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else if (speak.indexOf('no') != -1) {
        parameters.QN = 0;
        parameters.location = 'first';
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Let's recall the story, Inchoworm's Tale. What is the genre of Inchworm’s Tale?`,
          text: 'nothing.',
        }));
        conv.ask(new Suggestions(['Biography', 'Play', 'Folktale']));
        conv.ask(new BasicCard({
          title: 'Story Overview',
          subtitle: `Inchworm's Tale`,
          text: `What is the genre of Inchworm’s Tale?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/1.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),

          //display: 'WHITE', //WHITE(white bar) , CROPPED, DEFAULT(gray bar) //https://developers.google.com/actions/reference/rest/Shared.Types/ImageDisplayOptions
          //display  X 구글홈허브
        }));
      }
      else {
        parameters.QN = 2;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse(`That’s incorrect.
        Read the hints and answer the question. What is the genre of Inchworm’s Tale?`));
        conv.ask(new Suggestions(['Biography', 'Play', 'Folktale']));
        conv.ask(new List({
          title: 'What is the genre of Inchworm’s Tale?',
          items: {
            // Add the first item to the list
            'SELECTION_KEY_ONE': {
              synonyms: [
                'apple',
                'Apple',
                'I like an apple',
              ],
              title: 'Hint 1',
              description: 'It tries to explain the origin of something. In this case, the name of a big rock.',

            },
            // Add the second item to the list
            'SELECTION_KEY_GOOGLE_HOME': {
              synonyms: [
                'Google Home Assistant',
                'Assistant on the Google Home',
              ],
              title: 'Hint 2',
              description: 'The characters in the story have special abilities. In this case, the animals can talk.',

            },
          },
        }));
      }
    }
    else if (parameters.QN == '2') {
      if (speak.indexOf('folktale') != -1) {
        parameters.QN = 2.1;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new Suggestions(['yes', 'no']));
        conv.ask(new SimpleResponse({
          speech: `You did it! Do you want to move onto the next question?`,
          text: `Excellent! 
          Do you want to move onto the next question?`,
        }));
      }
      else {
        //wrong again the answer was Folktale + 3번화면+발화
        parameters.QN = 3;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Wrong again.The answer was Folktale. Let’s recall the setting of the story.
          What is the setting of the story?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Story Overview',
          subtitle: `Inchworm's Tale:Setting`,
          text: `What is the setting of the story?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/3forest.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
    }
    else if (parameters.QN == '2.1') {
      if (speak.indexOf('yes') != -1) {
        //피드백 없이 3번으로
        parameters.QN = 3;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Let’s recall the setting of the story.
          What is the setting of the story?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Story Overview',
          subtitle: `Inchworm's Tale:Setting`,
          text: `What is the setting of the story?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/3forest.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else if (speak.indexOf('no') != -1) {


        parameters.QN = 1;
        //피드백 Okay, lets go back to the question.

        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Okay, lets go back to the question. Let's recall the story, Inchoworm's Tale. What is the genre of Inchworm’s Tale?`,
          text: 'nothing.',
        }));
        conv.ask(new Suggestions(['Biography', 'Play', 'Folktale']));
        conv.ask(new BasicCard({
          title: 'Story Overview',
          subtitle: `Inchworm's Tale`,
          text: `What is the genre of Inchworm’s Tale?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/1.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));

      }
      else {
        //피드백:Wrong again.The answer was Folktale

        parameters.QN = 3;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Wrong again.The answer was Folktale. Let’s recall the setting of the story.
          What is the setting of the story?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Story Overview',
          subtitle: `Inchworm's Tale:Setting`,
          text: `What is the setting of the story?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/3forest.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
    }
    else if (parameters.QN == '3') {
      if (speak.indexOf('forest') != -1 || speak.indexOf('top of a rock') != -1) {
        parameters.QN = 3.1;
        //피드백 Okay, lets go back to the question.

        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Yay, you remembered! Are you ready for the next question?`,
          text: 'Yay, you remembered! Are you ready for the next question?',
        }));
      }
      else {
        parameters.QN = 4;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `That’s not the correct answer,
          Read the hints and answer the question.
          What is the setting of the story?`,
          text: 'nothing.',
        }));
     
        conv.ask(new List({
            title: 'What is the setting of the story?',
            items: {
              // Add the first item to the list
              'SELECTION_KEY_ONE': {
                synonyms: [
                  'apple',
                  'Apple',
                  'I like an apple',
                ],
                title: 'Hint 1: You can be general',
                description: 'The story is set in the ______________',
                image: new Image({
                  url: 'https://s3.amazonaws.com/eduai/test_image/4forest.png',
                  alt: 'Image alternate text',
                }),
              },
              // Add the second item to the list
              'SELECTION_KEY_GOOGLE_HOME': {
                synonyms: [
                  'Google Home Assistant',
                  'Assistant on the Google Home',
              ],
                title: 'Hint 2: You can be specific',
                description: 'The story takes place on top of a ______________',
                image: new Image({
                  url: 'https://s3.amazonaws.com/eduai/test_image/4rock.png',
                  alt: 'Google Home',
                }),
              },
            },
          }));
      }
    }
    else if (parameters.QN == '3.1') {
      if (speak.indexOf('yes') != -1) {
        parameters.QN = 5;
        conv.contexts.set('mysession', 1, parameters);
        conv.close('!@#$');
      }
      else if (speak.indexOf('no') != -1) {
        parameters.QN = 3;
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Okay, let's go back to the question. Let’s recall the setting of the story.
          What is the setting of the story?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Story Overview',
          subtitle: `Inchworm's Tale:Setting`,
          text: `What is the setting of the story?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/3forest.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else {
        parameters.QN = 4;
    
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `That’s not the correct answer,
          Read the hints and answer the question.
          What is the setting of the story?`,
          text: 'nothing.',
        }));
     
        conv.ask(new List({
            title: 'What is the setting of the story?',
            items: {
              // Add the first item to the list
              'SELECTION_KEY_ONE': {
                synonyms: [
                  'apple',
                  'Apple',
                  'I like an apple',
                ],
                title: 'Hint 1: You can be general',
                description: 'The story is set in the ______________',
                image: new Image({
                  url: 'https://s3.amazonaws.com/eduai/test_image/4forest.png',
                  alt: 'Image alternate text',
                }),
              },
              // Add the second item to the list
              'SELECTION_KEY_GOOGLE_HOME': {
                synonyms: [
                  'Google Home Assistant',
                  'Assistant on the Google Home',
              ],
                title: 'Hint 2: You can be specific',
                description: 'The story takes place on top of a ______________',
                image: new Image({
                  url: 'https://s3.amazonaws.com/eduai/test_image/4rock.png',
                  alt: 'Google Home',
                }),
              },
            },
          }));
      }

    }
    else if(parameters.QN =='4'){
        conv.close(`!@#$  qn4's answer classify need.`);
    }
    else {
      conv.close('error. the '+parameters.QN+' does not exist.');
    }
  }
  else if (parameters.location == 'E2') {
    parameters.QN = 0;
    parameters.location = 'first';
    conv.contexts.set('mysession', 1, parameters);

    conv.ask(new SimpleResponse({
      speech: 'number 2. not yet.',
      text: '1. Pre-Reading Overview \n 2. Let\'s Read \n',
    }));
    conv.ask(new Suggestions(['1. Pre-Reading Overview', '2. Let\'s Read \n']));


  }
  else {
    conv.close(parameters.location + ` does not exist.`);
  }

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
      }).then(function (body) {//1
        console.log(`###############` + `oauth 성공` + `###############`);
        console.log(`id:`, body.user_id);
        return body;
      }).catch(function (error) { //1실패시
        console.log('my request oauth2.0 error:', error);
        conv.ask(`oauth2.0 request error`);
      }).then(function (body) {//2
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

      });//2끝
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
      
      conv.ask(`you said that ${speak}.  here is basic card example`);
      conv.ask(new Suggestions(kind_of_suggestions));
      conv.ask(new BasicCard({
          title: '',
          subtitle: ``,
          text: ``,

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


      // conv.ask(new Suggestions(['apple', 'banana']));

   

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
