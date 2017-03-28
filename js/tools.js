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

// 获取某元素某个方向距离body的绝对位置
function getRect(obj, type){
	var rect = obj.getBoundingClientRect();
	switch(type){
		case 'left':
			return rect.left;
			break;
		case 'top':
			return rect.top;
			break;
		case 'right':
			return rect.right;
			break;
		case 'bottom':
			return rect.bottom;
			break;
	}
};

// 碰撞检测
function duang(current, target){
	var currentRect = current.getBoundingClientRect();
	var targetRect = target.getBoundingClientRect();
	var currentLeft = currentRect.left, 
		currentTop = currentRect.top,
		currentRight = currentRect.right,
		currentBottom = currentRect.bottom;
	var targetLeft = targetRect.left, 
		targetTop = targetRect.top,
		targetRight = targetRect.right,
		targetBottom = targetRect.bottom;
	return currentRight > targetLeft && currentBottom > targetTop && currentLeft < targetRight && currentTop < targetBottom;
};