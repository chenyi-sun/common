var ajaxs = function(){
  return function ajax(items){
    var parameters = {
      type: items.type?items.type.toUpperCase():'GET',
      url: items.url?items.url:'',
      success: items.success?items.success:function(){},
      datas: items.datas,
      newUrl: '',
      async: items.async?items.async:true,
      newMessage: '',
      error: items.error?items.error:function(){},
    }
    if(parameters.type =="GET"){
       parameters.newUrl = parameters.url+'?';
        for(var item in parameters.datas){
          parameters.newUrl += item +'='+ parameters.datas[item]+'&' 
        }
        parameters.newMessage = null;
    }
    else{
      parameters.newUrl = parameters.url;
       for(var item in parameters.datas){
           parameters.newMessage += item +'='+ parameters.datas[item]+'&' 
        }
    }
   
    var xmlhttp;
    if (window.XMLHttpRequest)
      {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
      }
    else
      {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.open(parameters.type,parameters.newUrl,parameters.async);
      xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xmlhttp.send(parameters.newMessage);
      xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
          parameters.success(xmlhttp.responseText);
        }
        else{
          parameters.error(xmlhttp.responseText);
        }
      }
     
  }
  
}
var ajax = ajaxs();

