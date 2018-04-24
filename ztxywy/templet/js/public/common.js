//获取时间
var time = function () {
  return function time(item) {
    if (item.time) {//如果存在time的dom就去显示时间10:30
      times(item);
      window.setInterval(times, 60000, item);
    }
    if (item.data) {
      data(item);//如果存在日期的dom就去显示时间2017.09.05
    }
    if (item.year) {
      // console.log('sss');
    }
  }

  function times(item) { //10:33
    var currentDT = new Date();
    var y = currentDT.getFullYear(),
      m = currentDT.getMonth() + 1,
      date = currentDT.getDate(),
      day = currentDT.getDay(),
      hs = currentDT.getHours(),
      ms = currentDT.getMinutes(),
      ss = currentDT.getSeconds();

    theDateStr = formatTime(hs) + ":" + formatTime(ms);
    item.time.innerHTML = theDateStr;
  }

  function data(item) {
    var currentDT = new Date();
    var week = new Date().getDay();
    var y = currentDT.getFullYear(),
      m = currentDT.getMonth() + 1,
      date = currentDT.getDate(),
      day = currentDT.getDay(),
      hs = currentDT.getHours(),
      ms = currentDT.getMinutes(),
      ss = currentDT.getSeconds(),
      str;
    if (week == 0) {
      str = "星期日";
    }
    else if (week == 1) {
      str = "星期一";
    } else if (week == 2) {
      str = "星期二";
    } else if (week == 3) {
      str = "星期三";
    } else if (week == 4) {
      str = "星期四";
    } else if (week == 5) {
      str = "星期五";
    } else if (week == 6) {
      str = "星期六";
    }
    theDateStr = y + "." + formatTime(m) + "." + formatTime(date);
    // +str;
    item.data.innerHTML = str;
    item.year.innerHTML = theDateStr;
  }

  function formatTime(str) {
    return str < 10 ? "0" + str : str
  }
}();

// 导航栏

var content = function () {
  return function (item) {
    $.ajax({
      type: 'GET',
      url: '../api/box/' + item,
      async: false,
      success: function (data) {
        var all = JSON.parse(data);
        // setcontent(all,item);
      },
      error: function (data) {

      }
    });
  }
}();


function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

var alls = document.getElementsByClassName('all-menus')[0];
var nav = document.getElementsByClassName('nav')[0];
alls.style.left = 0 + 'px';
var Homeurl = function () {
  var str = location.href;
  var num = str.indexOf("?");
  return str.substr(num + 1).slice(5, 9);
}();

function startfirst() {
  var data = [{
    api_url: "../box/index?",
    text: "我的首页",
    url: "./index.html?type=1"
  }, {
    api_url: "../notify/box_menus?",
    text: "物业服务",
    url: "./index.html?type=2"
  }, {
    api_url: "../affairs/index_box?",
    text: "智慧党建",
    url: "./index.html?type=3"
  }, {
    api_url: "../policy/box_menus?",
    text: "雪亮工程",
    url: "./index.html?type=4"
  }, {
    api_url: "../service/index_box?",
    text: "社区服务",
    url: "./service.html?type=5"
  }, {
    api_url: "../member/index_box?",
    text: "电子商务",
    url: "./index.html?type=6"
  }];
  var href = window.location.href;
  var nowMenu = GetQueryString('type') || 1;
  content(data[nowMenu - 1].api_url);
  start(alls, address, data, 108, itemClassName, aClassName, contentClassName, changeNum, nowMenu);
}

var data = ['哈哈哈', '啊啊啊', '啪啪啪', "对对对", "呵呵呵", "傻哈哈", "乐呵呵", "夕阳", "9", "10", '11', "12", "13", "14", "15", "16", "17", "18", '19', "20", "21", "22", "23", "24", "25", "26"];
var address = ["./policy.html", "http://www.jsztx.com/templets/ztx/video/ztx.mp4"];
var move;
var itemClassName = "menu";
var aClassName = "buttom lis width  buttom-border-2px-blue";
var contentClassName = "buttom-content";
var changeNum = 6;
var currentNum = {};
var head_title = document.getElementsByClassName("head_title")[0];
var divBox = document.getElementsByClassName("menu");
var changeArray = [];
var nowMenu;
var start = function () {
  function start(all, address, data, move_length, itemClassName, aClassName, contentClassName, changeNum, nowMenu) {
    var NowDom = nowMenu || 1;
    for (var i = 1; i < data.length + 1; i++) {
      var div = document.createElement('a');
      div.setAttribute('class', itemClassName);
      div.innerHTML = data[i - 1].text;
      div.setAttribute('num', i);
      div.setAttribute('href', data[i - 1].url);
      alls.appendChild(div);
      if (i == NowDom) {
        div.setAttribute('class', itemClassName + ' active');
        //点击导航栏对应标题改变
        div.style.color = "white";
        for (var h = 0; h < divBox.length; h++) {
          head_title.innerHTML = divBox[h].innerHTML
        }
        div.focus()
      }
      div.onfocus = function () {
        var num = parseInt(this.getAttribute("num"));
        var self = this;
        NowDom = this;
        nav.style.left = 0 + 'px';
        if ((self.offsetLeft + self.clientWidth) > 1280) {
          alls.style.left = -(self.offsetLeft + self.clientWidth - 1280) - 1 + 'px';
        }
        if (self.offsetLeft + self.clientWidth <= 1280) {
          alls.style.left = 0 + 'px';
        }
        //  NowDom.setAttribute('class', itemClassName);
        document.onkeydown = function (evt) {
          if (evt.keyCode == 40) {
            conosle.log('ssss');
          }
        };
      };
      div.onblur = function () {
        //    NowDom.setAttribute('class', itemClassName+' menuadd');
      }
    }
  }

  return start;
}();


startfirst();


//首页底部轮播
function Indexsliders() {
  var timer = setInterval(Indexmovers, 2500);
}

function Indexmovers() {
  $(".footer").children(".slider").animate({"top": -100 + "%"}, function () {
    $(".footer").children(".slider").children().eq(0).appendTo(".slider");
    $(".footer").children(".slider").css("top", 0)
  })
}

Indexsliders();


/*
// 右侧菜单栏
var allers = [
  {
    name: 'home',
    num: 1,
    encrypt: '家政服务',
    common: true
  },
  {
    name: 'property',
    num: 2,
    encrypt: '物业服务',
    common: true
  },
  {
    name: 'buildings',
    num: 3,
    encrypt: '房屋出租',
    common: true
  },
  {
    name: 'express',
    num: 4,
    encrypt: '快递服务',
    common: true
  },
  {
    name: 'convenience',
    num: 5,
    encrypt: '便民服务',
    common: true
  },
  {
    name: 'article',
    num: 6,
    encrypt: '二手物品',
    common: true
  },
  {
    name: 'notice',
    num: 7,
    encrypt: '小区公告',
    common: true
  }
];

var allDoms = [];

for(var i=0;i<allers.length;i++){
  var dom = document.getElementsByClassName(allers[i].name)[0];
  allDoms.push(dom);
}

for(var j = 0;j<allDoms.length;j++){
  if(allDoms[j]){
    allDoms[j].onkeydown = function(evt){
      if(evt.keyCode == 13){
        iBTB.player.stop();
      }
    }
  }
}


for(var a=0;a<allDoms.length;a++){
  if(allDoms[a]) {
    if(allers[a].common){
      allDoms[a].setAttribute('href','./article.html?type='+allers[a].num);
    }
    else{
      allDoms[a].setAttribute('href','./'+allers[a].html+'?type='+1);
    }
  }
}

*/
