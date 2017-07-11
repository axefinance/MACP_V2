var PoponComponentItem;
var ComponentId;
var DisplayProperty;

function GetPoponComponentScreenContent()
{
    myApp.showPreloader();
    var url= "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GenerateSearchOnPoponScreen";    
    var data="{"+    
      "\"item\":\""+PoponComponentItem+"\","+
      "\"userData\":"+sessionStorage.getItem("userData")+"}"; 
    console.log("SearchParams",data);        
    $.ajax({              
        type: 'POST',             
        url: url,                                     
        contentType: "text/plain",                            
        dataType: "json",                            
        dataType: "json",                               
        data: data,         
        success: function(data) {  
            document.getElementById("poponComponentForm").innerHTML=data.content;
            myApp.hidePreloader();  
        },
        error: function(e) { 
            myApp.hidePreloader();
        }                
    });  
}

function searchOnPoponButtonEvent()
{
  
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetSearchResultPage';
    myApp.showPreloader();
    lunchSearchResult(url,"searchOnPoponResult",PoponComponentItem);
}  
function poponComponentClick(item,idComponent,displayproperty)
{
    PoponComponentItem=item;
    ComponentId=idComponent;
    DisplayProperty=displayproperty;
     mainView.router.load({url: "poponComponentScreen.html",reload:false});
    /*
    var url= "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GenerateExistingQInputItemPopon";    
    var data="{"+    
      "\"item\":\""+currentItem+"\","+
      "\"userData\":"+sessionStorage.getItem("userData")+","+
      "\"mainItemId\":\"0\","+
      "\"taskId\":\""+TaskId+"\"}"; 
    console.log("SearchParams",data);        
    $.ajax({              
        type: 'POST',             
        url: url,                                     
        contentType: "text/plain",                            
        dataType: "json",                            
        dataType: "json",                               
        data: data,         
        success: function(data) {  
            document.getElementById("existingQuickInputForm").innerHTML=data.content;
            myApp.hidePreloader();  
        },
        error: function(e) { 
            myApp.hidePreloader();
        }                
    });    
    
    
    
    var popupHTML = "<div class='popup' style='width:100% !important; height:100% !important; left:0px !important; top:0px !important; margin-left:0px !important; margin-top:0px !important; margin-right:0px !important; overflow:hidden'><form id='my-search-form' class='list-block inset'><ul class='list-block-padding' style='overflow-y: none !important'><li><div class='item-content row no-gutter'><div class='textbox tablet-50 '><div class='item-inner '><div class='item-title label'>Name</div><div class='item-input'><input class='dataFont' type='text' id='a__counterparty__counterparty_name__c' name='a__counterparty__counterparty_name__c' onchange='handleRequiredIcon(this,'textbox','','','', '');'></div></div></div><div class='textbox tablet-50 '><div class='item-inner '><div class='item-title label'>Customer reference</div><div class='item-input'><input class='dataFont' type='text' id='a__counterparty__counterparty_shortname__c' name='a__counterparty__counterparty_shortname__c' onchange='handleRequiredIcon(this,'textbox', '', '', '', '');'></div></div></div></div></li><li><div class='item-content row no-gutter'><div class='combobox tablet-50 '><div class='item-content' style='padding-left : 0px !important;'><div class='item-inner  '><div class='item-title label'>Agency/DR</div><div class='item-input'></div></div></div></div><div class='combobox tablet-50 '><div class='item-content' style='padding-left : 0px !important;'><div class='item-inner  '><div class='item-title label'>Internal Segment</div><div class='item-input'><select class='dataFont' onchange='generateConnectedComboItems( '', 'searchSme',this, '','Counterparty', '', '')'  id='h__counterparty__internal_segment_id__c' name='h__counterparty__internal_segment_id__c'><option value=''  class='emptyOption'  selected></option><option value='11'>90000</option><option value='1013'>azeazee</option><option value='2'>Credit Direction</option><option value='5'>delete_test</option><option value='4'>Headquarter</option><option value='1'>Litigation Direction 02</option><option value='12'>Nothing Diection</option><option value='3'>Recovery Direction</option><option value='6'>Recovery Direction 01</option><option value='9'>Risk Direction </option><option value='13'>sdqda</option></select></div></div></div></div></div></li></ul></form><p class='buttons-row'><a href='#' class='button button-raised' onclick='launchQIPoponSearch(\""+item+"\")'>Search</a><a href='#' class='button button-raised' onclick='myApp.closeModal()'>Close</a></p><div id='selectOnPopon'></div></div>"; 
    myApp.popup(popupHTML);  
    */
}