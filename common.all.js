 /**
 * 通用函数封装
 * by chenyi
 */

{
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
 /**
 * GetDom 让返回的DOM数组的每个dom都拥有方法
 * @param {string} value 类名("#a .ass .ds")
 * addClass
 * hasClass
 * removeClass
 */
    function GetDom(value){ 
        let values = getDom(value);
        if(values.length > 0){
            if(!values[0].__proto__.addClass){
                values[0].__proto__.addClass = function (values){
                    const classNames = this.className;
                    const classArr = classNames.split(" ");
                    const value = values.trim();
                    for(let item in classArr){
                        if(classArr[item] == value){
                            return false;
                        };
                    }
                    this.className = this.className.trim() + ' ' + value.trim();
                }
            }

            if(!values[0].__proto__.hasClass){
                values[0].__proto__.hasClass = function (values){
                    const classNames = this.className.trim().split(" ");
                    for(let item in classNames){
                        if(classNames[item] == values.trim()){
                            return true;
                        };
                    }
                    return false;
                }
            }

            if(!values[0].__proto__.removeClass){
                values[0].__proto__.removeClass = function (value){
                    const classNames = this.className.trim().split(" ");
                    let bool = false;
                    const valueInt = value.trim();
                    const setClassName = (valueInt) => {
                        let ClassName = classNames;
                        for(let item in ClassName){
                            if(classNames[item] == valueInt){
                                ClassName.splice(item,1);
                            }
                        }
                        ClassName = ClassName.join(" ");
                        return ClassName;
                    };
                    for(let item in classNames){
                        if(classNames[item] == valueInt){
                            bool = true;
                            this.className = setClassName(valueInt)
                        }
                    }
                    return bool;
                }
            }
        }
        return values;
    }
}

let dom = GetDom(".a")[1];
let bool = dom.hasClass('test');

console.log(bool);