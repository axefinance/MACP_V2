var loading = false;
var selectedItem; 
var SearchResultScreen_JSFlag;

function editItem(id,reference,targettab){ 
    itemId=id;
    itemRef=reference;
    TargetTab=targettab;
    if(!checkInternetConnection())                                                   
        myApp.alert("please check your internet connection");
    else 
        mainView.router.load({url: "editScreen.html" ,reload:false,ignoreCache:true});  
}      