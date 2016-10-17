var btn = $('#counter');

if (btn != undefined) {
		btn.click(function() {

			var req = new XMLHttpRequest();

			req.onreadystatechange = function() {
				if (req.readyState === XMLHttpRequest.DONE) {
					if (req.status === 200) {
						var counter = req.responseText;
						var spn = $('#count');
						spn.html(counter);
					}
				}
			};

			req.open('GET', window.location.protocol+'//'+window.location.host+'/counter', true);
			req.send(null);
		});
}

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

						obj = JSON.parse(obj);

						var commentBox = $('#comment_section');
						commentBox.show();

						var tmp = '';
						var totalComments = $('#total_comments');
						totalComments.html(obj.length);


						for (var i = 0; i< obj.length; i++) {
							
							tmp += ` 	
							<div class="col-sm-2 text-center">
							  <img src="http://www.w3schools.com/bootstrap/bird.jpg" class="img-circle" height="65" width="65" alt="Avatar">
							</div>
							<div class="col-sm-10">
							  <h4>John Snow <small>`+obj[i].time+`</small></h4>
							  <p>`+obj[i].comment+`</p> 
							  <br>
							</div>`
						}

						commentBox.html(tmp);
					}
				}
			};
	
			var el = $(".active").children();
			var context = el[0].id;
				
			req.open('GET', window.location.protocol+'//'+window.location.host+'/submit-comment?context='+context+'&comment='+comment, true);
			req.send(null);
		});
}

$( document ).ready(function() {
  // Handler for .ready() called.
	var req1 = new XMLHttpRequest();

	req1.onreadystatechange = function() {
		if (req1.readyState === XMLHttpRequest.DONE) {
			if (req1.status === 200) {
				var counter = req1.responseText;
				var spn = $('#count');
				spn.html(counter);
			}
		}
	};

	req1.open('GET', window.location.protocol+'//'+window.location.host+'/currentctr', true);
	req1.send(null);

	var req2 = new XMLHttpRequest();

	req2.onreadystatechange = function() {
		if (req2.readyState === XMLHttpRequest.DONE) {
			if (req2.status === 200) {

				
				var obj = req2.responseText;

				if (obj != "null") {

				obj = JSON.parse(obj);

				var commentBox = $('#comment_section');
				commentBox.show();

				var tmp = '';
				var totalComments = $('#total_comments');
				totalComments.html(obj.length);


				for (var i = 0; i< obj.length; i++) {
					
					tmp += ` 	
					<div class="col-sm-2 text-center">
					  <img src="http://www.w3schools.com/bootstrap/bird.jpg" class="img-circle" height="65" width="65" alt="Avatar">
					</div>
					<div class="col-sm-10">
					  <h4>John Snow <small>`+obj[i].time+`</small></h4>
					  <p>`+obj[i].comment+`</p> 
					  <br>
					</div>`
				}

				commentBox.html(tmp);
				} else {
					var commentBox = $('#comment_section');
					commentBox.html("");
					var totalComments = $('#total_comments');
					totalComments.html("0");
				}
				
			}
		}
	};

	var el = $(".active").children();
	var context = el[0].id;

	req2.open('GET', window.location.protocol+'//'+window.location.host+'/fetchcomments?context='+context, true);
	req2.send(null);

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

	//$("#success-alert").hide();
	$("#success-alert").alert();
	$("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
		$("#success-alert").slideUp(500);
	});   

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
			}
		}
	};

	request.open('GET', window.location.protocol+'//'+window.location.host+'/'+data, true);
	request.send(null);

	var req2 = new XMLHttpRequest();

	req2.onreadystatechange = function() {
		if (req2.readyState === XMLHttpRequest.DONE) {
			if (req2.status === 200) {

				var obj = req2.responseText;

				if (obj != "null") {
				obj = JSON.parse(obj);

				var commentBox = $('#comment_section');
				commentBox.show();

				var tmp = '';
				var totalComments = $('#total_comments');
				totalComments.html(obj.length);


				for (var i = 0; i< obj.length; i++) {
					
					tmp += ` 	
					<div class="col-sm-2 text-center">
					  <img src="http://www.w3schools.com/bootstrap/bird.jpg" class="img-circle" height="65" width="65" alt="Avatar">
					</div>
					<div class="col-sm-10">
					  <h4>John Snow <small>`+obj[i].time+`</small></h4>
					  <p>`+obj[i].comment+`</p> 
					  <br>
					</div>`
				}

				commentBox.html(tmp);
				} else {
					var commentBox = $('#comment_section');
					commentBox.html("");
					var totalComments = $('#total_comments');
					totalComments.html("0");
				}
			}
		}
	};

	req2.open('GET', window.location.protocol+'//'+window.location.host+'/fetchcomments?context='+data, true);
	req2.send(null);
};

$(function() {
	$("li").click(function() {
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
