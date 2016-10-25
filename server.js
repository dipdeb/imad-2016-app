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
}

var app = express();
app.use(morgan('combined'));

var articles = {
	'default': {
		title: 'Webapp',
		heading: 'An introduction to Webapp',
		date: 'Oct 2, 2016',
		content:
		  `<p>
			The general distinction between an interactive web site of any kind and a "web application" is unclear. Web sites most likely to be referred to as "web applications" are those which have similar functionality to a desktop software application, or to a mobile app. HTML5 introduced explicit language support for making applications that are loaded as web pages, but can store data locally and continue to function while offline.

			There are several ways of targeting mobile devices:

			<ul>
	    		<li>Responsive web design can be used to make a web application - whether a conventional web site or a single-page application viewable on small screens and work well with touchscreens.</li>
		    	<li>Native apps or "mobile apps" run directly on a mobile device, just as a conventional software application runs directly on a desktop computer, without a web browser (and potentially without the need for Internet connectivity); these are typically written in Java (for Android devices) or Objective C or Swift (for iOS devices). Recently, frameworks like React Native and Flutter have come around, allowing the development of native apps for both platforms using languages other than the standard native languages.</li>
    			<li>Hybrid apps embed a mobile web site inside a native app, possibly using a hybrid framework like Apache Cordova and Ionic or Appcelerator Titanium. This allows development using web technologies (and possibly directly copying code from an existing mobile web site) while also retaining certain advantages of native apps (e.g. direct access to device hardware, offline operation, app store visibility).</li>
			</ul>
		  </p>`
	}, 
    'article-one': {
      title: 'Node.js',
      heading: 'Introduction to Node.js',
      date: 'Sep 5, 2016',
      content: 
			`<p>
				Node.js is an open-source, cross-platform JavaScript runtime environment for developing a diverse variety of tools and applications. Although Node.js is not a JavaScript framework,[3] many of its basic modules are written in JavaScript, and developers can write new modules in JavaScript. The runtime environment interprets JavaScript using Google's V8 JavaScript engine.

				Node.js has an event-driven architecture capable of asynchronous I/O. These design choices aim to optimize throughput and scalability in Web applications with many input/output operations, as well as for real-time Web applications (e.g., real-time communication programs and browser games).
				The Node.js distributed development project, governed by the Node.js Foundation,[5] is facilitated by the Linux Foundation's Collaborative Projects program.
			</p>`

    },
    'article-two': {
      title: 'RDBMS',
      heading: 'Relational Database management system',
      date: 'Sep 10, 2016',
      content: 
          `<p>
				A relational database management system (RDBMS) is a database management system (DBMS) that is based on the relational model as invented by E. F. Codd, of IBM's San Jose Research Laboratory. In 2016, many of the databases in widespread use are based on the relational database model.

RDBMSs have been a common choice for the storage of information in new databases used for financial records, manufacturing and logistical information, personnel data, and other applications since the 1980s. Relational databases have often replaced legacy hierarchical databases and network databases because they are easier to understand and use. However, relational databases have received unsuccessful challenge attempts by object database management systems in the 1980s and 1990s (which were introduced trying to address the so-called object-relational impedance mismatch between relational databases and object-oriented application programs) and also by XML database management systems in the 1990s. Despite such attempts, RDBMSs keep most of the market share, which has also grown over the years.	
          </p>`
    },
    'article-three': {
      title: 'Adminer',
      heading: 'Adminer',
      date: 'Sep 15, 2016',
      content: 
          `<p>
              Adminer (formerly phpMinAdmin) is a full-featured database management tool written in PHP. Conversely to phpMyAdmin, it consist of a single file ready to deploy to the target server. Adminer is available for MySQL, PostgreSQL, SQLite, MS SQL, Oracle, SimpleDB, Elasticsearch and MongoDB.
          </p>`
    }
};

function createTemplate (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = 
	`
		<script>document.title='${title}'</script>
      <h2>${heading}</h2>
      <h5><span class="glyphicon glyphicon-time"></span> Post by Urban Legend, ${date}.</h5>
      <h5><span class="label label-danger">Code</span> <span class="label label-primary">SCM</span></h5><br>
	  <p>${content}</p>	
	`

    return htmlTemplate;
}

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

app.get('/:articleName', function (req, res) {
  var articleName = req.params.articleName;
  if (articleName != 'favicon.ico')	{
	  res.send(createTemplate(articles[articleName]));
  }	
});

app.get('/articles/:articleName', function (res, req) {
    pool.query("select * from test where title = '" + req.params.articleName + "'", function (err, result) {
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

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80

app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
