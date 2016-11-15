var newart = $('#newart');

if (newart) {
		newart.click(function() {

			var req = new XMLHttpRequest();

			req.onreadystatechange = function() {
				if (req.readyState === XMLHttpRequest.DONE) {
					if (req.status === 200) {
						//alert('Successfully created');
							
						$('#message').html(req.responseText);
						$('#message').show();

						$("#message-alert").alert();
						$("#message-alert").fadeTo(2000, 500).slideUp(500, function(){
							$("#message-alert").slideUp(500);
						});   
						loadArticleList();
					}
				}
			};

			var title = $('#title').val();
			var content = $('#content').val();
			req.open('POST', '/create_article', true);
	        req.setRequestHeader('Content-Type', 'application/json');
    	    req.send(JSON.stringify({title: title, content: content}));


			$('#article-modal').modal('hide');
			// Clear the form once successfully submitted
			$('.modal').on('hidden.bs.modal', function(){
   				 $(this).find('form')[0].reset();
			});
		});
}

var logout = $('#logout');

if (logout) {
		logout.click(function() {

			var req = new XMLHttpRequest();

			req.onreadystatechange = function() {
				if (req.readyState === XMLHttpRequest.DONE) {
					if (req.status === 200) {
						//alert('Successfully created');
							
						$('#message').html(req.responseText);
						$('#message').show();

						$("#message-alert").alert();
						$("#message-alert").fadeTo(2000, 500).slideUp(500, function(){
							$("#message-alert").slideUp(500);
						});   

						loadLogin();
						loadArticleList();
						$('#li_logout').hide();
						$('#new_article').hide();
						$('#login').show();
						$('#commentbox').hide();
						$('#editperm').hide();
					}
				}
			};

			req.open('GET', '/logout', true);
    	    req.send(null);


		});
}

function commentSubmit() {
	var sbmt_btn = $('#sbmt_btn');

	if (sbmt_btn != undefined) {
		sbmt_btn.click(function () {
			var commentEl = $('#comment');
			var comment = commentEl.val();
	
			if (comment == '') {
				$('#empty').show()
				return false;
			}
			$('.alert').hide()
			commentEl.val('');
			
			var req = new XMLHttpRequest();

			req.onreadystatechange = function() {
				if (req.readyState === XMLHttpRequest.DONE) {
					if (req.status === 200) {
						var obj = req.responseText;

						loadComments();
					}
				}
			};
	
			var el = $(".active").children();
			var currentArticleTitle = el[0].id;

			req.open('POST', '/submit-comment/' + currentArticleTitle, true);
	        req.setRequestHeader('Content-Type', 'application/json');
    	    req.send(JSON.stringify({comment: comment}));
		});
	}
}

$( document ).ready(function() {
	// Handler for .ready() called.

	$(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
	});

	// scroll body to 0px on click
	$('#back-to-top').click(function () {
		$('#back-to-top').tooltip('hide');
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});
        
    $('#back-to-top').tooltip('show');

	openingMessage();
	
	//$("#success-alert").hide();
	$("#success-alert").alert();
	$("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
		$("#success-alert").slideUp(500);
	});   

	// Clear the form once successfully submitted
	$('.modal').on('hidden.bs.modal', function(){
		$('#logerr').css('visibility', 'hidden');
	});

	loadLogin();
	loadArticleList();

	commentSubmit();

	//avatar(window, document);

	/*$(document).click(function(event) {
		if ($('.profilecard').is(":visible")) {
		}
	});

	$("body"). on("click", ".round", function(){
		if ($('.profilecard').is(":visible")) 
			$(".profilecard").remove();
  		$(this).prev().html(profileCard());
	});*/
});

function showArticle(data) {

	var request = new XMLHttpRequest();

	var el = $(data).children();
	var data = el[0].id;

	request.onreadystatechange = function() {
		if (request.readyState === XMLHttpRequest.DONE) {
			if (request.status === 200) {
				var response = request.responseText;
				var viewElem = $('#viewwindow');
				viewElem.html(response);
				$('#editperm').show();
			}
		}
	};

	request.open('GET', '/articles/'+data, true);
	request.send(null);

	loadComments();
};

$(function() {
	$("#nav li").click(function() {
		// remove classes from all
		$("li").removeClass("active");
		// add class to the one we clicked
		$(this).addClass("active");

		showArticle($(this));
	});
});

$(function(){
    $("[data-hide]").on("click", function(){
		$(this).closest("." + $(this).attr("data-hide")).hide();
	});
});

