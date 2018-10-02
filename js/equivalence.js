var wffA       = '' ,
    wffB       = '',
    result     = document.getElementById('result'),
    submit     = document.getElementById('submit');


submit.onclick = function(){
	//将从表单控件中获取到的合式公式字符串中空格全部去掉
	wffA       =  document.getElementById('wffA').value.replace(/\s/g,'');
	wffB       =  document.getElementById('wffB').value.replace(/\s/g,'');


	result.innerHTML = Tools.isEquivalent(wffA, wffB);

	return false;
}

