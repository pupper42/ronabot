require('dotenv').config()
const Discord = require('discord.js');
const request = require("request-promise");
const cheerio = require("cheerio");

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}, Victoria version`);

    var new_cases;
    var case_change;
    var active_cases;
    var total_cases;
    var update;
    var last_updated;

    async function main() {
        var result = await request.get("https://covidlive.com.au/vic");
        var $ = cheerio.load(result);
        var data = [];
        var d = new Date();
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


        for (i = 0; i < data.length; i++) {
            switch(data[i].category) {
                case "New Cases":
                    new_cases = data[i].total;
                    break;
                case "Cases":
                    case_change = data[i].change;
                    total_cases = data[i].total;
                    break;
                case "Active":
                    active_cases = data[i].total;
                    break;
                case "Last Updated":
                    last_updated = data[i].total;
                    break;
            }
        }

        console.log(`Hour: ${hour}`);
        console.log(`New: ${new_cases}`);
        console.log(`Case change: ${case_change}`);
        console.log(`Active: ${active_cases}`);
        console.log(`Total: ${total_cases}`);
        console.log(`Rolling average: ${average}`);
        console.log(`Last updated: ${last_updated}`);
        console.log(`Check update: ${update}`);

        if (last_updated != update) {
            update = last_updated;
            client.channels.cache.get("684680921122603008").send({embed: {
                color: 3447003,
                title: "Report for Victoria",
                fields: [
                    { name: `New cases: `, value: `${(new_cases || new_cases === 0) ? new_cases : case_change}`},
                    { name: `Active cases: `, value: `${active_cases}`},
                    { name: `Total cases: `, value: `${total_cases}`},
                    { name: `Rolling average: `, value: `${average}`},
                    { name: `Last updated: `, value: `${last_updated}`}
                ]
            }});   
        }
        else {
            console.log("No new updates");
        }
        
        data = [];   
        console.log(data);     
        setTimeout(main, 1000);
    }
    main();
});

client.login();