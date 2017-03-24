/**
 * 重命名名字一样时有问题
 */
// 获取元素
var toc = document.querySelector('.toc');					//目录树wrap
var folders = document.querySelector('.folder_wrap ul');	//文件夹wrap
var viewList = document.querySelector('.view .view_list');	//展示方式

var local = document.querySelector('.local .local_info');		//路径栏
var back = document.querySelector('.local .back');			//返回上一级
var selAllCheck = document.querySelector('.sel_all .checkbox');	//全选框

var changName = document.querySelector('.cg_name');	//input 重命名
var changeInp = changName.querySelector('input');

var newFld = document.querySelector('.file_opt .opt_new');	//新建
var optDel = document.querySelector('.opt_other .opt_del');		//删除
var optRename = document.querySelector('.opt_other .opt_rename');	//重命名
var optMove = document.querySelector('.opt_other .opt_move');		// 移动到


var tips = document.querySelector('.tips');		//提示
var move = document.querySelector('.move');		//目录框（移动到）
var moveToc = document.querySelector('.move_toc');	// 目录树（移动到）
var confirm = document.querySelector('.verify form input:nth-of-type(1)');	// 选择移动到 确认
var cancel = document.querySelector('.verify form input:nth-of-type(2)');		// 选择移动到 取消

var moveSure = document.querySelector('.moveSure');	//确认移动
var moveConfirm = document.querySelector('.moveSure .conOpt input:nth-of-type(1)');
var moveCancel = document.querySelector('.moveSure .conOpt input:nth-of-type(2)');
console.log(cancel);
console.log(tips);

// 数据中的最大id
var maxId = maxDataId(data);
// 当前文件数目
var curData = [];
var curHtml = [];

// 文件操作------------------------------------------
// 删除
optDel.onclick = function (){
	console.log(111);
	console.log(fileSel());
	if (!fileSel()){
		console.log(11);
		tips.innerHTML = '请选择要删除的文件';
		tipsBlock();
	} else {
		for(var i=0; i<curData.length; i++){
			if (curData[i].checked) {
				curData.splice(i,1);
				i--;
			}
		}
		creTree(data,toc);	// child.length 为0时没有重新生成因此
		creTree(data,moveToc);
		fileOn(folders.id_);
	}
}
// 判断有没有选中文件
function fileSel(){
	for(var i=0; i<curData.length; i++){
		if (curData[i].checked) {
			return true;
		}
	}
	return false;
}
// 重命名
optRename.onclick = function (){
	var arr = selNum();	
	if (arr[0] === 1) {	// 重命名时只能选中一个
		var a = curHtml[arr[1][0]].firstElementChild.lastElementChild;
		// change 框定位与显示
		inpStyle();
		changName.style.display = 'block';	
		changeInp.focus();
		changeInp.value = a.innerHTML;
		changeInp.select();
		changName.style.left = curHtml[arr[1][0]].offsetLeft + a.offsetLeft + 'px';
		changName.style.top = a.offsetTop + 1 +  'px';
		changeInp.onblur = function (){
			if (changeInp.value === ''){
				changName.style.display = '';	
				return;
			}
			console.log(renameYN(arr));
			// 失去焦点时判断是否符合规则
			if(!renameYN(arr)){	//如果不符合
				tipsBlock(); // 提示
				changName.style.display = 'none';
				curData[arr[1][0]].title = nameYN();
				fileOn(folders.id_);
			} else {
				curData[arr[1][0]].title = changeInp.value;
				changName.style.display = '';	
				creTree(data,toc);	// child.length 为0时没有重新生成因此
				creTree(data,moveToc);
				fileOn(folders.id_);
			}
		}
	} else {
		tipsBlock();	//提示
		if (arr[0] === 0){
			tips.innerHTML = '请选择要重命名的文件';
			return;
		}
		if (arr[0] > 1) {
			tips.innerHTML = '重命名最多选择一个文件';
			return;
		}
		return false;
	}
}
// 移动到
optMove.onclick = function (){
	var arr = selNum();
	if (arr[0] === 0){
		tips.innerHTML = '请选择要移动的文件';
		tipsBlock();
	} else {
		moveBlock();
		moveToc.tar = null;
		moveToc.last.classList.remove('select');
	}
}
confirm.onclick =function (){
	if (moveToc.tar === null) {
		tips.innerHTML = '请选择目标文件夹';
		tipsBlock();
	} else {
		var moveIndex = selNum()[1];					// 获取到的选择移动文件在curHtml的索引值
		var can = canMove(moveIndex);
		if (moveToc.tar === folders.id_){
			tips.innerHTML = '已经在目标文件夹了';
			tipsBlock();
		}else if (!can){
			tips.innerHTML = '不能移动到目标文件夹，请重新选择';
			tipsBlock();
		}else if (can){
			var arr = nameMove(moveIndex);
			console.log(arr);
			// console.log(reNameArr);
			var target = objById(data,moveToc.tar);
			var arrData = nameMove(moveIndex)[1];
			if (arr[0]) {			
				// 删除当前的数据，并在目标文件内创建新的
				for(var i=arrData.length-1; i>=0; i--){
					curData.splice(0, 1);
					target.child.unshift(arrData[i]);
				}
				fileOn(folders.id_);
				creTree(data,toc);	// child.length 为0时没有重新生成因此
				creTree(data,moveToc);

				moveNone();
				tips.innerHTML = '移动成功';
				tipsBlock();
			} else {
				moveNone();
				moveSureBlock();
				// 确认覆盖移动
				moveConfirm.onclick = function (){
					console.log(arrData.length);
					for (var i=0; i<arrData.length; i++){
						console.log(objById(data,arrData[i][0].id))/* = arrData[i][1];*/
						// console.log(arrData[i][1]);
						curData.splice(0, 1);
						objById(data,arrData[i][0].id).id = arrData[i][1];

					}
					console.log(arrData);
					fileOn(folders.id_);
					creTree(data,toc);	// child.length 为0时没有重新生成因此
					creTree(data,moveToc);
				}
			}
		}
	}
}

