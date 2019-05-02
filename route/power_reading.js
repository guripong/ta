var express = require('express');
const request = require('request');
//const phrase = require('../resources/phrase');
console.log('aaaa');


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

const avail_answers = {
  14: [
    'cheetah', 'hummingbird', 'panda'
  ],
  15: [
    'fast', 'big', 'cat', 'very', 'sprint', 'accel' // match생각해서 자름
    , 'speed'
  ],
  16: [
    'small', '340', 'rapid', 'wing'
  ],
  17: [
    'giant', 'big', 'black', 'white', 'bamboo', 'endangered'
  ]
};

avail_answers.find_some = function (qn, str) {
  qn = qn + "";
  qn = qn.substring(0, qn.indexOf('.') > -1 ? qn.indexOf('.') : qn.length); // 16.1 형태일때 16으로 변환
  let spltd = str.split(' ');
  return avail_answers[qn].some((el) => {
    return str.includes(el);
  })
};

avail_answers.getIndex = function (qn, str) {
  qn = qn + "";
  qn = qn.substring(0, qn.indexOf('.') > -1 ? qn.indexOf('.') : qn.length); // 16.1 형태일때 16으로 변환
  let spltd = str.split(' ');

  for (var i = 0; i <= avail_answers[qn].length; i++) {
    if (spltd.indexOf(avail_answers[qn][i]) > -1) {
      return i + 1; // array 위치보정
    }
  }
  return 0;
};


