var clickedEditableGridId;
var clickEditableGridSourceTag;
var clickedEditableGridColumnsCount=columnsCount;
var rowToEditIndex=-1;
var rowIdToEdit="";
var SaveAction="";
var RowNumberToEdit;
function loadEditableGridOnPopon_popon(gridId,columnsCount,sourcetag,stringifyData){
    clickedEditableGridId=gridId;
    clickEditableGridSourceTag=sourcetag;
    clickedEditableGridColumnsCount=columnsCount;
    GetEditableGridPoponContent(sourcetag,"",stringifyData);
    SaveAction="new";
}
function GetGridDataFromHtml(gridId)
{
    var arrays=[];
    var table=$("#"+gridId).find(".tasksTableTD.tasksTableElement:not(.displayNone)");
    var existingGridDataRows=$("#"+gridId+" ul tr");
    for(var i=0; i<existingGridDataRows.length;i++)
    {
        var arr=[];
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
    var screenName=divId;
    var data = "{" +
          "\"sourcetag\":\"" + sourcetag + "\"," +
          "\"spname\":\"" + spname + "\"," + 
          "\"mainItemId\":\"" + itemId + "\"," + 
          "\"screenName\":\"" + screenName + "\"," + 
          "\"taskId\":\"" + TaskId + "\"," +
          "\"screenWidth\":\""+window.innerWidth+ "\"," +
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
            
            verifconnexion = false;
            myApp.hidePreloader();
            errorMessage(e.message);
        }
    }); 
} 

function GetObjectFromFormToData(formData)
{
    var  obj={}; 
    for(var propertyName in formData) {
        var type=propertyName.split('__')[0];
        var property=propertyName.split('__')[2];
        var value=formData[propertyName];
        if(type==="j")
        {
            if(value[0]==="on")  
                value="true";
            else
                value="false";
        }
        
        obj[property]=value;
    } 
    return obj; 
     
}

function GenertateRowObject(formId){
    rowObject = {};
    // var listElement=$("#"+formId+" div ul li item-input");
    var listElement=document.getElementById(formId).querySelectorAll(".item-input");
    //var listElement=$(formId).find(".item-input");
    // var textBox=$(formId).find(".textbox input");
    //var comboBox=$(formId).find(".combobox .item-input");
    
    for(var i=0;i<listElement.length ; i++)
    {
        var caseObject={}
        var input=listElement[i].firstElementChild;
        var property=input.getAttribute("id").split('__')[2];
        if(input.localName==="input")
        {
            var display=input.innerText;
            diplay=display.replace("\n","");
            caseObject["type"]="text";
            caseObject["display"]=diplay; 
            rowObject[property]=caseObject;
        }
        else if(input.localName==="select")
        {
            var display=input[input.selectedIndex].text;
            display=display.replace("\n","");
            var value=input.value;
            value=value.replace("\n","");
            caseObject["type"]="combobox";
            caseObject["value"]=value;  
            caseObject["display"]=display;    
            rowObject[property]=caseObject;  
        }
            
  
    }
    return rowObject;
}

