/* *****************************
 * Slack Sentiment Analysis Bot
 *
 * Tomomi Imura (@girlie_mac)
 * *****************************/

'use strict';

const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});


/* Auth - using a temp token */

let oauthToken = process.env.SLACK_AUTH_TOKEN;

// Oauth - implement only when distributing the bot
// ...

/* Bot */

// not sure why the event is called muktiple times sometimes :-(

app.post('/events', (req, res) => {
  let q = req.body;
  console.log('*** Event triggered');
  console.log(q);

  // To see if the request is coming from Slack
  if (q.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    res.sendStatus(400);
    return;
  }

  // App setting validation
  if (q.type === 'url_verification') {
    res.send(q.challenge);
  }

  // Events
  else if (q.type === 'event_callback') {
    if(!q.event.text) return;

    // Exclude the message from a bot, also slash command
    let regex = /(^\/)/;
    if(q.event.subtype === 'bot_message' || regex.test(q.event.text)) return;

    analyzeTone(q.event);

    res.sendStatus(200);
  }
});


// IBM Watson Tone Analysis

const watson = require('watson-developer-cloud');

let tone_analyzer = watson.tone_analyzer({
  username: process.env.WATSON_TONE_ANALYSIS_USERNAME,
  password: process.env.WATSON_TONE_ANALYSIS_PASSWORD,
  version: process.env.WATSON_TONE_ANALYSIS_VERSION,
  version_date: '2016-05-19'
});

const confidencethreshold = 0.55;

function analyzeTone(ev) {
  let text = ev.text;

  let regex = /(^:.*:$)/; // Slack emoji, starts and ends with :
  if(regex.test(text)) {
    text = text.replace(/_/g , ' ');
    text = text.replace(/:/g , '');
  }

  tone_analyzer.tone({text: text}, (err, tone) => {
    if (err) {
      console.log(err);
    } else {
      tone.document_tone.tone_categories.forEach((tonecategory) => {
        if(tonecategory.category_id === 'emotion_tone'){
          console.log(tonecategory.tones);
          tonecategory.tones.forEach((emotion) => {
            if(emotion.score >= confidencethreshold) { // pulse only if the likelihood of an emotion is above the given confidencethreshold
              postEmotion(emotion, ev)
            }
          })
        }
      })
    }
  });
}

function postEmotion(emotion, ev) {
  console.log('Current Emotion is', emotion.tone_id);

  let username = '';
  request.post('https://slack.com/api/users.info', {form: {token: oauthToken, user: ev.user}}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      username = JSON.parse(body).user.name;
      let message = username + ' is feeling ' + emotion.tone_id;

      let options = {
        method: 'POST',
        uri: 'https://slack.com/api/chat.postMessage',
        form: {
          token: oauthToken,
          channel: ev.channel,
          text: message,
          as_user: false,
          username: 'Watson Bot'
        }
      };

      request(options, (error, response, body) => {
        if (error) {
          console.log(error)
        }
      });
    }
  });
}
