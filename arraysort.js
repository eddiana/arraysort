#!/usr/bin/env node

let fs = require('fs');

usageMessage = () => {
    console.log("Usage: node arraysort <csv file> <sort type> <sort order>");
    console.log("  Valid sort types: \"alpha\", \"numeric\", \"both\"");
    console.log("  Valid sort orders: \"ascending\", \"descending\"");
}

errorMessage = (s) => {
    console.log("Error: " + s);
}
stripQuotes = (s) => {
    if ((s[0] == "'") && (s[s.length -1] == "'")) {
        s = s.substr(1, s.length -2);
    } 
    return s;
}

outputResults = (a) => {
    let s = a.join(",");
    console.log( s);
}


//Read & validate args
if (process.argv.length < 5) {
    usageMessage();
    return;
}

let csvFile = process.argv[2];
let sortType = process.argv[3];
let sortOrder = process.argv[4];

//file ok?
if (!fs.existsSync(csvFile)) {
    errorMessage( "File " + csvFile + " does not exist or cannot be accessed");
    usageMessage();
    return;
}

//validate sort type
if (["alpha", "numeric", "both"].indexOf(sortType) == -1) {
    errorMessage( "Unsupported sort type " + sortType);
    usageMessage();
    return;
} 

//validate order
if (["ascending", "descending"].indexOf(sortOrder) == -1) {
    errorMessage( "Unsupported sort order " + sortOrder);
    usageMessage();
    return;
} 

//Read csv
let csv;
try {
    csv = fs.readFileSync(csvFile);
} catch (e) {
    errorMessage("Error reading file " + csvFile);
    return;
}

//make master array
let allData = csv.toString().split(',');
let numData = [];
let strData = [];
let sorted = [];

//clean it up, make secondary arrays
allData.forEach((v, i) => {
    allData[i] = allData[i].trim();
    if (allData[i].length > 0) {  //catch empty entries
        if (isNaN(allData[i])) {
            strData.push( allData[i]);
        } else {
            numData.push( allData[i]);
        }
    }
});

if ((sortType == 'numeric') || sortType == 'both') {
    numData.sort((a, b) => {  //custom sort func to deal with scientific notation
        return (a -b)
    });
    if (sortOrder == 'descending') {
        numData.reverse();
    }
    sorted = numData;
}

if ((sortType == 'alpha') || sortType == 'both') {
    strData.sort((a, b) => {  //deal with quotes
        
        aa = stripQuotes( a);
        bb = stripQuotes( b);

        if (aa > bb) {
            return 1;
        } else if (bb > aa) {
            return -1;
        } else {
            return 0;
        }
    });
    if (sortOrder == 'descending') {
        strData.reverse();
    }
    sorted = sorted.concat( strData);
}

outputResults( sorted);