function makeconv(conv, parameters, feedback) {
  conv.contexts.set('mysession', 1, parameters);

  if (parameters.QN == '0' && parameters.location == 'first') {


    conv.ask(new SimpleResponse({
      speech: feedback + 'Welcome to Power reading! There are 2 Type exist.',
      text: '1. 😍Pre-Reading Overview \n 2. 😍Let\'s Read \n',
    }));
    conv.ask(new Suggestions(['1. Pre-Reading Overview', '2. Let\'s Read \n']));
  }
  else if (parameters.location == 'E1') {
    if (parameters.QN == '1') {

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
    else if (parameters.QN == '1.1') {
      conv.ask(new Suggestions(['yes', 'no']));
      conv.ask(new SimpleResponse({
        speech: feedback + `Do you want to move onto the next question?`,
        text: `Excellent! 
        Do you want to move onto the next question?`,
      }));
    }
    else if (parameters.QN == '2') {
      conv.ask(new SimpleResponse({
        speech: feedback + `Let’s discuss.Do you agree or disagree with the following statement? I think Hawk was more helpful than Inchworm in the story, Inchworm’s Tale.`,
        text: 'nothing.',
      }));
      conv.ask(new Suggestions(['agree', 'disagree']));
      conv.ask(new BasicCard({
        title: 'Tell me your opinion',
        subtitle: `Do you agree or disagree?`,
        text: `I think Hawk was more helpful than Inchworm in the story, __Inchworm’s Tale__.`,

        image: new Image({
          url: 'https://s3.amazonaws.com/eduai/test_image/e2_1.png',
          alt: 'panda',
        }),
      }));

    }
    else if (parameters.QN == '2.1') {
      conv.ask(new Suggestions(['yes', 'no']));
      conv.ask(new SimpleResponse({
        speech: feedback + `Do you want to move onto the next question?`,
        text: `Excellent! 
        Do you want to move onto the next question?`,
      }));
    }
    else if (parameters.QN == '3') {

      conv.ask(new SimpleResponse({
        speech: feedback + `Let’s recall the setting of the story.
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
    else if (parameters.QN == '3.1') {
      conv.ask(new SimpleResponse({
        speech: feedback + `Yay, you remembered! Are you ready for the next question?`,
        text: 'Yay, you remembered! Are you ready for the next question?',
      }));
    }
    else if (parameters.QN == '4') {
      {
        conv.ask(new SimpleResponse({
          speech: feedback + `Read the hints and answer the question.
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
    else if (parameters.QN == '4.1') {
      conv.ask(new SimpleResponse({
        speech: feedback + `Do you want to move onto the next question? `,
        text: `That’s correct!Do you want to move onto the next question?`,
      }));
    }
    else if (parameters.QN == '5') {
      conv.ask(new SimpleResponse({
        speech: feedback + `Let’s recall the characters from the story.Name two animals that appear in the story.`,
        text: 'nothing.',
      }));
      conv.ask(new BasicCard({
        title: 'Story Overview',
        subtitle: `Inchworm's Tale:Characters`,
        text: `Name two animals that appear in the story.`,

        image: new Image({
          url: 'https://s3.amazonaws.com/eduai/test_image/5etc.png',
          alt: 'Image alternate text',
          width: 500,
          heigh: 500,
        }),
      }));
    }
    else if (parameters.QN == '6') {
      conv.ask(new SimpleResponse({
        speech: feedback + `Read the hint and tell me two animals that appear in the story. 
        `,
        text: `nothing.`,
      }));
      conv.ask(new BasicCard({
        title: 'Hint',
        subtitle: `Inchworm's Tale:Characters`,
        text: `Look at the pictures and tell me two animals that appear in the story`,

        image: new Image({
          url: 'https://s3.amazonaws.com/eduai/test_image/6etc.png',
          alt: 'Image alternate text',
          width: 500,
          heigh: 500,
        }),
      }));
    }
    else if (parameters.QN == '6.1') {
      conv.ask(new SimpleResponse({
        speech: feedback + `Do you want to move onto the next question?`,
        text: feedback + `Do you want to move onto the next question?`,
      }));
    }
    else if (parameters.QN == '7') {
      conv.ask(new SimpleResponse({
        speech: `Let’s review the theme. 
        This story was about how everyone has their own unique talent or feature. 
        Do you have any special features or talents?
        `,
        text: `nothing.`,
      }));
      conv.ask(new Suggestions(['yes', 'no']));
      conv.ask(new BasicCard({
        title: 'Theme',
        subtitle: `Unique talents and features.`,
        text: `Do you have any special features or talents?`,

        image: new Image({
          url: 'https://s3.amazonaws.com/eduai/test_image/7children.png',
          alt: 'Image alternate text',
          width: 500,
          heigh: 500,
        }),
      }));
    }

  }
}


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
      parameters.QN = "1";
      parameters.location = 'E1';
      return new Promise(function (resolve) {
        makeconv(conv, parameters, "");
        resolve('conv emit 끝!');
      });

    }
    else if (speak.indexOf('2') != -1 || speak.indexOf('two') != -1 || speak.indexOf('read') != -1) {
      console.log('E2처음');
      /////////////1번화면 뿌려준다
      parameters.QN = "1";
      parameters.location = 'E2';
      return new Promise(function (resolve) {
        makeconv(conv, parameters, "");
        resolve('conv emit 끝!');
      });
    }
    else {

      return new Promise(function (resolve) {
        makeconv(conv, parameters, "I didn't understand.");
        resolve('conv emit 끝!');
      });

    }

  }////맨첫메뉴
  else if (parameters.location == 'E1') {
    if (parameters.QN == '14' && avail_answers.find_some(parameters.QN, speak)) {
      parameters.QN = '' + ((parameters.QN * 1) + avail_answers.getIndex(parameters.QN, speak));
      conv.contexts.set('mysession', 1, parameters);
    }

    if (parameters.QN == '1') {
      if (speak.indexOf('folktale') != -1) {
        parameters.QN = "1.1";
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Excellent! ");
          resolve('conv emit 끝!');
        });

      }
      else {
        parameters.QN = "2";
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "That's Incorrect. ");
          resolve('conv emit 끝!');
        });
      }
    }
    else if (parameters.QN == '1.1') {
      if (speak.indexOf('yes') != -1) {

        parameters.QN = "3";
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "That's Incorrect. ");
          resolve('conv emit 끝!');
        });

      }
      else if (speak.indexOf('no') != -1) {
        parameters.QN = "0";
        parameters.location = 'first';
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Then let's go back to the menu.");
          resolve('conv emit 끝!');
        });
      }
      else {
        parameters.QN = "2";
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "That's Incorrect. ");
          resolve('conv emit 끝!');
        });

      }
    }
    else if (parameters.QN == '2') {
      if (speak.indexOf('folktale') != -1) {
        parameters.QN = "2.1";
        conv.contexts.set('mysession', 1, parameters);
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "You did it! ");
          resolve('conv emit 끝!');
        });
      }
      else {
        //wrong again the answer was Folktale + 3번화면+발화
        parameters.QN = "3";
        conv.contexts.set('mysession', 1, parameters);
        //Wrong again.The answer was Folktale. 
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Wrong again.The answer was Folktale.  ");
          resolve('conv emit 끝!');
        });

      }
    }
    else if (parameters.QN == '2.1') {
      if (speak.indexOf('yes') != -1) {
        //피드백 없이 3번으로
        parameters.QN = "3";
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Okay! let's go to the next.  ");
          resolve('conv emit 끝!');
        });
      }
      else if (speak.indexOf('no') != -1) {
        parameters.QN = "1";
        //피드백 Okay, lets go back to the question.
        //Okay, lets go back to the question. 
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Okay, lets go back to the question.   ");
          resolve('conv emit 끝!');
        });


      }
      else {
        //피드백:Wrong again.The answer was Folktale

        parameters.QN = "3";
        conv.contexts.set('mysession', 1, parameters);
        //Wrong again.The answer was Folktale.
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Wrong again.The answer was Folktale.   ");
          resolve('conv emit 끝!');
        });
      }
    }
    else if (parameters.QN == '3') {
      if (speak.indexOf('forest') != -1 || speak.indexOf('top of a rock') != -1 || speak.indexOf('wood') != -1) {
        parameters.QN = "3.1";
        //피드백 Okay, lets go back to the question.

        return new Promise(function (resolve) {
          makeconv(conv, parameters, " ");
          resolve('conv emit 끝!');
        });

      }
      else {
        parameters.QN = "4";

        //That’s not the correct answer,
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "That’s not the correct answer, ");
          resolve('conv emit 끝!');
        });

      }
    }
    else if (parameters.QN == '3.1') {
      if (speak.indexOf('yes') != -1) {
        parameters.QN = "5";

        return new Promise(function (resolve) {
          makeconv(conv, parameters, " ");
          resolve('conv emit 끝!');
        });


      }
      else if (speak.indexOf('no') != -1) {
        parameters.QN = "3";
        //Okay, let's go back to the question.
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Okay, let's go back to the question. ");
          resolve('conv emit 끝!');
        });
      }
      else {
        parameters.QN = "4";
        //That’s not the correct answer,
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "That’s not the correct answer, ");
          resolve('conv emit 끝!');
        });
      }

    }
    else if (parameters.QN == '4') {
      if (speak.indexOf('woods') != -1 || speak.indexOf('top of a rock') != -1) {
        parameters.QN = "4.1";

        conv.contexts.set('mysession', 1, parameters);
        //That’s correct!
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "That’s correct! ");
          resolve('conv emit 끝!');
        });

      }
      else {
        parameters.QN = "5";
        conv.contexts.set('mysession', 1, parameters);
        //Wrong again. The correct answer was the woods.
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Wrong again. The correct answer was the woods. ");
          resolve('conv emit 끝!');
        });
      }
    }
    else if (parameters.QN == '4.1') {
      if (speak.indexOf('yes') != -1) {
        parameters.QN = "5";
        return new Promise(function (resolve) {
          makeconv(conv, parameters, " ");
          resolve('conv emit 끝!');
        });

      }
      else if (speak.indexOf('no') != -1) {
        parameters.QN = "3";
        //Okay, let's go back to the question.
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Okay, let's go back to the question. ");
          resolve('conv emit 끝!');
        });

      }
      else {
        parameters.QN = "4.1";

        //I didn't under stand. 
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "I didn't under stand.  ");
          resolve('conv emit 끝!');
        });

      }
    }
    else if (parameters.QN == '5') {
      // it is Inchworm and hawk.
      var correct_list = ['inchworm', 'hawk', 'bear', 'mouse', 'lion']
      var splitspeak = speak.split(' ');
      var aa = 0;
      var pass = 0;
      for (var i = 0; i < splitspeak.length; i++) {
        if (correct_list.includes(splitspeak[i]) == true) {
          aa++;
          if (aa == 2) {
            pass = 1;
            break;
          }
        }
      }

      if (pass == 1) { //맞춤
        //excelt
        parameters.QN = "5.1";
        //Excellent job! 
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Excellent job!  ");
          resolve('conv emit 끝!');
        });

      }
      else { //모름
        parameters.QN = "6";
        //That’s not the correct answer.
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "That’s not the correct answer. ");
          resolve('conv emit 끝!');
        });

      }
    }
    else if (parameters.QN == '5.1') {
      if (speak.indexOf('yes') != -1) {
        parameters.QN = "7";

        return new Promise(function (resolve) {
          makeconv(conv, parameters, "  ");
          resolve('conv emit 끝!');
        });
      }
      else if (speak.indexOf('no') != -1) {
        parameters.QN = "5";

        //Okay, lets go back to the question. 피드백
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Okay, lets go back to the question.  ");
          resolve('conv emit 끝!');
        });

      }
      else {
        parameters.QN = "5.1";
        //I didn't understand.
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "I didn't understand. ");
          resolve('conv emit 끝!');
        });
      }

    }
    else if (parameters.QN == '6') {
      var correct_list = ['inchworm', 'hawk', 'bear', 'mouse', 'lion']
      var splitspeak = speak.split(' ');
      var aa = 0;
      var pass = 0;
      for (var i = 0; i < splitspeak.length; i++) {
        if (correct_list.includes(splitspeak[i]) == true) {
          aa++;
          if (aa == 2) {
            pass = 1;
            break;
          }
        }
      }
      if (pass == 1) {
        parameters.QN = "6.1";
        //That’s correct!
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "That’s correct! ");
          resolve('conv emit 끝!');
        });


      }
      else {
        parameters.QN = "7";

        //Wrong again. One possible answer is inchworm and bear.
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Wrong again. One possible answer is inchworm and bear. ");
          resolve('conv emit 끝!');
        });

      }
    }
    else if (parameters.QN == '6.1') {
      if (speak.indexOf('yes') != -1) {
        parameters.QN = "7";
        return new Promise(function (resolve) {
          makeconv(conv, parameters, " ");
          resolve('conv emit 끝!');
        });
      }
      else if (speak.indexOf('no') != -1) {
        parameters.QN = "5";
        conv.contexts.set('mysession', 1, parameters);
        //Okay, lets go back to the question. 피드백
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "Okay, lets go back to the question. ");
          resolve('conv emit 끝!');
        });
      }
      else {
        parameters.QN = "6.1";
        //I didn't understand.
        return new Promise(function (resolve) {
          makeconv(conv, parameters, "I didn't understand. ");
          resolve('conv emit 끝!');
        });
      }
    }
    else if (parameters.QN == '7') {
      //yes no 에 따라서 9번 8번으로 흩어주자
      if (speak.indexOf('yes') != -1) {
        parameters.QN = "9";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Cool!
          Use one of the patterns above to answer the question.
          What is your special feature?  Tell me one.
          `,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme',
          subtitle: `Unique talents and features.`,
          text: `What is your special feature?  \n
          I can…  \n
          My special feature is…  \n
          I have a unique talent. It is…  \n
          `,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/7children.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else if (speak.indexOf('no') != -1) {
        parameters.QN = "8";
        conv.contexts.set('mysession', 1, parameters);


        conv.ask(new SimpleResponse({
          speech: `Hmm, maybe you need an example.
          My special talent is that I can sing very well.
          Read Example 2.          
          `,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Hint',
          subtitle: `Unique talents and features.`,
          text: `What is your special feature or talent?  \n
          Example 1) I can sing very well.  \n
          Example 2) My special talent is that I can write poetry.  \n
          `,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/8people.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else {
        parameters.QN = "7";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `I didn't understsand. say yes or no. Let’s review the theme. 
          This story was about how everyone has their own unique talent or feature. 
          Do you have any special features or talents?
          `,
          text: `nothing.`,
        }));
        conv.ask(new Suggestions(['yes', 'no']));
        conv.ask(new BasicCard({
          title: 'Theme',
          subtitle: `Unique talents and features.`,
          text: `Do you have any special features or talents?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/7children.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
    }
    else if (parameters.QN == '8') {
      if (speak.indexOf('write poetry') != -1) {
        parameters.QN = "8.1";
        conv.contexts.set('mysession', 1, parameters);

        conv.ask(new SimpleResponse({
          speech: `Now can you think of your own talent or unique feature?`,
          text: `Now can you think of your own talent or unique feature?`,
        }));
      }
      else {
        parameters.QN = "11";
        conv.contexts.set('mysession', 1, parameters);

        conv.ask(new SimpleResponse({
          speech: `What is the name of the animal in the picture?`,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme: Practice',
          subtitle: `Unique talents and features.`,
          text: `Can you identify this animal?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/11giraffe.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
    }
    else if (parameters.QN == '8.1') {
      if (speak.indexOf('yes') != -1) {
        parameters.QN = "9";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Cool!
          Use one of the patterns above to answer the question.
          What is your special feature?  Tell me one.
          `,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme',
          subtitle: `Unique talents and features.`,
          text: `What is your special feature?  \n
          I can…  \n
          My special feature is…  \n
          I have a unique talent. It is…  \n
          `,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/7children.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else if (speak.indexOf('no') != -1) {
        parameters.QN = "11";
        conv.contexts.set('mysession', 1, parameters);
        //Okay then let’s move on   피드백

        conv.ask(new SimpleResponse({
          speech: `Okay then let’s move on. What is the name of the animal in the picture?`,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme: Practice',
          subtitle: `Unique talents and features.`,
          text: `Can you identify this animal?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/11giraffe.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else {
        parameters.QN = "8.1";
        conv.contexts.set('mysession', 1, parameters);
        //피드백 I didn't understand.
        conv.ask(new SimpleResponse({
          speech: `I didn't understand. Now can you think of your own talent or unique feature?`,
          text: `I didn't understand. Now can you think of your own talent or unique feature?`,
        }));
      }
    }
    else if (parameters.QN == '9') {
      //
      parameters.QN = "9.1";
      conv.contexts.set('mysession', 1, parameters);
      conv.ask(new SimpleResponse({
        speech: `That’s very interesting!
        Do you have any other talents`,
        text: `That’s very interesting!
        Do you have any other talents`,
      }));
    }
    else if (parameters.QN == '9.1') {
      if (speak.indexOf('yes') != -1) {
        parameters.QN = "10";
        conv.contexts.set('mysession', 1, parameters);

        conv.ask(new SimpleResponse({
          speech: `Wow, you are very talented, aren’t you?What is your special feature?  Tell me one more.`,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme',
          subtitle: `Unique talents and features.`,
          text: `What is your special feature?  \n
          I can also…  \n
          Another one of my talent is…  \n
          I have another unique talent. It is…  \n
          `,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/10people.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else if (speak.indexOf('no') != -1) {
        parameters.QN = "11";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `What is the name of the animal in the picture?`,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme: Practice',
          subtitle: `Unique talents and features.`,
          text: `Can you identify this animal?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/11giraffe.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else {
        parameters.QN = "9.1";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `I didn't understand. Do you have any other talents?`,
          text: `I didn't understand. Do you have any other talents?`,
        }));
      }
    }
    else if (parameters.QN == '10') {
      if (speak.indexOf('i can also') != -1 || speak.indexOf('my talent is') != -1 || speak.indexOf('i have another unique talent') != -1) {
        parameters.QN = "10.1";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Great! You are very unique! Are you ready to move on to the next question?`,
          text: `Great! You are very unique! Are you ready to move on to the next question?`,
        }));
      }
      else {
        parameters.QN = "11";
        conv.contexts.set('mysession', 1, parameters);
        //피드백 Sorry, I  didn’t quite get that. Let’s move on.
        conv.ask(new SimpleResponse({
          speech: `Sorry, I  didn’t quite get that. Let’s move on. What is the name of the animal in the picture?`,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme: Practice',
          subtitle: `Unique talents and features.`,
          text: `Can you identify this animal?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/11giraffe.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
    }
    else if (parameters.QN == '10.1') {
      if (speak.indexOf('yes') != -1) {
        parameters.QN = "11";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `What is the name of the animal in the picture?`,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme: Practice',
          subtitle: `Unique talents and features.`,
          text: `Can you identify this animal?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/11giraffe.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else if (speak.indexOf('no') != -1) {
        //10으로 다시
        parameters.QN = "10";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Okay, lets go back to the question.
          Wow, you are very talented, aren’t you?What is your special feature?  Tell me one more.`,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme',
          subtitle: `Unique talents and features.`,
          text: `What is your special feature?
          I can also…
          Another one of my talent is…
          I have another unique talent. It is…
          `,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/10people.png',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else {
        parameters.QN = "10.1";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `I didn't understand. Are you ready to move on to the next question?`,
          text: `I didn't understand. Are you ready to move on to the next question?`,
        }));
      }
    }
    else if (parameters.QN == '11') {
      if (speak.indexOf('giraffe') != -1) {
        //13번으로
        parameters.QN = "13";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Excellent!
           What makes a giraffe unique?
           Tell me one feature of the giraffe.`,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme: Practice',
          subtitle: `Unique talents and features.`,
          text: `What makes this animal unique?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/11giraffe.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else {
        //12번으로
        parameters.QN = "12";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Let me give you a hint.
          Read the clues to guess what the animal in the picture is.
          What is the animal?`,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'HINT',
          subtitle: `Can you identify this animal?`,
          text: `Clues:  \n
          - The animal can be found in the African continent  \n
          - Its neck cannot reach the ground  \n
          - It starts with a G`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/11giraffe.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
    }
    else if (parameters.QN == '12') {
      if (speak.indexOf('giraffe') != -1) {
        //13으로
        parameters.QN = "13";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Excellent!
           What makes a giraffe unique?
           Tell me one feature of the giraffe.`,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme: Practice',
          subtitle: `Unique talents and features.`,
          text: `What makes this animal unique?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/11giraffe.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else {
        //13으로
        //That’s okay. The animal in the picture is a giraffe. Let move on.
        parameters.QN = "13";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `That’s okay. The animal in the picture is a giraffe. Let move on.
          What makes a giraffe unique?
          Tell me one feature of the giraffe.`,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme: Practice',
          subtitle: `Unique talents and features.`,
          text: `What makes this animal unique?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/11giraffe.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));

      }
    }
    else if (parameters.QN == '13') {
      //long neck  , tall , tallest, spots
      //13번에서 말하는거에 따라 나뉨
      //if(speak.indexOf('long neck'))
      var correct_list = ['long neck', 'tall', 'tallest', 'spots']

      var pasN = "0";
      for (var j = 0; j < correct_list.length; j++) {
        if (speak.indexOf(correct_list[j]) != -1) {
          pasN = "1";
          break;
        }
      }

      if (pass == 1) { //맞춤
        //excelt
        parameters.QN = "13.1";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Great job!Are you ready to move on?`,
          text: `Great job!Are you ready to move on?`,
        }));
      }
      else {
        parameters.QN = '14';
        conv.contexts.set('mysession', 1, parameters);

        let phrase = "I didn't quite get that. Let's move on.";

        phrase += `Look at the choices above. Which animal are you most interested in?`;
        conv.ask(new SimpleResponse({
          speech: phrase,
          text: 'nothing.',
        }));
        conv.ask(new Suggestions(['Cheetah', 'Hummingbird', 'Panda']));
        conv.ask(new Carousel({
          items: {
            'CHEETAH': {
              title: 'Cheetah',
              description: 'The cheetah is the fastest land…',
              image: new Image({
                url: 'https://s3.amazonaws.com/eduai/test_image/14cheetah.jpg',
                alt: 'cheetah',
              }),
            },
            'HUMMINGBIRD': {
              title: 'Hummingbird',
              description: 'Hummingbirds are one of the smallest…',
              image: new Image({
                url: 'https://s3.amazonaws.com/eduai/test_image/14hummingbird.jpg',
                alt: 'hummingbird',
              }),
            },
            'PANDA': {
              title: 'Panda',
              description: 'The giant panda is native china…',
              image: new Image({
                url: 'https://s3.amazonaws.com/eduai/test_image/14panda.jpg',
                alt: 'panda',
              }),
            },
          },
        }));
      }

    }
    else if (parameters.QN == '13.1') {
      if (speak.indexOf('yes') != -1) {
        parameters.QN = "14";
        conv.contexts.set('mysession', 1, parameters);

        let phrase = "";
        phrase += `Look at the choices above. Which animal are you most interested in?`;
        conv.ask(new SimpleResponse({
          speech: phrase,
          text: 'nothing.',
        }));
        conv.ask(new Suggestions(['Cheetah', 'Hummingbird', 'Panda']));
        conv.ask(new Carousel({
          items: {
            'CHEETAH': {
              title: 'Cheetah',
              description: 'The cheetah is the fastest land…',
              image: new Image({
                url: 'https://s3.amazonaws.com/eduai/test_image/14cheetah.jpg',
                alt: 'cheetah',
              }),
            },
            'HUMMINGBIRD': {
              title: 'Hummingbird',
              description: 'Hummingbirds are one of the smallest…',
              image: new Image({
                url: 'https://s3.amazonaws.com/eduai/test_image/14hummingbird.jpg',
                alt: 'hummingbird',
              }),
            },
            'PANDA': {
              title: 'Panda',
              description: 'The giant panda is native china…',
              image: new Image({
                url: 'https://s3.amazonaws.com/eduai/test_image/14panda.jpg',
                alt: 'panda',
              }),
            },
          },
        }));
      }
      else if (speak.indexOf('yes') != -1) {
        parameters.QN = "11";
        conv.contexts.set('mysession', 1, parameters);
        //피드백 Okay, lets go back to the question.
        conv.ask(new SimpleResponse({
          speech: `Okay, lets go back to the question. What is the name of the animal in the picture?`,
          text: `nothing.`,
        }));

        conv.ask(new BasicCard({
          title: 'Theme: Practice',
          subtitle: `Unique talents and features.`,
          text: `Can you identify this animal?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/11giraffe.jpg',
            alt: 'Image alternate text',
            width: 500,
            heigh: 500,
          }),
        }));
      }
      else {
        parameters.QN = "13.1";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `I didn't understand. Are you ready to move on?`,
          text: `I didn't understand. Are you ready to move on?`,
        }));
      }

    }

    else if (parameters.QN.includes('14')) {
      conv.contexts.set('mysession', 1, parameters);
      let phrase = "";
      if (!avail_answers.find_some(parameters.QN, speak)) {
        phrase = "I didn't understand. "
      }
      phrase += `Look at the choices above. Which animal are you most interested in?`;
      conv.ask(new SimpleResponse({
        speech: phrase,
        text: 'nothing.',
      }));
      conv.ask(new Suggestions(['Cheetah', 'Hummingbird', 'Panda']));
      conv.ask(new Carousel({
        items: {
          'CHEETAH': {
            title: 'Cheetah',
            description: 'The cheetah is the fastest land…',
            image: new Image({
              url: 'https://s3.amazonaws.com/eduai/test_image/14cheetah.jpg',
              alt: 'cheetah',
            }),
          },
          'HUMMINGBIRD': {
            title: 'Hummingbird',
            description: 'Hummingbirds are one of the smallest…',
            image: new Image({
              url: 'https://s3.amazonaws.com/eduai/test_image/14hummingbird.jpg',
              alt: 'hummingbird',
            }),
          },
          'PANDA': {
            title: 'Panda',
            description: 'The giant panda is native china…',
            image: new Image({
              url: 'https://s3.amazonaws.com/eduai/test_image/14panda.jpg',
              alt: 'panda',
            }),
          },
        },
      }));
    }
    else if (parameters.QN.includes('15')) {
      if (parameters.QN === '15') {
        parameters.QN = '15.1';
        // parameters.location = 'E1';
        conv.contexts.set('mysession', 1, parameters); //set my progress

        conv.ask(new SimpleResponse({
          speech: `Let's find out more about the cheetah. The cheetah is the fastest land animal in the world,
          reaching speeds of up to 70 miles per hour, They can accelerate from 0 to 68 per miles hour in just three seconds,
           Cheetahs are the only big cat that can turn in mid air while sprinting.`
            + ` What do you think is the coolest feature of a cheetah?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Cheetah',
          subtitle: `Fun Facts`,
          text: `The cheetah is the fastest land animal in the world, reaching speeds of up to 70 miles per hour. They can accelerate from 0 to 68 miles per hour in just three seconds. Cheetahs are the only big cat that can turn in mid-air while sprinting.`
            + ` What do you think is the coolest feature of a cheetah?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/15cheetah.jpg',
            alt: 'cheetah',
            width: 282,
            heigh: 361,
          }),
        }));
      } else if (parameters.QN == '15.1') { // todo 
        if (avail_answers.find_some(parameters.QN, speak)) {
          let phrase = 'Great job! \n You are done with Pre-Reading. \n Do you want to move onto Close Reading?';
          conv.ask(new SimpleResponse({
            speech: phrase,
            text: phrase,
          }));
          conv.ask(new Suggestions(['yes', 'no']));

        } else {
          let phrase = "Sorry. I didn't quite get that. You can tell me next time. \n Do you want to move on to Close Reading?";
          conv.ask(new SimpleResponse({
            speech: phrase,
            text: phrase,
          }));
          conv.ask(new Suggestions(['yes', 'no']));
        }

        parameters.QN = '15.2';
        conv.contexts.set('mysession', 1, parameters);
      } else if (parameters.QN == '15.2') {
        if (speak.indexOf('yes') != -1 || speak.indexOf('no') != -1
          || speak.indexOf('go') != -1 || speak.indexOf('stop') != -1
          || speak.indexOf('sure') != -1 || speak.indexOf('bye') != -1) {
          //todo 현재 기획이 나오지 않음, 현재는 무조건 no로
          let phrase = "Okay, I'll see you next time.";
          conv.close(new SimpleResponse({
            speech: phrase,
            text: phrase,
          }));
        } else {
          let phrase = "Do you want to move on to Close Reading?";
          conv.ask(new SimpleResponse({
            speech: phrase,
            text: phrase,
          }));
          conv.ask(new Suggestions(['yes', 'no']));
        }
      }
    }
    else if (parameters.QN.includes('16')) {
      if (parameters.QN == '16') {
        parameters.QN = '16.1';
        conv.contexts.set('mysession', 1, parameters);

        conv.ask(new SimpleResponse({
          speech: `Hummingbirds are one of the smallest kinds of birds in the world and can only be found in the Americas. 
          There are more than 340 species of hummingbirds. 
          They are named after the sound they create when they rapidly beat their wings.`
            + ` What do you think is the coolest feature of a hummingbird?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Hummingbird',
          subtitle: `Fun Facts`,
          text: `Hummingbirds are one of the smallest kinds of birds in the world and can only be found in the Americas. 
          There are more than 340 species of hummingbirds. 
          They are named after the sound they create when they rapidly beat their wings.`
            + ` What do you think is the coolest feature of a hummingbird?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/16hummingbird.jpg',
            alt: 'hummingbird',
          }),
        }));
      } else if (parameters.QN == '16.1') { // todo 
        if (avail_answers.find_some(parameters.QN, speak)) {
          let phrase = 'Great job! \n You are done with Pre-Reading. \n Do you want to move onto Close Reading?';
          conv.ask(new SimpleResponse({
            speech: phrase,
            text: phrase,
          }));
          conv.ask(new Suggestions(['yes', 'no']));

        } else {
          let phrase = "Sorry. I didn't quite get that. You can tell me next time. \n Do you want to move on to Close Reading?";
          conv.ask(new SimpleResponse({
            speech: phrase,
            text: phrase,
          }));
          conv.ask(new Suggestions(['yes', 'no']));
        }

        parameters.QN = '16.2';
        conv.contexts.set('mysession', 1, parameters);
      } else if (parameters.QN == '17.2') {
        if (speak.indexOf('yes') != -1 || speak.indexOf('no') != -1
          || speak.indexOf('go') != -1 || speak.indexOf('stop') != -1
          || speak.indexOf('sure') != -1 || speak.indexOf('bye') != -1) {
          //todo 현재 기획이 나오지 않음, 현재는 무조건 no로
          let phrase = "Okay, I'll see you next time.";
          conv.close(new SimpleResponse({
            speech: phrase,
            text: phrase,
          }));
        } else {
          let phrase = "Do you want to move on to Close Reading?";
          conv.ask(new SimpleResponse({
            speech: phrase,
            text: phrase,
          }));
          conv.ask(new Suggestions(['yes', 'no']));
        }
      }
    }
    else if (parameters.QN.includes('17')) {
      if (parameters.QN == '17') {
        parameters.QN = '17.1';
        conv.contexts.set('mysession', 1, parameters);

        conv.ask(new SimpleResponse({
          speech: `The giant panda is native to China. It has a black and white coat that feature large black patches around its eyes. 
          It spends 14 to 16 hours a day eating bamboo. 
          Pandas are an endangered species.`
            + ` What do you think is the coolest feature of a panda?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Panda',
          subtitle: `Fun Facts`,
          text: `The giant panda is native to China. It has a black and white coat that feature large black patches around its eyes. 
          It spends 14 to 16 hours a day eating bamboo. 
          Pandas are an endangered species.`
            + ` What do you think is the coolest feature of a panda?`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/17panda.jpg',
            alt: 'panda',
          }),
        }));
      } else if (parameters.QN == '17.1') { // todo 
        if (avail_answers.find_some(parameters.QN, speak)) {
          let phrase = 'Great job! \n You are done with Pre-Reading. \n Do you want to move onto Close Reading?';
          conv.ask(new SimpleResponse({
            speech: phrase,
            text: phrase,
          }));
          conv.ask(new Suggestions(['yes', 'no']));

        } else {
          let phrase = "Sorry. I didn't quite get that. You can tell me next time. \n Do you want to move on to Close Reading?";
          conv.ask(new SimpleResponse({
            speech: phrase,
            text: phrase,
          }));
          conv.ask(new Suggestions(['yes', 'no']));
        }

        parameters.QN = '17.2';
        conv.contexts.set('mysession', 1, parameters);
      } else if (parameters.QN == '17.2') {
        if (speak.indexOf('yes') != -1 || speak.indexOf('no') != -1
          || speak.indexOf('go') != -1 || speak.indexOf('stop') != -1
          || speak.indexOf('sure') != -1 || speak.indexOf('bye') != -1) {
          let phrase = "Okay, I'll see you next time.";
          conv.close(new SimpleResponse({
            speech: phrase,
            text: phrase,
          }));
        } else {
          let phrase = "Do you want to move on to Close Reading?";
          conv.ask(new SimpleResponse({
            speech: phrase,
            text: phrase,
          }));
          conv.ask(new Suggestions(['yes', 'no']));
        }
      }
    }

    else {
      conv.close('error. the ' + parameters.QN + ' does not exist.');
    }
  }

  else if (parameters.location == 'E2') {

    if (parameters.QN == "1") {

      if (speak.indexOf('disagree') != -1) {
        parameters.QN = "6";
        conv.contexts.set('mysession', 1, parameters);
        //6번으로
        conv.ask(new SimpleResponse({
          speech: `I see that you disagree with my statement.
              Tell me your thoughts. Why do you think that Inchworm was more helpful than Hawk?
              Use the pattern above to answer the question. `,
          text: 'nothing.',
        }));


        conv.ask(new BasicCard({
          title: 'Tell me the reason',
          subtitle: `Why do you disagree?
              Why do you think that Inchworm was more helpful than Hawk?
              `,
          text: `**I disagree** that Hawk was more helpful than Inchworm because…  \n
              **I don’t think** that Hawk was more helpful than Inchworm because…  \n
              **I don’t believe** that Hawk was more helpful than Inchworm because…  \n
              **I think** that Inchworm was Hawk was more helpful than Inchworm because…  \n
              **I believe** that Inchworm was more helpful than Hawk  because…`,

        }));
      }
      else if (speak.indexOf('agree') != -1) {
        //동의하면 2번으로
        parameters.QN = "2";
        conv.contexts.set('mysession', 1, parameters);
        //2번화면으로
        conv.ask(new SimpleResponse({
          speech: `You agree with me!` + `Why do you think that Hawk was more helpful than Inchworm?
            Use the pattern above to answer the question. `,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Tell me the reason',
          subtitle: `Why do you think that Hawk was more helpful than Inchworm?`,
          text: `**I agree** that Hawk was more helpful than Inchworm because…  
            **I think** that Hawk was more helpful than Inchworm because…  
            **I believe** that Hawk was more helpful than Inchworm because…`
        }));
      }
      else {
        parameters.QN = "1";
        conv.contexts.set('mysession', 1, parameters);

        conv.ask(new SimpleResponse({
          speech: `Let’s discuss.Do you agree or disagree with the following statement? I think Hawk was more helpful than Inchworm in the story, Inchworm’s Tale.`,
          text: 'nothing.',
        }));
        conv.ask(new Suggestions(['agree', 'disagree']));
        conv.ask(new BasicCard({
          title: 'Tell me your opinion',
          subtitle: `Do you agree or disagree?`,
          text: `I think Hawk was more helpful than Inchworm in the story, __Inchworm’s Tale__.`,

          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/e2_1.png',
            alt: 'panda',
          }),
        }));
      }

    }
    else if (parameters.QN == "2") {
      var cl = ['gather', 'food', 'eat', 'brought', 'bring', 'large leaves', 'leaves', 'warm', 'safe', 'unharmed', 'delivered', 'news', 'carry', 'carried'];
      var isok = 0;
      for (var i = 0; i < cl.length; i++) {
        if (speak.indexOf(cl[i]) != -1) {
          isok = 1;
          break;
        }
      }

      if (isok == 1) {
        //통과
        //3번화면으로
        parameters.QN = "3";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `That was great!
          You did a wonderful job!
          You are finished with the lesson. `+ `Would you like to  go back to the menu?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'A job well done!',
          subtitle: `Great work!  \nYou are done with today’s lesson.`,
          text: ``,
          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/20congra.jpg',
            alt: 'goodjob',
          }),
        }));
      }
      else {
        //실패
        //4번화면으로
        parameters.QN = "4";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Hmm. Let’s try again. Here’s a hint!` +
            `Why do you think that Hawk was more helpful than Inchworm?
          Read the context clues then use the pattern above to answer the question. `,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'HINT',
          subtitle: `Why do you think that Hawk was more helpful than Inchworm?`,
          text: `**I think** that Hawk was more helpful than Inchworm because…  
            
          - Hawk was unable to carry the children down the rock, so he gathered lots of food for them to eat. Then he brought large leaves to keep tem warm, Hawk wanted to make sure they were safe and unharmed. (p.184)
          - Every day, Hawk brought food to the children. Every day he reappeared in the village with news for the villagers. (p187)`
        }));
      }

    }
    else if (parameters.QN == "3") {
      if (speak.indexOf('yes') != -1) {
        //첫화면으로
        parameters.QN = "0";
        parameters.location = "first";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Okay. Let's go back to the menu. Please choose 1 or 2. `,
          text: '1. Pre-Reading Overview \n 2. Let\'s Read \n',
        }));
        conv.ask(new Suggestions(['1. Pre-Reading Overview', '2. Let\'s Read \n']));
      }
      else if (speak.indexOf('no') != -1) {
        //끝
        conv.close('See you next time. Good bye.');
      }
      else {
        conv.close('See you next time. Good bye.');
      }

    }
    else if (parameters.QN == "4") {
      var cl = ['gather', 'food', 'eat', 'brought', 'bring', 'large leaves', 'leaves', 'warm', 'safe', 'unharmed', 'delivered', 'news', 'carry', 'carried'];
      var isok = 0;
      for (var i = 0; i < cl.length; i++) {
        if (speak.indexOf(cl[i]) != -1) {
          isok = 1;
          break;
        }
      }

      if (isok == 1) {
        //정답 3번으로
        parameters.QN = "3";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `That was great!
          You did a wonderful job!
          You are finished with the lesson. `+ `Would you like to  go back to the menu?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'A job well done!',
          subtitle: `Great work!  \nYou are done with today’s lesson.`,
          text: ``,
          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/20congra.jpg',
            alt: 'goodjob',
          }),
        }));
      }
      else {
        //5번으로
        parameters.QN = "5";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Nice try! We can practice some more later.
          You are finished with the lesson. `+ `Would you like to  go back to the menu?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Better luck next time…',
          subtitle: `Good effort! \nYou are done with today’s lesson.`,
          text: ``,
          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/22goodjob.jpg',
            alt: 'goodjob',
          }),
        }));
      }
    }
    else if (parameters.QN == "5") {
      if (speak.indexOf('yes') != -1) {
        //첫화면으로
        parameters.QN = "0";
        parameters.location = "first";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `I didn't understand. Please choose 1 or 2. `,
          text: '1. Pre-Reading Overview \n 2. Let\'s Read \n',
        }));
        conv.ask(new Suggestions(['1. Pre-Reading Overview', '2. Let\'s Read \n']));
      }
      else if (speak.indexOf('no') != -1) {
        //끝
        conv.close('See you next time. Good bye.');
      }
      else {
        conv.close('See you next time. Good bye.');
      }
    }
    else if (parameters.QN == "6") {
      var cl = ['hawk was unable', 'climb', 'down', 'led', 'lead', 'rock', 'mountain', 'hero', 'bottom', 'safe', 'inch', 'brave', 'slope', 'skillful'];
      var isok = 0;
      for (var i = 0; i < cl.length; i++) {
        if (speak.indexOf(cl[i]) != -1) {
          isok = 1;
          break;
        }
      }

      if (isok == 1) {
        //정답이면 3번으로
        parameters.QN = "3";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `That was great!
          You did a wonderful job!
          You are finished with the lesson. `+ `Would you like to  go back to the menu?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'A job well done!',
          subtitle: `Great work!  \nYou are done with today’s lesson.`,
          text: ``,
          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/20congra.jpg',
            alt: 'goodjob',
          }),
        }));
      }
      else {
        //7번으로
        parameters.QN = "7";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Hmm. Let’s try again. Here’s a hint!` +
            `Why do you think that Hawk was more helpful than Inchworm?
          Read the context clues then use pattern above to answer the question. `,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'HINT',
          subtitle: `Why do you disagree?  Why do you think that Inchworm was more helpful than Hawk?`,
          text: `**I don’t** think that Hawk was more helpful than Inchworm because…  
          **I think** that Inchworm was more helpful than Hawk because…  
          - Inchworm showed them all how skillful she was at climbing. (p.186)  
          - It took almost a week for the three to climb down to the village. Inch by inch, Inchworm led the children carefully down the rocky slope. […]  Finally, Inchworm, Anant, and Anika reached the bottom of the rock. Everyone cheered and called Inchworm a hero. (p187)`
        }));
      }
    }
    else if (parameters.QN == "7") {
      var cl = ['hawk was unable', 'climb', 'down', 'led', 'lead', 'rock', 'mountain', 'hero', 'bottom', 'safe', 'inch', 'brave', 'slope', 'skillful'];
      var isok = 0;
      for (var i = 0; i < cl.length; i++) {
        if (speak.indexOf(cl[i]) != -1) {
          isok = 1;
          break;
        }
      }

      if (isok == 1) {
        //정답이면 3번으로
        parameters.QN = "3";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `That was great!
          You did a wonderful job!
          You are finished with the lesson. `+ `Would you like to  go back to the menu?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'A job well done!',
          subtitle: `Great work!  \nYou are done with today’s lesson.`,
          text: ``,
          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/20congra.jpg',
            alt: 'goodjob',
          }),
        }));
      }
      else {
        //5번으로
        parameters.QN = "5";
        conv.contexts.set('mysession', 1, parameters);
        conv.ask(new SimpleResponse({
          speech: `Nice try! We can practice some more later.
          You are finished with the lesson. `+ `Would you like to  go back to the menu?`,
          text: 'nothing.',
        }));
        conv.ask(new BasicCard({
          title: 'Better luck next time…',
          subtitle: `Good effort! \nYou are done with today’s lesson.`,
          text: ``,
          image: new Image({
            url: 'https://s3.amazonaws.com/eduai/test_image/22goodjob.jpg',
            alt: 'goodjob',
          }),
        }));
      }
    }
    else {
      conv.close('error. the ' + parameters.QN + ' does not exist.');
    }

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
        parameters.QN = '0';



        return new Promise(function (resolve) {
          makeconv(conv, parameters, "haha. ");
          resolve('conv emit 끝!');
        });

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

module.exports = router;


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