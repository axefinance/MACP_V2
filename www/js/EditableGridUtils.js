var clickedEditableGridId;
var clickEditableGridSourceTag;
var clickedEditableGridColumnsCount=columnsCount;
var rowToEditIndex=-1;
var EditableGridObject={};
var EditableGridObjectToSend={};
function loadEditableGridOnPopon_popon(gridId,columnsCount,sourcetag,stringifyData){
    clickedEditableGridId=gridId;
    clickEditableGridSourceTag=sourcetag;
    clickedEditableGridColumnsCount=columnsCount;
    GetEditableGridPoponContent(sourcetag,"",stringifyData);
}

function PutExistingFeesRowsInObjectToSend()
{
     if(EditableGridObjectToSend===undefined);
    EditableGridObjectToSend={};
    if(EditableGridObjectToSend["_editableGrid__consumerloan_condition__SPGetTransactionConditionFees"]===undefined)
          EditableGridObjectToSend["_editableGrid__consumerloan_condition__SPGetTransactionConditionFees"]=[];
     var table=$("#_editableGrid__consumerloan_condition__SPGetTransactionConditionFees_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
     if(EditableGridObjectToSend["_editableGrid__consumerloan_condition__SPGetTransactionConditionFees"]===undefined)
       EditableGridObjectToSend["_editableGrid__consumerloan_condition__SPGetTransactionConditionFees"]=[];
    var existingGridDataRows=$("#_editableGrid__consumerloan_condition__SPGetTransactionConditionFees ul tr");
    for(var i=0; i<existingGridDataRows.length;i++)
        {
            var arr=[];
            console.log(existingGridDataRows[i]);
            for(var j=0 ; j<existingGridDataRows[i].children.length ; j++)
                {
                    var value=existingGridDataRows[i].children[j].innerText;
                    arr.push(value);
                }
            EditableGridObjectToSend["_editableGrid__consumerloan_condition__SPGetTransactionConditionFees"].push(arr);
            EditableGridObject["_editableGrid__consumerloan_condition__SPGetTransactionConditionFees"].push(arr);
        }
}



function putExistingRowsInObject(formId)
{
    console.log(EditableGridObject);
     var grids=$(formId).find("div.editableGridOnPopon");
    var myObject = {};
    for (i = 0; i < grids.length; i++) 
    { 
       var id=$(grids[i]).attr("id");
       myObject[id] = GetGridDataFromHtml(id);
       EditableGridObject[id].push(myObject); 
    } 
}

function GetGridDataFromHtml(gridId)
{
    if(EditableGridObject===undefined)
             EditableGridObject={};
    if(EditableGridObject[gridId]===undefined)
          EditableGridObject[gridId]=[];
    var table=$("#"+gridId).find(".tasksTableTD.tasksTableElement:not(.displayNone)");
    var existingGridDataRows=$("#"+gridId+" ul tr");
    for(var i=0; i<existingGridDataRows.length;i++)
        {
            var arr=[];
            console.log(existingGridDataRows[i]);
            for(var j=0 ; j<existingGridDataRows[i].children.length ; j++)
                {
                    var value=existingGridDataRows[i].children[j].innerText;
                    arr.push(value);
                }
            EditableGridObject[gridId].push(arr);
        }
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
    if(EditableGridObjectToSend===undefined)
        EditableGridObjectToSend={};
    var existingGridData=$("#"+clickedEditableGridId+" ul").html();
    var count = $("#"+clickedEditableGridId+" ul").children().length;
    console.log(existingGridData);
    if(rowToEditIndex!==-1)
        {

             if(EditableGridObject[clickedEditableGridId]===undefined)
              EditableGridObject[clickedEditableGridId]=[];
              EditableGridObject[clickedEditableGridId].splice(rowToEditIndex, 1);
            if(EditableGridObjectToSend[clickedEditableGridId]===undefined)
              EditableGridObjectToSend[clickedEditableGridId]=[];
              EditableGridObjectToSend[clickedEditableGridId].splice(rowToEditIndex, 1);
        }
var formData = myApp.formToData('#my-editableGridPopon-form');

    
    var arr = [];
    var content="";
    for(var x in formData){
        arr.push(formData[x]);  
    }
      if(EditableGridObject[clickedEditableGridId]===undefined)
          EditableGridObject[clickedEditableGridId]=[];
          EditableGridObject[clickedEditableGridId].push(arr);
      if(EditableGridObject[clickedEditableGridId]===undefined)
          EditableGridObjectToSend[clickedEditableGridId]=[];
          EditableGridObjectToSend[clickedEditableGridId].push(arr);
          myApp.closeModal(); 
        var line="<li class='swipeout' style='background-color:#fff;border-radius: 15px !important;'><div class='swipeout-content item-content noPadding-left'><div class='item-inner gridRow'><div><table><tr>";
        for(var i=0 ; i<arr.length ;i++)
        {
            line=line+" <td style= 'font-size:small !important;width:"+ (window.innerWidth/clickedEditableGridColumnsCount)+"px !important; min-width:139px !important; overflow-wrap: break-word !important; padding-left:5px !important;' >"+arr[i]+"</td>";
        }
        line=line+ "</tr></table></div></div></div><div class='swipeout-actions-right'><a href='#'     data-popup='.demo-popup' class='action1 bg-orange editButton' onclick='EditEditableGridRow("+(count)+",\""+clickedEditableGridId+"\",\""+clickEditableGridSourceTag+"\");'></a><a href='#' data-popup='.demo-popup' class='action1 bg-red deleteButton' onclick='deleteEditableGridRow("+(count+1)+");'></a></div></li>";
        content=content+line;
 
    $("#"+clickedEditableGridId+" ul").html(content+existingGridData);
    rowToEditIndex=-1;
    console.log(EditableGridObject[clickedEditableGridId]);
}
    
    
}


