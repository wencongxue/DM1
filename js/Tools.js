/*
 * 要用到的各种工具,封装在Tools类中
 * @author xwc
 */
var Tools       = function(){};


//生成26个大写英文字母
Tools.getA_Z    = function(){
	var temp    = [];
	for (let i  = 65; i < 91; i++) {
		temp.push(String.fromCharCode(i));
	}

	return temp;
}

//联结词与括号	
Tools.sympols    = ['!', '&', '|', '>', '~', '(', ')'];

//合法的原子变元,暂定为26个大写字母       
Tools.vars       = Tools.getA_Z();

//命题公式中出现的所有原子变元
Tools.varsOfWff  = [];

//原子变元、联结词、括号							  
Tools.allSymbols = Tools.sympols.concat(Tools.vars);

//主析取范式
Tools.pdnf       = '';

//主合取范式
Tools.pcnf       = '';

/**
 * 验证合式公式的合法性
 * @param {string} wff 合式公式
 */
Tools.validate   = function(wff){
	//基础验证
	if ( false  == Tools.basicValidate(wff)) {

		return false;
	}

	//验证是否为原子命题
	if (1       == wff.length) {
		
		return Tools.isAtomProp(wff) ? true : false;
	}

	//其他验证
 	return     Tools.finalCheck(wff) ? true : false;
}


/* 最简单的复合命题的计算
 * p,q为命题,connective为联结词
 * 返回 0或者1
 */
Tools.calcByConn = function(p, q, connective){
	switch (connective) {
		//否定
		case '!' : return 1 ^ p;
		//合取
		case '&' : return p & q;
		//析取
		case '|' : return p | q;
		//条件
		case '>' : return (p == 1 && q == 0) ? 0 : 1;
		//双条件
		case '~' : return (p == q)           ? 1 : 0;
	}
}

/* 检查括号的配对情况
 * 对于任意字符位置,它左边的'('的括号数目不能少于')'的数目
 * 并且到字符串遍历结束的时候,左右括号的数目应该相等
 */
Tools.checkBrackets = function(str){
	var brackets   = [];
	var str        = str || '';

	//检查:
	//1, 是否有空括号
	//2, 当出现')*('的情况时,*是否为空或为命题变元
	if (/(\(\))|(\)[A-Z]?\()/.test(str)) {
		return false;
	}

	for(let i = 0; i < str.length; i++) {
		if ('(' == str[i]) {
			brackets.push('(');
		} else if (')' == str[i]) {
			if (brackets.length) {
				brackets.pop();
			} else {
				return false;
			}
		}
	}

	if (brackets.length) {
		return false;
	}

	return true;
}

//判断单个字符是否为原子命题
Tools.isAtomProp = function(prop){

	return Tools.vars.indexOf(prop) != -1 ? true : false;
}

/* 
 * 先对合式公式进行初步验证
 * 我们最终想要得到一个不包含空格以及其他非法字符的"合式公式字符串"
 * 如果失败,返回布尔值false
 */
Tools.basicValidate = function(str) {

	//验证是否为空
	if ('' == str) {
		return false;
	}

	//如果是多个字符,先校验一下组成它的各个单个字符是否是联结词、圆括号、命题标识符的其中一种
	var flag = true;
	str.split('').forEach(function(value){
		if (Tools.allSymbols.indexOf(value) == -1){
			flag = false;
		}
	});
	if (!flag) {
		return false;
	}

	//检查括号的配对情况
	if (false == Tools.checkBrackets(str)) {

		return false;
	}
}

/*
 * 递归判断合式公式是否合法
 * 在这之前已经完成了对合式公式字符串中原子变元,联结词以及括号配对的判断
 */
