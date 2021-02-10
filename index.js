const { Telegraf } = require('telegraf')
const token = '1525485201:AAHNAmcolIoB1PbCktqZVpY27SfHXh7fXcw';
const bot = new Telegraf(token);
const S = require('string');

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();

const fs = require('fs');



function dataJsonUrl(url) {

    xhr.open('GET', `https://desu.me/manga/api/${url}/`, false);

    xhr.send();

    let dataJson = xhr.responseText;

    objJson = JSON.parse(dataJson);

    return String(`Манга: @${objJson.response.russian}@ - Том: @1${objJson.response.chapters.updated.ch}@1 | Глава: @2${objJson.response.chapters.updated.vol}@2`);

    // let a = objJson.response.russian;
}


function newManga(id, text) {


    fs.mkdirSync(`BD/${id}/${S(text).between('https://desu.me/manga/', '/').s}`); // Создаем папку манги.

    fs.writeFileSync(`BD/${id}/${S(text).between('https://desu.me/manga/', '/').s}/${S(text).between('https://desu.me/manga/', '/').s}.txt`, `${dataJsonUrl(`${S(text).between('https://desu.me/manga/', '/').s}`)}`); //Создаем файл манги.

}



function telegrammMessage(id, message) {

    let urlMessage = `https://api.telegram.org/bot1525485201:AAHNAmcolIoB1PbCktqZVpY27SfHXh7fXcw/sendMessage?chat_id=${id}&text=`
        + encodeURI(message);

    xhr.open('GET', urlMessage, false);
    xhr.send();

}




bot.on('text', (ctx) => { // Бот смотрит, правильность ссылки и изменяет ее под апи.

    // console.log('ID - ' + ctx.chat.id);
    // console.log('MESS - ' + ctx.message.text);

    // console.log(ctx.message.text.includes('https://desu.me/manga/')); // Проверка на правильность ввода
    // console.log(S(ctx.message.text).between('https://desu.me/manga/', '/').s); // Удаляем все лишнее, чтобы создать файл txt

    // let nameManga = `${S(ctx.message.text).between('https://desu.me/manga/', '/').s}`;

    // Проверка на сущестование папки пользователя.
    if (fs.existsSync(`BD/${ctx.chat.id}`) == false && ctx.message.text.includes('https://desu.me/manga/')) {

        fs.mkdirSync(`BD/${ctx.chat.id}`); // Если папки нету, то создать.

        newManga(ctx.chat.id, ctx.message.text);
    }

    // Добавление манги, уже созданного пользователя
    else if (fs.existsSync(`BD/${ctx.chat.id}/${S(ctx.message.text).between('https://desu.me/manga/', '/').s}`) == false
        && ctx.message.text.includes('https://desu.me/manga/')) {

        newManga(ctx.chat.id, ctx.message.text);
    }

});



bot.launch() // запуск бота





let i = 0;
function start() {
    

setInterval(() => {
    console.log('-----------------------------------');
    console.log('Проверка №' + ++i);
    console.log('-----------------------------------');


    const files = fs.readdirSync('BD/');

    files.forEach(element0 =>

        fs.readdirSync(`BD/${element0}`).forEach(element1 => {

            console.log('Проверяю => ' + fs.readFileSync(`BD/${element0}/${element1}/${element1}.txt`, `utf8`)); // Данные из БД
            // console.log(dataJsonUrl(element1)); // Текущая ситация по манге с сайта

            const dM = fs.readFileSync(`BD/${element0}/${element1}/${element1}.txt`, `utf8`);
            const wM = dataJsonUrl(element1);


            const nameManga = S(wM).between('@', '@').s.toUpperCase();
            const chManga = S(wM).between('@1', '@1').s.toUpperCase();
            const volManga = S(wM).between('@2', '@2').s.toUpperCase();

            // console.log(nameManga);
            // console.log(chManga);
            // console.log(volManga);

            if (dM != wM) { //Если есть не свопадение по манге.

                telegrammMessage(element0, `☯ У манги 🔥${nameManga}🔥 вышла НОВАЯ ГЛАВА ${chManga} ☯`)

                fs.writeFileSync(`BD/${element0}/${element1}/${element1}.txt`, `${dataJsonUrl(`${element1}`)}`);
                //Создаем файл манги.
            }

        }
        )

    );

}, 120000);

}


try {
    start();
} catch (error) {
    console.log('+++++++' + error + ('+++++++'));
    start();
}
