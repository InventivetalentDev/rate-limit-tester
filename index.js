const axios = require("axios");

const INTERVAL = 1000; // adjust to test the rate limit
const MAX = 1000; // max # of requests before stopping
const WAIT_FOR_FINISHED_REQUEST = false; // if true, wait for the request to finish before starting another one; if false, just sends requests at a fixed interval


function makeRequest() {
    return axios.get("https://api.mojang.com/user/profiles/bcd2033c63ec4bf88aca680b22461340/names", {
        headers: {
            // "Authorization": "Bearer ..."
        }
    });
}

///// Make changes above this line

let timer = -1;

let start = Date.now()
let c = 0;

function run() {
    console.log(c);
    makeRequest().then(res => {
        console.log(res.status)
        console.log(res.headers);
        console.log(JSON.stringify(res.data))
        console.log(" ")

        c++;

        log();

        if (c >= MAX) {
            finish();
            return;
        }

        if (WAIT_FOR_FINISHED_REQUEST) {
            timer = setTimeout(() => {
                run()
            }, INTERVAL);
        }
    }).catch(err => {
        const res = err.response;
        console.log(res.status)
        console.log(res.headers);
        console.log(JSON.stringify(res.data))
        console.log(" ")

        finish();
    })


}

if (WAIT_FOR_FINISHED_REQUEST) {
    run();
} else {
    timer = setInterval(() => {
        run();
    }, INTERVAL);
}

function log() {
    console.log("======");
    const d = (Date.now() - start) / 1000;
    console.log("time: " + d);
    console.log("requests: " + c);
    console.log(`${ c }r/${ d }s = ~${ c / d }`);
    console.log(`> ~${ 1 / (c / d) }s delay`);
}

function finish() {
    clearTimeout(timer);
    clearInterval(timer);

    console.log("==========");
   log();
}