// 取消移动
moveCancel.onclick = function (){
	moveSureNone();
	tips.innerHTML = '取消移动';
	tipsBlock();
}
function nameMove(moveIndex){
	var tarChild = childById(data, moveToc.tar);
	var moveId = [];
	var repName = [];
	var t = true;
	for(var i=0; i<moveIndex.length; i++){
		moveId.push(objById(data,curHtml[moveIndex[i]].id_));
	}
	for(var i=0; i<tarChild.length; i++){
		for(var j=0; j<moveId.length; j++){
			if (tarChild[i].title === moveId[j].title) {
				console.log('存在重名文件，要移动并覆盖吗');
				t = false;
				repName.push([tarChild[i]].concat(moveId.splice(j,1),[j]));	// 把重复的push到数组
			}
		}
	}
	if (repName.length === 0) {
		repName = moveId;
	}
	console.log(repName);
	return [t,repName,moveId];
}


// 判断是否可以移动到目标文件夹
function canMove(moveIndex){
	var parArr = parentById(data, moveToc.tar);	// 目标文件以及所有的父级
	for (var i = 0; i < parArr.length; i++) {
		for (var j = 0; j < moveIndex.length; j++) {
			if (curHtml[moveIndex[j]].id_*1 === parArr[i].id) {
				return false;
			}
		}
	}
	return true;
}
cancel.onclick = function (){
	console.log(1);
	moveNone();
}


// 获取选中的数目
function selNum(){
	var n = 0;
	var m = [];
	for(var i=0; i<curData.length; i++){
		if (curData[i].checked){
			++n;
			m.push(i)	// 存储开着的开关
		}
	}
	return [n,m];
}
// tips block
function tipsBlock(){
	TweenMax.to(tips, 0.5, {
		top: 30,
		opacity: 1,
		ease:Bounce.easeOut,
		onComplete: function (){
			TweenMax.to(tips, 0.2, {
				opacity: 0,
				delay: 1.2,
				onComplete: function (){
					tips.style.top = '-42px';
				}
			})
		}
	})
}
// moveSure block
function moveSureBlock(){
	moveSure.style.display = 'block';
	TweenMax.to(moveSure, 0.5, {
		top: 200,
		opacity: 1
	})
}
function moveSureNone(){
	TweenMax.to(moveSure, 0.5, {
		top: 0,
		opacity: 0,
		onComplete: function (){
			moveSure.style.display = '';
		}
	})
}
// move block
function moveBlock(){
	move.style.display = 'block';
	TweenMax.to(move, 0.5, {
		opacity: 1
	})
}
// move none
function moveNone(){
	TweenMax.to(move, 0.5, {
		opacity: 0,
		onComplete: function (){
			move.style.display = '';
		}
	})
}
// 判断重命名
function renameYN(arr){
	for (var i = 0; i < curData.length; i++) {
		if (curData[i].id === curHtml[arr[1][0]].id_) {
			continue;
		}
		if (curData[i].title === changeInp.value) {
			// console.log('命名重复了');
			return false;
		}
	}
	return true;
}




