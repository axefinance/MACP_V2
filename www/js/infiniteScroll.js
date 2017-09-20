var loading = false;
var infiniteScroll_JSFlag; 
var lastIndex = 30;
var itemsPerLoad = 10;
myApp.attachInfiniteScroll($$('.infinite-scroll'))
$$('.infinite-scroll').on('infinite', function () {
   
    if (loading) return;  
    loading = true;
    setTimeout(function () {  

        loading = false;
        var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetNextSearchResult';
        if (lastIndex >= gTotalRowNumber) {
            myApp.detachInfiniteScroll($$('.infinite-scroll'));
            $$('.infinite-scroll-preloader').remove();
            return;
        }      
      
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
        "\"subItem\":\""+gCurrentSearchItem+"\","+
        "\"searchParams\":"+gSearchParams+","+
        "\"start\":\""+lastIndex+"\","+
        "\"limit\":\"10\","+      
        "\"windowWidth\":\""+screenWidth+"\","+
        "\"searchScreenType\":\""+gCurrentSearchType+"\","+
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
                if(gCurrentSearchType=="searchResult")
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
                 
                verifconnexion = false;        
                myApp.hidePreloader();
                errorMessage(e.message);
                 
            }           
        }); 
    }, 1000);
});
