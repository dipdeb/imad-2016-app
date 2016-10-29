var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var config = {
	user: 'dipdeb',
	database: 'dipdeb',
	host: 'db.imad.hasura-app.io',
	port: '5432',
	password: process.env.DB_PASSWORD
	/*user: 'dipanjan',
	database: 'dipanjan',
	host: 'localhost',
	port: '43000',
	password: ''*/
}

var app = express();
app.use(morgan('combined'));

function createTemplate (data) {
	var title = data.title;
	var date = data.date;
	var heading = data.heading;
	var content = data.content;
    
	var htmlTemplate = `
		<script>document.title='${title}'</script>
		<h2>${heading}</h2>
		<h5><span class="glyphicon glyphicon-time"></span> Post by Urban Legend, ${date.toDateString()}.</h5>
		<h5><span class="label label-danger">Code</span> <span class="label label-primary">SCM</span></h5><br>
		<p>${content}</p>	
	`;

	return htmlTemplate;
}

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/test-db', function(req, res) {
	pool.query("select * from test", function (err, result) {
    	if (err)
			res.status(500).send(err.toString());
		else    
			res.send(JSON.stringify(result.rows));
	});
});

var counter = 0;
app.get('/counter', function (req, res) {
	counter = counter + 1;
	res.send(counter.toString());
});

app.get('/currentctr', function (req, res) {
	res.send(counter.toString());
});

var comments = [];

app.get('/submit-comment', function(req, res) { 
	// Get the name from the request
	var comment = req.query.comment;
	var context = req.query.context;
	
	var d = new Date();
	d.toUTCString();

	var obj = {'comment': comment, 'time': d.toUTCString()};

	if (comments[context] == undefined)
		comments[context] = [];	
	comments[context].push(obj);
	// JSON: Javascript Object Notation
	res.send(JSON.stringify(comments[context]));
});

app.get('/fetchcomments', function(req, res) {
	var context = req.query.context;
  
	if (comments[context] != undefined)
		res.send(JSON.stringify(comments[context]));
	else {
		res.send("null");
	}
});

app.get('/favicon.ico', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'favicon.ico'));
});

app.get('/articles/:articleName', function (req, res) {
	pool.query("select * from article where title = $1", [req.params.articleName], function (err, result) {
		if (err)
			res.status(500).send(err.toString());
		else {
			if (result.rows.length === 0) 
				res.status(404).send('Article not found');
			else {
				var articleData = result.rows[0];
				res.send(createTemplate(articleData));
			}  
		}   
	});
});

app.get('/createForm', function(req, res) {
	// The form's action is '/' and its method is 'POST',
	// so the `app.post('/', ...` route will receive the
	// result of our form
	var html = '<form action="/" method="post">' +
               'Enter your name:' +
               '<input type="text" name="userName" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
               
	res.send(html);
});

app.get('/create_article', function (req, res) {
	var title = req.query.title;
	var content = req.query.content;
	pool.query("insert into article(title, heading, date, content) values($1, $2, $3, $4)", [title, title, new Date(), content], function (err, result) {
		if (err)
			res.status(500).send(err.toString());
		else {
			res.status(200).send('Successfully created');
		}   
	});
});

app.get('/ui/main.js', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80

app.listen(8080, function () {
	console.log(`IMAD course app listening on port ${port}!`);
});
