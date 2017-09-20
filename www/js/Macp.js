var gChangeLangConfirmationMessage;
var loggingOutWindowMessage;
var loggingOutWindowTitle;
var ip_config;
var ip_port; 
var gTotalRowNumber;
var gLanguagesList;
var $$ = Dom7;
var gPageTitleContent;
var gPageTitleElement;
var gSubItem;
var gMainItemId;
var gRelatedItemId=0;
var gScreenName;
var gQITransactionId=0;
var gQICounterpartyId=0;
var gQICreditFIldId=0;
var gTransactionTypeId=0;
var gAmortizationParameters;
var gAmortizationStringiFyData;
var gSearchParams;
var gHomeBackButton;
var gStopWFMessage;
var gTaskId=0;
var gExecutedWorkflowName;
var gEngine;
var gTargetTab;
var gInstructionGuide; 
var gIsWithCollectQuestion; 
var gExtendedProperties=null;
var gIsSwitchLanguage = false;
var gIsRelatedFromLink="false";
var gCurrentSearchItem;
var gCurrentSearchType;


var myApp=new Framework7({ swipeBackPage : false, statusbarOverlay:true, tapHold: true,swipePanel: 'left',fastClicksDelayBetweenClicks : 10 }) ;
var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache :true
});
var leftView = myApp.addView('.view-left', {
    dynamicNavbar: true,
    domCache :true
});
$$('.firstWS-confirm-ok-cancel').on('click', function () {
    myApp.confirm('Are you sure want to exit from App?', 'MACP',
      function () {
          navigator.app.exitApp();
      },
      function () {
      }
    );
    
});   
myApp.onPageInit('attachmentScreen', function (page) {
    gTaskId = 0;
    createLanguagesList('attachmentScreen');
    createLogoutPopover('attachmentScreen');
    myApp.params.swipePanel=false;
    myApp.showPreloader(); 
    setTemplate_HeaderData('attachmentScreen');
    GetAttachmentScreen(gScreenName);
    
});  
function GetAttachmentScreen(screenName){
     var url= "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GetAttachmentScreen";    
     var data="{"+    
        "\"screenName\":\""+screenName+"\","+ 
        "\"mainItemId\":\""+gMainItemId+"\","+ 
        "\"taskId\":\""+gTaskId+"\","+ 
        "\"windowWidth\":\""+window.innerWidth+"\","+
        "\"windowHeight\":\""+(window.innerHeight-90)+"\","+
        "\"userData\":"+sessionStorage.getItem("userData")+"}";
    $.ajax({             
        type: 'POST',             
        url: url,                                      
        contentType: "text/plain",                             
        dataType: "json",                            
        data: data,         
        success: function(data) {
            gPageTitleElement=document.getElementById("title_attachmentScreen");
            gPageTitleElement.textContent=gPageTitleContent+" : "+ RelatedItemType;
            createLanguagesList('attachmentScreen'); 
            createLogoutPopover('attachmentScreen'); 
            setTemplate_HeaderData('attachmentScreen');
            document.getElementById("attachmentScreenForm").innerHTML=data.content;            
            document.getElementById('attachment-toolbarContent').innerHTML=data.buttonsDiv;
            myApp.accordionOpen(".accordion-item");
            manageAttechementElement();
            myApp.hidePreloader();
        },
        error: function(e) { 
            myApp.hidePreloader();
            errorMessage(e.message);
        }            
    });  
} 
function checkInternetConnection() {
    // Handle the online event 
    var networkState = navigator.connection.type; 
    if (networkState !== Connection.NONE) 
        return true;
    return false;
}

