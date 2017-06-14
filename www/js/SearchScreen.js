var SearchScreen_JSFlag;    

$$('.search-form-to-data').on('click', function(){
 launchSearch();
}); 

function launchSearch()
{
    var isValidForm = requiredFormComponent('form');
   /*  if(!isValidForm)
    {
       $(x[indexToSelect]).next().children().first().focus();
    }else*/
    if(isValidForm)
    {
        var formData = myApp.formToData('#my-search-form');
        searchParams=JSON.stringify(formData);
        mainView.router.load({url: 'searchResultScreen.html',reload:false,ignoreCache:true});
    }
}