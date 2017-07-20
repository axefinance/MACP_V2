var loading = false;
var selectedItem; 
var SearchResultScreen_JSFlag;

function editItem(id,reference,item,targettab){ 
    itemId=id;
    itemRef=reference;
    TargetTab=targettab;
    currentItem=item;
    if(!checkInternetConnection())                                                   
        myApp.alert("please check your internet connection");
    else 
       
         mainView.router.load({url: "editScreen.html"});  
}      