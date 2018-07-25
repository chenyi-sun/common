/** set cookie */
function setCookie(name,value){
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
}

function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

function getClass(classname,dom){//js原生获取class对象
    if (document.getElementsByClassName) {
		//使用现有方法
		return document.getElementsByClassName(classname);
	}else{
		//定义一个数组放classname
		var results = new Array();
		//获取所有节点元素
		var elem = dom?dom.getElementsByTagName("*"):document.getElementsByTagName("*");
		for (var i = 0; i < elem.length; i++) {
			if (elem[i].className.indexOf(classname) != -1) {
				results[results.length] = elem[i];
			}
		}
		return results;
    }
}

function getId(IdName, dom){
    var elem = dom?dom.getElementsByTagName("*"):document.getElementsByTagName("*");
    let arr = [];
    for (var i = 0; i < elem.length; i++) {
        if (elem[i].id == IdName){
            arr.push(elem[i]);
        }
    }
    return arr;
}

function getDom(value, dom){
    let valueInt = value.trim();
    let intArrs = valueInt.split(' ');
    let init = {
        setLoop(i, dom){
            for(let item in dom){
                if(getDom(intArrs[i+1],dom[item])){
                    return getDom(intArrs[i+1],dom[item]);
                }
            }
        }
    }
    if(intArrs.length == 1){
        if(value.indexOf('.')>=0){
            return dom ? getClass(value.replace('.','')):getClass(value.replace('.',''), dom);
        }
        else if(value.indexOf('#')>=0){
            return dom ? getId(value.replace('#','')):getId(value.replace('#',''), dom);
        }
    }
    else{
        let dom;
        for(let i = 0; i < intArrs.length; i++){
            if(i == 0){
                dom = getDom(intArrs[i]);
            }
            else{
                if(init.setLoop(i-1, dom).length){
                   dom =  init.setLoop(i-1, dom);
                }
            }
        }
        return dom;
    }
}

let dom = getDom(".a");
console.log(dom);