
function launchQIPoponSearch(item)
{
   
        var formData = myApp.formToData('#search-QI-popon-form-to-data');
        searchParams=JSON.stringify(formData);
        if(!checkInternetConnection())                                                   
            myApp.alert("please check your internet connection");
        else 
            {
                var gridResult=document.getElementById("search-QI-form-to-data-GridResult");
                var url='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/GetSearchResultPage';
                console.log("URL",url);
                lunchSearchResult(url,"selectOnPopon",item); 
            }  
    
}