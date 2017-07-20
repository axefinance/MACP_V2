var SearchScreen_JSFlag;    


function launchSearch(item)
{
    currentItem=item;
    var isValidForm = requiredFormComponent('form');
    if(isValidForm)
    {
        var formData = myApp.formToData('#my-search-form');
        searchParams=JSON.stringify(formData);
        if(!checkInternetConnection())                                                   
            myApp.alert("please check your internet connection");
        else 
            mainView.router.load({url: 'searchResultScreen.html',reload:false,ignoreCache:true});
    }
}