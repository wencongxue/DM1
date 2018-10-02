/**
 * 一些页面特效
 */

var as       = document.getElementsByTagName('a');
var title    = document.getElementsByTagName('title')[0].innerHTML;
for(let i = 0; i < as.length; i++) {
	if (as[i].innerHTML == title) {
		as[i].style.backgroundColor = '#32CD32';
		break;
	}
}

