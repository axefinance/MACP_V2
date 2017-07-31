var loading = false;
var infiniteScroll_JSFlag; 
// Last loaded index
var lastIndex = 30;
 
 
// Append items per load
var itemsPerLoad = 10;
myApp.attachInfiniteScroll($$('.infinite-scroll'))
// Attach 'infinite' event handler
$$('.infinite-scroll').on('infinite', function () {
   
    if (loading) return;  
    loading = true;
    setTimeout(function () {  

        loading = false;
        var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetNextSearchResult';
        if (lastIndex >= totalRowNumber) {
            myApp.detachInfiniteScroll($$('.infinite-scroll'));
            $$('.infinite-scroll-preloader').remove();
            return;
        }      
      
           if(currentSearchType=="searchResult")
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
        "\"subItem\":\""+currentSearchItem+"\","+
        "\"searchParams\":"+currentSearchParams+","+
        "\"start\":\""+lastIndex+"\","+
        "\"limit\":\"10\","+      
        "\"windowWidth\":\""+screenWidth+"\","+
        "\"searchScreenType\":\""+currentSearchType+"\","+
        "\"windowHeight\":\""+screenHeight+"\"}"; 
          
        $.ajax({             
            type: 'POST',              
            url: url,                                     
            contentType: "text/plain",                            
            dataType: "json",                               
            async: false,                                
            data: data,         
            success: function(data) {              
                if(data.data==="")  
                { 
                    $$('.infinite-scroll-preloader').remove();
                    return;  
                }
                if(currentSearchType=="searchResult")
                    {
                $$('.tasksTableElement ul').append(data.data);
              
                    }
                else
                    {
                    $$('.tasksTableElementOnPopon ul').append(data.data);
                    }
              lastIndex=lastIndex+itemsPerLoad; 
            },
            error: function(e) { 
                console.log(e.message);  
                verifconnexion = false;        
                myApp.hidePreloader();
                errorMessage();
                 
            }           
        }); 
    }, 1000);
});