Tools.finalCheck   = function(wff){
	var temp       = '';
	var idxOfLeft;
	
	//递归检查合式公式的合法性,由内到外
	if (wff.indexOf('(') == -1) {

		return Tools.basicJudge(wff);
	} else {

		//最后一个'('的索引
		idxOfLeft  = wff.lastIndexOf('(');
		//temp中存放从左数最后一个'('与从右数最后一个')'之间的内容
		//例如给定合式公式((A&B)|(A~B)),那么temp就是A~B
		temp       = wff.substring(idxOfLeft + 1, wff.indexOf(')', idxOfLeft + 1));
		//对上面的temp进行校验
		if (!Tools.basicJudge(temp)){
			return false;
		}

		var re     = new RegExp('\\(' + temp + '\\)', 'g');

		return Tools.finalCheck(wff.replace(re, 'A'));
	}

}

//判断不含括号的合式公式是否合法
Tools.basicJudge = function(wff){	

	//如果合式公式中有以下几种情况之一,则为非法
	//1, 有两个或两个以上数量的命题变元连续出现
	//2, 有两个或两个以上数量的联结词连续出现
	//3, 非联结词'!'后面出现其他的联结词
	//4, 开头出现非联结词'!'之外的联结词
	//5, 结尾出现联结词
	//6, 用非联结词'!'来联结两个命题变元
	var re = /([A-Z]{2,})|([\&\|\>\~]{2,})|(\![\&\|\>\~]+)|(^[\&\|\>\~])|([\!\&\|\>\~]$)|([A-Z]\![A-Z])/;
	if (re.test(wff)) {
		
		return  false;
	}

	return true;
}

/**
 * 计算不含括号的合式公式
 * @param  {string} basicWff 不含括号的合式公式
 * @return {[type]}          [description]
 */
Tools.basicCalc        = function(basicWff){
	var newWff         = basicWff || '',
		idxOfNeg ,
		idxOfConj,
		idxOfDisj,
		idxOfCond,
		idxOfBicond;
	while((idxOfNeg    = newWff.indexOf('!')) != -1) {
		newWff         = newWff.replace(/\![01]/, Tools.calcByConn(parseInt(newWff[idxOfNeg + 1]), 1, '!'));
	}
	while((idxOfConj   = newWff.indexOf('&'))!= -1) {
		newWff         = newWff.replace(/[01]\&[01]/, Tools.calcByConn(parseInt(newWff[idxOfConj - 1]), parseInt(newWff[idxOfConj + 1]), '&'));
	}
	while((idxOfDisj   = newWff.indexOf('|'))!= -1) {
		newWff         = newWff.replace(/[01]\|[01]/, Tools.calcByConn(parseInt(newWff[idxOfDisj - 1]), parseInt(newWff[idxOfDisj + 1]), '|'));
	}
	while((idxOfCond   = newWff.indexOf('>')) != -1) {
		newWff         = newWff.replace(/[01]\>[01]/, Tools.calcByConn(parseInt(newWff[idxOfCond - 1]), parseInt(newWff[idxOfCond + 1]), '>'));
	}
	while((idxOfBicond = newWff.indexOf('~'))!= -1) {
		newWff         = newWff.replace(/[01]\~[01]/, Tools.calcByConn(parseInt(newWff[idxOfBicond - 1]), parseInt(newWff[idxOfBicond + 1]), '~'));
	}
	
	return newWff;
}


//递归计算
Tools.calc                = function(wff){

	var wff               = wff || ''   ;

	if (wff.indexOf('(') == -1) {
		return Tools.basicCalc(wff);
	} else {//能够运行到这里,说明传进来的合式公式包含括号.运用递归依次将括号去掉,直至没有括号.
		var idxOfLeft     = wff.lastIndexOf('('),
			temp          = wff.substring(idxOfLeft + 1, wff.indexOf(')', idxOfLeft + 1)),
			subValue	  = Tools.basicCalc(temp);

		//如果temp中包含'|',则对它转义
		temp              = temp.replace(/\|/g, '\\|');

		var re            = new RegExp('\\(' + temp + '\\)', 'g');

		return Tools.calc(wff.replace(re, subValue));
	}
	
}