function loadArticleList () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = $('#nav');
            if (request.status === 200) {
                var articleData = JSON.parse(this.responseText);
				var recentId = 0;
				var content = '';
                for (var i=0; i< articleData.length; i++) {
					if (i === 0)
	                    content += `<li class="active">
    	    			<a id="${articleData[i].title}" href="#">${articleData[i].title}</a>
						</li>`;
					else
	                    content += `<li>
    	    			<a id="${articleData[i].title}" href="#">${articleData[i].title}</a>
						</li>`;
                }
                
                articles.html(content);

				var viewElem = $('#viewwindow');

				var artdate = new Date(`${articleData[0].date}`);

				var defaultArticle = `
						<h2>${articleData[0].heading}</h2>
						<h5><span class="glyphicon glyphicon-time"></span> Post by ${articleData[0].username}, ${artdate.toDateString()}.</h5>
						<h5 id="editperm" style="display: none;"><span class="glyphicon glyphicon-edit"></span>Edit <span class="glyphicon glyphicon-remove"></span>Delete </h5><br>
						${articleData[0].content}`;

				viewElem.html(defaultArticle);

				loadComments();

				$(function() {
					$("#nav li").click(function() {
						// remove classes from all
						$("li").removeClass("active");
						// add class to the one we clicked
						$(this).addClass("active");

						showArticle($(this));
					});
				});
            } else {
                articles.innerHTML('Oops! Could not load all articles!')
            }
        }
    };

    request.open('GET', '/get-articles', true);
    request.send(null);
}

function loadLoggedInUser (username) {
	$('#login').hide();
	$('#li_logout').show();
	$('#new_article').show();
	$('#commentbox').show();
	$('#editperm').show();

	$('#login-modal').modal('hide');
	$('#uname').html(username);
	$('#usrimg').attr("avatar", username);
}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}

function loadLoginForm () {
	$('login').hide();

    var submit = $('#login_btn');
    submit.click(function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Sucess!';
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              }
              loadLogin();
          }  
          // Not done yet
        };
        
        // Make the request
        var username = $('#username').val();
        var password = $('#password').val();

        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
    });
    
    var register = $('#register');
    register.click(function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
					$('#message').html('User created successfully');
					$('#message').show();

					$("#message-alert").alert();
					$("#message-alert").fadeTo(2000, 500).slideUp(500, function(){
						$("#message-alert").slideUp(500);
					});   
					$('#login-modal').modal('hide');
					$('#logerr').css('visibility', 'hidden');

              } else {
					register.value = 'Register';
					$('#logerr').html('Could not sign up the user');
					$('#logerr').css('visibility', 'visible');
					$('#logerr').css('color', 'red');
              }
          }
        };
        
        // Make the request
        var username = $('#username').val();
        var password = $('#password').val();
        console.log(username);
        console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Registering...';
    
    });
}

function loadComments () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            
			var commentBox = $('#comment_section');
            if (request.status === 200) {
				commentBox.show();

				var tmp = '';
				var totalComments = $('#total_comments');
                var obj = JSON.parse(this.responseText);

				totalComments.html(obj.length);

				for (var i = 0; i< obj.length; i++) {
					var time = new Date(obj[i].timestamp);
							
        					//<img title="${obj[i].username}" class="round" width="50" height="50" avatar="${obj[i].username}">
					tmp += ` 	
						<div class="col-sm-1 text-center">
							<a href="#" title="Dismissible popover" data-toggle="popover" data-trigger="focus" data-content="<div><ul><li>1</li><li>2</li></ul></div>"><img title="${obj[i].username}" class="round" width="50" height="50" avatar="${obj[i].username}"></a>
						</div>
						<div class="col-sm-11">
						  <h4>${obj[i].username} - <small>${time.toLocaleTimeString()} on ${time.toLocaleDateString()}</small></h4>
						  <p>${obj[i].comment}</p> 
						  <br>
						</div>`
				}

				commentBox.html(tmp);
			$('[data-toggle="popover"]').popover();

            } else {
                comments.html('Oops! Could not load comments!');
            }
        }
    };
    
	var el = $(".active").children();
	var currentArticleTitle = el[0].id;

    request.open('GET', '/get-comments/' + currentArticleTitle, true);
    request.send(null);
}

function openingMessage()
{
	var thehours = new Date().getHours();
	var themessage;
	var morning = ('Good morning');
	var afternoon = ('Good afternoon');
	var evening = ('Good evening');

	if (thehours >= 0 && thehours < 12) {
		themessage = morning; 

	} else if (thehours >= 12 && thehours < 17) {
		themessage = afternoon;

	} else if (thehours >= 17 && thehours < 24) {
		themessage = evening;
	}

	$('#greeting').html(themessage);
}

function profileCard()
{
	var divElem = `
		<span class="profilecard"></span>
	`;

console.log(divElem);
	
	return divElem;
}
