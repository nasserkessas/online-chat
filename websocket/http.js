const http = require("http");

const host = 'localhost';
const port = 8000;

const codeLen = 8;


const requestListener = function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader("Content-Type", "application/json");
    switch (req.url){
        case "/code":
            if (req.method == "GET"){
                res.writeHead(200);
                res.end(`{"code": "${generateCode()}"}`);
	    }
            else {
                res.writeHead(404);
                res.end(`{"error": "Cannot ${req.method} \"${req.url}\""}`)
	    }
            break;
    }
};

const generateCode = () => {
    return "abcdefghijklmnopqrstuvwxyzABSCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('').sort(function(){return 0.5-Math.random()}).join('').slice(0,codeLen);
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