function saveInGridOnPopon(){
    var isValidForm = requiredFormComponent("#my-editableGridPopon-form"); 
    if (isValidForm)
    {
        if(SaveAction==="new")
        {
            var existingGridData=$("#"+clickedEditableGridId+" ul").html();
            if(existingGridData===undefined)
                existingGridData="";
            var count = $("#"+clickedEditableGridId+" ul").children().length;
            var formData = myApp.formToData('#my-editableGridPopon-form');
            // var dataToSave= GetObjectFromFormToData(formData); 
            var dataToSave= GenertateRowObject("my-editableGridPopon-form");        
            var arr = [];
            var content="";
            myApp.closeModal(); 
            var line="<li id='"+count+"_"+clickedEditableGridId+"' class='swipeout' style='background-color:#fff;border-radius: 15px !important;'><div class='swipeout-content item-content noPadding-left'><div class='item-inner gridRow'><div><table><tr>";
            var table=$('#'+clickedEditableGridId+"_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
            var padding=1;
            for(var i=0 ; i<table.length ;i++)
            {
                var entity=$(table[i]).attr("name");
                var display="";
                if(dataToSave[entity]!==undefined)
                {
                    display=dataToSave[entity]["display"]; 
                }
                if(dataToSave[entity]!=null || dataToSave[entity]!=undefined)
                {
                    if (dataToSave[entity]["type"]==="text")
                    {
                        var entity=  table[i].getAttribute("name");
                        line=line+" <td name="+entity+" style= 'font-size:small !important;max-width:"+ (((window.innerWidth-30)/clickedEditableGridColumnsCount)-2-padding)+"px !important; min-width:"+ ((window.innerWidth/clickedEditableGridColumnsCount)-2-padding)+"px !important; overflow-wrap: break-word !important; padding-left:5px !important;' >"+display+"</td>";
                        padding=padding+2;
                    }
                    else if (dataToSave[entity]["type"]==="combobox")
                    {
                        var value=dataToSave[entity]["value"];       
                        var entity=  table[i].getAttribute("name");
                        line=line+" <td name="+entity+" style= 'font-size:small !important;max-width:"+ (((window.innerWidth-30)/clickedEditableGridColumnsCount)-2-padding)+"px !important; min-width:"+ ((window.innerWidth/clickedEditableGridColumnsCount)-2-padding)+"px !important; overflow-wrap: break-word !important; padding-left:5px !important;' >"+display+"<div id='"+value+"'</div></td>";
                        padding=padding+2;  
                    }
                }
                else 
                {
                    line=line+" <td name="+entity+" style= 'font-size:small !important;max-width:"+ (((window.innerWidth-30)/clickedEditableGridColumnsCount)-2-padding)+"px !important; min-width:"+ ((window.innerWidth/clickedEditableGridColumnsCount)-2-padding)+"px !important; overflow-wrap: break-word !important; padding-left:5px !important;' ></td>";
                    padding=padding+2;    
                }
            }
            line=line+ "</tr></table></div></div></div><div class='swipeout-actions-right'><a href='#'     data-popup='.demo-popup' class='action1 bg-orange editButton' onclick='EditEditableGridRow("+(count)+",\""+clickedEditableGridId+"\",\""+clickEditableGridSourceTag+"\");'></a><a href='#' data-popup='.demo-popup' class='action1 bg-red deleteButton' onclick='deleteEditableGridRow(\""+count+"\",\""+clickedEditableGridId+"\");'></a></div></li>";
            content=content+line;
 
            $("#"+clickedEditableGridId+" ul").html(content+existingGridData);
            rowToEditIndex=-1;
        }
        else
        {
            var formData = myApp.formToData('#my-editableGridPopon-form');
            // var dataToSave= GetObjectFromFormToData(formData);
            var dataToSave= GenertateRowObject("my-editableGridPopon-form");     
            var content="";
            var line="";
            var table=$('#'+clickedEditableGridId+"_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
            var padding=3;
            for(var i=0 ; i<table.length ;i++)
            {
                var entity=$(table[i]).attr("name");
                var display="";
                if(dataToSave[entity]!==undefined)
                {
                    display=dataToSave[entity]["display"]; 
                }
                if(dataToSave[entity]!=null || dataToSave[entity]!=undefined)
                {
                    if (dataToSave[entity]["type"]==="text")
                    {
                        var entity=  table[i].getAttribute("name");
                        line=line+" <td name="+entity+" style= 'font-size:small !important;max-width:"+ ((window.innerWidth/clickedEditableGridColumnsCount)-2-padding)+"px !important; min-width:"+ ((window.innerWidth/clickedEditableGridColumnsCount)-2-padding)+"px !important; overflow-wrap: break-word !important; padding-left:5px !important;' >"+display+"</td>";
                        padding=padding+2;
                    }
                    else if (dataToSave[entity]["type"]==="combobox")
                    {
                        var value= display=dataToSave[entity]["value"];       
                        var entity=  table[i].getAttribute("name");
                        line=line+" <td name="+entity+" style= 'font-size:small !important;max-width:"+ ((window.innerWidth/clickedEditableGridColumnsCount)-2-padding)+"px !important; min-width:"+ ((window.innerWidth/clickedEditableGridColumnsCount)-2-padding)+"px !important; overflow-wrap: break-word !important; padding-left:5px !important;' >"+display+"<div id='"+value+"'</div></td>";
                        padding=padding+2;  
                    }
                }
                else 
                {
                    line=line+" <td name="+entity+" style= 'font-size:small !important;max-width:"+ ((window.innerWidth/clickedEditableGridColumnsCount)-2-padding)+"px !important; min-width:"+ ((window.innerWidth/clickedEditableGridColumnsCount)-2-padding)+"px !important; overflow-wrap: break-word !important; padding-left:5px !important;' ></td>";
                    padding=padding+2;    
                }
            }
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
    rowObject=GetEditableGridRowObject(selectedGridId,rowIdToEdit,gridSourceTag);
    var object={};
    var arr=[];
    arr.push(rowObject);
    object[selectedGridId]=arr;
    var strigifyRecord=JSON.stringify(object);
    GetEditableGridPoponContent(gridSourceTag,selectedGridId,strigifyRecord,rowNumber);
}
 

function GetEditableGridRowObject(selectedGridId,rowIdToEdit,selectedGrid)
{
    var obj={};
    var table=$("#"+selectedGridId+"_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
    var existingGridDataRows=$("#"+rowIdToEdit+" tr td");
    
    var arr=[];
    for(var j=0 ; j<table.length ; j++)
    {
        var entity=  table[j].getAttribute("name");
        var value;
        for(var i=0 ; i<existingGridDataRows.length;i++)
        {
            if(existingGridDataRows[i].getAttribute("name")===entity)
            {
                if(existingGridDataRows[i].childNodes.length>1)
                {
                    var div= existingGridDataRows[i].getElementsByTagName("div");
                    if(div[0]!=undefined)
                        value=div[0].getAttribute("id");
                }
                else
                    value=existingGridDataRows[i].innerText;
                    value=value.replace("\n","");
            }
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
                 {
                    if(existingGridDataRow[k].childNodes.length>1)
                    {
                    var div= existingGridDataRow[k].getElementsByTagName("div");
                    if(div[0]!=undefined)
                        value=div[0].getAttribute("id");
                       
                    }
                   else
                    value=existingGridDataRow[k].innerText;
                     value=value.replace("\n",""); 
                 }
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
