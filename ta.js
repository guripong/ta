var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



var allintentrouter = require('./route/handler');
var power_reading = require('./route/power_reading')
app.use('/allintent',allintentrouter);
app.use('/power_reading',power_reading);


app.listen(process.env.PORT || 9696, function() {
  console.log("Server up and 9696 port listening");
});
module.exports = app;


  //음악재생
  /*
  conv.ask(new SimpleResponse(`Answer Intent! you said that! ${input.any}`));
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
  */
 //테이블 예제
 /*
conv.ask(new SimpleResponse(`Answer Intent! you said that! ${input.any}`));
conv.ask(new Table({
  title: 'Table Title',
  subtitle: 'Table Subtitle',
  image: new Image({
    url: 'https://avatars0.githubusercontent.com/u/23533486',
    alt: 'Actions on Google'
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
  buttons: new Button({
    title: 'Button Title',
    url: 'https://github.com/actions-on-google' //버튼 링크줘서 보내버리기
  }),
}));
*/



//deveduai.koreapolyschool.com/.well-known/acme-challenge/bEc-I7J799Khbik6KOpl_BmTTGYEEKqFflgk1mrwW38
//deveduai.icreate.kr/.well-known/acme-challenge/ufc78PaY-1BV7-mn0U82hRGF9n2_87Ta7mnl7msXiJk
/*
app.get('/.well-known/acme-challenge/bEc-I7J799Khbik6KOpl_BmTTGYEEKqFflgk1mrwW38',function(req,res){

  var origFileNm='bEc-I7J799Khbik6KOpl_BmTTGYEEKqFflgk1mrwW38';
  var file='./temp/'+origFileNm; //여기가 로칼에서 받을 파일내임
  mimetype = mime.lookup(origFileNm);//


  res.setHeader('Content-disposition','attachment;filename='+origFileNm); //여기가 서버에서 보낼 파일이름해더에 정해주기
  res.setHeader('Content-type',mimetype);

  var filestream=fs.createReadStream(file);//실제파일
  filestream.pipe(res);
});
app.get('/',function(req,res){
  res.send('hihihi');
})

app.post("/allintent", function(req, res) {
   var intent =req.body.queryResult.intent.displayName;
   var speech =req.body.queryResult.queryText;
   var aim =req.body.queryResult.parameters['any'];
   console.log(`intent:`+intent);
   console.log(`speech:`+speech);
   console.log(`aim:`+aim);
   
   var response='default';
   //console.log(`1:`+req.body.queryResult.queryText); //실제 한말
   //console.log(`2:`+req.body.queryResult.intent.displayName); //호출된 인텐트
  if (intent== 'Default Welcome Intent'){
    response='Welcome to power test! say anything! I will repeat!';
  }

  //<speak><audio src="https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg">did not get your audio file</audio></speak>
  //var audio1 = `<audio src="https://s3.amazonaws.com/eduai/common/common-003-correct-good.mp3"/>`;
  if (intent == 'Answer') {
   // if(speech)response = `<speak>hi audio test! number 1. ${audio1} ${audio1} ${audio1} ${audio1} ${audio1} ${audio1} ${audio1}</speak> `;
    if(speech) response ='<speak>'+speech+'. say anything!'+'</speak>';

   // "<speak> <audio src='https://s3.amazonaws.com/eduai/sw01/u01/p01/sw01-u01-p01-001-wp-title.mp3'>did not get your audio file</audio> you said that "+speech+". say anything!<speak>";
    else response ='say anything!';
  }
  
   return res.json({
    fulfillmentText: response,
   
    source: "example.com",

   });
  
 
});
*/

