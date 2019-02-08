const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

const botToken = require('./constants').botToken;

const bot = new TelegramBot(botToken, {polling: true});

bot.onText(/\/course/, (msg, match) => {

    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Пожалуйста, выберите какая валюта Вас интересует:', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'EUR - €',
                        callback_data: 'EUR'
                    },
                    {
                        text: 'USD - $',
                        callback_data: 'USD'
                    },
                    {
                        text: 'RUB - ₽',
                        callback_data: 'RUR'
                    },
                    {
                        text: 'BTC - ₿',
                        callback_data: 'BTC'
                    }
                ]
            ]
        }
    });
});

bot.on('callback_query', query => {
    const id = query.message.chat.id;

    request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function (error, response, body) {
        const data = JSON.parse(body);
        const result = data.filter(item => item.ccy === query.data)[0];
        const flag = {
            'USD': '🇺🇸',
            'EUR': '🇪🇺',
            'RUR': '🇷🇺',
            'UAH': '🇺🇦',
            'BTC': '₿'
        };
        let md = `
            *${flag[result.ccy]} ${result.ccy} 💱 ${result.base_ccy} ${flag[result.base_ccy]}*
            Buy: _${result.buy}_
            Sale: _${result.sale}_
            `;
        bot.sendMessage(id, md, {parse_mode: 'Markdown'});

    })
});