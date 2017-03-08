// 获取元素
var toc = document.querySelector('.toc');					//目录树wrap
var folders = document.querySelector('.folder_wrap ul');	//文件夹wrap
var viewList = document.querySelector('.view .view_list');	//展示方式
var local = document.querySelector('.local .local_info');	//路径栏
var back = document.querySelector('.local .back');			//返回上一级


//生成目录树-------------------------------------------
var left = 10;
creTree(data,toc);
function creTree(data, wrap){
	data.forEach(function (item){	//数组中的每个项目循环
		//生成DOM
		var li_ = document.createElement('li');
		li_.classList.add('type_li');
		var a_ = document.createElement('a');
		a_.id_ = item.id;
		a_.href = 'javascript:;'
		a_.innerHTML = item.title;					//设置目录名称
		var i_ = document.createElement('i');
		a_.appendChild(i_);
		a_.style['padding-left'] = left + 'px';		//设置相应的left值
		li_.appendChild(a_);
		if (item.child){				//判断该目录下是否有子集
			left += 25;					//位于内层的需要增加left值
			var ul_ = document.createElement('ul');
			li_.appendChild(ul_);
			creTree(item.child, ul_);	//递归 继续生成内部结构
			left -= 25;					//内层走完后恢复外层的left值
		}

		a_.onclick = function (){
			fileOn(this.id_);
		};		//每个目录项的点击事件

		wrap.appendChild(li_);
	})
}
//目录点击事件
function catalogOn(){
	var as = document.querySelectorAll('.toc a');
	Array.from(as).forEach(function (item){
		item.onclick = function (){
			for (var i=0; i<as.length; i++) {
				as[i].classList.remove('select');
			}
			var next = this.nextElementSibling;
			var ppar = this.parentNode.parentNode;
			var allUl = ppar.querySelectorAll('ul');
			for (var i=0; i<allUl.length; i++) {
				if (allUl[i] != next) {
					allUl[i].classList.remove('active');
					for (j=0; j<as.length; j++){
						as[j].classList.remove('active');
					}	
				}
			}

			if (next){
				next.classList.toggle('active');
			}
			item.classList.toggle('active');
			item.classList.toggle('select');			
			fileOn(item.id_);
		}
	})
}
catalogOn();


//生成文件夹------------------------------------------
creFiles(data, 0);
function creFiles(data, id){		//生成文件夹
	folders.innerHTML = '';
	var arr = creFilesData(data,id);
	arr.forEach(function (item){
		folders.appendChild(item);
	});
}
//生成文件夹数据
function creFilesData(data, id){
	var arr = [];
	var filesArr = childById(data, id);		//获取该id下的子集元素
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
		li_.onclick = function (){
			fileOn(this.id_);
		}
		arr.push(li_);					//将生成的内容数据提交至数组
	}
	return arr;							//数据作为结果返回
}

//地址---------------------------------------
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
		a_.onclick = function (){				//点击相应的路径进入相应的目录
			fileOn(this.id_);
		}
	}
}
creLocal(data,0);

//返回上一级
back.onclick = function (){
	console.log(back.id_);
	fileOn(back.id_);
}






// 进入文件夹-----------------------------------------
function fileOn(thisId_){		//每个文件夹的点击事件
	creLocal(data,thisId_);	//更新地址栏
	var child = childById(data, thisId_);	//判断其有没有子元素
	if(child){					//有子集就生成
		creFiles(data, thisId_);

	}else{						//没有就清空内容
		folders.innerHTML = '该文件夹内没有文件';
	}
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
