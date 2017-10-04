var loading = false;
var SearchResultScreen_JSFlag;

function editItem(mainItemId,reference,subItem,targettab){ 
    gPageTitleContent=reference;
    gTargetTab=targettab;
    gSubItem=subItem;
    gScreenName=subItem;
    gMainItemId=mainItemId;
    if(!checkInternetConnection())                                                   
        myApp.alert("please check your internet connection");
    else 
       {
           loadEditScreen(true,mainItemId);
       }
       
}       