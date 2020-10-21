require('dotenv').config()
const request = require("request-promise");
const cheerio = require("cheerio");

function arraysMatch(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

	// Check if all items exist and are in the same order
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}

	// Otherwise, return true
	return true;
}

async function main() {
    const result = await request.get("https://covidlive.com.au/vic");
    const $ = cheerio.load(result);
    data = []; 
    
    average = $("#content > div > div:nth-child(4) > section > div > div.info-item.info-item-3.COUNT > p").text();

    $("#content > div > div:nth-child(1) > section > table > tbody > tr").each((index, element) => { 
        if (index === 0) return true;
        const tds = $(element).find("td");

        const category = $(tds[0]).text();
        const total = $(tds[1]).text();
        const change = $(tds[3]).text();

        tableRow = {category, total, change};

        if (arraysMatch(data, Object.values(tableRow)) === false) {
            //console.log(Object.values(tableRow));
            console.log(arraysMatch(data, Object.values(tableRow)));
            data = Object.values(tableRow);
            //console.log(data);
            //console.log(average);
        } 
        else {
            console.log("Nothing new...");
        }
    });


    

    

    setTimeout(main, 5000);

}

main();