//生成目录树-------------------------------------------
var left = 46;
function creTree(data, wrap){
	wrap.innerHTML = '';
	data.forEach(function (item){	//数组中的每个项目循环
		//生成DOM
		var li_ = document.createElement('li');
		var a_ = document.createElement('a');
		a_.id_ = item.id;
		a_.href = 'javascript:;'
		a_.innerHTML = item.title;					//设置目录名称
		var i_ = document.createElement('i');
		a_.appendChild(i_);
		a_.style['padding-left'] = left + 'px';		//设置相应的left值
		i_.style['left'] = (left-25) + 'px';
		i_.id_ = item.id;
		li_.appendChild(a_);
		if (item.child.length){				//判断该目录下是否有子集
			left += 25;					//位于内层的需要增加left值
			var ul_ = document.createElement('ul');
			li_.appendChild(ul_);
			creTree(item.child, ul_);	//递归 继续生成内部结构
			left -= 25;					//内层走完后恢复外层的left值
		}
		wrap.appendChild(li_);
	})
}
// 目录树点击事件
toc.onclick = function (e){
	if (e.target.nodeName.toUpperCase() === 'A' || e.target.nodeName.toUpperCase() === 'I') {
		if (e.target.id_ === folders.id_){ return; };
		fileOn(e.target.id_);
		console.log(e.target.id_);
	}
}
moveToc.last = moveToc;
moveToc.tar = null;
moveToc.onclick = function (e){
	moveToc.last.classList.remove('select');	// 清除上一个
	if (e.target.nodeName.toUpperCase() === 'A' || e.target.nodeName.toUpperCase() === 'I') {
		if (e.target.nodeName.toUpperCase() === 'A') {
			e.target.classList.add('select');
			moveToc.last = e.target;
		}
		if (e.target.nodeName.toUpperCase() === 'I') {
			e.target.parentNode.classList.add('select');
			moveToc.last = e.target.parentNode;
		}
		moveToc.tar = e.target.id_ * 1;
	}
}
//目录树的select-
function treeSel(data, id, wrap){
	var allp = parentById(data,id);
	var aAll = wrap.querySelectorAll('a');
	// console.log(id);
	for(var i=0; i<aAll.length; i++){			//清空所有的选择
		if(aAll[i].id_ == id){					//为选择的目录树设置样式
			aAll[i].classList.add('select');
			continue;
			console.log(aAll[i]);
		}
		aAll[i].classList.remove('select');
	}
	for (var i = 0; i < aAll.length; i++) {
		aAll[i].classList.remove('active');
	}
	for(var i=0; i<aAll.length; i++){		//自己与所有父级的文件夹打开
		for(var j=0; j<allp.length; j++){
			if (aAll[i].id_ === allp[j].id){
				aAll[i].classList.add('active');
			}
		}
	}
}