function isScreenInCache(screenName){
    var history=mainView.history;
    for(var i=0 ; i<history.length ; i++)
    {
        if(history[i]===screenName)
        {
            return true;
        } 
    }
    return false;
}
function westMenuItem(subItem,title,htmlFile, screenName){     
    
    if(isScreenInCache(screenName))
    {
        mainView.history=["#homePage"];
        document.getElementById("title_"+screenName).remove(); 
        document.getElementById("userName_label_"+screenName).remove(); 
        document.getElementById("lng_label_"+screenName).remove(); 
        $$('.view-main .page-on-left').remove(screenName);
    }
    gSubItem=subItem;
    gScreenName=screenName; 
    gPageTitleContent=title; 
    gTransactionConditionId = 0;
    if(!checkInternetConnection())                                                   
        myApp.alert("please check your internet connection");
    else                                              
        mainView.router.load({url: htmlFile,reload:true});   
}  
myApp.onPageReinit('homePage', function (page) {
    if(!gIsSwitchLanguage)
    {
        gTransactionConditionId = 0;
        document.getElementById("tasks").innerHTML=null;
        document.getElementById("homePage-toolbarContent").innerHTML=null;
        reInitHomePage();
    }
    else
    {
        document.getElementById("tasks").innerHTML=null;
        document.getElementById("homePage-toolbarContent").innerHTML=null;

        gIsSwitchLanguage = false;           
        loadTaskList(); 
        setTemplate_HeaderData("homePage");
    }
});  
function reInitHomePage(){ 
    myApp.showPreloader();
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/ReInitHomePage';
    var data="{"+ 
         "\"userData\":"+sessionStorage.getItem("userData")+","+
         "\"windowWidth\":\""+window.innerWidth+"\","+
         "\"windowHeight\":\""+(window.innerHeight-90)+"\"}";
    $.ajax({             
        type: 'POST',                               
        url: url,                                    
        contentType: "text/plain",                                      
        dataType: "json",                               
        data: data,       
        success: function(data) {
            document.getElementById("tasks").innerHTML=data.TasksContent;
            document.getElementById("homePage-toolbarContent").innerHTML=data.buttonsDiv;
            myApp.hidePreloader();
            GetHomePageScripts(); 
        },
        error: function(e) {
            
            myApp.hideIndicator();
            errorMessage(e.message);
        }         
    });   
}
function saveFirstConfig(){
    ip = document.getElementById('ipFirstConfig').value,
    port = document.getElementById('portFirstConfig').value;
    saveWsConfiguration(ip,port);
    myApp.closeModal();
}       
function loadJSFile(screenName){           
    var js = document.createElement("script");
    js.type = "text/javascript";                
    js.src = screenName;                                    
    document.body.appendChild(js);
   

}  
function isScriptAlreadyIncluded(src){
    var scripts = document.getElementsByTagName("script");
    for(var i = 0; i < scripts.length; i++) 
        if(scripts[i].getAttribute('src') == src) return true;
    return false;
}
function verifConfig(){    
    ip_config=sessionStorage.getItem("Ip_config");
    ip_port=sessionStorage.getItem("Ip_port");
    if(ip_config===null || ip_port===null)
        myApp.loginScreen(); 
}  
function verifDeviceConfig(){
    manageDB();
    getWsConfiguration();
}
var leftView=myApp.addView('.view-left',{
    domCache: true,dynamicNavbar:true
});
document.addEventListener("deviceready", onDeviceReady, true);
function onDeviceReady() {         
    gHomeBackButton=document.getElementById("homeBackButton");
    document.addEventListener("online", checkInternetConnection, false);
    myApp.params.swipePanel=false;
    verifDeviceConfig();   
}                
myApp.onPageInit('WSConfigurationScreen', function (page) {
    myApp.params.swipePanel=false;    
    document.getElementById('WSip').value=sessionStorage.getItem('Ip_config');
    document.getElementById('WSport').value=sessionStorage.getItem('Ip_port');
    loadJSFile("js/WSConfigurationScreen.js");
});   
myApp.onPageInit('homePage', function (page) {   
    myApp.params.swipePanel=false;    
    setTemplate_HeaderData('homePage');
    loadTaskList();
});                  
myApp.onPageInit('searchScreen', function (page) {
    gHomeBackButton.style.visibility="visible";    
    createLanguagesList('searchScreen');
    createLogoutPopover('searchScreen');  
    myApp.params.swipePanel=false;
    gPageTitleElement=document.getElementById("title_searchScreen");
    gPageTitleElement.textContent=gPageTitleContent;  
    myApp.showPreloader();
    setTemplate_HeaderData('searchScreen');  
    loadsearchScreen();
  
}); 
myApp.onPageInit('teamTasksScreen', function (page) {
    gTaskId = 0;
    createLanguagesList('teamTasks');
    createLogoutPopover('teamTasks');
    myApp.params.swipePanel=false;
    myApp.showPreloader();
    gPageTitleElement=document.getElementById("title_teamTasks");
    gPageTitleElement.textContent=navbarTitle;
    setTemplate_HeaderData('teamTasks');
    GetTeamTasks();
    
});    
myApp.onPageInit('editScreen', function (page) {
    gTaskId = 0;
    createLanguagesList('editScreen');
    createLogoutPopover('editScreen');
    myApp.params.swipePanel=false;
    InitEditScreen(gScreenName,gSubItem);
    
}); 
myApp.onPageInit('newInputScreen', function (page) {
    gHomeBackButton.style.visibility="visible"; 
    createLanguagesList('newInputScreen'); 
    createLogoutPopover('newInputScreen');
    myApp.params.swipePanel=false;   
    gPageTitleElement=document.getElementById("title_newInputScreen");
    gPageTitleElement.textContent=gPageTitleContent;
    myApp.showPreloader();
    setTemplate_HeaderData('newInputScreen');
    loadNewInputPage(gScreenName);  
});                
myApp.onPageInit('searchResultScreen', function (page) {
    gHomeBackButton.style.visibility="visible";
    createLanguagesList('searchResultScreen'); 
    createLogoutPopover('searchResultScreen');  
    myApp.params.swipePanel=false;
    gPageTitleElement=document.getElementById("title_searchResultScreen");
    gPageTitleElement.textContent=gPageTitleContent;
    setTemplate_HeaderData('searchResultScreen');   
    myApp.showPreloader();
    gCurrentSearchType="searchResult";
    lunchSearchResult(gSubItem,gSearchParams);
});  
myApp.onPageInit('executeTaskScreen', function (page) {
    gHomeBackButton.style.visibility="visible";
    createLanguagesList('executeTaskScreen'); 
    createLogoutPopover('executeTaskScreen');      
    myApp.params.swipePanel=false;
    gPageTitleElement=document.getElementById("title_executeTaskScreen");
    gPageTitleElement.textContent=gPageTitleContent;
    setTemplate_HeaderData('executeTaskScreen'); 
    myApp.showPreloader();
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetExecuteTaskScreen';
    GetExecuteTaskScreen(url);
});
myApp.onPageInit('relatedItemScreen', function (page) {
   
    gHomeBackButton.style.visibility="visible";
    createLanguagesList('relatedItemScreen'); 
    createLogoutPopover('relatedItemScreen');
    setTemplate_HeaderData('relatedItemScreen');   
    myApp.params.swipePanel=false;
    gPageTitleElement=document.getElementById("title_relatedItemScreen");
    gPageTitleElement.textContent=gPageTitleContent+" : "+ RelatedItemType;
    InitRelatedItemScreen(gScreenName);
    myApp.showPreloader();
});
myApp.onPageInit('pricingConditionScreen', function (page) {
    gHomeBackButton.style.visibility="visible";
    createLanguagesList('pricingConditionScreen'); 
    createLogoutPopover('pricingConditionScreen');    
    setTemplate_HeaderData('pricingConditionScreen'); 
    myApp.params.swipePanel=false;
    gPageTitleElement=document.getElementById("title_pricingConditionScreen");
    gPageTitleElement.textContent=gPageTitleContent+" : "+ RelatedItemType;
    myApp.showPreloader();
    GetPricingConditionScreen(gScreenName); 
}); 

