require('dotenv').config()
const Discord = require('discord.js');
const { data } = require('jquery');
const client = new Discord.Client();
var csv = require('jquery.csv.js')

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);

});


client.on("message", message => {
    if (message.content == "?cases")
    {
        var previousCases = 0;
        var previousDeaths = 0;

        function getCases() {
            t = 10*60*1000;
            var cases = $.ajax({
                type: "GET",
                dataType: "json",
                url: "https://api.covid19api.com/summary",
                async: false,
            }).responseJSON;

            //console.log(previousCases);
            //console.log(cases.Global.TotalConfirmed);

            if (cases.Global.TotalConfirmed != previousCases) {
                var c_change = cases.Global.TotalConfirmed - previousCases;
                var d_change = cases.Global.TotalDeaths - previousDeaths;
                client.channels.cache.get('766475023539765249').send(`Confirmed cases: ${cases.Global.TotalConfirmed} (${c_change}). Total deaths: ${cases.Global.TotalDeaths} (${d_change})`);
                //client.channels.cache.get('766475023539765249').send("Confirmed cases: " + cases.Global.TotalConfirmed + ", " + "Deaths: " + cases.Global.TotalDeaths);
                previousCases = cases.Global.TotalConfirmed;
                previousDeaths = cases.Global.TotalDeaths;
            }
            
            setTimeout(getCases, t);
        }
    
        getCases();
    }    
   
});

client.login();