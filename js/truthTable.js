/**
 * 该文件中的代码主要处理以下两个问题
 *   1. 合式公式验证
 *   2. 打印真值表
 * 该文件依赖于Tools.js文件
 * @author xwc
 * @DateTime 2018-10-01T11:50:01+0800
 */
window.onload = function(){
	//对合式公式的合法性进行检验
	//在这里, 用以下符号代表不同的联结词
	//'!'代表非联结词
	//'&'代表合取联结词
	//'|'代表析取联结词
	//'>'代表条件联结词
	//'~'代表双条件联结词

	//合式公式字符串
	var wff          = '', 
		//获取显示结果的div
		theDiv       = document.getElementById('result'),
		//提交按钮
		submit       = document.getElementById('submit');
									 

	//监听提交按钮
	submit.onclick   = function(){
		//将从表单控件中获取到的合式公式字符串中空格全部去掉
		wff          = document.getElementById('wff').value.replace(/\s/g,'');

		//判断合式公式合法性并输出真值表与主范式
		if (Tools.validate(wff)) {//如果合法就输出真值表与主范式

			Tools.printTruthTableAndPnf(wff, theDiv);
		} else {//否则直接输出不合法
			theDiv.innerHTML = '合式公式不合法';
		}

		return false;
	}
}