//tools
//根据id找到对应id所在的对象
function objById(data, id){
	var obj = null;
	for(var i=0; i<data.length; i++){
		if (data[i].id === id){
			obj = data[i];
			return obj;
			break;
		}
		if (!obj && data[i].child) {	//??? !obj
			obj = objById(data[i].child, id);
			if(obj){
				break;
			}
		}
	}
	return obj;
}

// 根据id找到对应id对象的子集（如果存在）
function childById(data, id){
	var target = objById(data,id);
	// console.log(target);
	if(target && target.child){
		return target.child;
	}
}

// 根据id获取自己以及自己所有的父级
function parentById(data, id){
	var parArr = [];
	var current = objById(data, id);
	if(current){
		parArr.push(current);
		parArr = parArr.concat(parentById(data,current.pid));
	}
	return parArr;
}



//找到data中最大的id-----------------------------
function maxDataId(data){
	var idArr = [];		//声明一个数组用于存放data数据中所有的id
	function get(data){
		for(var i=0; i<data.length; i++){
			idArr.push(data[i].id);
			if (data[i].child.length) {
				get(data[i].child);
			}
		}
		return Math.max(...idArr);
	}
	return get(data);
	
}
// console.log(maxDataId(data));