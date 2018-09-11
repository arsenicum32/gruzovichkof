const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const app = express();

app.use(cors());

/*
  когда данных нету у нас в базе, берем их с сервера...
*/
function grabFromServer(string, cb){
  //cb(["hello", "hello world", "hello world 2"])
  axios({
    url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
    method: "post",
    headers: {
      "Content-Type": "application/json" ,
      "Accept": "application/json" ,
      "Authorization": "Token 5b2b4283f7c92966a891f739c10be667e71ba077"
    },
    data: {
      "query": string , "count": 10
    }
  }).then( event => {
    cb( event
      && event.data && event.data.suggestions
      && (typeof event.data.suggestions == typeof [])
      ? event.data.suggestions.map( e=> e.value ) : [] );
  }).catch( error => {
    cb( null );
  });
}

/*
  получаем подсказки по заданной строке и выполняем с ними cb функцию
*/
function getHints(string , cb ){
  fs.readFile('./cache.json', 'utf-8',  (err,data) => {
    try{
      var dt = JSON.parse(data);
      if( dt[string] ){
        console.log("no AJAX with: "+ string);
        cb(dt[string]);
      }else{
        grabFromServer(string, function(ar){
          console.log("grab from server with String: "+string);
          dt[string] = ar;
          fs.writeFile( './cache.json',
            JSON.stringify(dt, null, '\t'),
            { flag: 'w', encode: 'uft-8' },
          function(err){
            cb(ar);
          });
        })
      }
    } catch (e) {
      cb( null );
    }
  })
}


app.get('/api/q', ( req, res ) => {
  if(req.query.string && req.query.string.length > 3){
    getHints( req.query.string , function(ar){
      res.json({hints: ar ? ar : [] , q: req.params.string })
    })
  }else{
    res.json({ hints: [] , q: req.params.string, error: true })
  }
})

app.all('*', (req,res) => res.json({response: "hello client!"}) );


app.listen(3500, () => {
  console.log('server is running on port 3500')
});
