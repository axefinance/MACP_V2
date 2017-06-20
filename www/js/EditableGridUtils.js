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

function PutExistingFeesRowsInObjectToSend(feesGridId) 
{
     if(EditableGridObjectToSend===undefined);
    EditableGridObjectToSend={};
    if(EditableGridObjectToSend[feesGridId]===undefined)
          EditableGridObjectToSend[feesGridId]=[];
     var table=$("#"+feesGridId).find(".tasksTableTD.tasksTableElement:not(.displayNone)");
     if(EditableGridObjectToSend[feesGridId]===undefined)
       EditableGridObjectToSend[feesGridId]=[];
    var existingGridDataRows=$("#"+feesGridId+" ul tr");
    for(var i=0; i<existingGridDataRows.length;i++)
        {
            var arr=[];
            console.log(existingGridDataRows[i]);
            for(var j=0 ; j<existingGridDataRows[i].children.length ; j++)
                {
                    var value=existingGridDataRows[i].children[j].innerText;
                    arr.push(value);
                }
            EditableGridObjectToSend[feesGridId].push(arr);
            EditableGridObject[feesGridId].push(arr);
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
      if(EditableGridObjectToSend[clickedEditableGridId]===undefined)
          EditableGridObjectToSend[clickedEditableGridId]=[];
          EditableGridObjectToSend[clickedEditableGridId].push(arr);
          myApp.closeModal(); 
        var line="<li id='"+count+"__"+clickedEditableGridId+"' class='swipeout' style='background-color:#fff;border-radius: 15px !important;'><div class='swipeout-content item-content noPadding-left'><div class='item-inner gridRow'><div><table><tr>";
        for(var i=0 ; i<arr.length ;i++)
        {
            line=line+" <td style= 'font-size:small !important;width:"+ (window.innerWidth/clickedEditableGridColumnsCount)+"px !important; min-width:139px !important; overflow-wrap: break-word !important; padding-left:5px !important;' >"+arr[i]+"</td>";
        }
        line=line+ "</tr></table></div></div></div><div class='swipeout-actions-right'><a href='#'     data-popup='.demo-popup' class='action1 bg-orange editButton' onclick='EditEditableGridRow("+(count)+",\""+clickedEditableGridId+"\",\""+clickEditableGridSourceTag+"\");'></a><a href='#' data-popup='.demo-popup' class='action1 bg-red deleteButton' onclick='deleteEditableGridRow(\""+count+"__"+clickedEditableGridId+"\",\""+clickedEditableGridId+"\");'></a></div></li>";
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



function deleteEditableGridRow(rowId,gridId)
{ 
  var existingGridDataRows=$("#"+gridId+" ul li");
    for(var i=0; i<existingGridDataRows.length;i++)
        {
            if($(existingGridDataRows[i]).attr("id")===rowId){
                $("#"+rowId).remove();
            }
        }
}
