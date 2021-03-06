var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

if (1 == 0) {
	const url = require('url')
	const params = url.parse(process.env.DATABASE_URL);
	const auth = params.auth.split(':');
}

var config = {
	dev: {
		user: 'dipanjan',
		database: 'imad',
		port: 5432,
		host: 'localhost',
		password: 'dipanjan'
	},
	prod: {
		user: 'dipdeb',
		database: 'dipdeb',
		host: 'db.imad.hasura-app.io',
		port: '5432',
		password: process.env.DB_PASSWORD
	}/*, 
	others: {
			user: auth[0],
			password: auth[1],
			host: params.hostname,
			port: params.port,
			database: params.pathname.split('/')[1],
			ssl: true 
	}*/
}

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30},
	resave: true,
    saveUninitialized: true
}));

function escapeQuote(str) {
	return str.replace('\'', '\\\'').trim();
}

function createTemplate (req, data) {
	var title = escapeQuote(data.title);
	var date = data.date;
	var heading = data.heading;
	var content = data.content;
    
	var htmlTemplate = `
		<script>document.title='${title}'</script>
		<h2 style="word-wrap: break-word">${heading}</h2>
		<h5><span class="glyphicon glyphicon-time"></span> Post by ${data.username}, ${date.toDateString()}.</h5>`;

 	if (req.session && req.session.auth && req.session.auth.userId && (data.user_id === req.session.auth.userId)) 
		htmlTemplate += `<h5 id="editperm" style="display: none;"><span class="glyphicon glyphicon-edit"></span>Edit <span class="glyphicon glyphicon-remove"></span>Delete </h5><br>`;

	htmlTemplate += `${content}`;

	return htmlTemplate;
}

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config.prod);
//var pool = new Pool(config.others);
//var pool = new Pool(config.dev);
var counter;

app.get('/counter', function (req, res) {
	counter = parseInt(counter) + 1;
	res.send(counter.toString());

	pool.query('UPDATE visitors SET footfall='+counter, function(err, results){
        if (err){
            return(err.toString());
        } else {
                console.log("");
        }
    });
});

var user = {
	"name": "Dipanjan",
	"interest": "Programming, Sports, Technology & Movies",
	"since": "10/25/2016",
	"articles": "7",
	"lastlog": "1 min ago",
	"address": "Bangalore, India", 
}

app.get('/userinfo/:id', function(req, res) {
	var userInfo = `<div class="container">
		<div class="row">
    	    <div class="col-md-1 col-lg-1" align="center"> <img alt="User Pic" src="https://tracker.moodle.org/secure/attachment/30912/f3.png" class="img-circle img-responsive">${user.name}</div>
			<div class=" col-md-5 col-lg-5"> 
				<table class="table table-user-information">
        			<tbody>
            			<tr>
							<td>Interest:</td>
							<td>${user.interest}</td>
						</tr>
						<tr>
							<td>Member since:</td>
							<td>${user.since}</td>
						</tr>
						<tr>
							<td>Total Articles:</td>
							<td>${user.articles}</td>
						</tr>
						<tr>
							<td>Last Login:</td>
							<td>${user.lastlog}</td>
						</tr>
						<tr>
							<td>Address</td>
							<td>${user.address}</td>
						</tr>
						<tr>
							<td><span class="glyphicon glyphicon-envelope"></span></td>
							<td><a href="mailto:blogger@gmailx.com">blogger@gmailx.com</a></td>
						</tr>
							<td><span class="glyphicon glyphicon-phone"></td>
							<td>123-4567-890(Landline)<br><br>555-4567-890(Mobile)</td>
						</tr>
						<tr>
							<td colspan="2">
								<ul class="list-inline text-center">
	                                <li>
										<a target="_blank" href="https://twitter.com/dipanjohn">
											<span class="fa-stack fa-lg">
												<i class="fa fa-circle fa-stack-2x"></i>
												<i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
											</span>
										</a>	
        	                        </li>
	                                <li>
										<a target="_blank" href="https://facebook.com/dipanjohn">
											<span class="fa-stack fa-lg">
												<i class="fa fa-circle fa-stack-2x"></i>
												<i class="fa fa-facebook fa-stack-1x fa-inverse"></i>
											</span>
										</a>	
        	                        </li>
	                                <li>
										<a target="_blank" href="https://github.com/dipdeb">
											<span class="fa-stack fa-lg">
												<i class="fa fa-circle fa-stack-2x"></i>
												<i class="fa fa-github fa-stack-1x fa-inverse"></i>
											</span>
										</a>	
        	                        </li>
								</ul>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>`;

	res.send(userInfo);
});

pool.query('SELECT * from visitors', function(err, result){
	if (err){
		return(err.toString());
	} else {
		counter = result.rows[0].footfall;
	}
});

