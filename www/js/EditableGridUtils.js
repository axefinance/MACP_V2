var clickedEditableGridId;
var clickEditableGridSourceTag;
var clickedEditableGridColumnsCount;
var WithInstantSave;
var ItemIdToEdit;
var rowToEditIndex=-1;
var rowIdToEdit="";
var SaveAction="";
var RowNumberToEdit;
var GridEntity;
var DataToEdit;
function loadEditableGridOnPopon_popon(gridId,columnsCount,gridSourcetag,gridEntity,stringifyData,mainItemId,withInstantSave,screenName){
    clickedEditableGridId=gridId;
    clickEditableGridSourceTag=gridSourcetag;
    clickedEditableGridColumnsCount=columnsCount;
    GetEditableGridPoponContent(gridSourcetag,"",stringifyData,mainItemId,screenName);
    SaveAction="new";
    WithInstantSave=withInstantSave;
    GridEntity=gridEntity;
    ItemIdToEdit="";
}
function GetGridDataFromHtml(gridId){
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
    return arrays;   
}
function GetEditableGridPoponContent(gridSourcetag,spname,stringifyData,mainItemId,screenName){
    SaveAction="edit";
    var data = "{" +
          "\"sourcetag\":\"" + gridSourcetag + "\"," +
          "\"spname\":\"" + spname + "\"," + 
          "\"mainItemId\":\"" + mainItemId + "\"," +  
          "\"screenName\":\"" + screenName + "\"," + 
          "\"taskId\":\"" + gTaskId + "\"," +
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
function GetObjectFromFormToData(formData){
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
            var display=input.value;
            display=display.replace("\n","");
            var align = input.style.textAlign;
            if(align==="right")
            caseObject["type"]="numeric";
            else
            caseObject["type"]="text";
            caseObject["display"]=display; 
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
    var checkBox=$("#"+formId).find("div.checkbox label.label-checkbox");
    for (i = 0; i < checkBox.length; i++)
    {
        var checkboxElement = $(checkBox[i]).find("input");
        var checkboxProperty=checkboxElement.attr("id").split('__')[2];

        var checkboxCaseObject={}

        checkboxCaseObject["type"]="checkbox";
 
            
        if(checkboxElement.is(":checked")===false)
        {
            checkboxCaseObject["value"]="";  
            checkboxCaseObject["display"]="";   
        }else
        {
            checkboxCaseObject["value"]=true   
            checkboxCaseObject["display"]=true;   
        }
        rowObject[checkboxProperty]=checkboxCaseObject; 
    }
 
    return rowObject;
}
function updateGridOnPoponContent(content){
    for(var grid in content["Grids"])
    {
        var gridContent=$("#"+grid).html(content["Grids"][grid]); 
    } 
}
function saveInGridOnPopon(screenName){
    var isValidForm = requiredFormComponent("#my-editableGridPopon-form"); 
    var gridWidth=window.innerWidth-30;
    if (isValidForm)
    {
        
        if(WithInstantSave)
        {
            var formData = myApp.formToData('#my-editableGridPopon-form');
            var newFormData={};
            
            for(var propertyName in formData)
            {
               var property=propertyName.split('__')[2];
               newFormData[property]=formData[propertyName]; 
            }
             newFormData[GridEntity+"_id"]=ItemIdToEdit;
            
            for(var propertyName in DataToEdit)
            {
                if(newFormData[propertyName] ===undefined)
                 {
                      newFormData[propertyName]=DataToEdit[propertyName];  
                 }
            }
             var Data={};
             var arr=[];
             arr.push(newFormData);
             Data[clickedEditableGridId]=arr;
             var gridData=JSON.stringify(Data);
             GridDataInstantSave(gridData,clickedEditableGridId,screenName);
        }
        else
        {         
          if(SaveAction==="new")
          {
            var existingGridData=$("#"+clickedEditableGridId+" ul").html();
            if(existingGridData===undefined)
                existingGridData="";
            var count = $("#"+clickedEditableGridId+" ul").children().length;
            var formData = myApp.formToData('#my-editableGridPopon-form');
            var dataToSave= GenertateRowObject("my-editableGridPopon-form");             
            var arr = [];
            var content="";
            myApp.closeModal(); 
            var line="<li id='"+count+"_"+clickedEditableGridId+"' class='swipeout' style='background-color:#fff;border-radius: 15px !important;'><div class='swipeout-content item-content noPadding-left'><div class='item-inner gridRow'><div style='width : "+window.innerWidth+"px !important'><table style='width : "+window.innerWidth+"px !important'><tr>";
            var table=$('#'+clickedEditableGridId+"_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
            var padding=0;
            for(var i=0 ; i<table.length ;i++)
            {
                var entity=$(table[i]).attr("name");                
                if(dataToSave[entity]!==undefined)
                {
                    display=dataToSave[entity]["display"];                     
                }

                if(dataToSave[entity]!==null && dataToSave[entity]!==undefined && dataToSave[entity]!=="")
                {
                    if (dataToSave[entity]["type"]==="text")
                    {
                        var entity=  table[i].getAttribute("name");
                        line=line+" <td class='note' name="+entity+" style= 'font-size:small !important;max-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-3)+"px !important; min-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-2)+"px !important; overflow-wrap: break-word !important; margin-left:"+padding+"px !important;' >"+display+"</td>";
                      
                    }
                    if (dataToSave[entity]["type"]==="numeric")
                    {
                        var entity=  table[i].getAttribute("name");
                        line=line+" <td class='note' name="+entity+" style= 'font-size:small !important;max-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-3)+"px !important; min-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-2)+"px !important; overflow-wrap: break-word !important; margin-left:"+padding+"px !important; text-align:right;' >"+display+"</td>";
                      
                    }
                    else if (dataToSave[entity]["type"]==="combobox")
                    {    
                        var value=dataToSave[entity]["value"];       
                        var entity=  table[i].getAttribute("name");
                        line=line+" <td class='note' name="+entity+" style= 'font-size:small !important;max-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-3)+"px !important; min-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-2)+"px !important; overflow-wrap: break-word !important; margin-left:"+padding+"px !important;' >"+display+"<div id='"+value+"'</div></td>";
                         
                    }
                    else if (dataToSave[entity]["type"]==="checkbox")
                    {
                        var entity=  table[i].getAttribute("name");
                        line=line+" <td class='note' name="+entity+" style= 'font-size:small !important;max-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-3)+"px !important; min-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-2)+"px !important; overflow-wrap: break-word !important; margin-left:"+padding+"px !important;' >"+display+"</td>";
                       
                    }
                             
                } 
                else 
                {
                    line=line+" <td name="+entity+" style= 'font-size:small !important;max-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-2)+"px !important; min-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-2)+"px !important; overflow-wrap: break-word !important; margin-left:"+padding+"px !important;' ></td>";
                      
                }
                padding=padding+3.5;
            }
            line=line+ "</tr></table></div></div></div><div class='swipeout-actions-right'><a href='#'     data-popup='.demo-popup' class='action1 bg-orange editButton' onclick='EditEditableGridRow("+(count)+",\""+clickedEditableGridId+"\",\""+clickEditableGridSourceTag+"\");'></a><a href='#' data-popup='.demo-popup' class='action1 bg-red deleteButton' onclick='deleteEditableGridRow(\""+count+"\",\""+clickedEditableGridId+"\");'></a></div></li>";
            content=content+line;
 
            $("#"+clickedEditableGridId+" ul").html(content+existingGridData);
            rowToEditIndex=-1;
        }
        else
        {
            var formData = myApp.formToData('#my-editableGridPopon-form');
            var dataToSave= GenertateRowObject("my-editableGridPopon-form");     
            var content="";
            var line="";
            var table=$('#'+clickedEditableGridId+"_header").find(".tasksTableTD.tasksTableElement:not(.displayNone)");
            var padding=0;
            for(var i=0 ; i<table.length ;i++)
            {
                var entity=$(table[i]).attr("name");
                var display="";
                if(dataToSave[entity]!==undefined)
                {
                    display=dataToSave[entity]["display"]; 
                }
                if(dataToSave[entity]!==null && dataToSave[entity]!==undefined && dataToSave[entity]!=="")
                {
                    if (dataToSave[entity]["type"]==="text")
                    {
                        //var entity=  table[i].getAttribute("name");
                        line=line+" <td class='note' name="+entity+" style= 'font-size:small !important;max-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-3)+"px !important; min-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-2)+"px !important; overflow-wrap: break-word !important; margin-left:"+padding+"px !important;' >"+display+"</td>";
                        
                    }
                    if (dataToSave[entity]["type"]==="numeric")
                    {
                       // var entity=  table[i].getAttribute("name");
                        line=line+" <td class='note' name="+entity+" style= 'font-size:small !important;max-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-3)+"px !important; min-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-2)+"px !important; overflow-wrap: break-word !important; margin-left:"+padding+"px !important; text-align:right;' >"+display+"</td>";
                      
                    }
                    else if (dataToSave[entity]["type"]==="combobox")
                    {
                        var value=dataToSave[entity]["value"];       
                        //var entity=  table[i].getAttribute("name");
                        line=line+" <td class='note' name="+entity+" style= 'font-size:small !important;max-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-3)+"px !important; min-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-2)+"px !important; overflow-wrap: break-word !important; margin-left:"+padding+"px !important;' >"+display+"<div id='"+value+"'</div></td>";
                      
                    }
                    else if (dataToSave[entity]["type"]==="checkbox")
                    {
                        //var entity=  table[i].getAttribute("name");
                        line=line+" <td class='note' name="+entity+" style= 'font-size:small !important;max-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-3)+"px !important; min-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-2)+"px !important; overflow-wrap: break-word !important; margin-left:"+padding+"px !important;' >"+display+"</td>";
                    }
                }
                else 
                {
                    line=line+" <td name="+entity+" style= 'font-size:small !important;max-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-2)+"px !important; min-width:"+ ((gridWidth/clickedEditableGridColumnsCount)-2)+"px !important; overflow-wrap: break-word !important; margin-left:"+padding+"px !important;' >"+DataToEdit[entity]+"</td>";
                      
                }
                padding=padding+3.5;
            }
            var existingGridDataRows=$("#"+clickedEditableGridId+" ul li");
            for(var i=0; i<existingGridDataRows.length;i++)
            {
                if(existingGridDataRows[i].getAttribute("id")===rowIdToEdit)
                    {
                    $("#"+rowIdToEdit+" tr").html(line); 
                    }
            }
            
            myApp.closeModal(); 
         }
    }
    }  
}
function EditEditableGridRow(rowNumber,selectedGridId,gridSourceTag,screenName,itemId,gridEntity,columnCount,withInstantsave){
    clickedEditableGridId=selectedGridId;
    rowIdToEdit=rowNumber+"_"+selectedGridId;
    rowObject=GetEditableGridRowObject(selectedGridId,rowIdToEdit,gridSourceTag);
    var object={};
    var arr=[];
    arr.push(rowObject);
    object[selectedGridId]=arr;
    DataToEdit=rowObject;
    var stringify=JSON.stringify(object);
    GetEditableGridPoponContent(gridSourceTag,selectedGridId,stringify,rowNumber,screenName);
    clickedEditableGridColumnsCount=columnCount;
    ItemIdToEdit=itemId;
    GridEntity=gridEntity;
    WithInstantSave=withInstantsave;
}
function GetEditableGridRowObject(selectedGridId,rowIdToEdit,selectedGrid){
    var obj={};
    var table=$("#"+selectedGridId+"_header").find(".tasksTableTD.tasksTableElement");
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
                if(value==="True")
                    value=true;
                else if(value==="False")
                    value=false;
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
function deleteEditableGridRow(rowNumber,selectedGridId,gridSourceTag){ 
    var existingGridDataRows=$("#"+selectedGridId+" ul li");
    for(var i=0; i<existingGridDataRows.length;i++)
    {
        if($(existingGridDataRows[i]).attr("id")===rowNumber+"_"+selectedGridId){
            $("#"+rowNumber+"_"+selectedGridId).remove();
        }
    }
}
function deleteDefinitelyEditableGridRow(rowNumber,selectedGridId,gridSourceTag,screenName,itemId,gridEntity){ 
    var data = "{" +
       "\"screenName\":\"" + screenName + "\"," +
       "\"gridEntity\":\"" + gridEntity + "\"," +
       "\"itemId\":\"" + itemId + "\"," +
       "\"mainItemId\":\"" + gMainItemId + "\"," +
       "\"beforeCheck\":\"false\"," +
       "\"remoteAddress\":\"\"," +
       "\"screenWidth\":\"" + (window.innerWidth-30) + "\"," +
       "\"userData\":"+sessionStorage.getItem("userData")+","+
       "\"spName\":\"\"," +
       "\"groupingSetShortname\":\"\"," +
       "\"mcData\":\"\"}";
        myApp.showPreloader();
        $.ajax({
            type: "POST",
            url: "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/DeleteItem",
            contentType: "text/plain",
            dataType: "json",
            data: data,
            success: function (data) {
                myApp.hidePreloader();
                myApp.alert(data.status,"MACP", function () {
                      $("#"+selectedGridId).html(data.grid); 
                }); 
            },
            error: function (e) { 
                myApp.hidePreloader();            
                errorMessage(e.message);   
            }
        });
}
function GridDataInstantSave(rowData,gridId,screenName){
    var data = "{" +
          "\"data\":" + rowData + "," + 
          "\"gridEntity\":\"" + GridEntity + "\"," +
          "\"mainItemId\":\"" + gMainItemId + "\"," +  
          "\"screenName\":\"" + screenName + "\"," +    
          "\"counterpartyId\":\"" + gQICounterpartyId + "\"," + 
          "\"transactionConditionId\":\"" + gTransactionConditionId + "\"," +
          "\"creditFileId\":\"" + gQICreditFIldId + "\"," +
          "\"ipAddress\":\"" + sessionStorage.getItem('Ip_config') + "\"," +
          "\"screenWidth\":\"" + (window.innerWidth-30) + "\"," +
          "\"userData\":"+sessionStorage.getItem("userData")+"}";
          myApp.showPreloader();
    var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/GridDataInstantSave'; 
    $.ajax({  
        type: 'POST', 
        url: url,
        contentType: "text/plain",
        dataType: "json",
        data: data, 
        success: function (data) {
            if(data.status==="ok")
                {
                    myApp.hidePreloader();
                     myApp.closeModal();
                     $("#"+clickedEditableGridId).html(data.grid); 
                     
                }
            else
                {
                    errorMessage(e.message);  
                }
        },
        error: function (e) {
            verifconnexion = false;
            myApp.hidePreloader();
            errorMessage(e.message);
        }
    }); 
}