myApp.onPageInit('relatedScreen', function (page) {
    gHomeBackButton.style.visibility="visible";
    createLanguagesList('relatedScreen'); 
    createLogoutPopover('relatedScreen');    
    setTemplate_HeaderData('relatedScreen'); 
    myApp.params.swipePanel=false;
    gPageTitleElement=document.getElementById("title_relatedScreen");
    gPageTitleElement.textContent=gPageTitleContent;
    loadScreen(gScreenName,mainItemIdForLink,mainItemForLink,"classicre");  
});


myApp.onPageInit('quickInputDetailsScreen', function (page) {
    var url= "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GenerateExistingItemQIScreen";    
     var data="{"+    
        "\"screenWidth\":\""+window.innerWidth+"\","+
        "\"screenName\":\""+gScreenName+"\","+
        "\"subItem\":\""+gSubItem+"\","+ 
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +  
        "\"transactionID\":\""+gQITransactionId+"\","+   
        "\"counterpartyID\":\""+gQICounterpartyId+"\","+  
        "\"transactionTypeId\":\""+gTransactionTypeId+"\","+   
        "\"creditFileID\":\""+gQICreditFIldId+"\","+  
        "\"userData\":"+sessionStorage.getItem("userData")+"}";
    $.ajax({             
        type: 'POST',             
        url: url,                                      
        contentType: "text/plain",                             
        dataType: "json",                            
        data: data,         
        success: function(data) {
            document.getElementById("quickInputDetailsScreenForm").innerHTML=data.content;
            gPageTitleElement=document.getElementById("title_quickInputDetailsScreen");
            gPageTitleElement.textContent=data.navBarTitle;
            document.getElementById('existingItemQI-screen-toolbarContent').innerHTML=data.buttonsDiv;
            createLanguagesList('quickInputDetailsScreen'); 
            createLogoutPopover('quickInputDetailsScreen'); 
            setTemplate_HeaderData('quickInputDetailsScreen');
            loadJSFile("js/informativeGridInfiniteScroll.js");
            ManagePricingCnditionComponents("my-existingItemQI-form");  
            myApp.hidePreloader();
        },
        error: function(e) { 
            myApp.hidePreloader();
            errorMessage(e.message); 
        }            
    });  
});

myApp.onPageInit('newQuickInputScreen', function (page) {
    var url= "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GenerateExistingItemQIScreen";    
     var data="{"+    
        "\"screenWidth\":\""+window.innerWidth+"\","+
        "\"screenName\":\""+gScreenName+"\","+
        "\"subItem\":\""+gSubItem+"\","+ 
        "\"ipAddress\":\""+sessionStorage.getItem("Ip_config")+"\"," +  
        "\"transactionID\":\""+gQITransactionId+"\","+   
        "\"counterpartyID\":\""+gQICounterpartyId+"\","+  
        "\"transactionTypeId\":\""+gTransactionTypeId+"\","+   
        "\"creditFileID\":\""+gQICreditFIldId+"\","+  
        "\"userData\":"+sessionStorage.getItem("userData")+"}";
    $.ajax({             
        type: 'POST',             
        url: url,                                      
        contentType: "text/plain",                             
        dataType: "json",                            
        data: data,         
        success: function(data) {
            document.getElementById("quickInputDetailsScreenForm").innerHTML=data.content;
            gPageTitleElement=document.getElementById("title_quickInputDetailsScreen");
            gPageTitleElement.textContent=data.navBarTitle;
            document.getElementById('existingItemQI-screen-toolbarContent').innerHTML=data.buttonsDiv;
            createLanguagesList('quickInputDetailsScreen'); 
            createLogoutPopover('quickInputDetailsScreen'); 
            setTemplate_HeaderData('quickInputDetailsScreen');
            loadJSFile("js/informativeGridInfiniteScroll.js");
            ManagePricingCnditionComponents("my-existingItemQI-form");  
            myApp.hidePreloader();
        },
        error: function(e) { 
            myApp.hidePreloader();
            errorMessage(e.message); 
        }            
    });  
});


