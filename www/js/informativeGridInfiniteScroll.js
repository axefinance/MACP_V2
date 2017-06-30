var loading = false;
var infiniteScroll_JSFlag; 
var itemsPerLoad = 10;
myApp.attachInfiniteScroll($$('.informativeGrid-infinite-scroll'))
$$('.informativeGrid-infinite-scroll').on('infinite', function () {
   
    gridId=$$(this).attr("id");
    var spName= gridId.split("__")[1];
    var lastIndex = $("#"+gridId+" ul tr").length;
    if (loading) return;  
    loading = true;
    setTimeout(function () {  
 
        loading = false;
        var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetNextInformativeGridRows';
        if (lastIndex >= totalRowNumber) {
            myApp.detachInfiniteScroll($$("#"+gridId));
            $$('.infinite-scroll-preloader '+gridId).remove();
            return;
        }      
      
        var data="{"+    
          "\"screenName\":\""+divId+"\","+
          "\"spName\":\""+spName+"\","+  
          "\"mainItemId\":\""+itemId+"\","+  
          "\"relatedItemId\":\""+relatedItemId+"\","+  
          "\"userData\":"+sessionStorage.getItem("userData")+","+
          "\"start\":\""+lastIndex+"\","+
          "\"limit\":\"10\","+      
          "\"windowWidth\":\""+window.innerWidth+"\"}"; 
        console.log("SearchParams",data);        
        $.ajax({             
            type: 'POST',             
            url: url,                                     
            contentType: "text/plain",                             
            dataType: "json",                               
            async: false,                                
            data: data,         
            success: function(data) {              
                if(data.content==="")  
                { 
                    $$('.infinite-scroll-preloader '+gridId).remove();
                    return;  
                }
                $$("#"+gridId+" ul").append(data.content);
                totalRowNumber=data.totalRow;
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