//生成文件夹------------------------------------------
function creFiles(data, id){		//生成文件夹
	folders.innerHTML = '';
	var arr = curHtml = creFilesData(data,id);
	arr.forEach(function (item){
		folders.appendChild(item);
	});
}
//生成文件夹数据
function creFilesData(data, id){
	var arr = [];
	var filesArr = curData = childById(data, id);		//获取该id下的子集元素
	for(var i=0; i<filesArr.length; i++){
		// 生成DOM
		var li_ = document.createElement('li');
		var div_info = document.createElement('div');
		div_info.classList.add('fld_info');
		var div_more = document.createElement('div');
		div_more.classList.add('fld_more');
		var i_ = document.createElement('i');
		i_.classList.add('checkbox');
		var span_ = document.createElement('span');
		span_.classList.add('fld_img');
		var a_ = document.createElement('a');
		a_.classList.add('fld_name');
		a_.href = 'javascript:;';
		a_.innerHTML = filesArr[i].title;
		div_info.appendChild(i_);
		div_info.appendChild(span_);
		div_info.appendChild(a_);
		var span0_ = document.createElement('span');
		span0_.innerHTML = '-';
		var time_ = document.createElement('time');
		time_.innerHTML = '2017-03-08 01:00:22';
		div_more.appendChild(span0_);
		div_more.appendChild(time_);
		li_.appendChild(div_info);
		li_.appendChild(div_more);
		li_.id_ = filesArr[i].id;		//为当前li设置自定义属性id_
		span_.id_ = filesArr[i].id;
		a_.id_ = filesArr[i].id;
		div_info.id_ = filesArr[i].id;
		i_.id_ = filesArr[i].id;
		/*li_.onclick = function (){
			fileOn(this.id_);
		}*/
		arr.push(li_);					//将生成的内容数据提交至数组
	}
	return arr;							//数据作为结果返回
}
function creDom(){
	var li_ = document.createElement('li');
	var div_info = document.createElement('div');
	div_info.classList.add('fld_info');
	var div_more = document.createElement('div');
	div_more.classList.add('fld_more');
	var i_ = document.createElement('i');
	i_.classList.add('checkbox');
	var span_ = document.createElement('span');
	span_.classList.add('fld_img');
	var a_ = document.createElement('a');
	a_.classList.add('fld_name');
	a_.href = 'javascript:;';
	a_.innerHTML = '';
	div_info.appendChild(i_);
	div_info.appendChild(span_);
	div_info.appendChild(a_);
	var span0_ = document.createElement('span');
	span0_.innerHTML = '-';
	var time_ = document.createElement('time');
	time_.innerHTML = '2017-03-08 01:00:22';
	div_more.appendChild(span0_);
	div_more.appendChild(time_);
	li_.appendChild(div_info);
	li_.appendChild(div_more);
	return li_;
}
// 文件夹点击事件
folders.onclick = function (e){
	// 进入文件夹
	if (e.target.nodeName.toUpperCase() === 'LI' || e.target.classList.contains('fld_info') || e.target.classList.contains('fld_img') || e.target.classList.contains('fld_name')) {
		fileOn(e.target.id_);
	}
	// 勾选框
	if (e.target.classList.contains('checkbox')) {
		// 点击改变样式 及 数据
		e.target.parentNode.parentNode.classList.toggle('active');
		e.target.innerHTML = e.target.parentNode.parentNode.classList.contains('active')? '√' : '';
		objById(data, e.target.id_).checked = e.target.parentNode.parentNode.classList.contains('active')? true : false;	
		// 全选判断
		setCheckAll();
		console.log(curData);
		// console.log(objById(data, e.target.id_).checked);
		// 检测 //
		// e.target.nextElementSibling.nextElementSibling.innerHTML = objById(data, e.target.id_).title + objById(data, e.target.id_).checked;
	}
}
// 全选框点击事件
selAllCheck.onclick = function (){
	if (!curData.length){
		return;
	}
	selAllCheck.classList.toggle('active');
	selAllCheck.innerHTML = selAllCheck.classList.contains('active')? '√' : '';
	for(var i=0; i<curHtml.length; i++){
		if (selAllCheck.classList.contains('active')){
			curHtml[i].classList.add('active');
			setSelCheck();
		} else {
			curHtml[i].classList.remove('active');
			setSelCheck();
		}
	}
	function setSelCheck(){
		curHtml[i].firstElementChild.firstElementChild.innerHTML = curHtml[i].classList.contains('active')? '√' : '';
		objById(data, curHtml[i].id_).checked = curHtml[i].classList.contains('active')? true : false;
	}
	console.log(curData);
}
// 全选判断设置
function setCheckAll(){
	if (checkAll()){
		selAllCheck.classList.add('active');
		selAllCheck.innerHTML = '√';
	} else {
		selAllCheck.classList.remove('active');
		selAllCheck.innerHTML = '';
	}
}
// 全选判断
function checkAll(){
	for (var i=0; i<curData.length; i++) {
		if (!curData[i].checked) return false;
	}
	return true;
}


// 进入（生成对应id下的）文件夹并关联地址栏、目录位置-----------------------------------------
function fileOn(thisId_){		//每个文件夹的点击事件
	checkOri(false);		// 重置开关打开选项
	creLocal(data,thisId_);	//更新地址栏
	treeSel(data,thisId_, toc);	//更新目录树选择
	treeSel(data,thisId_, moveToc);	//更新目录树选择
	var child = childById(data, thisId_);	//判断其有没有子元素
	if(child.length){					//有子集就生成
		creFiles(data, thisId_);	//重新绘制文件夹
		creTree(data, toc);			//重新绘制目录树
		creTree(data, moveToc);
		treeSel(data,thisId_, toc);		//重新设定刚刚选择的目录树
		treeSel(data,thisId_, moveToc);		//重新设定刚刚选择的目录树
	}else{						//没有就清空内容
		folders.innerHTML = '';
		curData = [];
		curHtml = [];
	}
	folders.id_ = thisId_;
	// console.log(curData);
	// console.log(curHtml);
	// console.log(folders.id_);
}
fileOn(0);		//默认初始位置开始
// 重置开关
function checkOri(bool){
	// 数据处理
	for (var i=0; i<curData.length; i++) {
		curData[i].checked = bool;
	}
	// 如果设置为false
	if (!bool){
		selAllCheck.classList.remove('active');
		selAllCheck.innerHTML = '';
		// 样式处理
		for(var i=0; i<curHtml.length; i++){	
			curHtml[i].classList.remove('active');
			curHtml[i].firstElementChild.firstElementChild.innerHTML = '';
		}
	}
}