/*
 * 获取所有真值指派下公式的真值
 * @param wffs    合式公式数组
 * @return 一个包含公式所有真值的二维数组,它的格式形如:
 *         [
 *         		[公式0] : {
 *         				赋值1 : 公式0的真值1,
 *         				赋值2 : 公式0的真值2,
 *         				...
 *         		},
 *         		[公式1] : {
 *         				赋值1 : 公式1的真值1,
 *         				赋值2 : 公式1的真值2,
 *         				...
 *         		},
 *         		...
 *         ]
 */
Tools.getTruths     = function(wffs){
		//命题变元的数量
	var numOfVars   = 0,
		//存储每组赋值的临时变量
		assign      = '',
		truths      = [];

	//初始化存储命题变元的数组
	Tools.varsOfWff = [];

	//初始化主范式
	Tools.pcnf      = '';
	Tools.pdnf      = '';

	//对传进来的合式公式做一些简单处理
	for (let i = 0; i < wffs.length; i++) {
		//非空处理
		wffs[i]     = wffs[i] || '';
		//把成对的非联结词去掉
		wffs[i]     = wffs[i].replace(/\!{2}/g, '');
		//顺便获取一下里面的命题变元
		Tools.pushVarsOfWff(wffs[i]);
	}
	numOfVars       = Tools.varsOfWff.length;

	//按照二进制顺序生成真值指派
	for(let i = 0; i < wffs.length; i++) {
		truths[i]   = [];
		for(let j   = 0; j < Math.pow(2, numOfVars); j++) {
			assign  = j.toString(2);

			//如果二进制的位数少于命题变元的数量,前面补0对齐
			if (assign.length < numOfVars) {
				var assignLength  = assign.length;
				for (let k  = 0; k < (numOfVars - assignLength); k ++) {
					assign    = '0'  + assign;
				}
			}

			truths[i][assign] = Tools.calc(Tools.letterToNum(assign, wffs[i]));
		}
	}

	return truths;

	
}
/**
 * 获取所有命题变元
 * @param  {string} wff 合式公式
 */
Tools.pushVarsOfWff  = function(wff){
	//匹配26个大写字母
	var re           = /[A-Z]/;

	wff.split('').forEach(function(value){
		if (re.test(value) && Tools.varsOfWff.indexOf(value) == -1){
			Tools.varsOfWff.push(value);
		}
	});
}

/**
 * 打印真值表和主范式
 */
Tools.printTruthTableAndPnf = function(wff, target){

	var //存放真值表的表格
		str                 = '<table border="1" cellspacing="0" cellpadding="5"><tr>',
		truths              = Tools.getTruths([wff])[0],
		rowsOfTable         = truths.length;
	//生成表头
	for (let i = 0; i < Tools.varsOfWff.length; i++) {
		str   += '<th> '    + Tools.varsOfWff[i] + ' </th> ';
	}
	str       += '<th> '    + wff + ' </th></tr>';

	//拼接真值表与主范式
	for(var key in truths) {
		str  += '<tr>';
		for(let i = 0; i < key.length; i++) {
			str += '<td> ' + key[i] + ' </td>';
		}

		//判断是否为大小项
		if(parseInt(truths[key])) {//成真赋值,将对应的小项添加到主析取范式中
			//如果主析取范式不为空,说明里面已经有小项存在,这时需要给其添加析取联结词
			Tools.pdnf  && (Tools.pdnf += ' | ');

			Tools.pdnf  += Tools.assign_to_M_or_m(key, 'm');
		} else {//成假赋值,将对应的大项添加到主合取范式中
			Tools.pcnf  && (Tools.pcnf += ' & ');

			Tools.pcnf  += Tools.assign_to_M_or_m(key, 'M');
		}

		str += '<td>'   + truths[key] + '</td>' +'</tr>';
	}

	//拼接主范式
	str                 += '</table>';
	str                 += '主析取范式: ';
	str                 += Tools.pdnf ? Tools.pdnf : "主析取范式不存在<br />";
	str                 += '<br/>主合取范式: ';
	str                 += Tools.pcnf ? Tools.pcnf : '主合取范式不存在<br />';
	target.innerHTML     = '合式公式合法,真值表如下:' + str; 

	target.innerHTML     = str;
}

