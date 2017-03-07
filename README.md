# Sentiment Analysis Slack chat Bot

Have you ever wonder how your Slack chat message is perceived by other users? You may sounds unpleasant, or have harsh tones that you may not have noticed! In this tutorial, I am walking you through to build a Slack bot that analyze the tone of messages using IBM Watson Watson to read the emotion of each message posted!

![Slack Watson Raspberry Pi Bot](https://github.com/girliemac/slack-sentiment/blob/master/pi-bot.gif)

## Running on Your Own

### Prerequisites

You need an [IBM Bluemix](https://console.ng.bluemix.net) account and add the [Watson Tone Analyzer](https://console.ng.bluemix.net/services/tone_analyzer/cbe7a324-0794-46d3-a6be-db4e58604273/?paneId=manage). You will be required the service credentials later.

The second part is totally optional. If you want to build a physical Raspberry Pi bot, you need the hardware:

1 [Raspberry Pi 3](https://www.amazon.com/gp/product/B01CD5VC92/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=gm063-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01CD5VC92&linkId=f0ff0b9febc994dd00afe62faade7ce8) (If you are using Pi 2, you need a WiFi dongle too)
1 [NeoPixel RGB LED](https://www.adafruit.com/products/1734)
3 Female/female jumper wires

You need to install the latest Raspbian OS, connect to WiFi, and update and upgrade the system. See [Raspberrypi.org](https://www.amazon.com/gp/product/B01CD5VC92/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=gm063-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01CD5VC92&linkId=f0ff0b9febc994dd00afe62faade7ce8) for the instruction.

### Set the ENV VARS

When you clone this repo run on your own server, rename the `.env-test` file to `.env` and fill out your own Slack Dev and IBM Bluemix credentials.

## Configuring Your Slack App

*I will write the steps down later!*
