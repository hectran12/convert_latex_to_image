const axios = require('axios');
const express = require("express");
const { fstat } = require('fs');
const config = require('./config');
const fs = require('fs');
const latex = require('./script/latex');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    fs.readFile('index.html', 'utf-8', (err, data)=> {
        if(err) { res.status(400).type('html').send('Nothing, maybe error!'); }
        else {
            res.status(200).type('html').send(data.replace('this_download_is_now', ''));
        }
    });
});


app.post('/convert', async (req, res)=>{
    const content = req.body.content;
    var css = req.body.css_style;
    if (content != undefined) {
        try {
            await latex.generateLatex(content, css, 'download.png');
            fs.readFile('index.html', 'utf-8', (err, data)=> {
                if(err) { res.status(400).type('html').send('Nothing, maybe error!'); }
                else {
    
                    res.status(200).type('html').send(data.replace('this_download_is_now', `<div class="card">
                    <div class="card-header" style="color: black">
                    Images of this or previous session are ready for you to download
                    </div>
           
                    <img src="/download.png" alt="image"><br>
                      <a href="#" class="btn btn-primary" onclick="downloadImage('download.png');">Download</a>
                      
                  </div>`));
                }
            });
        } catch {
            fs.readFile('index.html', 'utf-8', (err, data)=> {
                if(err) { res.status(400).type('html').send('Nothing, maybe error!'); }
                else {
    
                    res.status(200).type('html').send(data.replace('this_download_is_now', `<div class="card">
                    <div class="card-header" style="color: black">Unable to convert, an error occurred</div></div>`));
                }
            });
        }
        
        

    } else {
        res.status(400).type('html').send('Nothing, maybe error! !');
    }
});

app.get('/download.png', (req, res)=>{
    fs.readFile('download.png', (err,data)=>{if(err){ res.status(400).type('html').send('Nothing, maybe error! !'); } else{res.status(200).type('png').send(data); }});
});
app.listen(config.port, ()=>{console.log("Server is running")});