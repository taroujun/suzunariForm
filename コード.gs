function generateSuzunari(name,libraryNo,count,settings) {

  SuzunariForm.prototype = Object.create(suzunari.SuperSuzunari.prototype, {value: {constructor: SuzunariForm}});
  
  var suzunariForm = new SuzunariForm(name,libraryNo,count);
  
  suzunariForm.addOutputFromFile(['plugins','pluginCss']);
  
  suzunariForm.contentFromSetting(settings.librarys[libraryNo]);

  return suzunariForm;

}

function suzunariCatchRequest(req){
  submitForm(req);
  return JSON.stringify(getColumnValues(req.lib.target.SpreadsheetId,'シート11',3,2,4));//req.data[req.lib.parts[1].name];//JSON.stringify(req.data);
}

function submitForm(req){
  var parts = req.lib.parts;
  var form = req.data;
  var ary = [];
    for (var i = 0; i < parts.length; i++){
      switch(parts[i].widgets){
          case "rowId":
          case "rowID":
          if(req.lib.target.offset){
            ary[i] = "=row()-" + req.lib.target.offset;
          }else{
            ary[i] = "=row()"
          };
          break;
          case 'timeStamp':
            ary[i] = new Date();
          break;
          case "userId" :
            ary[i] = suzunari.getUserId();
          break;
          case "userEmail" :
            ary[i] = suzunari.getUserEmail();
          break;
          default:
            ary[i] = form[parts[i].name];
          break;
      };
  };

  writeSpreadsheet(req.lib.target.SpreadsheetId,req.lib.target.sheetName,ary,req.lib.target.offset + 1,true);
}

function writeSpreadsheet(ssId,sheetName,data,target,insert){ //insert　インサートで挿入か書き換えを指定
  var sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName);
  var ary = [];
  var row = sheet.getLastRow() +1;
  ary[0] = data;
  if(target){ row = target };
  if(target && insert){ sheet.insertRowBefore(target) };
  sheet.getRange(row,1,1,ary[0].length).setValues(ary);
};

function getColumnValues(ssId,sheetName,columnNo,startRow,endRow){
  var sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName);
  var start = startRow;
  var end = endRow + 1;
  var ary = [];
  if(!startRow){start = 1};
  if(!endRow){end = sheet.getLastRow() +1;};
  var val = sheet.getRange(start,columnNo,end-start,1).getValues();
  for (var i = 0; i < val.length; i++){
    ary.push(val[i][0]);
  };
  return ary;
}

