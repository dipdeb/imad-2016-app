var newart = $('#newart');
var firstArticleUser = '';

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
			title = html_sanitize(title, urlX, idX);
			var content = $('#content').val();
			content = html_sanitize(content, urlX, idX);
			req.open('POST', '/create-article', true);
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
				$.blockUI();

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
				$.unblockUI();
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

			comment = html_sanitize(comment, urlX, idX);
			
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
		$('#logerr1').css('visibility', 'hidden');
		$('#logerr2').css('visibility', 'hidden');

		// Clear the fields and set SignIn as default
		$(this).find("input,textarea,select").val('').end();
		$("#myTab li").removeClass("active");
		$('#myTab li:first-child').addClass("active");

		$('#signup').removeClass("active in");
		$('#signin').addClass("active in");
	});

	loadLogin();
	loadArticleList();

	commentSubmit();
	counter();

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
	$.unblockUI();

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

	var url = '/articles/'+encodeURIComponent(data);

	request.open('GET', url, true);
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
                var response = JSON.parse(this.responseText);
				var articleData = response.result;
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
				firstArticleUser = articleData[0].username;
				var title = escapeQuote(articleData[0].title);

				var defaultArticle = `
						<script>document.title='${title}'</script>
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
                articles.html('Oops! Could not load all articles!')
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

	// Show edit-delete only when the user who created it has logged
	if (firstArticleUser === username)
		$('#editperm').show();

	$('#login-modal').modal('hide');
	$('#uname').html(username);
	$('#usrimg').attr("avatar", username);
}

function counter () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
				//console.log(this.responseText)
                $('#count').html(this.responseText);
            } else {
				console.log('Error in counter');
            }
        }
    };
    
    request.open('GET', '/counter', true);
    request.send(null);
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
        var username = $('#username').val();
        var password = $('#password').val();

		if (username.trim() == '' || password.trim() == '') {
			$('#logerr1').html("Username/Password can't be left empty.");
			$('#logerr1').css('visibility', 'visible');
			$('#logerr1').css('color', 'red');

			return;
		}
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
					$('#message').html('Logged in.');
					$('#message').show();

					$("#message-alert").alert();
					$("#message-alert").fadeTo(2000, 500).slideUp(500, function(){
						$("#message-alert").slideUp(500);
					});   
					$('#login-modal').modal('hide');
					$('#logerr1').css('visibility', 'hidden');
              		loadLogin();
                  
              } else if (request.status === 403) {
				$('#logerr1').html('Invalid credentials. Try again?');
				$('#logerr1').css('visibility', 'visible');
				$('#logerr1').css('color', 'red');
              } else if (request.status === 500) {
				$('#logerr1').html(this.responseText);
				$('#logerr1').css('visibility', 'visible');
				$('#logerr1').css('color', 'red');
              } else {
				$('#logerr1').html('Something went wrong on the server');
				$('#logerr1').css('visibility', 'visible');
				$('#logerr1').css('color', 'red');
              }
          }  
        };
        
        // Make the request
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
    });
    
    var register = $('#register');
    register.click(function () {
        var username = $('#new_user').val();
        var password = $('#new_pass').val();

		if (username.trim() == '' || password.trim() == '') {
			$('#logerr2').html("Username/Password can't be left empty.");
			$('#logerr2').css('visibility', 'visible');
			$('#logerr2').css('color', 'red');
			
			return;
		}
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
					$('#logerr2').css('visibility', 'hidden');

              } else {
					$('#logerr2').html(this.responseText);
					$('#logerr2').css('visibility', 'visible');
					$('#logerr2').css('color', 'red');
              }
          }
        };
        
        // Make the request
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
							<a href="#" data-toggle="popover" data-trigger="focus" ><img title="${obj[i].username}" class="round" width="50" height="50" avatar="${obj[i].username}"></a>
							<div style="display:none;" class="container-fluid well span6">
								<div class="row-fluid">
									<div class="span2" >
										<img class="round" width="100" height="100" avatar="${obj[i].username}">
									</div>
									<div class="span8">
										<h6>Email: ${obj[i].username}@xmail.com</h6>
										<h6>Nation: India</h6>
										<h6>Score: 89</h6>
										<h6>Member since: 1 Year</h6>
									</div>
								</div>
							</div>
						</div>
						<div class="col-sm-11">
						  <h4>${obj[i].username} - <small>${time.toLocaleTimeString()} on ${time.toLocaleDateString()}</small></h4>
						  <p>${obj[i].comment}</p> 
						  <br>
						</div>`
				}

				commentBox.html(tmp);
				
				var test = `<div style="" class="container-fluid well span6">
								<div class="row-fluid">
									<div class="span2" >
										<img class="round" width="100" height="100" avatar="kaka">
									</div>
									<div class="span8">
										<h6>Email: </h6>
										<h6>Nation: India</h6>
										<h6>Score: 89</h6>
										<h6>Member since: 1 Year</h6>
									</div>
								</div>
							</div>`;
				
			$('[data-toggle="popover"]').popover({
				html: true,
				content: function() {
					var user = $(this).next().html();
					return user;
				}
			});

            } else {
                commentBox.html('Oops! Could not load comments!');
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

	return divElem;
}

function escapeQuote(str) {
	return str.replace('\'', '\\\'').trim();
}

function changeLink(obj)
{
	console.log(obj.id);
}

$(function(){

if (1 == 0) {
    $(".dropdown-menu li a").click(function(){
		$.blockUI();

		/*$(".btn:first-child").text($(this).text());
		$(".btn:first-child").val($(this).text());*/
		var themename = $(this).text();
		var selText = $(this).html();
		$(this).parents('.dropdown').find('.dropdown-toggle')
         .html(selText+'<span class="caret"></span>');
		if (themename.toLowerCase() === 'default')
			$('#stylelnk').attr('href', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
		else
			$('#stylelnk').attr('href', '/theme/'+themename.toLowerCase()+'/bootstrap.css');
		$.unblockUI();
   });
}
});

$('#themeMenu > li > a').click(function(e){
	console.log('clicked');
    $('#themeMenu > li > a').removeClass('selected');
    $(this).addClass('selected'); 
	var themename = $(this).text();
	if (themename.toLowerCase() === 'default')
		$('#stylelnk').attr('href', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
	else
		$('#stylelnk').attr('href', '/theme/'+themename.toLowerCase()+'/bootstrap.css');
});
