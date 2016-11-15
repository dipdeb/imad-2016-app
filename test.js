
const Pool = require('pg-pool');
const url = require('url')

var time = process.env.TIMES;
console.log(time)

const params = url.parse('postgres://dhfsrnjwqkhhoq:Oc7xsybX3Okmv01eur03FDJK2Q@ec2-174-129-4-75.compute-1.amazonaws.com:5432/d9btdeega7oa8v');
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
};

console.log(config);

