window.onload = function (){
	var floders = document.querySelector('.floder_wrap ul');
	var newFloder = document.querySelector('.set_floder');
	var viewList = document.querySelector('.view .list');
	var lis = floders.children;

	var data = [
		{
			title: '新建文件夹',
			id_: 0,
			idp: 0,
			date: '2017-3-6 17:21:32'
		},
		{
			title: '我的游戏',
			id: 1,
			idp: 0,
			data: '2017-3-6-17:59:21'
		},
		{
			title: '守望先锋',
			id: 2,
			idp: 1,
			data: '2017-3-6-17:59:21'
		}
	];

	viewList.onclick = function (){
		if (floders.classList.contains('floders')) {
			floders.classList.add('act_list');
			floders.classList.remove('floders');
		}else{
			floders.classList.add('floders');
			floders.classList.remove('act_list');
		}
		

	}


	Array.from(lis).forEach(function (item){
		console.log(item);

		item.onclick = function (){
			console.log(1);
		}
	})

	creat(data);
	newFloder.onclick = function (){
		var nowdate = new Date();
		data.push(
			{
				title:'新建文件夹',
				id: data[data.length-1].id+1,
				date: nowdate.getFullYear() + '-' + (nowdate.getMonth()+1) + '-' + nowdate.getDate() + '    ' + nowdate.getHours() + ':' + nowdate.getMinutes() + ':' + nowdate.getSeconds()
			}
		);
		creat(data);
	}



	// 生成新的文件夹
	function creat(arr){
		floders.innerHTML = '';
		arr.forEach(function (item){
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
			li.id_ = item.id_;
			li.appendChild(div0);
			li.appendChild(div1);
			li.onclick = function (){
				creat(getChildren(this.id));
				function getChildren(id){
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


			floders.appendChild(li);


		})
	}






}