function InitRelatedItemScreen(screenName){
    var url= "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GetRelatedItemScreen";    
            
    var data="{"+    
      "\"screenName\":\""+screenName+"\","+
      "\"screenType\":\"relatedItemDetails\","+
      "\"userData\":"+sessionStorage.getItem("userData")+","+
      "\"taskId\":\""+gTaskId+"\"," + 
      "\"mainItemId\":\""+gMainItemId+"\","+
      "\"screenWidth\":\""+window.innerWidth+"\","+          
      "\"relatedItemId\":\""+gRelatedItemId+"\"}"; 
    $.ajax({             
        type: 'POST',             
        url: url,                                      
        contentType: "text/plain",                             
        dataType: "json",                            
        data: data,         
        success: function(data) { 
            manageAutoCompleteComponent("my-relatedItemPopup-form",screenName);   
            loadJSFile("js/RelatedItemScreen.js");
            document.getElementById("relatedItemForm").innerHTML=data.content;
            $('#relatedItem-toolbarContent').append(data.buttonsDiv);
            myApp.hidePreloader();
            ManagePricingCnditionComponents("my-relatedItemPopup-form");
        },
        error: function(e) { 
            myApp.hidePreloader();
            errorMessage(e.message);
        }           
    });  
}
function setTemplate_HeaderData(pScreen){
    var user = JSON.parse(sessionStorage.getItem('userData'));
    document.getElementById("userName_label"+"_"+pScreen).textContent=user.user_name;
    document.getElementById("lng_label"+"_"+pScreen).textContent=user.culture_language;
}  
function loadsearchScreen(){
    GetSearchPage('http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetSearchScreen');
   
}       
function loadTaskList() {
    tasks=document.getElementById('tasks');
    var deviceWidth = window.innerWidth - 50;
    GetHomePage('http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/getHomePage');  
} 
function loadNewInputPage(screenName){  
    var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetNewInputScreen';
    GetNewInputScreen(url,screenName);
}  

