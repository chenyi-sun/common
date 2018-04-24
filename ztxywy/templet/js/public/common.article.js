function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

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

//子页面底部轮播
function articleSliders() {
  var articleTimer = setInterval(articlemovers, 2500);
}

function articlemovers() {
  $(".article_footer").children(".article_slider").animate({"top": -100 + "%"}, function () {
    $(".article_footer").children(".article_slider").children().eq(0).appendTo(".article_slider");
    $(".article_footer").children(".article_slider").css("top", 0)
  })
}

articleSliders();

//子页面菜单
var menudata = [
  {
    // api_url:"../notify/box_menus?",
    text: "家政服务",
    // url:"./article.html?type=6",
    son: [
      {
        text: '物品出售',
        // url: 'leader/index_box'
      },
      {
        text: '物品求购',
        // url: 'appeal/index_box'
      }
    ]
  },
  {
    // api_url:"../notify/box_menus?",
    text: "物业服务",
    // url:"./article.html?type=6",
    son: [
      {
        text: '物品出售',
        // url: 'leader/index_box'
      },
      {
        text: '物品求购',
        // url: 'appeal/index_box'
      }
    ]
  },
  {
    // api_url:"../notify/box_menus?",
    text: "房屋出租",
    // url:"./article.html?type=6",
    son: [
      {
        text: '物品出售',
        // url: 'leader/index_box'
      },
      {
        text: '物品求购',
        // url: 'appeal/index_box'
      }
    ]
  },
  {
    // api_url:"../notify/box_menus?",
    text: "快递服务",
    // url:"./article.html?type=6",
    son: []
  },
  {
    // api_url:"../notify/box_menus?",
    text: "便民服务",
    // url:"./article.html?type=6",
    son: [
      {
        text: '物品出售',
        // url: 'leader/index_box'
      },
      {
        text: '物品求购',
        // url: 'appeal/index_box'
      }
    ]
  },
  {
    // api_url:"../notify/box_menus?",
    text: "二手物品",
    // url:"./article.html?type=6",
    son: [
      {
        text: '物品出售',
        // url: 'leader/index_box'
      },
      {
        text: '物品求购',
        // url: 'appeal/index_box'
      }
    ]
  },
  {
    // api_url:"../notify/box_menus?",
    text: "小区公告",
    // url:"./article.html?type=6",
    son: []
  }
];

var nowMenu = GetQueryString('type') || 1;


var text = menudata[nowMenu - 1].text;

$(".head_title").text(menudata[nowMenu - 1].text);

$(".menu").click(function () {
  index = $(this).index();
  $(this).addClass("menu_active").siblings().removeClass("menu_active");
  $(".right").children(".right-inner").removeClass("show").eq(index).addClass("show");
});

$(".menu").click(function () {
  index = $(this).index();
  $(this).addClass("menu_active").siblings().removeClass("menu_active");
  $(".right").children(".right_inner").removeClass("show").eq(index).addClass("show");
});

//判断名字来选择使用哪个模板
if (text == "二手物品") {
  $(".content_box").show();
  var menus = document.getElementsByClassName("menu")[0];
  menus.focus();
}
else if (text=="物业服务"){
  $(".property_box").show()
}
else if(text=="小区公告"){
  $(".notice_box").show()
}
else if(text=="房屋出租"){
  $(".buildings_box").show();
  var buildingsMenus=document.getElementsByClassName("buildings_menu")[0];
  buildingsMenus.focus();
}

var noticeLists=document.getElementsByClassName("notice_list");
for(var i=0;i<6;i++){
  noticeLists[i].href="./notice-line.html?id="+ 1;
}