function SuzunariForm (name,libraryNo,count,layout,pages){

  suzunari.SuperSuzunari.call(this,name,libraryNo,count);
  
  this.defaultForm = function(setting,target,pages,pageNo) {
    var prop = {        
      libraryName : this.libraryName,
      libraryNo   : this.libraryNo,
      target      : target,
      pageNo      : pageNo,
      formSubmit  : this.formSubmitButton(setting,target,pages,pageNo),
      formCansel  : this.formCanselButton(setting,target,pages),
      formContent : this.formContent(setting,target),
      libraryPage : this.listPageNo(pages.defaultForm[target])
      }
//      this.ifAny('defaultFrom'+ target + this.libraryNo,target,this.liblaryTemplateFromFile('defaultForm',prop));
 //     this.addPage(target,pageNo,this.liblaryTemplateFromFile('defaultForm',prop));
//      this.ifAny('defaultFroma'+ target + this.libraryNo,'javascript',"function submitForm(ret){ alert(ret)};");
    return this.liblaryTemplateFromFile('defaultForm',prop);
  }
  
  this.formSubmitButton = function(setting,target,pages,pageNo){
    var buttonID = this.libraryName + this.libraryNo + target +'-';
    var btn = "";
    var script = ""
    btn += '<button type="submit" class="btn-success btn-lg navbar-btn btn-' + this.libraryName + this.libraryNo + '-' + pageNo + '" value="Exec"';
    btn += 'onclick="pageCanger(' + 0 + ')">';
    btn += '<span class="glyphicon glyphicon-ok-circle"></span><b>OK</b>';
    btn += '</button>';
//    btn += '<a>' + JSON.stringify(setting.form) + '</a>'
    script += '$(".btn-' + this.libraryName + this.libraryNo + '-' + pageNo +'").on("click",function(){';
    script += 'google.script.run.withSuccessHandler(submitForm).requestLibrary(castRequest($("#defaultForm-' + target + '-' + this.libraryNo + '-' + pageNo + '").serializeObject(),3))';
    script += '});';
    this.ifAny('SubmitButton'+ target + this.libraryNo,'jqueryIni',script);
  return btn;
  }
  
  this.formCanselButton = function(setting,target,pages){
    var cbtn = "";
    cbtn += '<button type="button" class="btn-info btn-lg navbar-btn" value="Exec" onclick="pageCanger(0);">';
    cbtn += '<span class="glyphicon glyphicon-ban-circle"></span><b>Cansel</b>';
    cbtn += '</button>';
    return cbtn;
  }
  
  this.formContent = function (setting,target){
  
 //   var form = '<div class="row"><div class="w-size col-sm-6"><div class="form-group">';
    var form = "";
 //   form += '<div class="container">';
    form += this.searchParts(setting.parts,"widgets",setting,'form');
 //   form += '</div>';
    return form;
  }
  
  this.addLabel = function (hid,title,comment) {
  if(!hid) {hid = ""};
  if(!title){title = ""};
  if(!comment){comment = ""};
  return '<div class="row form-label" type="' + hid + '"><label class="control-label">' + title + '</label><p>' + comment + '</p></div>';
  }
  
  this.castElement = function(parts){
    var element = ""
    for(var key in parts){
      if(key !== 'widgets' && key !== 'tag' && key !== 'title' && key !== 'comment' && key !== 'data') {
        element += " " + key + '="' + parts[key] + '"';
      }
     }
    return element;
  }
  
  this.rowId = function (parts,partsNo,setting,target){
    return this.input(parts,partsNo,setting,target);
  }
  
  this.datepicker = function (parts,partsNo,setting,target){
    var part = ""
//    part += '<div class="row"><div class="row w-size"><div class="form-group">';
    part += this.addLabel(parts.type,parts.title,parts.comment);
    part += '<div class=\'input-group date\' id="' + parts.id + 'picker">'
    part += '<input' + this.castElement(parts) + '/>';
    part += '<span class="input-group-addon">';
    part += '<span class="glyphicon glyphicon-calendar"></span>';
    part += '</span>';
    part += '</div>'
  //  part += '</div></div></div>';
    var picker =  "";
    picker += '$("#' + parts.id + '").datetimepicker({locale:"ja",format:"LL",inline:true,sideBySide:true});';
    picker += '$("#' + parts.id + '").val("");';
    this.ifAny('piccker' + parts.id,'jqueryIni',picker);
    return part;    
  }

  this.combobox = function (parts,partsNo,setting,target){
    var combo = ""
    var li = parts.data;
    li = li.split(",")
  //  combo += '<div class="row"><div class="row w-size"><div class="form-group">';
    combo += this.addLabel(parts.type,parts.title,parts.comment);
      combo += '<div class="dropdown">'
      combo += '<input' + this.castElement(parts) + ' data-toggle="dropdown" />';
      combo += '<ul id="' + parts.id + '_ul" class="dropdown-menu col-xs-12">';
      for (var i = 0; i < li.length; i++){
        combo += '<li ><a class="dropDownListItem" href="javascript:;" data-target-name="' + parts.id +'" data-target-val="'
        combo += li[i] + '" style="white-space: normal;">' + li[i] + '</a></li>';
      };
      combo += '</ul>'
      combo += '</div>';
  //  combo += '</div></div></div>';
    var jvs = "";
    jvs += '$(".dropDownListItem").click(function(e) {';
    jvs += 'var name = e.currentTarget;';
    jvs += '$("#" + name.getAttribute("data-target-name")).val(name.getAttribute("data-target-val")); ';
    jvs += '});';
    this.ifAny('combo','jqueryIni',jvs);


    return combo; //JSON.stringify(setting.parts[partsNo].data);    
  }
  
  this.autocomp = function (parts,partsNo,setting,target){
    var li = parts.data;
    li = li.split(",")
    var jvs = '$("#' + parts.id + '").typeahead({source:' + JSON.stringify(li) + '});';
    this.ifAny('autocomp'+ parts.id,'jqueryIni',jvs);
    return this.input(parts,partsNo,setting,target);
  }

  this.select = function (parts,partsNo,setting,target){
    var li = parts.data;
    li = li.split(",")
    var select = "";
    select += this.addLabel(parts.type,parts.title,parts.comment);
    select += '<select' + this.castElement(parts) + '>';
      for (var i = 0; i < li.length; i++){
       select += '<option value="' + li[i] +'" style="white-space: normal;">' + li[i] + '</option>';
      };
   select += '</select>'
    return select;    
  }

 this.input = function (parts,partsNo,setting,target){
   var input = "";
   input += this.addLabel(parts.type,parts.title,parts.comment);
   input += '<input' + this.castElement(parts) + '/>';
    return input;    
  }

  this.textarea = function (parts,partsNo,setting,target){
   var texta = "";
   texta += this.addLabel(parts.type,parts.title,parts.comment);
   texta += '<textarea' + this.castElement(parts) + 'rows="5"></textarea>';
    return texta;    
  }
  this.timeStamp = function (parts,partsNo,setting,target){
    return "";
  }
  this.userId = function (parts,partsNo,setting,target){
    return "";
  }
  this.userEmail = function (parts,partsNo,setting,target){
    return "";
  }
}

  SuzunariForm.prototype = Object.create(suzunari.SuperSuzunari.prototype, {value: {constructor: SuzunariForm}});

function libraryOutputFromFile(name) {
   return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function libraryTemplateFromFile(name) {
  return HtmlService.createTemplateFromFile(name);
}
