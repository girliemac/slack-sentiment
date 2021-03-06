/* ***************************************************
 * Slack Sentiment Analysis IoT Bot with Rapsberry Pi
 * v3 
 * Updated: Jan 23, 2020
 * Tomomi Imura (@girlie_mac)
 * ***************************************************/

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const axios = require('axios');
const qs = require('qs');

/* 
 * Verifying signing signature 
 * To learn what these lines are doing, see my tutorial at: 
 * https://medium.com/slack-developer-blog/tutorial-developing-an-action-able-app-4d5455d585b6#4744
*/
const signature = require('./verifySignature');

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};
app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));
/*  */

const apiUrl = 'https://slack.com/api';

/* Handling events */

app.post('/events', (req, res) => {
  
  // App setting validation
  if (req.body.type === 'url_verification') {
    res.send(req.body.challenge);
  }

  // Events 
  else if (req.body.type === 'event_callback') {
    
    if (!signature.isVerified(req)) {
      res.sendStatus(404);
      return;
    } else {
      res.sendStatus(200);
    }
    
    const {bot_id, text, user, channel} = req.body.event;
    
    if(!text) return;

    // Exclude the message from a bot, also slash command
    let regex = /(^\/)/;
    
    //console.log(req.body.event);
    if(bot_id || regex.test(text)) return;
    
    analyzeTone(text, user, channel);
    
  }
});


/* IBM Watson Tone Analysis */

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const toneAnalyzer = new ToneAnalyzerV3({
  iam_apikey: process.env.TONE_ANALYZER_IAM_APIKEY,
  url: 'https://gateway.watsonplatform.net/tone-analyzer/api',
  version: '2017-09-21',
});

const confidencethreshold = 0.55;

function analyzeTone(text, user, channel) {

  let regex = /(^:.*:$)/; // Slack emoji, starts and ends with :
  if(regex.test(text)) {
    text = text.replace(/_/g , ' ');
    text = text.replace(/:/g , '');
  }

  toneAnalyzer.tone({text: text}, (err, result) => {
    
    if (err) {
      console.log(err);
    } else {
      let tones = result.document_tone.tones;
      let emotions = [];   

      for (let v of tones) {
        if(v.score >= confidencethreshold) { // pulse only if the likelihood of an emotion is above the given confidencethreshold
          console.log(`Current Emotion is ${v.tone_id}, ${v.score}`);
          emotions.push(v.tone_id);
        }
      }
      
      if(emotions.length) postEmotion(emotions, user, channel)
    }
  });
}

/* Bot posts a message */
const postEmotion = async(emotions, user, channel) => { 
  
  const args = {
    token: process.env.SLACK_ACCESS_TOKEN,
    channel: channel,
    text: `<@${user}> is feeling: ${emotions.join(', ')}`
  };
  
  const result = await axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(args));
  
  try {
    //console.log(result.data);
  } catch(e) {
    console.log(e);
  }
};

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});




// Display LED color
// The code is based on the sample code by IBM

const ws281x = require('rpi-ws281x-native');
const NUM_LEDS = 1;
ws281x.init(NUM_LEDS);
const color = new Uint32Array(NUM_LEDS);

// ----  reset LED before exit
process.on('SIGINT', () => {
  ws281x.reset();
  process.nextTick(() => { process.exit(0); });
});

const red = 0x00ff00 ;
const green = 0xff0000 ;
const blue = 0x0000ff ;
const yellow = 0xffff00 ;
const purple = 0x00ffff ;

// Process emotion returned from Tone Analyzer Above
// Show a specific color fore each emotion
function colorEmotion(emotion) {
  if (emotion.tone_id === 'anger') {
    setLED(red);
  } else if(emotion.tone_id === 'joy') {
    setLED(yellow);
  } else if(emotion.tone_id === 'fear') {
    setLED(purple);
  } else if(emotion.tone_id === 'disgust') {
    setLED(green);
  } else if(emotion.tone_id === 'sadness') {
    setLED(blue);
  }
}

// Set the LED to the given color value
function setLED(colorval){
  color[0] = colorval ;
  ws281x.render(color);
}
