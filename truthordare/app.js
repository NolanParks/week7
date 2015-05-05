var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/ssl/server.key'),
    cert: fs.readFileSync('/etc/ssl/server.crt'),
    ca: fs.readFileSync('/etc/ssl/server.ca.crt')
};

var truths = [];
truths.push("What personality traits would cause you to end a friendship?");
truths.push("Have you ever lied to your best friend?  If so, describe what happened.");
truths.push("How long have you gone without showering?");
var dares = [];
dares.push("Put on a blindfold and slow dance with a player. See if you can guess who it is by touch alone.");
dares.push("Put lipstick on another player but you are not allowed to use your hands.");
dares.push("Ask the neighbors to borrow a cup of sugar");


function getRandomTruth() {
    return truths[Math.floor(Math.random() * truths.length)];
function getRandomDare() {
    return dares[Math.floor(Math.random() * dares.length)];
}


https.createServer(options, function(req, res) {
    if (req.method == 'POST') {
        var jsonString = '';
        req.on('data', function(data) {
            jsonString += data;
        });
        req.on('end', function() {
            console.dir(jsonString, {
                depth: 5
            });
            echoResponse = {};
            echoResponse.version = "1.0";
            echoResponse.response = {};
            echoResponse.response.outputSpeech = {};


            echoResponse.response.outputSpeech.type = "PlainText"
            echoResponse.response.outputSpeech.text = "Do you want truth or dare?"
            echoResponse.response.shouldEndSession = "false";
            theRequest = JSON.parse(jsonString);
            console.log('JSON', theRequest.request);
            if (typeof theRequest.request.intent !== 'undefined') {
                choice = theRequest.request.intent.slots.Choice.value;
                if(choice === "truth"){
                truth = getRandomTruth();
                echoResponse.response.outputSpeech.text = truth;
                echoResponse.response.shouldEndSession.text = "true";
                    }
                if(choice === "dare"){
                truth = getRandomDare();
                echoResponse.response.outputSpeech.text = dare;
                echoResponse.response.shouldEndSession.text = "true";
                }
                
                // echoResponse.response.outputSpeech.text = "you said " + choice;
                // echoResponse.response.card = {}
                // echoResponse.response.card.type = "PlainText";
                // echoResponse.response.card.title = choice;
                // echoResponse.response.card.subtitle = choice;
                // echoResponse.response.card.content = choice;
                echoResponse.response.shouldEndSession = "true";

            }
            myResponse = JSON.stringify(echoResponse);
            res.setHeader('Content-Length', myResponse.length);
            res.writeHead(200);
            res.end(myResponse);
            console.log('from post', myResponse);

        });
    } else {
        myResponse = JSON.stringify(echoResponse);
        res.setHeader('Content-Length', myResponse.length);
        res.writeHead(200);
        res.end(myResponse);
    }
}).listen(3012); //Put number in the 3000 range for testing and 443 for production