function EditEditableGridRow(rowNumber,selectedGridId,gridSourceTag){
  rowToEditIndex=rowNumber;
  console.log(EditableGridObject);
  var table=$('#'+selectedGridId+"_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
     var obj = {};
     var arr=[];
     for(var j=0; j<EditableGridObject[selectedGridId][rowNumber].length;j++)
      {
          if(table[j]!=undefined)
             {
            var entity=  table[j].getAttribute("name");
            console.log(entity);
            obj[entity] = EditableGridObject[selectedGridId][rowNumber][j];
             }
      }
     arr.push(obj); 
     var row={};
    row[selectedGridId] = arr;
   var strigifyRecord=JSON.stringify(row);
    GetEditableGridPoponContent(gridSourceTag,"",strigifyRecord);
}

function GetGridData(gridId){
    
    var myObject = {};
    var table=$('#'+gridId+"_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
     var arr=[];
    if(EditableGridObjectToSend[gridId]===undefined)
          EditableGridObjectToSend[gridId]=[];
    for(var i=0;i<EditableGridObjectToSend[gridId].length;i++)
        {
           
            var obj = {};
            for(var j=0; j<EditableGridObjectToSend[clickedEditableGridId][i].length;j++)
                {
                    if(table[j]!=undefined)
                        {
                    var entity=  table[j].getAttribute("name");
                    obj[entity] = EditableGridObjectToSend[gridId][i][j];
                        }     
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
        line=line+ "</tr></table></div></div></div><div class='swipeout-actions-right'><a href='#'     data-popup='.demo-popup' class='action1 bg-orange editButton' onclick='EditEditableGridRow("+j+","+clickedEditableGridId+");'></a><a href='#' data-popup='.demo-popup' class='action1 bg-red deleteButton' onclick='deleteEditableGridRow("+j+");'></a></div></li>";
        content=content+line;
    }
    document.getElementById(clickedEditableGridId).innerHTML=content;    
}
}
