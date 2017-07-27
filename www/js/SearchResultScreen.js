var loading = false;
var selectedItem; 
var SearchResultScreen_JSFlag;

function editItem(mainItemId,reference,subItem,targettab){ 
    itemRef=reference;
    TargetTab=targettab;
    gSubItem=subItem;
    gMainItemId=mainItemId;
    if(!checkInternetConnection())                                                   
        myApp.alert("please check your internet connection");
    else 
       {
           var withBackButton=true;
           loadEditScreen(withBackButton);
       }
       
}       