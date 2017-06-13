var changeLangConfirmationMessage;
var loggingOutWindowMessage;
var loggingOutWindowTitle;
var ip_config;
var ip_port;
var itemId;
var tasks; 
var totalRowNumber;
var languagesList;
var $$ = Dom7;
var pageTitleContent;
var pageTitleElement;
var currentItem;
var searchParams;
var HomeBackButton;
var docMenu;
var eligibility;
var relatedItemId;
var stopWFMessage;
var TaskId;
var ExecutedWorkflowName;
var itemRef;
var fromNewInput;
var divId; 
var engine;
var TargetTab;
var InstructionGuide; 
var WithCollectQuestion; 
var extendedProperties=null;
var isSwitchLanguage = false;
var MainItemEdiatbelegrids = {};

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

 
function checkInternetConnection() {
    // Handle the online event 
    var networkState = navigator.connection.type; 
    if (networkState !== Connection.NONE) 
        return true;
    return false;
}

function isScreenInCache(screenName){
    var history=mainView.history;
    console.log(screenName);
    for(var i=0 ; i<history.length ; i++)
        {
            if(history[i]===screenName)
                {
                console.log("true");    
                return true;
                } 
        }
    console.log("false");   
    return false;
}
function westMenuItem(item,title,screenName){ 
    if(isScreenInCache(screenName))
        {
        mainView.history=["#homePage"];
        document.getElementById("title_"+screenName.replace(".html","")).remove(); 
        document.getElementById("userName_label_"+screenName.replace(".html","")).remove(); 
        document.getElementById("lng_label_"+screenName.replace(".html","")).remove(); 
        $$('.view-main .page-on-left').remove(screenName);
        }
      currentItem=item;
      pageTitleContent=title;
      fromNewInput=false;
      mainView.router.load({url: screenName,reload:true});   
}  
myApp.onPageReinit('homePage', function (page) {
    if(!isSwitchLanguage)
    {
     document.getElementById("tasks").innerHTML=null;
     document.getElementById("toolbar").innerHTML=null;
     reInitHomePage();
     console.log(mainView.history);
    }
    else
    {
           document.getElementById("tasks").innerHTML=null;
           document.getElementById("toolbar").innerHTML=null;
           isSwitchLanguage = false;           
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
            document.getElementById("toolbar").innerHTML=data.toolbar;
            console.log("success");
             myApp.hidePreloader();
GetHomePageScripts(); 
        },
        error: function(e) {
            
            myApp.hideIndicator();
            errorMessage();
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
    HomeBackButton=document.getElementById("homeBackButton");
    document.addEventListener("online", checkInternetConnection, false);
    myApp.params.swipePanel=false;
    verifDeviceConfig();   
} 
/*myApp.onPageInit('home', function (page) {  
     HomeBackButton=document.getElementById("homeBackButton");
     myApp.params.swipePanel=false;
    verifConfig();
    verifDeviceConfig();        
}).trigger();   */                    
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
    console.log("Init search screen");
    HomeBackButton.style.visibility="visible";    
    createLanguagesList('searchScreen');
    createLogoutPopover('searchScreen');  
    myApp.params.swipePanel=false;
    pageTitleElement=document.getElementById("title_searchScreen");
    console.log(pageTitleElement);
    pageTitleElement.textContent=pageTitleContent;  
    console.log(pageTitleContent);
    myApp.showPreloader();
    setTemplate_HeaderData('searchScreen');  
    loadsearchScreen();
  
}); 
myApp.onPageInit('editScreen', function (page) {
    TaskId = 0;
    createLanguagesList('editScreen');
    createLogoutPopover('editScreen');
    myApp.params.swipePanel=false;
    myApp.showPreloader();
    if(fromNewInput===true)
    document.getElementById("backButton").style.display = "none"; 
    pageTitleElement=document.getElementById("title_editScreen");
    pageTitleElement.textContent=itemRef;
    setTemplate_HeaderData('editScreen');
    loadEditScreen(itemId);
    
}); 
myApp.onPageInit('newInputScreen', function (page) {
    HomeBackButton.style.visibility="visible"; 
    createLanguagesList('newInputScreen'); 
    createLogoutPopover('newInputScreen');
    myApp.params.swipePanel=false;   
    pageTitleElement=document.getElementById("title_newInputScreen");
    pageTitleElement.textContent=pageTitleContent;
    myApp.showPreloader();
    setTemplate_HeaderData('newInputScreen');
    loadNewInputPage();
});                
myApp.onPageInit('searchResultScreen', function (page) {
    HomeBackButton.style.visibility="visible";
    createLanguagesList('searchResultScreen'); 
    createLogoutPopover('searchResultScreen');  
    myApp.params.swipePanel=false;
    pageTitleElement=document.getElementById("title_searchResultScreen");
    pageTitleElement.textContent=pageTitleContent;
    setTemplate_HeaderData('searchResultScreen');   
     myApp.showPreloader();
      var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetSearchResultPage';
    console.log("URL",url);
   lunchSearchResult(url); 
});  
myApp.onPageInit('executeTaskScreen', function (page) {
    HomeBackButton.style.visibility="visible";
    createLanguagesList('executeTaskScreen'); 
    createLogoutPopover('executeTaskScreen');      
    myApp.params.swipePanel=false;
    pageTitleElement=document.getElementById("title_executeTaskScreen");
    pageTitleElement.textContent=pageTitleContent;
    setTemplate_HeaderData('executeTaskScreen'); 
     myApp.showPreloader();
      var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetExecuteTaskScreen';
    console.log("URL",url);
    GetExecuteTaskScreen(url);
});
myApp.onPageInit('relatedItemScreen', function (page) {
    HomeBackButton.style.visibility="visible";
    createLanguagesList('relatedItemScreen'); 
    createLogoutPopover('relatedItemScreen');
    setTemplate_HeaderData('relatedItemScreen');   
    myApp.params.swipePanel=false;
    pageTitleElement=document.getElementById("title_relatedItemScreen");
    pageTitleElement.textContent=itemRef+" : "+ RelatedItemType;
    GetRelatedItemScreen();
    myApp.showPreloader();
});
myApp.onPageInit('pricingConditionScreen', function (page) {
    HomeBackButton.style.visibility="visible";
    createLanguagesList('pricingConditionScreen'); 
    createLogoutPopover('pricingConditionScreen');    
    setTemplate_HeaderData('pricingConditionScreen'); 
    myApp.params.swipePanel=false;
    pageTitleElement=document.getElementById("title_pricingConditionScreen");
    pageTitleElement.textContent=itemRef+" : "+ RelatedItemType;
    GetPricingConditionScreen(); 
    myApp.showPreloader();
});

