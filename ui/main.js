var btn = document.getElementById('counter');

if (btn !== undefined) {
btn.onclick = function() {

	var req = new XMLHttpRequest();

	req.onreadystatechange = function() {
		if (req.readyState === XMLHttpRequest.DONE) {
			if (req.status === 200) {
				var counter = req.responseText;
				var spn = document.getElementById('count');
				spn.innerHTML = counter;
			}
		}
	};

	req.open('GET', document.URL+'/counter', true);
	req.send(null);
};
}
var sbmt_btn = document.getElementById('sbmt_btn');

if (sbmt_btn !== undefined) {
sbmt_btn.onclick = function () {
	var commentEl = document.getElementById('comment');
	var comment = commentEl.value;
	commentEl.value = '';
	
	var req = new XMLHttpRequest();

	req.onreadystatechange = function() {
		if (req.readyState === XMLHttpRequest.DONE) {
			if (req.status === 200) {
				var comments = req.responseText;
				comments = JSON.parse(comments);

				var commentBox = document.getElementById('box');
				commentBox.style.display = "block";

				var tmp = '';
				for (var i = 0; i< comments.length; i++) {
					 tmp += comments[i]+'<br/>';
				}

				commentBox.innerHTML = tmp;
			}
		}
	};
	
	req.open('GET', document.URL+'/submit-comment?comment='+comment, true);
	req.send(null);
};
}
