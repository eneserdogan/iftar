#!/usr/bin/env node
var timediff = require('./timediff');
var pkg = require('./package.json');

var start = process.argv[2];
var end = process.argv[3];
var units = process.argv[4];

function help () {
  console.log([
    '',
    ' ' + pkg.description,
    '',
    '  Usage: timediff <start> <end> [<units>]',
    '',
    '  Examples:',
    '',
    "    timediff 2013-12-01 '2015-04-20 12:20:10.342' YMWDHmSs",
    '    years: 1',
    '    months: 4',
    '    weeks: 2',
    '    days: 5',
    '    hours: 12',
    '    minutes: 20',
    '    seconds: 10',
    '    milliseconds: 342',
    '',
    '    timediff 1989-11-09 now YD',
    '    years: 25',
    '    days: 71'
  ].join('\n'));
}

function run () {
  var result;
  try {
    result = timediff(start, end, units);
  } catch (e) {
    console.error(e);
    help();
    return;
  }

  for (unit in result) {
    console.log(unit + ': ' + result[unit]);
  }
}

if (process.argv.indexOf('--help') !== -1) {
  help();
  return;
}

if (process.argv.indexOf('--version') !== -1) {
  console.log(pkg.version);
  return;
}

if (!start || !end) {
  help();
  return;
}

run();

