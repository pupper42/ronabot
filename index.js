require('dotenv').config()
const Discord = require('discord.js');
const request = require("request-promise");
const cheerio = require("cheerio");

const client = new Discord.Client();

var d = new Date();



client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}, Victoria version`);

    async function main() {
        var result = await request.get("https://covidlive.com.au/vic");
        var $ = cheerio.load(result);
        var data = [];
        var hour = d.getUTCHours();

        var average = $("#content > div > div:nth-child(4) > section > div > div.info-item.info-item-3.COUNT > p").text();          
    
        $("#content > div > div:nth-child(1) > section > table > tbody > tr").each((index, element) => { 
            if (index === 0) return true;
            var tds = $(element).find("td");
    
            var category = $(tds[0]).text();
            var total = $(tds[1]).text();
            var change = $(tds[3]).text();
    
            var tableRow = {category, total, change};
            data.push(tableRow);
            
    
        }); 

        console.log(data);     
        console.log(average);
        console.log(hour);
        if (hour === 2) {
            client.channels.cache.get("766475023539765249").send({embed: {
                color: 3447003,
                title: "Report for Victoria",
                fields: [
                    { name: `New cases: `, value: `${data[0].change}`},
                    { name: `Active cases: `, value: `${data[2].total}`},
                    { name: `Total cases: `, value: `${data[1].total}`},
                    { name: `Rolling average: `, value: `${average}`},
                    { name: `Last updated: `, value: `${data[9].total}`}
                ]
            }});   
        }
        else {
            console.log("Not now");
        }
        
        data = [];   
        console.log(data);     
        setTimeout(main, 1 * 3600 * 1000);
    }
    main();
});

client.login();