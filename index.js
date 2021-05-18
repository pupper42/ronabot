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
    var tests;
    var local_cases;
    var overseas_cases;

    var nsw_new_cases;
    var nsw_case_change;
    var nsw_active_cases;
    var nsw_total_cases;
    var nsw_update;
    var nsw_last_updated;
    var nsw_tests;
    var nsw_local_cases;
    var nsw_overseas_cases;

    async function main() {
        var result = await request.get("https://covidlive.com.au/vic");
        var nsw_result = await request.get("https://covidlive.com.au/nsw")

        var $ = cheerio.load(result);
        var $_nsw = cheerio.load(nsw_result);

        var data = [];
        var source_data = [];

        var nsw_data = [];
        var nsw_source_data = [];
        



        var average = $("#page-state > div > header > div > table > tbody > tr.STATS > td.MA > a").text();    
        var nsw_average = $_nsw("#page-state > div > header > div > table > tbody > tr.STATS > td.MA > a").text();   
    
        $("#content > div > div:nth-child(1) > section > table > tbody > tr").each((index, element) => { 
            if (index === 0) return true;
            var tds = $(element).find("td");
    
            var category = $(tds[0]).text();
            var total = $(tds[1]).text();
            var change = $(tds[3]).text();
    
            var tableRow = {category, total, change};
            data.push(tableRow);       
    
        }); 

        $_nsw("#content > div > div:nth-child(1) > section > table > tbody > tr").each((index, element) => {
            if (index === 0) return true;
            var tds = $(element).find("td");
    
            var category = $(tds[0]).text();
            var total = $(tds[1]).text();
            var change = $(tds[3]).text();
    
            var tableRow = {category, total, change};
            nsw_data.push(tableRow);
        });

        $("#content > div > div:nth-child(7) > section > table > tbody > tr").each((index, element) => {
            if (index === 0) return true;
            var tds = $(element).find("td");
    
            var local = $(tds[3]).text();
            var overseas = $(tds[6]).text();
    
            var tableRow = {local, overseas};
            source_data.push(tableRow);  
        });

        $_nsw("#content > div > div:nth-child(7) > section > table > tbody > tr").each((index, element) => {
            if (index === 0) return true;
            var tds = $(element).find("td");
    
            var local = $(tds[3]).text();
            var overseas = $(tds[6]).text();
    
            var tableRow = {local, overseas};
            nsw_source_data.push(tableRow);  
        });

        console.log(data);     
        console.log(nsw_data);


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
                case "Deaths":
                    deaths = data[i].change;
                    break;
                case "Tests":
                    tests = data[i].change;
                    break;

            }
        }

        for (i = 0; i < nsw_data.length; i++) {
            switch(nsw_data[i].category) {
                case "New Cases":
                    nsw_new_cases = nsw_data[i].total;
                    break;
                case "Cases":
                    nsw_case_change = nsw_data[i].change;
                    nsw_total_cases = nsw_data[i].total;
                    break;
                case "Active":
                    nsw_active_cases = nsw_data[i].total;
                    break;
                case "Last Updated":
                    nsw_last_updated = nsw_data[i].total;
                    break;
                case "Deaths":
                    nsw_deaths = nsw_data[i].change;
                    break;
                case "Tests":
                    nsw_tests = nsw_data[i].change;
                    break;

            }
        }

        local_cases = source_data[0].local;
        nsw_local_cases = nsw_source_data[0].local;

        overseas_cases = source_data[0].overseas;
        nsw_overseas_cases = nsw_source_data[0].overseas;

        var guilds = client.guilds.cache.map(guild => guild.id);

        function sendMessage(channel_id, msg_color, region, new_cases, case_change, local_cases, overseas_cases, active_cases, total_cases, average, tests, last_updated) {

            client.channels.cache.get(channel_id).send({embed: {
                color: msg_color,
                title: `Report for ${region}`,
                fields: [
                    { name: `New cases: `, value: `${(new_cases || new_cases === 0) ? new_cases : case_change} (${local_cases} local, ${overseas_cases} overseas)`},
                    { name: `Active cases: `, value: `${active_cases}`},
                    { name: `Total cases: `, value: `${total_cases}`},
                    { name: `Rolling average: `, value: `${average}`},
                    { name: `Tests conducted: `, value: `${tests}`},
                    { name: `Last updated: `, value: `${last_updated}`}
                ]                
            }});   

        }
        
        for (i = 0; i < guilds.length; i++) {

            var guild = client.guilds.cache.get(guilds[i]);

            if (guild) {

                send_to_channel = String(guild.channels.cache.find(channel => channel.name === "rona"));
                send_to_channel_id = send_to_channel.substring(2, send_to_channel.length - 1)
   
                try {

                    if (last_updated != update) {
                        sendMessage(
                            send_to_channel_id,
                            5602237,
                            "VIC",
                            new_cases,
                            case_change,
                            local_cases,
                            overseas_cases,
                            active_cases,
                            total_cases,
                            average,
                            tests,
                            last_updated);                  
                            
                    }
                    if (nsw_last_updated != nsw_update) {

                        sendMessage(
                            send_to_channel_id,
                            10906334,
                            "NSW",
                            nsw_new_cases,
                            nsw_case_change,
                            nsw_local_cases,
                            nsw_overseas_cases,
                            nsw_active_cases,
                            nsw_total_cases,
                            nsw_average,
                            nsw_tests,
                            nsw_last_updated); 

                    }
                    
                    else {
                        console.log("No new updates");
                    }
                }
                catch(err) {
                    console.log("No channel named rona")
                    console.log(err);
                }
                
            }
        }      
        
        update = last_updated;
        nsw_update = nsw_last_updated;
        
        data = [];  
        nsw_data = [];     
        setTimeout(main, .25 * 3600 * 1000);
    }
    main();
});

client.login();