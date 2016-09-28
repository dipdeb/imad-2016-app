var express = require('express');
var morgan = require('morgan');
var path = require('path');

var articles = {
	'article-one': {
		title: "Article one",
		heading: "Article one",
		date: "5-sep-2016",
		content: `
			<p>
				This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.
			</p>    
			<p>
				This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.
			</p>    
			<p>
				This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.
			</p>    
			<p>
				This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.This is  the content of article one.
			</p>    
	       `
	},
	'article-two': {
		title: "Article two",
		heading: "Article two",
		date: "15-sep-2016",
		content: `
			<p>
				This is  the content of article two.This is  the content of article two.
			</p>    
	       `
	},
	'article-three': {
		title: "Article three",
		heading: "Article three",
		date: "30-sep-2016",
		content: `
			<p>
				This is  the content of article two.This is  the content of article two.
			</p>    
	       `
	}
};

function createTemplate (data) {
	var heading = data.heading;
	var title = data.title;
	var date = data.date;
	var content = data.content;

	var htmlTemplate = 
	`
		<html>
			<head>
					<title>${title}</title>
					<link href="/ui/style.css" rel="stylesheet" />
			</head>
			<body>				
				<div class="container">
					<div>
						<a href="/">Home</a>    
						<a href="/article-one">Article One</a>    
						<a href="/article-two">Article Two</a>    
						<a href="/article-three">Article Three</a>    
					</div>    
					<hr/>
					<h3>${heading}</h3>
					<div>${date}</div>    
					<div>
						${content}
					</div>		
				</div>
			</body>
		</html>
		`;
	return htmlTemplate;
}

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/:articleName', function (req, res) {
	var articleName = req.params.articleName;	
	res.send(createTemplate(articles[articleName]));
   //res.sendFile(path.join(__dirname, 'ui', 'article-one.html')); 
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port =2400; // Use 8080 for local development because you might already have apache running on 80
app.listen(2400, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
