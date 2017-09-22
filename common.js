var chenyi = function(){
    this.ask = 'ddd';
    return function chenyi(){
         console.log('ssss');
         this.ask = 'ddd';
    }
}

var chenyi = new chenyi();
console.log(chenyi.ask);