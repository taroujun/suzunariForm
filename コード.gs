function doGet(e) {


  var settings = sheetToJson.loadSheet(e); // sheetToJson Library key MqZYQoF12KAefOpV0V0EPVv2sGzPh2OFS
  
  var container = loadLibrary(settings);
     
  return container.evaluate();//html.evaluate();
}


function loadLibrary(settings) {
  if(settings.main.libraryName && settings.main.libraryName !== 'Suzunari' && settings.main.libraryName !== 'suzunari'){
  var lib = libraryFanc("suzunariMain",settings.main.libraryName);
  } else { 
  var lib = libraryFanc("suzunariMain","");
  };

  var main = lib(settings);
  var container = main.createContainer(settings);
  var count = {};
 
  for (var i = 0; i < settings.librarys.length; i++){
    if(!settings.librarys[i].libraryName || settings.librarys[i].libraryName === 'Suzunari' || settings.librarys[i].libraryName === 'suzunari') {
    var name = "";
    } else {
    var name = settings.librarys[i].libraryName;
    }    
    count[settings.librarys[i].libraryName] = counter.call(count,settings.librarys[i].libraryName);
    lib = libraryFanc("generateSuzunari",name,4);
    lib = lib(name,i,count[settings.librarys[i].libraryName],settings);
    container.addData(lib.content,i);
  };
  
 return container;
}

function suzunariMain(settings){

  SuperSuzunari.prototype.createContainer = function(settings) {
  var container = new suzunariLayout.SuzunariContener(settings);
  container.footer = settings.main.footer;
  return container;
  };
  SuperSuzunari.prototype.container = {};
  return new SuperSuzunari(settings.main.libraryName,"main",settings,1);

}

function generateSuzunari(name,libraryNo,count,settings) {

  SuperSuzunari.prototype = Object.create(suzunariLayout.SuzunariLayout.prototype, {value: {constructor: SuperSuzunari}});

  var suzunari = new SuperSuzunari(name,libraryNo,count);   

  suzunari.contentFromSetting(settings.librarys[libraryNo]);
  
  return suzunari;
}

function suzunariCatchRequest(req){
  return 'suzunari'
}

function SuperSuzunari(name,libraryNo,count,layout,pages) {
  //var layoutLibrary = libraryCall('SuzunariLayout','suzunariLayout',2);
  //layoutLibrary(this,layout);
  suzunariLayout.SuzunariLayout.call(this,layout);

  // propety

  this.libraryName = name;       // libraryNo　リクエスト次にも使える
  this.libraryNo = libraryNo;    // libraryNo　リクエスト次にも使える
  this.count = {library: count}; // htmlの重複を回避する為のカウンタ,一時保管場所
  this.content = {pageDiv:[]};             // htmlコンテンツの入れ物
  
  // function
  
  this.catchRequest = function(req) { return ""}; // google Script run requestLibrary();

  this.response = function(req) { return ""}; // google Script run requestLibrary();

  this.addOutputFromFile = function(htmlName) {
  var outputFromFile = libraryFanc('libraryOutputFromFile',this.libraryName);
    if(Object.prototype.toString.call(htmlName) === '[object Array]') {
      for (var i = 0; i < htmlName.length; i++){
        this.content[htmlName[i]] = outputFromFile(htmlName[i]);
      }
    } else {
    this.content[htmlName] = outputFromFile(htmlName);  
  }
}
      
  this.liblaryTemplateFromFile = function(htmlName,obj) {
    var TemplateFromFile = libraryFanc('libraryTemplateFromFile',this.libraryName);
    var html = TemplateFromFile(htmlName);
        if(obj) {
          for(var key in obj) {
            html[key] = obj[key];
          }
        } else {
        html.libraryName = this.libraryName;
        html.libraryNo = this.libraryNo;
        html.count = this.count.library;
        };
    return html.evaluate().getContent();
  }
  
  this.setContent = function (obj){
    this.content = obj;
  }
  
  this.addContent = function (obj){
    orInsert.call(this.content,obj);
  }
  
  this.addCount = function (obj){
    orInsert.call(this.count,obj);
  }
  
  this.searchFunc = function(search,arg1,arg2,arg3,arg4,arg5,arg6,arg7){ // 引数7個まで
    var libfunc = libraryCall(search,this.libraryName,7);
    var others = libraryCall(search,"",7);    
      if(this[search] !== undefined) {
        return this[search](arg1,arg2,arg3,arg4,arg5,arg6,arg7);
      }else if(libfunc !== undefined) {
        return libfunc(this,arg1,arg2,arg3,arg4,arg5,arg6,arg7);
      }else if(others !== undefined) {
        return others(this,arg1,arg2,arg3,arg4,arg5,arg6,arg7);
      };
  }  
    
  this.searchParts = function(ary,key,arg1,arg2,arg3,arg4,arg5){ // ５個まで
    var val = ""
    for (var i = 0; i < ary.length; i++){
      if(ary[i][key]){
        val += this.searchFunc(ary[i][key],ary[i],i,arg1,arg2,arg3,arg4,arg5);
      };
    };
    return val;
  }

  this.ifAny = function(key1,key2,val,count){
    if(this.count[key1] === undefined && !count){
      this.count[key1] = 1;
      appendContent.call(this.content,key2,val);
    } else if(this.count[key1] === undefined && count){
      this.count[key1] = count;
      appendContent.call(this.content,key2,val);
    } else if(this.count[key1] !== undefined && count){
      this.count[key1] = count;
    } else {
      this.count[key1] ++
    };
  }
  
}

