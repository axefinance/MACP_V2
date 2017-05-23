var StartWfEligibilityObject;
var WorkflowId;
var WorkFlowName;
var DeviatedMsg;
var RequiredDocument;
var RequiredMitigant;
function startWorkflow_ButtonAction(itemId){
    myApp.showPreloader();
    selectedItem=itemId;
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/StartWorkFlowButtonAction';
   var popupWidth=window.innerWidth*0.80;
     var popunHeight=95;
    popupWidth=Math.floor(popupWidth); 
     var data="{"+     
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"entityName\":\""+currentItem+"\","+  
        "\"itemId\":\""+itemId+"\"," + 
        "\"popupWidth\":\""+popupWidth+"\","+
        "\"popupHeight\":\""+popunHeight+"\"}";    
    console.log("SearchParams",data);                
    $.ajax({             
        type: 'POST',               
        url: url,                    
        contentType: "text/plain",                          
        dataType: "json",                              
        data: data,         
        success: function(data) {                 
            
            //myApp.closeModal();
            myApp.closeModal(".popup",true);
            manageStartWorkFlowResponse(data); 
          
           
        },
        error: function(e) {         
            verifconnexion = false;  
             myApp.hidePreloader();
            myApp.alert("error occured"); 
        }                           
    });    
}        
      
    
function manageStartWorkFlowResponse(data){
    switch(data.status)
        {  
            case "ok":
                {
                  if(data.response==="defaultwf")
                      {
                          myApp.hidePreloader();
                           myApp.confirm(data.message, 'MACP',
                            function () {
                                       startWorkFlowItem(data.wfId);
                                        },
                                        function () {
                                       
                                            }  
                                        );
                      }    
                    else if(data.response==="wfStillRunning")
                        {
                              myApp.hidePreloader();
                              myApp.alert(data.message,'MACP');
                        }
                  else
                        {
                            myApp.hidePreloader();
                            myApp.popup('<div class="popup" style="overflow:hidden !important; width: 80% !important; top: 10% !important;left: 10% !important; margin-left: 0px !important;height:80% !important; margin-top: 0px !important; position:absoloute !important; padding-left:5px !important; padding-right:5px !important ;padding-top:7px !important; padding-bottom:7px !important"  >'+data.Content+'</div>', true);
                            if(data.runningWF!=undefined)
                                  myApp.alert(data.runningWF,'MACP',function(){
                                     myApp.closeModal(".popup",true);
                                  });
                            if(data.noPublishedWF!=undefined)
                                {
                                     myApp.alert(data.noPublishedWF,'MACP',function(){
                                     myApp.closeModal(".popup",true);
                                  });
                                }
                        }  
                    break;            
                }
            case "error" :
                {
                  myApp.alert("error in worflow");
                }
        }
}
  
function startWorkFlowEvent(workflowId,message,workflowName){
    WorkFlowName=workflowName;
     WorkflowId=workflowId;
     myApp.confirm(message, 'MACP',
                            function () {
                                startWorkFlowItem(); 
                                        },
                                        function () {
                                        
                                            }
                                        );
}

function startWorkFlowItem(){
   
    myApp.showPreloader(); 
     var popupWidth=window.innerWidth*0.80;
        popupWidth=Math.floor(popupWidth); 
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/StartWorkFlow';
     var data="{"+            
        "\"itemId\":\""+selectedItem+"\","+  
        "\"userData\":"+sessionStorage.getItem("userData")+","+  
        "\"workfloawId\":\""+WorkflowId+"\"," +
        "\"workflowName\":\""+WorkFlowName+"\"," + 
        "\"popupWidth\":\""+popupWidth+"\","+
        "\"entityName\":\""+currentItem+"\"}";    
     $.ajax({             
        type: 'POST',                     
        url: url,                  
        contentType: "text/plain",                          
        dataType: "json",                             
        data: data,         
        success: function(data) { 
            myApp.hidePreloader();
            myApp.closeModal(".popup",true);
            manageStartWorkFlowItemResponse(data); 
             
        },
        error: function(e) {       
            console.log(e.message);      
              myApp.hidePreloader();
            myApp.alert("error occured");             
        }                                 
    });      
}

function manageStartWorkFlowItemResponse(data){
    myApp.hidePreloader(); 
    if(data.withEligibility!=undefined)
                {
                    StartWfEligibilityObject=data.EligibilityObject;
                     myApp.hidePreloader(); 
                    myApp.popup('<div class="popup" style="width: 80% !important; top: 10% !important;left: 10% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important" >'+data.poponContent+'</div>', true);
                }
    else if(data.behavior!=undefined)
    {   
            manageControlValidatorBehavior(data);
    }
    else if(data.requiredDocument!=undefined)
    {
            manageRequiredDocumentResponse(data);
    }  
    else if(data.requiredMitigant!=undefined)
    {
            managerRequiredMitigantResponse(data);
    }
    else
    { 
             HomeBackButton.style.visibility="hidden";  
             myApp.hidePreloader(); 
             myApp.closeModal('.popup');
             mainView.router.back({force:true,pageName:"homePage"});
             mainView.history=["#homePage"];
             leftView.router.load({force : true,pageName:'MenuParent',animatePages:false});
    }
}