function InitEditScreen(screenName,subItem){ 
    var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetEditScreen';
     myApp.showPreloader(); 
     var request="{"+      
              "\"subItem\":\""+subItem+"\","+
              "\"screenName\":\"" + screenName + "\"," +
              "\"screenParent\":\"\","+ 
              "\"taskId\":\"" + gTaskId + "\"," +
              "\"userData\":"+sessionStorage.getItem("userData")+","+  
              "\"mainItemId\":\""+gMainItemId+"\"," +
              "\"targetTab\":\""+gTargetTab+"\"," +  
              "\"screenEngine\":\"empty\","+
              "\"screenWidth\":\""+window.innerWidth+"\"," +
              "\"screenHeight\":\""+window.innerHeight+"\"}";
           var withBackButton=true;
    $.ajax({ 
        type: "POST",   
        dataType:"json",  
        url: url,    
        contentType: "text/plain",                          
        data: request,  
        success: function(data) {     
           document.getElementById('editScreenForm__'+gMainItemId).innerHTML=data.content;
            $('#edit-toolbarContent__'+gMainItemId).append(data.buttonsDiv);
             gPageTitleElement=document.getElementById("title_editScreen__"+gMainItemId);
             gPageTitleElement.textContent=gPageTitleContent;
             setTemplate_HeaderData('editScreen__'+gMainItemId); 
             loadJSFile("js/WorkflowManager.js");
             loadJSFile("js/informativeGridInfiniteScroll.js");
             myApp.attachInfiniteScroll($$('.informativeGrid-infinite-scroll'));
             myApp.hidePreloader();
        },
        error: function(e) {
            myApp.hidePreloader();
            errorMessage(e.message);                         
        }    
    });      
    
}                
function GetNewInputScreen(url,screenName){
    var data="{"+     
       "\"screenWidth\":\""+window.innerWidth+"\","+
       "\"screenName\":\""+screenName+"\","+
       "\"userData\":"+sessionStorage.getItem("userData")+"}";
    $.ajax({ 
        type: "POST",  
        dataType:"json",  
        url: url,    
        contentType: "text/plain",                          
        data: data,  
        success: function(data) {     
            document.getElementById("newInputForm").innerHTML=data.content;
            document.getElementById("newInput-toolbarContent").innerHTML=data.button;
            manageAutoCompleteComponent("my-newInput-form",gSubItem);
            loadJSFile("js/NewInputScreen.js");
            myApp.hidePreloader();
        },
        error: function(e) {
            myApp.hidePreloader();
            errorMessage(e.message);                         
        }    
    });         
}
function GetSearchPage(url){ 
    var data="{"+  
       "\"subItem\":\""+gSubItem+"\","+
       "\"userData\":"+sessionStorage.getItem("userData")+"}";
    $.ajax({ 
        type: 'POST',                             
        url: url,                                    
        contentType: "text/plain",                                    
        dataType: "json",                               
        data: data,
        success: function(data) { 
            document.getElementById("searchForm").innerHTML=data.content;
            manageAutoCompleteComponent("my-search-form",gSubItem);
            loadJSFile("js/SearchScreen.js");
            myApp.hidePreloader();
        },
        error: function(e) {
            myApp.hidePreloader();
            errorMessage(e.message); 
        }  
                 
    });    
}  
function GetHomePageScripts(){
    $.getScript("js/Macp.js");
    $("script[src='js/Macp.js']").remove();

    $.getScript("js/Macp.js");
    $("script[src='js/Macp.js']").remove();
    $("script[src='js/Macp.js']").remove();
    $("script[src='js/homePage.js']").remove();
    loadJSFile("js/homePage.js"); 
}
function GenerateResponseArray(element){ 
    var res = element.split(",");
    var result = [];//Array
    if(res.length!==0)
    {
        for (var i = 0; i < res.length; i++) 
        {
            if(res[i]!=="")
                result.push(res[i]);
        }
    } 
    return result;        
} 
function setUser_ShortName(userShortName){
    var res = userShortName.split('\\');
    return res[0]+'\\\\'+res[1]; 
    
} 
function GetHomePage(url) {
    var data="{"+  
         "\"windowWidth\":\""+window.innerWidth+"\","+
         "\"userData\":"+sessionStorage.getItem("userData")+","+ 
         "\"windowHeight\":\""+(window.innerHeight-90)+"\"}";  
    var dataToReturn = 'null';    
    $.ajax({             
        type: 'POST',                             
        url: url,                                  
        contentType: "text/plain",                                    
        dataType: "json",                               
        data: data,     
        success: function(data) {            
            document.getElementById("tasks").innerHTML=data.TasksContent;
            document.getElementById("westMenu").innerHTML=data.WestMenuContent;
            document.getElementById("homePage-toolbarContent").innerHTML=data.buttonsDiv;
            sessionStorage.setItem("Languages",data.Languages);
            var languages=sessionStorage.getItem('Languages');
            gLanguagesList = JSON.parse(languages); 
            gChangeLangConfirmationMessage = JSON.stringify(data.ChangeLangConfirmationMessage);
            gChangeLangConfirmationMessage = gChangeLangConfirmationMessage.substr(1,gChangeLangConfirmationMessage.length-2);
            loggingOutWindowMessage = JSON.stringify(data.LoggingOutWindowMessage);
            loggingOutWindowMessage = loggingOutWindowMessage.substr(1,loggingOutWindowMessage.length-2);
            loggingOutWindowTitle = JSON.stringify(data.LoggingOutWindowTitle);
            loggingOutWindowTitle = loggingOutWindowTitle.substr(1,loggingOutWindowTitle.length-2);
            createLanguagesList('homePage');
            createLogoutPopover('homePage'); 
            GetHomePageScripts(); 
            myApp.hidePreloader();
        }, 
        error: function(e) {  
            myApp.hidePreloader();                
            errorMessage(e.message);
        }
    });          
               
}  
function GetTeamTasks(url) {
    var data="{"+  
         "\"windowWidth\":\""+window.innerWidth+"\","+
         "\"userData\":"+sessionStorage.getItem("userData")+","+ 
         "\"windowHeight\":\""+(window.innerHeight-90)+"\"}";  
    var dataToReturn = 'null';    
    $.ajax({             
        type: 'POST',                             
        url: 'http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetTeamTasks',                                  
        contentType: "text/plain",                                    
        dataType: "json",                               
        data: data,     
        success: function(data) {            
            document.getElementById("teamTasks").innerHTML=data.TasksContent;
            document.getElementById("teamTasks-toolbarContent").innerHTML=data.buttonsDiv;
            createLanguagesList('teamTasks');
            createLogoutPopover('teamTasks'); 
            loadJSFile("js/TeamTasks.js");
            myApp.hidePreloader();
        }, 
        error: function(e) {  
            myApp.hidePreloader();                
            errorMessage(e.message);
        }
    });           
               
}                
function createLanguagesList(screen){
    $$('.create-language-links-'+screen).on('click', function () {
        var clickedLink = this;
        var output="";        
        for(var i=0 ; i< gLanguagesList.LangsList.length ; i++)
        { 
            var display=gLanguagesList.LangsList[i].display;
            output=output+'<li><a href="#" class="item-link list-button" onclick="switchLanguage(\''+gLanguagesList.LangsList[i].property+'\')">'+display  +'</li>';
        }
        var popoverHTML = '<div id="language_popover" class="popover">'+
                            '<div class="popover-inner">'+
                              '<div class="list-block">'+
                                '<ul>'+
                                 output
        '</ul>'+
      '</div>'+
    '</div>'+
  '</div>';
        myApp.popover(popoverHTML, clickedLink); 
    });
}  