SuperSuzunari.prototype = Object.create(suzunariLayout.SuzunariLayout.prototype, {value: {constructor: SuperSuzunari}});

function addArrayObject(target,index,key,val){  //call thisObjectはarrayObuject
  this[target] = this[target] || [];
  this[target][index] = this[target][index] || {};
    if(this[target][index][key] !== undefined){
      this[target][index][key] += val;
    }else{
      this[target][index][key] = val;
    };
}

function addArrayObject2(index,key,val){  //call thisObjectはarrayObuject
//  this = this || [];
  this[index] = this[index] || {};
//  this[index][key] = this[index][key] + val || val;
    if(this[index][key] !== undefined){
      this[index][key] += val;
    }else{
      this[index][key] = val;
    };
}

function combineArrayObject(aryObj1,aryObj2){
  if(aryObj1.length > aryObj2.length){
    var len = aryObj1.length;
  }else{
    var len = aryObj2.length;
  }
  for(var i = 0; i < len; i++){
    if(aryObj2[i]){
      aryObj1[i] = aryObj1[i] || {};
      for(var key in aryObj2[i]){
        if(aryObj1[i][key] !== undefined){
          aryObj1[i][key] += aryObj2[i][key];
        }else{
          aryObj1[i][key] = aryObj2[i][key];
        };
      };
    };
  };
  return aryObj1;
}

function counter(name) {
 if(this[name] !== undefined) {
 return this[name] +1
 } else {
 return 1;
 };
}

function libraryFanc(func,opt_library,opt_args) { // 第一引数が関数名、関数のあるライブラリ、引数のいくつあるか。関数がないとundefinedを返す。
  var arg = "arg"
  var lib ="";
  if(opt_library) {
  var lib = opt_library + '.'
  }
  if(opt_args) {
    for (var i = 1; i < opt_args; i++){
      arg += ",arg" + i;
    };
  };
  var t = 'return typeof(' + lib  + func + ')'
  var t2 = Function.call("",t);
  if(t2() == 'function') {
    var f = 'return function(' + arg + ') { return ' + lib  + func + '(' + arg + ');}';
    return Function.call("",f)();
  }else{
  return undefined;
  }
}

function libraryCall(func,opt_library,opt_args) { // 第一引数が関数名、関数のあるライブラリ、引数のいくつあるか。関数がないとundefinedを返す。
  var arg = "thisObj,arg"
  var lib ="";
  if(opt_library) {
  var lib = opt_library + '.'
  }
  if(opt_args) {
    for (var i = 1; i < opt_args; i++){
      arg += ",arg" + i;
    };
  };
  var t = 'return typeof(' + lib  + func + ')'
  var t2 = Function.call("",t);
  if(t2() == 'function') {
    var f = 'return function(' + arg + ') { return ' + lib  + func + '.call(' + arg + ');}';
    return Function.call("",f)();
  }else{
  return undefined;
  }
}

function requestLibrary(req) {
　　var  lib = libraryFanc("suzunariCatchRequest",castLibName(req.libName),4);
　　return lib(req);
}

function castLibName(name){
  if(!name || name === 'Suzunari' || name === 'suzunari') {
    return  "";
  } else {
    return name;
  };    
}

function getUserId(){
  return Session.getActiveUser().getUserLoginId();
}

function getUserEmail(){
  return Session.getActiveUser().getEmail();
}

function orInsert(obj,key,val){
  if(key && val){
    if(this[key] !== undefined){
      this[key] += val;
    } else {
      this[key] = val;
    }
  } else {
    if(obj){
      for(var key1 in obj){
        if(this[key1] !== undefined){
          this[key1] += obj[key1];
        } else {
          this[key1] = obj[key1];
        };  
      };
    };
  };
}

function appendContent(key,val){
  if(this[key] !== undefined){
    this[key] += val;
  } else {
    this[key] = val;
  }
}

function libraryOutputFromFile(name) {
   return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function libraryTemplateFromFile(name) {
  return HtmlService.createTemplateFromFile(name);
}