function GetRelatedItemScreen()
{
     var url= "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GetRelatedItemScreen";    
            
      var data="{"+    
        "\"screenName\":\""+divId+"\","+
        "\"screenType\":\"relatedItemDetails\","+
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\""+itemId+"\","+
        "\"screenWidth\":\""+window.innerWidth+"\","+          
        "\"relatedItemId\":\""+relatedItemId+"\"}"; 
    console.log("SearchParams",data);        
    $.ajax({             
        type: 'POST',             
        url: url,                                     
        contentType: "text/plain",                             
        dataType: "json",                            
        data: data,         
        success: function(data) {  
            loadJSFile("js/RelatedItemScreen.js");
            document.getElementById("relatedItemForm").innerHTML=data.content;
            $('#relatedItem-toolbarContent').append(data.buttonsDiv);
            myApp.hidePreloader();
        },
        error: function(e) { 
            myApp.hidePreloader();
            errorMessage();
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
function loadNewInputPage(){  
    currentItem=currentItem.toLowerCase();
    var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetNewInputScreen';
    GetNewInputScreen(url);
}  
function loadEditScreen(itemId){
    var url='http://'+sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetEditScreen';
    GetEditScreen(url,itemId);
} 
function GetEditScreen(url,itemId){ 
     var data="{"+      
        "\"screenName\":\""+currentItem+"\","+
        "\"screenParent\":\"\","+ 
        "\"taskId\":\""+TaskId+"\"," +
        "\"userData\":"+sessionStorage.getItem("userData")+","+  
        "\"mainItemId\":\""+itemId+"\"," +
        "\"targetTab\":\""+TargetTab+"\"," +  
        "\"screenEngine\":\"empty\","+
        "\"screenWidth\":\""+window.innerWidth+"\"," +
        "\"screenHeight\":\""+window.innerHeight+"\"}";  
          
    $.ajax({ 
                    type: "POST",     
                    dataType:"json",  
                    url: url,    
                    contentType: "text/plain",                          
                    data: data,        
                    success: function(data) { 
                        console.log(data);
                        document.getElementById("editScreenForm").innerHTML=data.content;
                        $('#edit-toolbarContent').append(data.buttonsDiv);
                        divId = data.divId;
                        engine = data.screenEngine;                        
                        docMenu=(data.DocumentMenu);
                        loadJSFile("js/EditScreen.js");
                        loadJSFile("js/WorkflowManager.js"); 
                        MainItemEdiatbelegrids={};
                        EditableGridObject=MainItemEdiatbelegrids;
                        myApp.hidePreloader();
                    },
                    error: function(e) {
                        myApp.hidePreloader();               
                        errorMessage();
                    }   
            });         
}                 
function GetNewInputScreen(url){
     var data="{"+     
        "\"currentItem\":\""+currentItem+"\","+
        "\"screenWidth\":\""+window.innerWidth+"\","+         
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
                        loadJSFile("js/NewInputScreen.js");
                      //  loadJSFile("js/FormatUtils.js");
                         myApp.hidePreloader();
                    },
                    error: function(e) {
                        myApp.hidePreloader();
                        errorMessage();                         
                    }    
            });         
}
function GetSearchPage(url){ 
     var data="{"+  
        "\"currentItem\":\""+currentItem+"\","+
        "\"userData\":"+sessionStorage.getItem("userData")+"}";
    $.ajax({ 
        type: 'POST',                             
        url: url,                                  
        contentType: "text/plain",                                    
        dataType: "json",                               
        data: data,
                    success: function(data) { 
                        document.getElementById("searchForm").innerHTML=data.content;
                        loadJSFile("js/SearchScreen.js");
                      //  loadJSFile("js/FormatUtils.js");
                        loadJSFile("js/accounting.js");
                         myApp.hidePreloader();
                    },
                    error: function(e) {
                        myApp.hidePreloader();
                        errorMessage();
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
            document.getElementById("toolbar").innerHTML=data.toolbar;
            sessionStorage.setItem("Languages",data.Languages);
            var languages=sessionStorage.getItem('Languages');
            languagesList = JSON.parse(languages); 
            changeLangConfirmationMessage = JSON.stringify(data.ChangeLangConfirmationMessage);
            changeLangConfirmationMessage = changeLangConfirmationMessage.substr(1,changeLangConfirmationMessage.length-2);
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
            errorMessage();
        }
    });          
               
}                
function createLanguagesList(screen){
    $$('.create-language-links-'+screen).on('click', function () {
  var clickedLink = this;
    var output="";        
    for(var i=0 ; i< languagesList.LangsList.length ; i++)
        { 
            var display=languagesList.LangsList[i].display;
            output=output+'<li><a href="#" class="item-link list-button" onclick="switchLanguage(\''+languagesList.LangsList[i].property+'\')">'+display  +'</li>';
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
    
      myApp.confirm(changeLangConfirmationMessage,
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
                   document.getElementById("toolbar").innerHTML=null;
                   loadTaskList();
                   setTemplate_HeaderData("homePage");                   
                }
            else
                {
             isSwitchLanguage = true;
             HomeBackButton.style.visibility="hidden";  
             mainView.router.back({force:true,pageName:"homePage"});
             mainView.history=["#homePage"];
             leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                }

        },
        error: function(e) {               
            myApp.hidePreloader();    
            errorMessage();    
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
function lunchSearchResult(url){           
     var data="{"+    
        "\"userData\":"+sessionStorage.getItem("userData")+","+ 
        "\"item\":\""+currentItem+"\","+
        "\"searchParams\":"+searchParams+","+
        "\"start\":\"0\","+
        "\"limit\":\"30\","+      
        "\"windowWidth\":\""+window.innerWidth+"\","+
        "\"windowHeight\":\""+(window.innerHeight-90)+"\"}";  
    console.log("SearchParams",data);          
    $.ajax({             
        type: 'POST',           
        url: url,                      
        contentType: "text/plain",                          
        dataType: "json",                            
        data: data,         
        success: function(data) {   
            
            document.getElementById("searchResult").innerHTML=data.dataGrid;  
            totalRowNumber=data.TotalRows;
            console.log(totalRowNumber);
             var tasksTableElement =document.getElementById("tasksTableElement");
             myApp.attachInfiniteScroll(tasksTableElement);
            loadJSFile("js/infiniteScroll.js");
            loadJSFile("js/WorkflowManager.js");
            loadJSFile("js/SearchResultScreen.js");
            myApp.hidePreloader();
            
        },   
        error: function(e) { 
            console.log(e.message);  
            verifconnexion = false;  
            
            myApp.hidePreloader();
            errorMessage();
                         
        }                           
    });      
}         
function generateConnectedComboItems(idChild,screenTagName,val,child,entity,sharedConfig,property){ 
    var url =  "http://"+sessionStorage.getItem('Ip_config')+":"+sessionStorage.getItem('Ip_port')+"/MobileAPI.svc/ConnectedComboOptions"; 
    connectedComboOptions(url,idChild,val,child,entity,screenTagName,sharedConfig,property);

} 

function connectedComboOptions(url,idChild,val,child,entity,screenTagName,sharedConfig,property) {
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
                    
                        
                        for(var i=0;i<child.length;i++)
                            {
                                document.getElementById(childs[i]).innerHTML=data[childs[i]];
                            }
                                                                    
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown+'  in processing!'+textStatus);
                    }                   
            });          
};
function HomeBack(){
    HomeBackButton.style.visibility="hidden";       
    mainView.router.back({force:true,pageName:"homePage"});  
    mainView.history=["#homePage"];
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
    TaskId=taskId;
    ExecutedWorkflowName=workflowName;
    TargetTab = targettab;       
    mainView.router.load({url: "executeTaskScreen.html",reload:true});
}
function GetExecuteTaskScreen(url){  
    var data="{"+
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"taskId\":\""+TaskId+"\"," +
        "\"targetTab\":\""+TargetTab+"\"," +         
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
                    stopWFMessage=data.stopWFMessage;
                     eligibility=data.eligibility;
                    WithCollectQuestion=data.WithCollectQuestion;
                     currentItem=data.screenName;
                     pageTitleElement=document.getElementById("title_executeTaskScreen");
                     pageTitleElement.textContent=data.itemShortName;
                     $('#executeTask-toolbarContent').append(data.buttonsDiv);
                        divId = data.divId;
                        engine = data.screenEngine;    
                    docMenu=(data.DocumentMenu);
                    extendedProperties=data.ExtendedProperties;    
                    myApp.hidePreloader();
                    manageInstructionGuideResponse(data);
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
             
            console.log(e.message);  
            verifconnexion = false;                           
            myApp.hidePreloader();
            errorMessage();
        }                             
    });       
}         
function manageInstructionGuideResponse(data){
    if(data.instructionGuide!==undefined)  
    {
         InstructionGuide=data.instructionGuide;   
         showWorkflowInstructionGuide(); 
        $('#executeTask-toolbarContent').append(data.instructionGuideButton); 
    }
} 
function showWorkflowInstructionGuide(){  
     myApp.popup('<div class="popup" style="width: 50% !important; height :50% !important; top: 25% !important; top:25% !important; left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important background : #f1f1f1 !important;" >' + InstructionGuide + '</div>', true); 
}

function GetPricingConditionScreen(){
    var url= "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GetRelatedItemScreen";    

    var data="{"+    
      "\"screenName\":\""+divId+"\","+
      "\"screenType\":\"pricingCondition\","+
      "\"userData\":"+sessionStorage.getItem("userData")+","+
      "\"mainItemId\":\""+itemId+"\","+
      "\"screenWidth\":\""+window.innerWidth+"\"," +
      "\"relatedItemId\":\""+relatedItemId+"\"}"; 
    console.log("SearchParams",data);        
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
            ManagePricingCnditionComponents();
        },
        error: function(e) { 
            myApp.hidePreloader();
        }              
    });  
}
    