function switchLanguage(property){
    myApp.closeModal();
    
    myApp.confirm(gChangeLangConfirmationMessage,
   '',
    function (value) {
        var userData = JSON.parse(sessionStorage.getItem("userData"));
        myApp.showPreloader();
        userData.culture_language = property;
        sessionStorage.setItem("userData",JSON.stringify(userData));  
        var updatedUserData = sessionStorage.getItem("userData");
        var data="{\"userData\":"+updatedUserData+"}";  
        $.ajax({             
            type: 'POST',                             
            url:'http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/UpdateUserLanguage',                                
            contentType: "text/plain",                                    
            dataType: "json",                               
            data: data,    
            success: function(data) {
            
                if(mainView.history[0]==="#homePage")
                {
                    document.getElementById("tasks").innerHTML=null;
                    document.getElementById("homePage-toolbarContent").innerHTML=null;
                    loadTaskList();
                    setTemplate_HeaderData("homePage");                   
                }
                else
                {
                    gIsSwitchLanguage = true;
                    gHomeBackButton.style.visibility="hidden";  
                    mainView.router.back({force:true,pageName:"homePage"});
                    mainView.history=["#homePage"];
                    if(!checkInternetConnection())                                                   
                        myApp.alert("please check your internet connection");
                    else 
                        leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                }

            },
            error: function(e) {               
                myApp.hidePreloader();    
                errorMessage(e.message);    
            }
        }); 
    },
    function (value) {
    }
  );
       
    
}
function createLogoutPopover(screen){
    $$('.create-profile-links-'+screen).on('click', function () {
        var clickedLink = this;
        var output="";

        output=output+'<li><a href="#" onclick="logoutAction();" class="item-link list-button">Logout</li>';
        
        var popoverHTML = '<div class="popover">'+
                            '<div class="popover-inner">'+
                              '<div class="list-block">'+
                                '<ul>'+
                                 output
        '</ul>'+
      '</div>'+
    '</div>'+
  '</div>';
        myApp.popover(popoverHTML, clickedLink);
    });
}          

function logoutAction(){
    myApp.closeModal();
    myApp.confirm(loggingOutWindowMessage,
    loggingOutWindowTitle,
     function (value) {
         sessionStorage.clear();   
         mainView.router.load({url: 'index.html'});
         location.reload(true);  
        
     },
     function (value) {
     }
   );
       
}
function lunchSearchResult(subItem,searchParams){  
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetSearchResultPage';    
    var screenHeight;
    var screenWidth;
    if(gCurrentSearchType=="searchResult")
    {
        screenWidth=window.innerWidth; 
        screenHeight=window.innerHeight-90;
    }
    else
    {
        screenWidth=window.innerWidth*0.80;
        screenWidth=Math.floor(screenWidth); 
        screenHeight=window.innerHeight*0.73;
        screenHeight=Math.floor(screenHeight); 
    }
    var data="{"+    
       "\"userData\":"+sessionStorage.getItem("userData")+","+ 
       "\"subItem\":\""+subItem+"\","+
       "\"searchParams\":"+searchParams+","+
       "\"start\":\"0\","+
       "\"limit\":\"30\","+      
       "\"windowWidth\":\""+screenWidth+"\","+
       "\"searchScreenType\":\""+gCurrentSearchType+"\","+
       "\"windowHeight\":\""+screenHeight+"\"}"; 
    $.ajax({             
        type: 'POST',           
        url: url,                      
        contentType: "text/plain",                          
        dataType: "json",                            
        data: data,         
        success: function(data) {   
            if(gCurrentSearchType=="searchResult")
            {
                document.getElementById("searchResult").innerHTML=data.dataGrid; 
                loadJSFile("js/SearchResultScreen.js");       
                var tasksTableElement =document.getElementById("tasksTableElement");
                myApp.attachInfiniteScroll(tasksTableElement);      
            }
            else
            {
                myApp.popup("<div class='popup' style='width:80% !important; height:80% !important; left:10% !important; top:10% !important; margin-left:0px !important; margin-top:0px !important; margin-right:0px !important; overflow:hidden'>"+data.dataGrid+"</div>");
                var tasksTableElement =document.getElementById("tasksTableElementOnPopon");
                myApp.attachInfiniteScroll(tasksTableElement);  
            }
            var tasksTableElement =document.getElementById("tasksTableElement");
            myApp.attachInfiniteScroll(tasksTableElement);
            gTotalRowNumber=data.TotalRows;
            loadJSFile("js/infiniteScroll.js");
            loadJSFile("js/WorkflowManager.js");
           
            myApp.hidePreloader();
            
        },    
        error: function(e) { 
            verifconnexion = false;  
            myApp.hidePreloader();
            errorMessage(e.message);
                         
        }                           
    });      
}   