app.get('/currentctr', function (req, res) {
	res.send(counter.toString());
});

app.get('/favicon.ico', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'favicon.ico'));
});

app.get('/articles/:articleName', function (req, res) {

	pool.query('select * from n_article a, "user" u where title = $1 and a.user_id = u.id', [req.params.articleName], function (err, result) {
		if (err)
			res.status(500).send(err.toString());
		else {
			if (result.rows.length === 0) 
				res.status(404).send('Article not found');
			else {
				var articleData = result.rows[0];
				res.send(createTemplate(req, articleData));
			}  
		}   
	});
});

app.get('/test/:category/:title', function(req, res) {
	res.send("Category: " + req.params.category + " title: " + req.params.title);
});

app.get('/get-articles', function (req, res) {
	pool.query('SELECT u.id, title, heading, date, content, username FROM n_article a, "user" u where a.user_id = u.id ORDER BY date DESC', function (err, result) {
		if (err) {
			res.status(500).send(err.toString());
		} else {
			res.send(JSON.stringify({result: result.rows, user: 'logged'}));
		}
	});
});

app.post('/create-article', function (req, res) {
	var title = req.body.title;
	var content = req.body.content;

	if ((title.trim() === '' || content.trim() === '')) {
       res.status(500).send("Title/Content can't be left empty");
	}
	
	//content = '<p>'+removeTags(content)+'</p>';
	content = '<p style="word-wrap: break-word">'+content+'</p>';
	var userId = req.session.auth.userId;

    if (req.session && req.session.auth && req.session.auth.userId) {
		pool.query("insert into n_article(title, user_id, heading, date, content) values($1, $2, $3, $4, $5)", [title, userId, title, new Date(), content], function (err, result) {
			if (err)
				res.status(500).send(err.toString());
			else {
				res.status(200).send('Successfully created');
			}   
		});
	}
});

function hash (input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}


app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.post('/create-user', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;

   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);

   if ((username.trim() === '' || password.trim() === '') || (username.length > 15 || password.length > 8)) {
       res.status(500).send("Invalid Username/Password. Please try again");
   }

	if(!/^[a-zA-Z0-9_.@]+$/.test(username))  //If username contains other than a-z,A-Z,0-9 then true.
    {
        res.status(500).send("Username can't contain special characters.");
	} else {
		var salt = crypto.randomBytes(128).toString('hex');
		var dbString = hash(password, salt);

		pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
			if (err) {
				res.status(500).send(err.toString());
			} else {
				res.send('User successfully created: ' + username);
			}
		});
	}
});

app.post('/update-password', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;

	var salt = crypto.randomBytes(128).toString('hex');
	var dbString = hash(password, salt);

	pool.query('UPDATE "user" set password=$1 where username=$2', [dbString, username], function (err, result) {
		if (err) {
			res.status(500).send(err.toString());
		} else {
			if (result.rowCount === 1) 
				res.send('Password successfully updated');
			else 
				res.status(403).send("User doesn't exist.")
		}
	});
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   if ((username.trim() === '' || password.trim() === '') || (username.length > 15 || password.length > 8)) {
       res.status(500).send("Invalid Username/Password. Please try again");
       return;
   }
   
	if(!/^[a-zA-Z0-9_.@]+$/.test(username))  //If username contains other than a-z,A-Z,0-9 then true.
    {
        res.status(500).send("Username can't contain special characters.");
	} else {
	   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
    	  if (err) {
        	  res.status(500).send(err.toString());
	      } else {
    	      if (result.rows.length === 0) {
        	      res.status(403).send('Username/password is invalid');
	          } else {
    	          // Match the password
        	      var dbString = result.rows[0].password;
            	  var salt = dbString.split('$')[2];
	              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
    	          if (hashedPassword === dbString) {
                
        	        // Set the session
            	    req.session.auth = {userId: result.rows[0].id};
                	// set cookie with a session id
	                // internally, on the server side, it maps the session id to an object
    	            // { auth: {userId }}
                
        	        res.send('credentials correct!');
                
    	      	} else {
                	res.status(403).send('username/password is invalid');
	            }
          	}
      	}
   });
	}
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;

	res.status(200).send('Successfully logged out!');
});

/*app.get('/ui/main.js', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});*/

//Comment
app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT c.*, "user".username FROM n_article a, comment c, "user" WHERE a.title = $1 AND a.id = c.article_id AND c.user_id = "user".id ORDER BY c.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
	var comment = req.body.comment;

//	comment = removeTags(comment);

    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from n_article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

//var port = 5000; // Use 8080 for local development because you might already have apache running on 80
//app.set('port', (process.env.PORT || 8080));
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);

//app.listen(5000, function () {
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

app.use(express.static('public'));

app.get('/ui/:fileName', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});


var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

var tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');

function removeTags(html) {
  var oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
}
