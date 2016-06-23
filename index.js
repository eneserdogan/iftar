const request = require('request');
const emoji   = require('node-emoji');
const colors  = require('colors');
const program = require('commander');
const spinner = require('cli-spinner').Spinner;


let spin = new spinner('%s Güncel veriler alınıyor.');
spin.setSpinnerString('|/-\\');
spin.start();

program
  .version('2.0.1')
  .arguments('<city>')
  .action(function (city) {

    request('https://iftar.herokuapp.com/?city=' + city, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            spin.stop(true);

            // Parse
            let jsonParse   = JSON.parse(body),
            stringHour;

            // Date to second
            let hoursToSecond      = new Date().getHours() * 3600;
            let minuteToSecond     = new Date().getMinutes() * 60;
            let totalSecond        = hoursToSecond + minuteToSecond;

            // Json date to second
            let jsonDate            = jsonParse.aksam.split(':');

            let jsonHourToSecond    = jsonDate[0] * 3600;
            let jsonMinuteToSecond  = jsonDate[1] * 60;
            let jsonTotalSecond     = jsonHourToSecond + jsonMinuteToSecond;


            let timeDiffToMinute = (jsonTotalSecond - totalSecond) / 60;


            let n       = Number(timeDiffToMinute);
            let Hours   = Math.floor(n % 3600 / 60);
            let Minutes = Math.floor(n % 3600 % 60);

            if(Hours > 0 || Minutes > 0){
              stringHour = 'İftara '+((Hours > 0 ? colors.cyan.underline(Hours) + ' saat ' : '') + (Minutes > 0 ? colors.cyan.underline(Minutes) + ' dakika ' : '') + 'kaldı');
            }else{
              stringHour = 'İftar vakti geçti';
            }

            console.log('');
            console.log(emoji.get(':hourglass_flowing_sand:') + '   ' + jsonParse.aksam + ' ' + stringHour);
            console.log('');
        } else {
            spin.stop(true);
            console.log('');
            console.error('Sunucu yanıt vermiyor');
            console.log('');
        }
    })

  });


program.on('--help', function(){
    console.log('  Örnek Kullanım:');
    console.log('');
    console.log('    $ iftar istanbul');
    console.log('    $ iftar ankara');
    console.log('');
});

program.parse(process.argv);