//判断一个公式是否为重言式
Tools.isT         = function(wff){
	var truths    = Tools.getTruths([wff])[0],
		flag      = true;

	for (var assign in truths) {
		if (!parseInt(truths[assign])) {
			flag = false;
			break;
		}
	}

	return flag;
}

//判断一个公式是否为矛盾式
Tools.isF         = function(wff){
	var truths    = Tools.getTruths([wff])[0],
		flag      = true;

	for (var assign in truths) {
		if (parseInt(truths[assign])) {
			flag = false;
			break;
		}
	}

	return flag;
}

/**
 * 判断两个合适公式是否等价
 * @param  {string}  wffA 合式公式A
 * @param  {string}  wffB 合式公式B
 * @return {String}  
 */
Tools.isEquivalent  = function(wffA,wffB){

	if (!Tools.validate(wffA) ) {

		return '合式公式A非法';
	} else if  (!Tools.validate(wffB)){

		return '合式公式B非法';
	} else if  (('T'    == wffA && Tools.isT(wffB)) || 
				('F'    == wffA && Tools.isF(wffB)) ||
				('T'    == wffB && Tools.isT(wffA)) ||
				('F'    == wffB && Tools.isF(wffA))){
		
		return 'A与B等价';
	}

	var allTruths      = Tools.getTruths([wffA, wffB]);
	for(var assign in allTruths[0]) {
		if (allTruths[0][assign] != allTruths[1][assign]) {
			return 'A与B不等价';
		}
	}

	return 'A与B等价';
}

/**
 * 将合式公式中的字母转化为数字
 * @param  {string} assign 真值指派
 * @param  {string} wff    合式公式
 * @return {string}        合式公式,不过其中的字母已经全部变为数字0或1
 */
Tools.letterToNum = function(assign, wff){
	var temp      = assign.split('');

	for (let i    = 0; i < Tools.varsOfWff.length; i++){

		//将对应的字母替换为数字
		re        = new RegExp(Tools.varsOfWff[i], 'g');
		wff       = wff.replace(re, temp[i]);
	}

	return wff;
}

/**
 * 根据真值指派将真值表中的一行转化为大项或者小项
 * @param {num} assign 真值指派
 * @param {str} flag 可传值为m或者M,如果传入m则表示求小项,如果传入M表示求大项
 * @return {str} 返回大项或者小项
 */
Tools.assign_to_M_or_m     = function(assign, flag){

	var  str               = '(';

	//求小项
	if ('m' == flag) {
		for (let i = 0; i  < assign.length; i++) {
			//i>0时,添加合取联结词
			!!i && (str   += ' & ');

			if (parseInt(assign[i])) {//该命题变元编码为1,它本身出现 

				str       += ' '  + Tools.varsOfWff[i] + ' ';
			} else {//否则,它的否定出现
				str       += ' !' + Tools.varsOfWff[i] + ' ';
			}
		}
	}

	//求大项
	if ('M' == flag) {
		for (let i = 0; i  < assign.length; i++) {
			//i>0时,添加析取联结词
			!!i && (str   += ' | ');

			if (parseInt(assign[i])) {//该命题变元的编码为1,它的否定出现 

				str       += ' !' + Tools.varsOfWff[i] + ' ';
			} else {//否则,它本身出现
				str       += ' '  + Tools.varsOfWff[i] + ' ';
			}
		}
	}
	
	return str += ')';
}