const axios = require('axios');
const { Telegraf } = require('telegraf');
const { fmt, link } = require("telegraf/format");

/* Telegram Bot Settings */
const chatId = '';
const token = '';
const bot = new Telegraf(token);

let running = true;

bot.hears('stop', (ctx) => {
    running = false;
    ctx.reply('Stopping bot...');
});
bot.hears('start', (ctx) => {
    ctx.reply('Starting bot...');
    running = true;
    runLoop();
});
bot.launch();

/* Runtime Settings */
const interval = 5000;
const timeBias = 1000;

/* Watch Tower */
const itemList = [
    {
        name: 'α7CR (黑)',
        id: 'ff8080818a0213c7018a40b40ddf37f2',
    },
    {
        name: 'α7CR (銀)',
        id: 'ff8080818a0213c7018a40b2282137ed',
    },
    {
        name: 'α7C II (黑)',
        id: 'ff8080818a0213c7018a40a2a31637df',
    }
];

async function runRequest(item) {
    try {
        const url = `https://store.sony.com.tw/product/show/${item.id}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
            },
        });

        if (response.data.includes('"加入購物車"', 0)) {
            console.log(`${item.name} on stuck`);
            bot.telegram.sendMessage(
                chatId,
                fmt`[${item.name}] 到貨囉！ ${link('進入商品頁', url)}`
            );
        } else {
            console.log(item.name, '-');
        }
    } catch (error) {
        console.error(error);
    }
}

function checkItemsStatus() {
    if (running === false) {
        return;
    }
    for (let index in itemList) {
        runRequest(itemList[index]);
    }
}

function runLoop() {
    if (running === false) {
        return;
    }
    setTimeout(() => {
        checkItemsStatus();
        runLoop();
    }, interval + Math.random() * timeBias);
}