//新建文件夹------------------------------------------
newFld.onOff = true;
newFld.onclick = function (){
	checkOri(false);
	// 插入一个临时DOM Li
	if (newFld.onOff){
		folders.insertBefore(creDom(),folders.firstElementChild);
		// newFld.onOff = false;
	}
	
	var lisA = folders.children[0].querySelector('.fld_name');		//新创建的文件夹
	var lisAp = lisA.parentNode.parentNode;
	// 设置/修改文件夹名字wrap的位置
	inpStyle();	// 转换布局时input的样式变化
	changName.style.display = 'block';
	changeInp.focus();	//焦点
	changeInp.value = '';
	changName.style.left = lisA.offsetLeft + lisAp.offsetLeft + 'px';
	changName.style.top = lisA.offsetTop + lisAp.offsetTop + 1 +  'px';
	changeInp.onblur = function (){
		// newFld.onOff = true;
		changName.style.display = 'none';
		var newName = nameYN();
		if (newName){
			newData(data, folders.id_,newName);
			fileOn(folders.id_);
		} else {
			folders.removeChild(folders.firstElementChild);
			console.log('删除');
		}
	}
	console.log(curData);
}
// 命名判断
function nameYN(){		
	var selfChild = objById(data,folders.id_).child;
	var newName = '';
	return (function tst(){
		if (changeInp.value) {
			for (var i=0; i<selfChild.length; i++){
				if(selfChild[i].title === changeInp.value){	//如果写入的名字与统计文件夹有相同的
					var selfData = objById(data,selfChild[i].id);	//获取名字相同的這个数据
					if (!selfData.n){			// 存不存在n
						selfData.n = 1;			//不存在则添加n
					}
					newName = `${changeInp.value}(${selfData.n++})`;	//同名的n++
					return newName;
					}
				}
				newName = changeInp.value;
				return newName;
		} else {
			console.log('不能为空');
			changeInp.focus();
		}	
	})();
		
	// console.log(selfChild);
}

function newData(data,id,newName){
	var obj = {
		title: newName,
		id: ++maxId,
		pid : id,
		child : []
	}
	console.log(obj.title);
	objById(data,id).child.unshift(obj);	//向数据中添加新的文件对象
	console.log(data);
}

// input的style
function inpStyle(){
	if (folders.classList.contains('act_list0')){
		changeInp.classList.add('inp0');
	} else {
		changeInp.classList.remove('inp0');
	}
}





//地址----------------------------------------------------
//生成地址
function creLocal(data,id){
	local.innerHTML = '';				//清空当前内容
	if (id === 0) {						//如果到达'全部文件'，则让'返回上一级消失'
		back.style.display = 'none';
	} else {
		back.style.display = 'block';	//否则'返回上一级出现'
		back.id_ = objById(data, id).pid;	//设置back的id_(用于返回)
	}	
	var par = Array.from(parentById(data,id)).reverse();//获取自己以及自己所有的父级的数据
	for (var i=0; i<par.length; i++){			//生成路径结构
		var a_ = document.createElement('a');
		a_.id_ = par[i].id;
		a_.innerHTML = par[i].title;
		a_.href = 'javascript:;';
		local.appendChild(a_);
	}
}
// 面包屑点击事件 点击相应的路径进入相应的目录
local.onclick = function (e){
	if (e.target.nodeName.toUpperCase() === 'A') {
		if (e.target.id_ === folders.id_) return;	// 如果已经是当前文件，则不重复执行
		console.log(55555);
		fileOn(e.target.id_);
	}
}
//返回上一级
back.onclick = function (){
	console.log(back.id_);
	fileOn(back.id_);
}





//视觉功能-----------------------------------------------
var selOther = document.querySelector('.sel_col .sel_other');	//其他选项（大小/时间）
//切换视图
viewList.onOff = true;
viewList.onclick = function (){
	this.classList.toggle('active');
	selOther.classList.toggle('active');
	if (this.onOff) {
		folders.classList.add('act_list0');
		folders.classList.remove('act_list1');
	} else {
		folders.classList.add('act_list1');
		folders.classList.remove('act_list0');
	}
	this.onOff = !this.onOff;
}