function fillTransactionForm(selectedValue, counterpartyId, transactionId, formId,screenName){
    myApp.showPreloader();
            var formData = myApp.formToData('#'+formId);
        parameters=JSON.stringify(formData);
        var popupWidth=window.innerWidth*0.90;
        popupWidth=Math.floor(popupWidth); 
    var url =  "http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/GetPricingTemplate"; 
    var data="{"+    
      "\"userData\":"+sessionStorage.getItem("userData")+","+ 
      "\"transactionTypeID\":\""+selectedValue.value+"\","+
      "\"transactionID\":\""+transactionId+"\","+
      "\"counterpartyID\":\""+counterpartyId+"\","+
      "\"subItem\":\""+gSubItem+"\","+ 
      "\"poponWidth\":\""+popupWidth+"\"," +   
      "\"screenName\":\""+screenName+"\","+   
      "\"SpecificAgreementID\":\"0\","+        
      "\"parameters\":"+parameters+"}"; 
    
     $.ajax({   
        type: 'POST',           
        url: url,                       
        contentType: "text/plain",                            
        dataType: "json",                            
        data: data, 
        success: function(data) {
            myApp.hidePreloader();
            myApp.formFromData('#'+formId, data);
            updateGridOnPoponContent(data);
        },
        error: function(e) {                        
            verifconnexion = false;                           
            myApp.hidePreloader();
            errorMessage(e.message);
        }                   
    }); 
     
}
function generateConnectedComboItems(idChild,screenTagName,val,child,entity,sharedConfig,property,formId){ 
    var url =  "http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/ConnectedComboOptions"; 
    connectedComboOptions(url,idChild,val,child,entity,screenTagName,sharedConfig,property,formId);

} 

function connectedComboOptions(url,idChild,val,child,entity,screenTagName,sharedConfig,property,formId) {
    var childs=idChild.split(",");
    var data="{"+    
      "\"userData\":"+sessionStorage.getItem("userData")+","+ 
      "\"parentValue\":\""+val.value+"\","+
      "\"property\":\""+property+"\","+
      "\"screenTagName\":\""+screenTagName+"\","+
      "\"sharedConfig\":\""+sharedConfig+"\","+
      "\"child\":\""+child+"\","+  
      "\"idChild\":\""+idChild+"\","+ 
      "\"entity\":\""+entity+"\"}"; 
    $.ajax({   
        type: 'POST',           
        url: url,                       
        contentType: "text/plain",                            
        dataType: "json",                            
        data: data,
        success: function(data) {
            var json=JSON.stringify(data.content);
            var myObj=JSON.parse(json)
            Object.keys(myObj).forEach(function(key){
                var value = myObj[key];
                Object.keys(value).forEach(function(key2){
                    var value2 = value[key2];
                    $("#"+formId).find("#"+key2).html(value2);
                });
            });                                    
        },
        error: function(e) {                      
            verifconnexion = false;                           
            myApp.hidePreloader();
            errorMessage(e.message);
        }                    
    });          
}
function HomeBack(){
    gHomeBackButton.style.visibility="hidden";       
    mainView.router.back({force:true,pageName:"homePage"});  
    mainView.history=["#homePage"];
    if(!checkInternetConnection())                                                   
        myApp.alert("please check your internet connection");
    else 
        leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
}   
function manageDB(){
    var msg;
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS WS (id unique, ip, port)');
            
    });
}
function getWsConfiguration(){
    
    db.readTransaction(function (tx) {
        tx.executeSql('SELECT * FROM WS', [], function (tx, results) {
            var len = results.rows.length, i;
            if(results.rows.length!==0)
            { 
                var 	ip=results.rows.item(0).ip;
                var  port=results.rows.item(0).port;
                sessionStorage.setItem('Ip_config', ip);
                sessionStorage.setItem('Ip_port', port);
            }
            else
            {
                myApp.loginScreen();
            }
        });
    }, null);
}
function onError(tx, error) {
    myApp.alert(error.message,"Error");
}
function saveWsConfiguration(ip,port){    
    db.transaction(function (t) {
        t.executeSql('INSERT INTO WS (id,ip,port) VALUES (1,"'+ip+'","'+port+'")');
    });  
    sessionStorage.setItem('Ip_config', ip);
    sessionStorage.setItem('Ip_port', port);
}
function updateWsConfiguration(ip,port){
    db.transaction(function (t) {
        t.executeSql('Update WS SET ip="'+ip+'" , port="'+port+'" where id=1');
    });
    sessionStorage.setItem('Ip_config', ip);
    sessionStorage.setItem('Ip_port', port);    
}
function ExecuteTask(taskId,workflowName,targettab){
    gTaskId=taskId;
    gExecutedWorkflowName=workflowName;
    gTargetTab = targettab; 
    if(!checkInternetConnection())                                                   
        myApp.alert("please check your internet connection");
    else 
        mainView.router.load({url: "executeTaskScreen.html",reload:true});
}
function GetExecuteTaskScreen(url){  
    var data="{"+
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"taskId\":\""+gTaskId+"\"," +
        "\"targetTab\":\""+gTargetTab+"\"," +         
        "\"screenWidth\":\""+window.innerWidth+"\","+
        "\"screenHeight\":\""+(window.innerHeight-90)+"\"}";
    $.ajax({             
        type: 'POST',                                    
        url: url,                    
        contentType: "text/plain",                           
        dataType: "json",                            
        data: data,             
        success: function(data) {       
            if(data.status==="ok")
            {
                    
                loadJSFile("js/EditScreen.js");
                loadJSFile("js/ExecuteTaskScreen.js");
                document.getElementById("executeTaskContent").innerHTML=data.content;
                itemId=data.itemId;
                gStopWFMessage=data.stopWFMessage;
                gIsWithCollectQuestion=data.WithCollectQuestion;
                gSubItem=data.screenName;
                manageAutoCompleteComponent("my-mainData-form__"+itemId,gSubItem);
                document.getElementById("executeTaskContent").innerHTML=data.content;
                gPageTitleElement=document.getElementById("title_executeTaskScreen");
                gPageTitleElement.textContent=data.itemShortName;
                $('#executeTask-toolbarContent').append(data.buttonsDiv);
                gScreenName=data.screenName;
                gSubItem=data.subItem;
                gEngine = data.screenEngine;                    
                gExtendedProperties=data.ExtendedProperties;    
                myApp.hidePreloader();
                manageInstructionGuideResponse(data);
                myApp.hidePreloader();
            }
            else if(data.status==="item not found")
            {
                myApp.hidePreloader(); 
                myApp.alert("Item not found in database","Item not found");
            }
            else                     
            {   
                myApp.hidePreloader();
            }
        },
        error: function(e) {                      
            verifconnexion = false;                           
            myApp.hidePreloader();
            errorMessage(e.message);
        }                             
    });       
}     

