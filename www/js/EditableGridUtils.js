var clickedEditableGridId;
var clickEditableGridSourceTag;
var clickedEditableGridColumnsCount=columnsCount;
var rowToEditIndex=-1;
var rowIdToEdit="";
var EditableGridObject={};
var EditableGridObjectToSend={};
var SaveAction="";
var RowNumberToEdit;
function loadEditableGridOnPopon_popon(gridId,columnsCount,sourcetag,stringifyData){
    clickedEditableGridId=gridId;
    clickEditableGridSourceTag=sourcetag;
    clickedEditableGridColumnsCount=columnsCount;
    GetEditableGridPoponContent(sourcetag,"",stringifyData);
    SaveAction="new";
    console.log(SaveAction);
}


function putExistingRowsInObject(formId)
{
    console.log(EditableGridObject);
     var grids=$(formId).find("div.editableGridOnPopon");
    var myObject = {};
    for (i = 0; i < grids.length; i++) 
    { 
       var obj={};
       var id=$(grids[i]).attr("id");
     //EditableGridObject[id]=  GetGridDataFromHtml(id);
       obj[id]=  GetGridDataFromHtml(id);
    }
    
}

function GetGridDataFromHtml(gridId)
{
   var arrays=[];
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
            arrays.push(arr);
        }
    return arrays   
}


 
function GetEditableGridPoponContent(sourcetag,spname,stringifyData){
     SaveAction="edit";
    console.log(SaveAction);
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

function GetObjectFromFormToData(formData)
{
       var  obj={}; 
    
    for(var propertyName in formData) {
        var property=propertyName.split('__')[2];
        obj[property]=formData[propertyName];
    }
    return obj;
     
}
function saveInGridOnPopon(){
 var isValidForm = requiredFormComponent("#my-editableGridPopon-form"); 
if (isValidForm)
{
    if(SaveAction==="new")
    {
    if(EditableGridObjectToSend===undefined)
        EditableGridObjectToSend={};
    var existingGridData=$("#"+clickedEditableGridId+" ul").html();
        if(existingGridData===undefined)
            existingGridData="";
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
 var dataToSave= GetObjectFromFormToData(formData); 
    var arr = [];
    var content="";
          myApp.closeModal(); 
        var line="<li id='"+count+"_"+clickedEditableGridId+"' class='swipeout' style='background-color:#fff;border-radius: 15px !important;'><div class='swipeout-content item-content noPadding-left'><div class='item-inner gridRow'><div><table><tr>";
        var table=$('#'+clickedEditableGridId+"_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
        var padding=3;
        for(var i=0 ; i<table.length ;i++)
        {
            var entity=  table[i].getAttribute("name");
            line=line+" <td name="+entity+" style= 'font-size:small !important;max-width:"+ ((window.innerWidth/clickedEditableGridColumnsCount)-padding)+"px !important; min-width:125px !important; overflow-wrap: break-word !important; padding-left:5px !important;' >"+dataToSave[entity]+"</td>";
            padding=padding+2;
        }
        line=line+ "</tr></table></div></div></div><div class='swipeout-actions-right'><a href='#'     data-popup='.demo-popup' class='action1 bg-orange editButton' onclick='EditEditableGridRow("+(count)+",\""+clickedEditableGridId+"\",\""+clickEditableGridSourceTag+"\");'></a><a href='#' data-popup='.demo-popup' class='action1 bg-red deleteButton' onclick='deleteEditableGridRow(\""+count+"__"+clickedEditableGridId+"\",\""+clickedEditableGridId+"\");'></a></div></li>";
        content=content+line;
 
    $("#"+clickedEditableGridId+" ul").html(content+existingGridData);
    rowToEditIndex=-1;
    console.log(EditableGridObject[clickedEditableGridId]);
    }
    else
    {
    var formData = myApp.formToData('#my-editableGridPopon-form');
     var dataToSave= GetObjectFromFormToData(formData);    
    var content="";
        var line="";
        //var line="<li id='"+count+"__"+clickedEditableGridId+"' class='swipeout' style='background-color:#fff;border-radius: 15px !important;'><div class='swipeout-content item-content noPadding-left'><div class='item-inner gridRow'><div><table><tr>";
        var table=$('#'+clickedEditableGridId+"_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
        var padding=3;
        for(var i=0 ; i<table.length ;i++)
        {
           var entity=  table[i].getAttribute("name");
            line=line+" <td name="+entity+" style= 'font-size:small !important; max-width:"+ ((window.innerWidth/clickedEditableGridColumnsCount)-padding)+"px !important; min-width:125px !important; overflow-wrap: break-word !important; padding-left:5px !important;' >"+dataToSave[entity]+"</td>";
            padding=padding+2;
        }
        // line=line+ "</tr></table></div></div></div><div class='swipeout-actions-right'><a href='#'     data-popup='.demo-popup' class='action1 bg-orange editButton' onclick='EditEditableGridRow("+(count)+",\""+clickedEditableGridId+"\",\""+clickEditableGridSourceTag+"\");'></a><a href='#' data-popup='.demo-popup' class='action1 bg-red deleteButton' onclick='deleteEditableGridRow(\""+RowNumberToEdit+"__"+clickedEditableGridId+"\",\""+clickedEditableGridId+"\");'></a></div></li>";  
        var existingGridDataRows=$("#"+clickedEditableGridId+" ul li");
        for(var i=0; i<existingGridDataRows.length;i++)
        {
            if(existingGridDataRows[i].getAttribute("id")===rowIdToEdit)
               $("#"+rowIdToEdit+" tr").html(line);
            }
        
        myApp.closeModal(); 
    }
}  
}

function EditEditableGridRow(rowNumber,selectedGridId,gridSourceTag){
    clickedEditableGridId=selectedGridId;
    rowIdToEdit=rowNumber+"_"+selectedGridId;
    rowObject=GetEditableGridRowObject(rowNumber,selectedGridId,gridSourceTag);
    var object={};
    var arr=[];
    arr.push(rowObject);
    object[selectedGridId]=arr;
    var strigifyRecord=JSON.stringify(object);
    GetEditableGridPoponContent(gridSourceTag,selectedGridId,strigifyRecord,rowNumber);
}
 

function GetEditableGridRowObject(rowNumber,gridId,selectedGrid)
{
    var obj={};
    var table=$("#"+gridId+"_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
    var existingGridDataRows=$("#"+rowNumber+"_"+gridId+" td");
    
            var arr=[];
            console.log(existingGridDataRows[i]);
            for(var j=0 ; j<table.length ; j++)
                {
                     var entity=  table[j].getAttribute("name");
                    var value;
                    for(var i=0 ; i<existingGridDataRows.length;i++)
                        {
                            if(existingGridDataRows[i].getAttribute("name")===entity)
                                value=existingGridDataRows[i].innerText;
                        }
                 
                    obj[entity]=value;
                }  
    return obj; 
}

function GetGridData(gridId){
    
   
    var table=$('#'+gridId+"_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
     var arr=[];
    var gridRows=$('#'+gridId+" li");
    for(var i=0 ;i<gridRows.length;i++)
        {
             var myObject = {};
            rowId=gridRows[i].getAttribute("id");
             var existingGridDataRow=$("#"+rowId+" td");
            for(var j=0 ; j<table.length ; j++)
                {
                     var entity=  table[j].getAttribute("name");
                    var value;
                    for(var k=0 ; k<existingGridDataRow.length;k++)
                        {
                            if(existingGridDataRow[k].getAttribute("name")===entity)
                                value=existingGridDataRow[k].innerText;
                        }
                    myObject[entity]=value;
                }
            arr.push(myObject);
        }
    return arr;
    
}


function deleteEditableGridRow(rowNumber,selectedGridId,gridSourceTag)
{ 
  var existingGridDataRows=$("#"+selectedGridId+" ul li");
    for(var i=0; i<existingGridDataRows.length;i++)
        {
            if($(existingGridDataRows[i]).attr("id")===rowNumber+"_"+selectedGridId){
                $("#"+rowNumber+"_"+selectedGridId).remove();
            }
        }
}
