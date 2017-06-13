var clickedEditableGridId;
var clickEditableGridSourceTag;
var clickedEditableGridColumnsCount=columnsCount;
var rowToEditIndex=-1;
var EditableGridObject;

function loadEditableGridOnPopon_popon(gridId,columnsCount,sourcetag,stringifyData){
    clickedEditableGridId=gridId;
    clickEditableGridSourceTag=sourcetag;
    clickedEditableGridColumnsCount=columnsCount;
    GetEditableGridPoponContent(sourcetag,"",stringifyData);
}

function GetEditableGridPoponContent(sourcetag,spname,stringifyData){
    var screenName=divId;
      var data = "{" +
            "\"sourcetag\":\"" + sourcetag + "\"," +
            "\"spname\":\"" + spname + "\"," +
            "\"screenName\":\"" + screenName + "\"," + 
            "\"stringifyData\":" + stringifyData +"," +   
            "\"userData\":"+sessionStorage.getItem("userData")+"}";
        myApp.showPreloader();
        var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/GetEditableGridPoponContent';
        $.ajax({  
            type: 'POST',
            url: url,
            contentType: "text/plain",
            dataType: "json",
            data: data, 
            success: function (data) { 
                createPopup(data.content,data.toolbar,"10%","10%","80%","80%");
               //    myApp.popup('<div class="popup  macp-popup" style="width: 80% !important; height: 80% !important; top: 10% !important;left: 10% !important; background : #f1f1f1 !important;"><div class="popup-container">'+data.content+'</div><div  class="popup-toolbar">'+data.toolbar+'</div></div>', true);
                   myApp.hidePreloader();
            },
            error: function (e) {
                console.log(e.message);
                verifconnexion = false;
                myApp.hidePreloader();
                myApp.alert("error occured"); 
            }
        }); 
} 
function saveInGridOnPopon(){
 var isValidForm = requiredFormComponent("#my-editableGridPopon-form"); 
if (isValidForm)
  {
    if(rowToEditIndex!==-1)
        {

             if(EditableGridObject[clickedEditableGridId]===undefined)
              EditableGridObject[clickedEditableGridId]=[];
              EditableGridObject[clickedEditableGridId].splice(rowToEditIndex, 1);
        }
var formData = myApp.formToData('#my-editableGridPopon-form');

    
    var arr = [];
    var content="<div class='list-block tasksTableElement animated fadeIn ' style='max-width:100% !important; margin-top :-0.02cm !important;background-color:#ff7f7f;-webkit-box-shadow: -2px 9px 43px -5px rgba(0,0,0,0.26);-moz-box-shadow: -2px 9px 43px    -5px rgba(0,0,0,0.26);box-shadow: -1px 9px 43px -5px rgba(0,0,0,0.26); overflow-y: auto !important;    overflow-x: none !important; max-height:614px !important; '><ul style='padding-left: 0px !important;border-radius: 15px !important;'>";
    for(var x in formData){
        arr.push(formData[x]);  
    }
      if(EditableGridObject[clickedEditableGridId]===undefined)
          EditableGridObject[clickedEditableGridId]=[];
          EditableGridObject[clickedEditableGridId].push(arr);
           myApp.closeModal();

    for(var j=0 ; j<EditableGridObject[[clickedEditableGridId]].length ;j++)

        {       
        var line="<li class='swipeout' style='background-color:#fff;border-radius: 15px !important;'><div class='swipeout-content item-content noPadding-left'><div class='item-inner gridRow'><div><table><tr>";
        for(var i=0 ; i<arr.length ;i++)
        {
            line=line+" <td    style= 'font-size:small !important;width:"+ (window.innerWidth/clickedEditableGridColumnsCount)+"px !important; min-width:139px !important; overflow-wrap: break-word !important; padding-left:5px !important;' >"+EditableGridObject[clickedEditableGridId][j][i]+"</td>";
        }
        line=line+ "</tr></table></div></div></div><div class='swipeout-actions-right'><a href='#'     data-popup='.demo-popup' class='action1 bg-orange editButton' onclick='EditEditableGridRow("+j+");'></a><a href='#' data-popup='.demo-popup' class='action1 bg-red deleteButton' onclick='deleteEditableGridRow("+j+");'></a></div></li>";
        content=content+line;
        }
    console.log(content);
    document.getElementById(clickedEditableGridId).innerHTML=content;
    rowToEditIndex=-1;
}
}
function EditEditableGridRow(rowNumber){
  rowToEditIndex=rowNumber;
  var table=$('#'+clickedEditableGridId+"_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
     var obj = {};
     var arr=[];
     for(var j=0; j<EditableGridObject[clickedEditableGridId][rowNumber].length;j++)
      {
            var entity=  table[j].getAttribute("name");
            console.log(entity);
            obj[entity] = EditableGridObject[clickedEditableGridId][rowNumber][j];
      }
     arr.push(obj); 
     var row={};
    row[clickedEditableGridId] = arr;
   var strigifyRecord=JSON.stringify(row);
    GetEditableGridPoponContent(clickEditableGridSourceTag,"",strigifyRecord);
}
function GetGridData(gridId){
    var myObject = {};
    var table=$('#'+gridId).find(".tasksTableTD.tasksTableElement:not(.displayNone)");
    console.log(table); 
     var arr=[];
    for(var i=0;i<EditableGridObject[clickedEditableGridId].length;i++)
        {
           
            var obj = {};
            for(var j=0; j<EditableGridObject[clickedEditableGridId][i].length;j++)
                {
                    var entity=  table[j].getAttribute("name");
                    console.log(entity);
                    obj[entity] = EditableGridObject[clickedEditableGridId][i][j];
                    console.log(obj);
                    
                }
              arr.push(obj); 
        
        }
   return arr;
}
function deleteEditableGridRow(rowNumber){
    if (rowNumber > -1) {
    EditableGridObject[clickedEditableGridId].splice(rowNumber, 1);
    var content="<div class='list-block tasksTableElement animated fadeIn ' style='max-width:100% !important; margin-top :-0.02cm !important;background-color:#ff7f7f;-webkit-box-shadow: -2px 9px 43px -5px rgba(0,0,0,0.26);-moz-box-shadow: -2px 9px 43px    -5px rgba(0,0,0,0.26);box-shadow: -1px 9px 43px -5px rgba(0,0,0,0.26); overflow-y: auto !important;    overflow-x: none !important; max-height:614px !important; '><ul style='padding-left: 0px !important;border-radius: 15px !important;'>";    
    for(var j=0 ; j<EditableGridObject[clickedEditableGridId].length ;j++)
    {
        
        var line="<li class='swipeout'><div class='swipeout-content item-content noPadding-left'><div class='item-inner gridRow'><div><table><tr>";
        for(var i=0 ; i<EditableGridObject[clickedEditableGridId][j].length ;i++)
        {
            line=line+" <td    style= 'font-size:small !important;width:"+ (window.innerWidth/clickedEditableGridColumnsCount)+"px !important; min-width:139px !important; overflow-wrap: break-word !important; padding-left:5px !important;' >"+EditableGridObject[clickedEditableGridId][j][i]+"</td>";
        }
        line=line+ "</tr></table></div></div></div><div class='swipeout-actions-right'><a href='#'     data-popup='.demo-popup' class='action1 bg-orange editButton' onclick='EditEditableGridRow("+j+");'></a><a href='#' data-popup='.demo-popup' class='action1 bg-red deleteButton' onclick='deleteEditableGridRow("+j+");'></a></div></li>";
        content=content+line;
    }
    document.getElementById(clickedEditableGridId).innerHTML=content;    
}
}
