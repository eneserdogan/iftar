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
let City = ["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırşehir", "Koceali", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"];

Vorpal
    .command('iftar <city>')
    .validate(function(args) {
        return (City.indexOf(args.city) === -1 ? (Spinner.fail([`Geçersiz parametre: <city> => ${args.city}`]), false) : true)
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