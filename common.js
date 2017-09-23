//移除remove方法，现在存在一个bug，很多情况的dom，去执行同一个行为function,
//方法什么的都一模一样，可是,dom.doo = function(){this----},还是要写很多遍
//行为一致，拥有相同方法的一组对象，应该使用构造去实现,该如何去实现

var init = function(){
    var dom;
    function chenyi(item){
      return getDom(item);
    }
    function getDom(item){
        if(item.indexOf('.')>=0){
            dom = document.getElementsByClassName(item.replace('.',''));
        }
        else if(item.indexOf('#')>=0){
            dom = document.getElementById(item.replace('#',''));
        }
        set(dom);
        return dom;
    }
    function set(dom){
        dom.addClass = function(items){
            return dom;
        }
        dom.ask = function(){
            return dom;
        }
        if(dom.length>=0){
            var i = dom.length;
            while(i){
                i = i - 1;
                dom[i].removeClass = function(items){
                    var allClass = this.className.split(" ");
                    var classLength = allClass.length;
                        if(this.className.indexOf(items) != -1){
                            if(classLength == 1){
                                this.removeAttribute('class');
                            }
                            else{
                                if(this.className.indexOf(items) == 0){
                                    this.className = this.className.replace(items+' ','');
                                }
                                else if(this.className.indexOf(items) > 0){
                                    this.className = this.className.replace(' '+items,'');
                                }
                            }
                        }
                        else{
                            return false;
                        }
                    }
            }
            dom.removeClass = function(items){
                while(i){
                   dom[i].className = this.className.replace(items+' ','');
                }
            }
        }
        else{
            dom.removeClass = function(items){
            var allClass = this.className.split(" ");
            var classLength = allClass.length;
                if(this.className.indexOf(items) != -1){
                    if(classLength == 1){
                        this.removeAttribute('class');
                    }
                    else{
                        if(this.className.indexOf(items) == 0){
                            this.className = this.className.replace(items+' ','');
                        }
                        else if(this.className.indexOf(items) > 0){
                            this.className = this.className.replace(' '+items,'');
                        }
                    }
                }
                else{
                    return false;
                }
            }
        }
        
    }
    return chenyi;
}

console.log(document.getElementsByClassName('sss'));
var chenyi = init();
console.log(chenyi('.sss'));
chenyi('#sss').removeClass('ee');
chenyi('.sss')[0].removeClass('ddd');
console.log(chenyi('.sss')[0]);