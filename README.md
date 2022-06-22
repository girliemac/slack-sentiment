# Sentiment Analysis Slack Bot

Have you ever wondered how your Slack chat message is perceived by other users? You may sound unpleasant, or have harsh tones that you may not have noticed! In this tutorial, I am walking you through to build a Slack bot that analyzes the tone of messages using IBM Watson, to read the emotion of each message posted!

![Slack Watson Raspberry Pi Bot](https://github.com/girliemac/slack-sentiment/blob/master/pi-bot.gif?raw=true)

## Running on Your Own

### Prerequisites

First you need an [IBM Cloud](cloud.ibm.com) account: 
1. Go to **Catalog** > **AI** 
2. Enable **Tone Analyzer**
3. Get your credentials (API key and URL) by clicking **Service Credentials** then **View credentials**

The second part now is **optional**. If you want to build a physical bot, you need the hardware for a Raspberry Pi:

* 1x [Raspberry Pi 3](https://www.amazon.com/gp/product/B01CD5VC92/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=gm063-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01CD5VC92&linkId=f0ff0b9febc994dd00afe62faade7ce8) (If you are using Pi 2, you need a WiFi dongle too)
* 1x [NeoPixel RGB LED](https://www.adafruit.com/products/1734)
* 3x Female/female jumper wires

You need to have the Raspbian OS installed. Connect you Raspberry Pi to WiFi and update and upgrade the system. See [Raspberrypi.org](https://www.amazon.com/gp/product/B01CD5VC92/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=gm063-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B01CD5VC92&linkId=f0ff0b9febc994dd00afe62faade7ce8) for the instruction.

### Set the ENV VARS

When you clone this repo, run it on your own server, rename the `.env-test` file to `.env` and fill out your own Slack Dev and IBM Bluemix credentials.

## Configuring Your Slack App

The full step-by-step tutorial (updated on Jan 23, 2020) is on https://api.slack.com/tutorials/watson-sentiment
