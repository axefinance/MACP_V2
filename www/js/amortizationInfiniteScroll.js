var loading = false;
var infiniteScroll_JSFlag; 
var lastIndex = 30;
var itemsPerLoad = 10;
var loading = false;
var infiniteScroll_JSFlag; 
myApp.attachInfiniteScroll($$('.amortization-infinite-scroll'));
$$('.amortization-infinite-scroll').on('infinite', function () {
   
  if (loading) return;  
  loading = true;
    
  // Emulate 1s loading     
  setTimeout(function () {
        if (lastIndex >= totalRowNumber) {
      myApp.detachInfiniteScroll($$('.amortization-infinite-scroll'));
      $$('.infinite-scroll-preloader').remove();
      return;
    } 
    // Reset loading flag  
    loading = false;
    var popupWidth=window.innerWidth*0.90;
     var popupHeight=window.innerHeight*0.90;
     popupWidth=Math.floor(popupWidth); 
     popupHeight=Math.floor(popupHeight); 
     var formData = myApp.formToData('#my-relatedItemPopup-form');
     var parameters=JSON.stringify(formData);
     var stringify= getGridonPoponsData("#my-relatedItemPopup-form");
     var data="{"+ 
       "\"limit\":\"10\","+
       "\"start\":\""+lastIndex+"\","+
       "\"mainItemId\":\""+gMainItemId+"\"," + 
       "\"screenTag\":\""+gScreenName+"\"," +   
       "\"parentId\":\""+gMainItemId+"\"," +  
       "\"screenName\":\""+gSubItem+"\","+
       "\"userData\":"+sessionStorage.getItem("userData")+","+ 
       "\"poponWidth\":\""+popupWidth+"\"," + 
       "\"poponHeight\":\""+popupHeight+"\"," +  
       "\"stringify\":"+stringify+"," +  
       "\"parameters\":"+parameters+"}" ;   
    var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetNextAmortizationGridRows';
   
    $.ajax({ 
        type: "POST",  
        dataType:"json",    
        url: url,    
        contentType: "text/plain",                           
        dataType: "json",                         
        data: data,        
        success: function(data) {             
            if(data.data==="")  
              { 
                  $$('.infinite-scroll-preloader').remove();
                 return;  
              }
            $$('.amortization_tasksTableElement ul').append(data.content);
            lastIndex=lastIndex+itemsPerLoad; 
            
        },
        error: function(e) { 
            
            verifconnexion = false;        
            myApp.hidePreloader();
            errorMessage(e.message);
                    
        }           
    });  
  }, 1000);
})           