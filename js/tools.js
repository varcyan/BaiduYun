//tools-----------------------------------------------
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
// console.log(objById(data,7));

// 根据id找到对应id对象的子集（如果存在）
function childById(data, id){
	var target = objById(data,id);
	// console.log(target);
	if(target && target.child){
		return target.child;
	}
}
// console.log(childById(data,2));

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
// console.log(parentById(data,5));