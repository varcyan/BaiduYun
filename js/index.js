// 问题：空文件夹内无法创建
window.onload = function (){
	//获取元素
	var floders = document.querySelector('.floder_wrap ul');	//ul 放文件夹的地方
	var newFloder = document.querySelector('.set_floder');
	var viewList = document.querySelector('.view .list');
	var toc = document.querySelector('.toc_wrap');
	var lis = floders.children;

	//数据
	var data = [
		{
			title: '0新建文件',
			id: 1,
			idp: 0,
			date: '2017-3-6 17:21:32'
		},
		{
			title: '0我的游戏',
			id: 2,
			idp: 0,
			date: '2017-3-6-17:59:21'
		},
		{
			title: '2守望先锋',
			id: 3,
			idp: 2,
			date: '2017-3-6-17:59:21'
		},
		{
			title: '2守望屁股',
			id: 4,
			idp: 2,
			date: '2017-3-6-17:59:21'
		},
		{
			title: '3D.VA',
			id: 5,
			idp: 3,
			date: '2017-3-6-17:59:21'
		},
		{
			title: '3pigff',
			id: 6,
			idp: 3,
			date: '2017-3-6-17:59:21'
		},
		{
			title: '5dva的宝宝0',
			id: 7,
			idp: 5,
			date: '2017-3-6-17:59:21'
		},
		{
			title: '5dva的宝宝1',
			id: 8,
			idp: 5,
			date: '2017-3-6-17:59:21'
		}
	];

	//目录树
	var id_ = 0;				//第一层的idp都为0，所以初始值为0
	tocCreat(data,id_,toc);		// 传入数据、id、wrap
	function tocCreat(arr,id_,toc){
		toc.innerHTML = '';
		for(var i=0; i<arr.length; i++){
			if (arr[i].idp == id_){		//查找该id下的子集（通过idp查找 idp==id 则该对象是该id下的子集）
				var li = document.createElement('li');	//生成dom
				var a = document.createElement('a');
				var i_ = document.createElement('i');	//文件夹图标
				a.innerHTML = arr[i].title;
				a.href = 'javascript:;';
				a.appendChild(i_);
				li.appendChild(a);
				li.id_ = arr[i].id;						//设置li的自定义属性id
				toc.appendChild(li);
				for(var j=0; j<arr.length; j++){	
					if(arr[j].idp == li.id_){			//判断数据中有没有与当前id相等的
						if(li.children.length == 1){	
							var ul = document.createElement('ul');
							li.appendChild(ul);
							tocCreat(arr,li.id_,ul);	//递归执行
						}
					}
				}
			}
		}
	}



	//视图切换
	viewList.onclick = function (){
		if (floders.classList.contains('floders')) {
			floders.classList.add('act_list');
			floders.classList.remove('floders');
		}else{
			floders.classList.add('floders');
			floders.classList.remove('act_list');
		}
	}

	creat(getChildren(data,0));
	newFloder.onclick = function (){
		var nowIdp = floders.children[0].idp;
		var nowdate = new Date();
		// var nowId = floders.children[0].id;///////////////////
		data.push(
			{
				title:'新建文件夹',
				id: maxId(data)+1,
				idp: nowIdp,
				date: nowdate.getFullYear() + '-' + (nowdate.getMonth()+1) + '-' + nowdate.getDate() + '    ' + nowdate.getHours() + ':' + nowdate.getMinutes() + ':' + nowdate.getSeconds()
			}
		);
		creat(getChildren(data,nowIdp));	//传入nowIdp, 在每个层级的菜单创建
		tocCreat(data,id_,toc);		//data更新了，目录树也更新
	}

	function maxId(data){
		var n = -1;
		data.forEach(function (item){
			if(item.id>n){
				n = item.id;
			}
		})
		return n;
	}



	// 生成新的文件夹
	function creat(arr){
		floders.innerHTML = '';
		arr.forEach(function (item){
			//生成元素
			var div0 = document.createElement('div');
			var div1 = document.createElement('div');
			var li = document.createElement('li');
			var i = document.createElement('i');
			var span0 = document.createElement('span');
			var a_ = document.createElement('a');
			var m_span = document.createElement('span');
			var m_time = document.createElement('time');
			m_time.innerHTML = item['date'];
			div1.classList.add('more');
			i.classList.add('checkbox');
			span0.classList.add('fld_img');
			a_.innerHTML = item['title'];
			a_.href="javascript:;"
			m_span.innerHTML = '-';
			div0.classList.add('fld_name');
			div0.appendChild(i);
			div0.appendChild(span0);
			div0.appendChild(a_);
			div1.appendChild(m_span);
			div1.appendChild(m_time);
			li.id = item.id;
			li.idp = item.idp;
			li.appendChild(div0);
			li.appendChild(div1);
			//进入子文件夹
			li.onclick = function (){
				console.log(this.id);
				creat(getChildren(data,this.id));	
			}
			floders.appendChild(li);
		})
	}

	//获取子元素
	function getChildren(data,id){
		var child = [];
		data.forEach(function (item){
			if(item.idp == id){
				child.push(item);
			}
		})
		console.log(child);
		return child;
	}	






}