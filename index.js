'use strict';
const Vorpal   = require('vorpal')();
const Slugify  = require('slugify');
const Request  = require('request');
const Moment   = require('moment');
const TimeDiff = require('timediff');
const Ora = require('ora');
const Spinner = new Ora({
    text: 'Hesaplanıyor',
    color: 'yellow'
});

const pg = require('pg');
const dbConfig = {
    host : 'localhost',
    port : 5432,
    database : 'iftar',
    username : 'fatih',
    password : 'test'
};
const pool = pg.Pool(dbConfig);

var City = [];

pool.connect((err,db)=>{
    if(err){
        console.log(err);
    }else{
        db.query('SELECT * FROM iftar',(err,table)=>{
            if(err){
                console.log(err);
            }else{
                for(var i = 0 ; i < table.rows.length ; i++){ var args1 = args.city;
                    var args2 = args.slice(1).toString().toLowerCase();
                    args1 = args1[0].toLocaleUpperCase() + args2;
                    console.log(args1);
                    City.push(table.rows[i].city_name);
                }
            }
        })
        
    }
})

var ahmet = 'ahmet';
var x =  ahmet.slice(1).toString().toLowerCase();

ahmet = ahmet[0].toLocaleUpperCase() + x;

Vorpal
    .command('iftar <city>')
    .validate(function(args) {
        
        return (
            
            City.indexOf(args.city) === -1 ? (Spinner.fail([`Geçersiz parametre: <city> => ${args.city}`]), false) : true)
    })
    .autocomplete(City)     
    .action(function(args, callback) {
        Spinner.start();
        let ExistRamadan = '2017-06-24';
        let NextRamadan = '2018-05-16';
        if (Moment().format('YYYY-MM-DD') <= ExistRamadan) {
            let PostURL = `http://www.namazvaktim.net/json/gunluk/${Slugify(args.city.toLowerCase())}.json`;
            Request(PostURL, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    let PrayerTimes = JSON.parse(body);
                    let RemainingTime = TimeDiff(Moment().format('YYYY-MM-DD HH:mm:ss'), Moment().format(`YYYY-MM-DD ${PrayerTimes.namazvakitleri.zaman.vakitler.aksam}:00`));
                    return (RemainingTime.hours > 0 || RemainingTime.minutes > 0 ? Spinner.succeed([`İftar'a ${RemainingTime.hours} saat ${RemainingTime.minutes} dakika kaldı`]) : Spinner.fail([`Bir günü daha yedin, iyisin tabi.`]))
                } else {
                    Spinner.fail([`Bir şeyler ters gitti, tekrar dener misin ?`]);
                }
            });
            callback();
        } else {
            let NextYear = TimeDiff(Moment().format('YYYY-MM-DD'), NextRamadan);
            Spinner.succeed([`Bir sonraki Ramazan ayı ${NextYear.months} ay ${NextYear.weeks} hafta ${NextYear.days} gün sonra başlıyor. `]);
        }
    });

Vorpal
    .delimiter('iftar$:')
    .show();