function managerRequiredMitigantResponse(data){
    RequiredMitigant=data.requiredMitigant;
    DeviatedMsg=data.message;
    if(data.withDeviation==="true")
        {
     myApp.popup('<div class="popup" style="width: 50% !important; height: 50% !important; top: 25% !important;left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important background : #f1f1f1 !important;" ><div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">'+data.message+"</br></br>"+data.requiredMitigant+"</br></br>"+data.question+'</br></div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="deviationComment" onkeyup="saveStartWorkflow_RequiredMitigantComent_enabledButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick="saveStartWorkflow_RequiredMitigantComent()" id="saveStartWorkflow_RequiredMitigantComentButton">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()">No</a></div></div></div>', true);
        }
    else
        {
            myApp.alert(data.message+"</br></br>"+data.requiredMitigant+"</br>") ; 
        }
}

function manageRequiredDocumentResponse(data){
    RequiredDocument=data.requiredDocument;
    DeviatedMsg=data.message;
    if(data.withDeviation==="true")
        {
     myApp.popup('<div class="popup" style="width: 50% !important; height: 50% !important; top: 25% !important;left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important background : #f1f1f1 !important;" ><div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">'+data.message+"</br></br>"+data.requiredDocument+"</br></br>"+data.question+'</br></div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="deviationComment" onkeyup="saveStartWorkflow_RequiredDocumentComent_enabledButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick="saveStartWorkflow_RequiredDocumentComent()" id="saveStartWorkflow_RequiredDocumentComentButton">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()">No</a></div></div></div>', true);
        }
    else
        {
            myApp.alert(data.message+"</br></br>"+data.requiredDocument+"</br>") ; 
        }
}


function saveStartWorkflow_RequiredDocumentComent_enabledButton(textarea){
    var saveStartWorkflow_RequiredDocumentComentButton=document.getElementById("saveStartWorkflow_RequiredDocumentComentButton");
    if(textarea.value.length!=0)
        {
            saveStartWorkflow_RequiredDocumentComentButton.className ="button button-fill active";
        }
    else
       {
        saveStartWorkflow_RequiredDocumentComentButton.className ="button button-fill disabled";
       }
}

function saveStartWorkflow_RequiredMitigantComent_enabledButton(textarea){
    var saveStartWorkflow_RequiredMitigantComentButton=document.getElementById("saveStartWorkflow_RequiredMitigantComentButton");
    if(textarea.value.length!=0)
        {
            saveStartWorkflow_RequiredMitigantComentButton.className ="button button-fill active";
        }
    else
    {
        saveStartWorkflow_RequiredMitigantComentButton.className ="button button-fill disabled";
    }
    
}

function manageControlValidatorBehavior(data){
                                if(data.behavior==="blockingAlert")
                                    {
                                        myApp.alert(data.message,"Exception");
                                    }
                                else if(data.behavior==="optionalAlert")
                                    {
                                         myApp.confirm(data.message, "Exception", function () {
                                          checkWorkflowEligibility();
                                         });
                                    }
                                else if (data.behavior==="deviationAlert")
                                    {
                                         DeviatedMsg=data.message;
                                         myApp.popup('<div class="popup" style="width: 50% !important; height: 50% !important; top: 25% !important;left: 25% !important; margin-left: 0px !important; margin-top: 0px !important; position:absoloute !important background : #f1f1f1 !important;" ><div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">'+DeviatedMsg+'</br></br>'+data.question+'</br></div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="startWFdeviationComment" onkeyup="saveStartWFDeviationComment_enabledButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick="saveStartWFDeviationComment()" id="saveWFDeviationCommentButton">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()">No</a></div></div></div>', true);
                                    }
}
 
function checkWorkflowEligibility(){   
        myApp.showPreloader(); 
     var popupWidth=window.innerWidth*0.80;
        popupWidth=Math.floor(popupWidth);
     var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/CheckWorkflowEligibility';
      var data="{"+  
        "\"mainItemId\":\""+selectedItem+"\","+
        "\"item\":\""+currentItem+"\","+
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"workflowId\":\""+WorkflowId+"\","+
        "\"workflowName\":\""+WorkFlowName+"\","+  
        "\"popupWidth\":\""+popupWidth+"\"}";
    myApp.showPreloader();
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
                   myApp.closeModal(".popup",true);
                   manageStartWorkFlowItemResponse(data);  
                    
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
            myApp.alert("error occured");                   
        }                                         
    }); 

}

