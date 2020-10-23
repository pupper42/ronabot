require('dotenv').config()
const Discord = require('discord.js');
const request = require("request-promise");
const cheerio = require("cheerio");

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Connected as ${client.user.tag}, Victoria version`);

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
        console.log(average);
        console.log(hour);

        var new_cases;
        var active_cases;
        var total_cases;

        for (i = 0; i < data.length; i++) {
            switch(data[i].category) {
                case "Cases":
                    new_cases = data[i].change;
                    total_cases = data[i].total;
                    break;
                case "Active":
                    active_cases = data[i].total;
                    break;
            }
        }

        console.log(new_cases);
        console.log(active_cases);
        console.log(total_cases);

        if (hour === 1) {
            client.channels.cache.get("766475023539765249").send({embed: {
                color: 3447003,
                title: "Report for Victoria",
                fields: [
                    { name: `New cases: `, value: `${new_cases}`},
                    { name: `Active cases: `, value: `${active_cases}`},
                    { name: `Total cases: `, value: `${total_cases}`},
                    { name: `Rolling average: `, value: `${average}`},
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