var express = require('express');
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
    console.log('conv:',conv);

    conv.ask(`this is my cat picture`);
    conv.ask(new Image({
        url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
        alt: 'A cat',
    }))
    conv.ask(`is it cute`);
})

ap.intent('Answer', (conv, input) => {
    console.log('input:',input);
    console.log('conv:',conv);
    console.log(`input.any:`, input.any);
    //Carousel  예제
    conv.ask(new SimpleResponse(`Answer Intent! you said that! ${input.any}`));
});


// 항상 여기로 시작할것
ap.intent('girl', (conv) => {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    conv.ask(new SignIn('To get your account details'));
});


// 여기서 시작하면 XXX
ap.intent('boy', (conv,params, signin) => {
   
      if (signin.status === 'OK') {
        console.log('###########conv###############');
        console.log(conv);
        /*
        console.log(`params:`,params);
        console.log(`signin:`,signin);
        */
       console.log('#####################conv.DialogflowConversation########################');
       console.log(conv.DialogflowConversation);
       console.log('#######################conv.DialogflowConversation.user#######################');
       console.log(conv.DialogflowConversation.user);
       console.log('##########################################################');

        conv.ask(`I got your account details. What do you want to do next?`);
      } else {
          /*
        console.log(`conv:`,conv);
        console.log(`params:`,params);
        console.log(`signin:`,signin);
        */
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


/*
const SELECTED_ITEM_RESPONSES = {
    '[SELECTION_KEY_ONE]': 'You selected the first item',
    '[SELECTION_KEY_GOOGLE_HOME]': 'You selected the Google Home!',
    '[SELECTION_KEY_GOOGLE_PIXEL]': 'You selected the Google Pixel!',
};
ap.intent('actions.intent.OPTION', (conv, params, option) => {
    let response = 'You did not select any item';
    if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
        response = SELECTED_ITEM_RESPONSES[option];
    }
    conv.ask(response);
});

*/
module.exports = router;
