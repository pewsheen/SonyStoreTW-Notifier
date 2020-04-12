const request = require('request');
const TelegramBot = require('node-telegram-bot-api');


/* Telegram Bot Settings */
const chatId = '';
const token = '';
const bot = new TelegramBot(token, {polling: false});

/* Runtime Settings */
const interval = 30000;
const timeBias = 30000;

/* Watch Tower */
const itemList = [
    {
        name: 'SEL24F14GM',
        id: 'ff8080816643644a0166661218cf10cd',
    },
    {
        name: 'SEL100F28GM',
        id: '8a818bb95a464b07015a49fab83a2ef6',
    },
];

function runRequest(item) {
    let options = {
        url: `https://store.sony.com.tw/product/show/${item.id}`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
        }
    }
    request(options, function (error, response, body) {
        let time = new Date();

        if (!response || response.statusCode !== 200) {
            console.log('Failed to get response');
            console.log(time, item.name, error, response.statusCode, body);
            return;
        }

        if (body.includes('放入購物車', 0)) {
            console.log(time, item.name, 'On stuck!!');
            bot.sendMessage(chatId, `${item.name} has stock`);
        } else {
            console.log(time, item.name, 'Out of stuck!');
        }
    });
}

function checkItemsStatus() {
    for (let index in itemList) {
        runRequest(itemList[index]);
    }
};

function runLoop() {
    setTimeout(() => {
        checkItemsStatus();
        runLoop();
    }, (interval+Math.random()*timeBias));
}

runLoop();