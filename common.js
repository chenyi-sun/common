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
        dom.set = function(){
            console.log('ssssdd');
        }
        return dom;
    }
    
    return chenyi;
}

var chenyi = init();
console.log(chenyi('#sss'));
chenyi('#sss').set();