function manageInstructionGuideResponse(data){
    if(data.instructionGuide!==undefined)  
    {

         gInstructionGuide=data.instructionGuide;   
         showWorkflowInstructionGuide(); 
        $('#executeTask-toolbarContent div').append(data.instructionGuideButton); 
    } 
} 
function showWorkflowInstructionGuide(){  
     myApp.popup('<div class="popup" style="width: 50% !important; height :50% !important; top: 25% !important; top:25% !important; left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important; background : #f1f1f1 !important;" >' + gInstructionGuide + '</div>', true); 
}
function GetPricingConditionScreen(screenName){
    var url= "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GetRelatedItemScreen";    

    var data="{"+    
      "\"screenName\":\""+screenName+"\","+
      "\"screenType\":\"pricingCondition\","+
      "\"userData\":"+sessionStorage.getItem("userData")+","+
      "\"mainItemId\":\""+gMainItemId+"\","+
      "\"taskId\":\""+gTaskId+"\"," +
      "\"screenWidth\":\""+window.innerWidth+"\"," +
      "\"relatedItemId\":\""+gRelatedItemId+"\"}"; 
    $.ajax({              
        type: 'POST',             
        url: url,                                     
        contentType: "text/plain",                            
        dataType: "json",                            
        dataType: "json",                               
        data: data,         
        success: function(data) {  
            document.getElementById("pricingConditionForm").innerHTML=data.content;
            $('#pricingConditionScreen-toolbarContent').append(data.buttonsDiv);
            myApp.hidePreloader();    
            loadJSFile("js/PricingConditionScreen.js");
            loadJSFile("js/amortizationInfiniteScroll.js");
            myApp.hidePreloader();  
            ManagePricingCnditionComponents("my-relatedItemPopup-form");
        },
        error: function(e) { 
            myApp.hidePreloader();
        }              
    });  
}



myApp.onPageInit('quickInputPopon', function (page) {
    gHomeBackButton.style.visibility="visible";    
    createLanguagesList('quickInputPopon');
    createLogoutPopover('quickInputPopon');  
    myApp.params.swipePanel=false;
    gPageTitleElement=document.getElementById("title_quickInputPopon");
    gPageTitleElement.textContent=gPageTitleContent;  
    myApp.showPreloader();
    setTemplate_HeaderData('quickInputPopon'); 
    loadQuickInputPopon(gScreenName);
  
}); 

function loadQuickInputPopon(screenName){
        GetQuickInputPopon('http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GenerateQInputItemPopon',screenName);
}


function GetQuickInputPopon(url,screenName){
     var data="{"+  
       "\"subItem\":\""+gSubItem+"\","+
       "\"sourceTag\":\""+screenName+"\","+ 
       "\"taskId\":\""+gTaskId+"\","+
       "\"mainItemId\":\"0\","+
       "\"userData\":"+sessionStorage.getItem("userData")+"}";
    $.ajax({ 
        type: 'POST',                             
        url: url,                                    
        contentType: "text/plain",                                    
        dataType: "json",                               
        data: data,
        success: function(data) { 
            document.getElementById("quickInputPoponForm").innerHTML=data.content;
            $('#existingItemQI-popon-toolbarContent').append(data.buttonsDiv);
            manageAutoCompleteComponent("my-existingItemQIPopon-form","QI_existing"+gSubItem.toLowerCase());
            loadJSFile("js/QuickInputDetailsScreen.js");
            loadJSFile("js/accounting.js");
            myApp.hidePreloader();
        },
        error: function(e) { 
            myApp.hidePreloader();
            errorMessage(e.message);
        }  
                 
    }); 
}
