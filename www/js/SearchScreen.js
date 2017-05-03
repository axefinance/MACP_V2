
        
 var SearchScreen_JSFlag;    

$$('.search-form-to-data').on('click', function(){
    var i;
    var indexToSelect=1;
    var isValid = true;
    var textBox=$("form div.requiredItem.textbox input" )
    for (i = 0; i < textBox.length; i++) 
    {
        if($(textBox[i]).val()==="")
        {
            $(textBox[i]).closest("div.item-inner").addClass("requiredIcon");
            isValid=false;            
        }
        else
        {
            $(textBox[i]).closest("div.item-inner").removeClass("requiredIcon");
        }
    }
    var dateOnly=$("form div.requiredItem.dateonly input" )
    for (i = 0; i < dateOnly.length; i++) 
    {
        if($(dateOnly[i]).val()==="")
        {
            $(dateOnly[i]).closest("div.item-inner").addClass("requiredIcon");
            isValid=false;
        }
        else
        {
            $(dateOnly[i]).closest("div.item-inner").removeClass("requiredIcon");
        }
    }
    var comboBox=$("form div.requiredItem.combobox div.item-after" )
    for (i = 0; i < comboBox.length; i++)
    {
        if($(comboBox[i]).html()==="")
        {
            $(comboBox[i]).closest("div.item-inner").addClass("requiredIcon");
            isValid=false;
        }
        else
        {
            $(comboBox[i]).closest("div.item-inner").removeClass("requiredIcon");
        }            
    }
    var checkBox=$("form div.requiredItem.checkbox label.label-checkbox")
    for (i = 0; i < checkBox.length; i++)
    {
        if($(checkBox[i]).find("input").is(":checked")==false)
        {
            $(checkBox[i]).addClass("requiredIcon");
            isValid=false;
        }
        else
        {
            $(checkBox[i]).removeClass("requiredIcon");
        }
    }
    if(!isValid)
    {
       $(x[indexToSelect]).next().children().first().focus();
    }else
    {
        var formData = myApp.formToData('#my-search-form');
        searchParams=JSON.stringify(formData);
        mainView.router.load({url: 'searchResultScreen.html',reload:false,ignoreCache:true});
    }
});
