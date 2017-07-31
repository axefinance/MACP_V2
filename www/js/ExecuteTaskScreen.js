var eligibilityObject;
var deviatedMsg;
var withValidatorControl;
var requiredDocument;
function stopWorkflow(){
   var comment=document.getElementById("stopWorkflowComment").value; 
    
   myApp.closeModal();
   myApp.showPreloader();
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/StopWorkflow';
    var data="{"+       
        "\"taskId\":\""+TaskId+"\"," +
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\""+itemId+"\"," +    
        "\"comment\":\""+comment+"\"," +
       "\"workflowName\":\""+ExecutedWorkflowName+"\"}";
  $.ajax({             
        type: 'POST',           
        url: url,                  
        contentType: "text/plain",                           
        dataType: "json",                            
        data: data,             
        success: function(data) {       
            if(data.status==="ok")
                {
                    myApp.hidePreloader(); 
                    extendedProperties=null;
                    HomeBackButton.style.visibility="hidden";   
                    mainView.router.back({force:true,pageName:"homePage"});
                    mainView.history=["#homePage"];
                    if(!checkInternetConnection())                                                   
                        myApp.alert("please check your internet connection");
                    else 
                        leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
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
$$('.stop-Workflow-form-to-data').on('click', function(){
     showcommentPopup();
});
function enabledButton(textarea){
   
    var stopWorkflowButton=document.getElementById("stopWfYesButton");
    if(textarea.value.length!=0)
        {
            stopWorkflowButton.className ="button button-fill active";
        }
    else
    {
        stopWorkflowButton.className ="button button-fill disabled";
    }
    
      
}; 
function saveDeviationComment_enabledButton(textarea){
   
    var stopWorkflowButton=document.getElementById("saveDeviationCommentButton");
    if(textarea.value.length!=0)
        {
            stopWorkflowButton.className ="button button-fill active";
        }
    else
    {
        stopWorkflowButton.className ="button button-fill disabled";
    }
    
      
}; 
function endTaskButtonEvent(mainItemId)
{

        var formId = "#my-mainData-form__"+mainItemId;
        var isValidForm = requiredFormComponent(formId); 
        if(isValidForm){
             endTaskEvent(formId,mainItemId);
        }
    
}
function showcommentPopup(){
     myApp.popup('<div class="popup" style="width: 40% !important; height: 40% !important; top: 30% !important;left: 30% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important; background : #f1f1f1 !important;" ><div class="content-block-title">'+stopWFMessage+'</div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="stopWorkflowComment" onkeyup="enabledButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick="stopWorkflow()" id="stopWfYesButton">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()">No</a></div></div></div>', true);
}  
function endTaskEvent(formId,mainItemId){
   myApp.showPreloader();
      var formData = myApp.formToData(formId);
     var   screenParameters=JSON.stringify(formData); 
     var popupWidth=window.innerWidth*0.8;
    popupWidth=Math.floor(popupWidth);
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/EndTaskButtonEvent';
    var data="{"+       
        "\"userData\":"+sessionStorage.getItem("userData")+","+ 
        "\"mainItemId\":\""+mainItemId+"\","+
        "\"extendedProperties\":"+extendedProperties+","+
        "\"screenName\":\""+gSubItem+"\","+
        "\"taskId\":\""+TaskId+"\","+
        "\"WithCollectQuestion\":\""+WithCollectQuestion+"\","+
        "\"parameters\":"+screenParameters+","+
        "\"poponWidth\":\""+popupWidth+"\"}";
  $.ajax({             
        type: 'POST',             
        url: url,                  
        contentType: "text/plain",                           
        dataType: "json",                            
        data: data,               
        success: function(data) {         
            if(data.status==="ok")
                {
                    eligibilityObject=data.eligibilityObject;
                    withValidatorControl=data.withValidatorControl;
                    myApp.hidePreloader();
                    if(data.poponContent!=undefined)
                        {
                    myApp.popup('<div class="popup" style="width: 80% !important; top: 10% !important;left: 10% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important; background : #f1f1f1 !important;" >'+data.poponContent+'</div>', true);
                        }
                        else
                        {
                            if(withValidatorControl==="true")        
                            manageControlValidatorBehavior(data);    
                            else
                                {
                                    if(data.requiredDocuments!=undefined)
                                        {
                                             manageRequiredDocument(data);
                                        }
                                    else if(data.CollectQuestions!=null)
                                        {
                                            manageCollectQuestion(data.CollectQuestions);
                                        }
                                    else 
                                        {
                                            myApp.hidePreloader(); 
                                            HomeBackButton.style.visibility="hidden";
                                            extendedProperties=null;
                                            mainView.router.back({force:true,pageName:"homePage"});
                                            mainView.history=["#homePage"];
                                            if(!checkInternetConnection())                                                   
                                                myApp.alert("please check your internet connection");
                                            else 
                                                leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                                        }
                                        
                                }
                        }
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

function manageCollectQuestion(CollectQuestion)
{
     myApp.popup('<div class="popup" style="width: 80% !important; height: 80% !important; top: 10% !important;left: 10% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important; background : #f1f1f1 !important;" >'+CollectQuestion+'</div>', true);  
}
function manageControlValidatorBehavior(data){
    if(data.message!=undefined)    
                            {
                                var behavior=data.behavior;
                                if(behavior==="blockingAlert")
                                    {
                                        myApp.alert(data.message,"Exception");
                                    }
                                else if(behavior==="optionalAlert")
                                    {
                                         myApp.confirm(data.message, "Exception", function () {
                                          checkRequiredDocument();
                                         });
                                    }
                                else if (behavior==="deviationAlert")
                                    {
                                        deviatedMsg=data.message;
                                         myApp.popup('<div class="popup" style="width: 50% !important; height: 50% !important; top: 25% !important;left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important; background : #f1f1f1 !important;" ><div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">'+deviatedMsg+'</br></br>'+data.question+'</br></div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="deviationComment" onkeyup="saveDeviationComment_enabledButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick="saveDeviationComment()" id="saveDeviationCommentButton">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()">No</a></div></div></div>', true);
                                    }
                            }
}
function checkRequiredDocument(){
     myApp.showPreloader();
     var formData = myApp.formToData('#my-mainData-form');
     var   screenParameters=JSON.stringify(formData); 
     var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/CheckRequiredDocument';
     var data="{"+       
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\""+itemId+"\","+
        "\"extendedProperties\":"+extendedProperties+","+
        "\"screenName\":\""+gSubItems+"\","+
        "\"taskId\":\""+TaskId+"\","+
        "\"WithCollectQuestion\":\""+WithCollectQuestion+"\","+
        "\"parameters\":"+screenParameters+"}";
    $.ajax({             
        type: 'POST',             
        url: url,                  
        contentType: "text/plain",                             
        dataType: "json",                              
        data: data,             
        success: function(data) {       
            if(data.status==="ok")  
                {
                    myApp.hidePreloader(); 
                    myApp.closeModal(); 
                    if(data.requiredDocuments!=undefined)
                        {
                           myApp.hidePreloader();
                           manageRequiredDocument(data);
                        }
                    else
                        {
                          myApp.hidePreloader(); 
                            extendedProperties=null;
                            HomeBackButton.style.visibility="hidden";       
                            mainView.router.back({force:true,pageName:"homePage"});
                            mainView.history=["#homePage"];
                            if(!checkInternetConnection())                                                   
                                myApp.alert("please check your internet connection");
                            else 
                                leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                        }
                }    
            else                       
                { 
                    myApp.hidePreloader();
                }
        },
});
}
function saveRequiredDocumentComent(){
     var comment=document.getElementById("deviationComment").value; 
      myApp.showPreloader();
     var formData = myApp.formToData('#my-mainData-form');
     var   screenParameters=JSON.stringify(formData); 
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveDeviationComment';
    var data="{"+       
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"deviatedMsg\":\""+deviatedMsg+"\","+
        "\"requiredDocument\":\""+requiredDocument+"\","+
        "\"mainItemId\":\""+itemId+"\","+
        "\"screenName\":\""+gSubItem+"\","+
        "\"taskId\":\""+TaskId+"\","+
        "\"extendedProperties\":"+extendedProperties+","+
        "\"comment\":\""+comment+"\","+
        "\"WithCollectQuestion\":\""+WithCollectQuestion+"\","+
        "\"parameters\":"+screenParameters+"}";   
    
  $.ajax({             
        type: 'POST',               
        url: url,                  
        contentType: "text/plain",                             
        dataType: "json",                              
        data: data,             
        success: function(data) {       
            if(data.status==="ok")  
                {
                    myApp.hidePreloader(); 
                    myApp.closeModal(); 
                    if(data.WithrequiredDocument!=undefined)
                        {
                         manageRequiredDocument(data);
                        }
                    else
                        {
                            myApp.hidePreloader(); 
                            extendedProperties=null;
                            HomeBackButton.style.visibility="hidden";       
                            mainView.router.back({force:true,pageName:"homePage"});
                            mainView.history=["#homePage"];
                            if(!checkInternetConnection())                                                   
                                myApp.alert("please check your internet connection");
                            else 
                                leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                        }
                    
                }    
            else                         
                { 
                    myApp.hidePreloader();
                    myApp.alert("error saving","Error"); 
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
function saveDeviationComment(){
    var comment=document.getElementById("deviationComment").value; 
    myApp.showPreloader();
     var formData = myApp.formToData('#my-mainData-form');
     var   screenParameters=JSON.stringify(formData); 
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveDeviationComment';
     var data="{"+       
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"deviatedMsg\":\""+deviatedMsg+"\","+
        "\"requiredDocument\":\"\","+
        "\"mainItemId\":\""+itemId+"\","+
        "\"screenName\":\""+gSubItem+"\","+
        "\"taskId\":\""+TaskId+"\","+
         "\"WithCollectQuestion\":\""+WithCollectQuestion+"\","+
         "\"extendedProperties\":"+extendedProperties+","+
        "\"comment\":\""+comment+"\","+
        "\"parameters\":"+screenParameters+"}"; 
  $.ajax({             
        type: 'POST',             
        url: url,                  
        contentType: "text/plain",                             
        dataType: "json",                              
        data: data,             
        success: function(data) {       
            if(data.status==="ok")  
                {
                    
                    myApp.hidePreloader(); 
                    myApp.closeModal(); 
                    if(data.WithrequiredDocument!=undefined)
                        {
                            if(data.deviation==="true")
                             manageRequiredDocument(data);
                            else
                           myApp.alert(data.message+"</br></br>"+data.requiredDocuments+"</br></br>","MACP") ;     
                        }
                    else if(data.endTask!=undefined)
                        {
                             HomeBackButton.style.visibility="hidden";  
                             extendedProperties=null;
                             mainView.router.back({force:true,pageName:"homePage"});
                             mainView.history=["#homePage"];
                             if(!checkInternetConnection())                                                   
                                myApp.alert("please check your internet connection");
                            else 
                                leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                        }
                }      
            else                       
                { 
                    myApp.hidePreloader();
                    myApp.alert("error saving","Error"); 
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


function manageRequiredDocument(data){
     if(data.deviation==="true")
         {
                          
     deviatedMsg=data.message;
     requiredDocument=data.requiredDocuments;
     myApp.popup('<div class="popup" style="width: 50% !important; height: 50% !important; top: 25% !important;left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important; background : #f1f1f1 !important;" ><div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">'+data.message+"</br></br>"+data.requiredDocuments+"</br></br>"+data.question+'</br></div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="deviationComment" onkeyup="saveDeviationComment_enabledButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick="saveRequiredDocumentComent()" id="saveDeviationCommentButton">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()">No</a></div></div></div>', true);
         }
    else
        {
        myApp.alert(data.message+"</br></br>"+data.requiredDocuments+"</br>","MACP") ; 
        }
};
function saveEligibilityComment(){
    
     myApp.showPreloader();
     var formData = myApp.formToData('#my-mainData-form');
     var   screenParameters=JSON.stringify(formData); 
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveEligibilityComment';
    var data="{"+  
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\""+itemId+"\","+
        "\"screenName\":\""+gSubItem+"\","+
        "\"parameters\":"+screenParameters+","+
        "\"taskId\":\""+TaskId+"\","+
        "\"WithCollectQuestion\":\""+WithCollectQuestion+"\","+
        "\"eligibilityObject\":"+JSON.stringify(eligibilityObject)+","+
        "\"extendedProperties\":"+extendedProperties+","+
        "\"withValidatorControl\":\""+withValidatorControl.toLowerCase()+"\","+
        "\"commentList\":"+JSON.stringify(getCommentsList())+"}";
  $.ajax({             
        type: 'POST',               
        url: url,                    
        contentType: "text/plain",                           
        dataType: "json",                              
        data: data,             
        success: function(data) {       
            if(data.status==="ok")  
                {
                    myApp.hidePreloader(); 
                    myApp.closeModal(); 
                    if(withValidatorControl==="True")
                        {
                            manageControlValidatorBehavior(data);
                        }
                    else if(data.WithrequiredDocument!=undefined)
                       manageRequiredDocument(data);
                    else
                        {
                        HomeBackButton.style.visibility="hidden";     
                            extendedProperties=null;
                             mainView.router.back({force:true,pageName:"homePage"});
                             mainView.history=["#homePage"];
                             if(!checkInternetConnection())                                                   
                                 myApp.alert("please check your internet connection");
                             else 
                                 leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                        }
                    
                }    
            else                       
                { 
                    myApp.hidePreloader();
                     myApp.alert("error saving","Error"); 
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
function getCommentsList(){
    var commentlist={};
   for (var j=0; j < eligibilityObject.length; j++)
   {
       var element=document.getElementById("endTaskComment__"+eligibilityObject[j].eligibility_criteria_id);
       var comment=element.value;     
       commentlist[eligibilityObject[j].eligibility_criteria_id] = comment;
   }
    
    return commentlist;
} 

function saveCollectQuestionEvent(){   
    var formId = "#Collect-Question-form";
    var isValidForm = requiredFormComponent(formId); 
   
  /*  if(!isValid)
    {
       $(x[indexToSelect]).next().children().first().focus();
    }else*/
    if(isValidForm)
    {
       saveCollectQuestion();
       
    }
}

function saveCollectQuestion(){ 
    myApp.closeModal();
    myApp.showPreloader();
     var collectQuestionData = myApp.formToData('#Collect-Question-form');
     var   collectQuestionParameters=JSON.stringify(collectQuestionData); 
      var formData = myApp.formToData('#my-mainData-form');
     var   screenParameters=JSON.stringify(formData); 
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveCollectQuestionAndEndTask';
    var data="{"+  
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\""+itemId+"\","+
        "\"screenName\":\""+gSubItems+"\","+
        "\"parameters\":"+screenParameters+","+
        "\"collectQuestionParameters\":"+collectQuestionParameters+","+
        "\"taskId\":\""+TaskId+"\"}";
  $.ajax({             
        type: 'POST',               
        url: url,                    
        contentType: "text/plain",                           
        dataType: "json",                              
        data: data,             
        success: function(data) {       
            if(data.status==="ok")  
                {
                             myApp.hidePreloader(); 
                             HomeBackButton.style.visibility="hidden";  
                             extendedProperties=null;
                             mainView.router.back({force:true,pageName:"homePage"});
                             mainView.history=["#homePage"];
                             if(!checkInternetConnection())                                                   
                                 myApp.alert("please check your internet connection");
                             else 
                                 leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
                        
                    
                }    
            else                       
                { 
                    myApp.hidePreloader();
                     myApp.alert("error saving","Error"); 
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


  

