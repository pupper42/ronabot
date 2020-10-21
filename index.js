require('dotenv').config()
const Discord = require('discord.js');
const request = require("request-promise");
const cheerio = require("cheerio");

const client = new Discord.Client();

var d = new Date();
var hour = d.getUTCHours();


client.on('ready', () => {
    console.log("Connected as " + client.user.tag);

    async function main() {
        var result = await request.get("https://covidlive.com.au/vic");
        var $ = cheerio.load(result);
        var data = [];

        var average = $("#content > div > div:nth-child(4) > section > div > div.info-item.info-item-3.COUNT > p").text();          
    
        $("#content > div > div:nth-child(1) > section > table > tbody > tr").each((index, element) => { 
            if (index === 0) return true;
            var tds = $(element).find("td");
    
            var category = $(tds[0]).text();
            var total = $(tds[1]).text();
            var change = $(tds[3]).text();
    
            var tableRow = {category, total, change};
            //console.log(tableRow)
            data.push(tableRow);
            console.log(data);
    
            //data = Object.values(tableRow);          
            
    
        }); 

        client.channels.cache.get("684680921122603008").send({embed: {
            color: 3447003,
            title: "Report for Victoria",
            fields: [
                { name: `New cases: `, value: `${data[0].change}`},
                { name: `Active cases: `, value: `${data[1].total}`},
                { name: `Total cases: `, value: `${data[0].total}`},
                { name: `Rolling average: `, value: `${average}`},
                { name: `Last updated: `, value: `${data[8].total}`}
            ]
        }});
        

        console.log(average);
        setTimeout(main, 1800000);
    }

    main();
});


client.login();