function saveStartWFDeviationComment_enabledButton(textarea){
   
    var stopWorkflowButton=document.getElementById("saveWFDeviationCommentButton");
    if(textarea.value.length!=0)
        {
            stopWorkflowButton.className ="button button-fill active";
        }
    else
    {
        stopWorkflowButton.className ="button button-fill disabled";
    }
    
      
}; 

function saveStartWFDeviationComment(){
     var comment=document.getElementById("startWFdeviationComment").value; 
     myApp.showPreloader();
     var popupWidth=window.innerWidth*0.80;
        popupWidth=Math.floor(popupWidth); 
     var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveDeviationCommentOnStartWorkflow';
     var data="{"+       
       "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\""+selectedItem+"\","+
        "\"item\":\""+currentItem+"\","+
        "\"workflowId\":\""+WorkflowId+"\","+
        "\"workflowName\":\""+WorkFlowName+"\","+ 
        "\"popupWidth\":\""+popupWidth+"\","+
        "\"deviationMsg\":\""+comment+"\","+
        "\"errorMsg\":\""+DeviatedMsg+"\"}"; 
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
                   myApp.closeModal(".popup",true); 
                    manageStartWorkFlowItemResponse(data);
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
            myApp.alert("error occured");                     
        }                                         
    });       
}
    

function saveStartWorkflow_EligibilityComment(){
 var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveEligibilityCommentAndStartWorkflow';
    var data="{"+  
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"mainItemId\":\""+selectedItem+"\","+
        "\"item\":\""+currentItem+"\","+
        "\"workflowName\":\""+WorkFlowName+"\"," +
        "\"workflowId\":\""+WorkflowId+"\","+
        "\"eligibilityObject\":"+JSON.stringify(StartWfEligibilityObject)+","+
        "\"commentList\":"+JSON.stringify(getCommentsList())+"}";
    myApp.showPreloader();  
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
                      myApp.closeModal(".popup",true); 
                     manageStartWorkFlowItemResponse(data);
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
            myApp.alert("error occured");                   
        }                                         
    }); 
}

function saveStartWorkflow_RequiredMitigantComent()
{
     var comment=document.getElementById("deviationComment").value; 
      myApp.showPreloader();
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveRequiredMitigantCommentOnStartWorkflow';
    var data="{"+       
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"deviatedMsg\":\""+DeviatedMsg+"\","+
        "\"requiredDocument\":\"\","+
        "\"requiredMitigant\":\""+RequiredMitigant+"\","+
        "\"mainItemId\":\""+selectedItem+"\","+
        "\"item\":\""+currentItem+"\","+
        "\"workflowId\":\""+WorkflowId+"\","+
        "\"workflowName\":\""+WorkFlowName+"\"," +
        "\"comment\":\""+comment+"\"}";   
      
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
                    myApp.closeModal(".popup",true);
                     manageStartWorkFlowItemResponse(data);
                    
                }    
            else                         
                { 
                    myApp.hidePreloader();
                    myApp.alert("error occured");
                }
        },  
        error: function(e) {           
            console.log(e.message);  
            verifconnexion = false;        
            myApp.hidePreloader();
            myApp.alert("error occured");                     
        }                                         
    }); 
}

function saveStartWorkflow_RequiredDocumentComent(){
     var comment=document.getElementById("deviationComment").value; 
      myApp.showPreloader();
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/SaveRequiredDocumentCommentOnStartWorkflow';
    var data="{"+       
        "\"userData\":"+sessionStorage.getItem("userData")+","+
        "\"deviatedMsg\":\""+DeviatedMsg+"\","+
        "\"requiredDocument\":\""+RequiredDocument+"\","+
        "\"requiredMitigant\":\"\","+
        "\"mainItemId\":\""+selectedItem+"\","+
        "\"item\":\""+currentItem+"\","+
        "\"workflowId\":\""+WorkflowId+"\","+
        "\"workflowName\":\""+WorkFlowName+"\"," +
        "\"comment\":\""+comment+"\"}";   
      
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
                    myApp.closeModal(".popup",true);
                     manageStartWorkFlowItemResponse(data);
                    
                }    
            else                         
                { 
                    myApp.hidePreloader();
                    myApp.alert("error occured");
                }
        },  
        error: function(e) {           
            console.log(e.message);  
            verifconnexion = false;        
            myApp.hidePreloader();
            myApp.alert("error occured");                     
        }                                         
    }); 
}

function getCommentsList(){
    var commentlist={};
   for (var j=0; j < StartWfEligibilityObject.length; j++)
   {
       var element=document.getElementById("endTaskComment__"+StartWfEligibilityObject[j].eligibility_criteria_id);
       var comment=element.value;     
       commentlist[StartWfEligibilityObject[j].eligibility_criteria_id] = comment;
   }
    
    return commentlist;
}