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
        dom.addClass = function(){
            console.log(dom[0].className);
            return dom;
        }
        dom.ask = function(){
            console.log('ddd');
            return dom;
        }
    }
    return chenyi;
}

var chenyi = init();
console.log(chenyi('#sss'));
chenyi('#sss').set().addClass('d');