var ForematUtils_JSFlag;

function goToNextField(event) {
    {
        var elements = $(".item-input");
        for(i=elements.length-1; i>=0;i--)
        if($(elements[i]).children().first().is(":focus"))
        {
            $(elements[i+1]).children().first().focus();
        }
    }
}
function errorMessage(){
    if(!checkInternetConnection())                                                   
        myApp.alert("please check your internet connection");
    else                                          
        myApp.alert("error occured","Error");                                
}

function handleKeyboardButton(event){
    var newPage = $(".newPage").length;
    var keyCode = event.which || event.keyCode;
    if(keyCode===13)        
    {
        if(newPage ==0 )
        {
            if($("#WSConfig").length==1)
            {
                saveConfiguration();
                document.activeElement.blur();            
            }
            else
                if($("#loginPage").length==1||$("#firstWSConfig").length==1/*||$("#WSConfig").length==1*/)
                {
                    //saveFirstConfig();
                    onClickLoginButton();
                    document.activeElement.blur();
                }

        } 
        else
            if($("#searchForm").length==1)
            {
                launchSearch();
                document.activeElement.blur();
            }
            else
                goToNextField(event) 
 
    }
    
}

function calendarDateFormat(cssClass,idComponent,year,month,day){
    if(month ===-1)
    {

myApp.calendar({    
    input: '#'+idComponent,    
    dateFormat: cssClass,
    closeOnSelect : false,
    value : []
}); 
    }else{
   myApp.calendar({    
    input: '#'+idComponent,    
    dateFormat: cssClass,
    closeOnSelect : false,
    value : [new Date(year,month,day)]
}); }
}
   
function AmountFormat(elementId,decimalprecision,groupseparator,decimalseparator){
    var element = document.getElementById(elementId); 
    var value=element.value;
    if(value!=="")
        {
    var output=accounting.formatMoney(value,"",decimalprecision,groupseparator,decimalseparator);
    element.value= output;
        }
    
} 

function percentageFormat(elementId,decimalprecision,decimalseparator)
{
    var element = document.getElementById(elementId); 
    var value=element.value; 
     if(value!="")
         {
             var output = parseFloat(value).toFixed(2).toString();             
             if(decimalseparator ===",")
                    output= output.replace(".",",");
             else
                 output= output.replace(",",".");
            element.value= output;   
         }               
}

function percentageFormat(elementId,decimalprecision,decimalseparator){
    var element = document.getElementById(elementId); 
    var value=element.value; 
     if(value!=="")
         {
     var output=accounting.formatMoney(value,"",decimalprecision,"",decimalseparator);
     element.value= output;   
         }               
}    

function handleRequiredIcon(component,componentType,elementId,decimalprecision,groupseparator,decimalseparator){
    switch(componentType)
    {
        case "dateonly":
        case "textbox" :         
            $(component).closest("div.item-inner").removeClass("requiredIcon");
            break;        
        case "combobox" :         
            $(component).siblings("div.item-inner").removeClass("requiredIcon");
            break;                
        case "amount" :         
            $(component).closest("div.item-inner").removeClass("requiredIcon");
            AmountFormat(elementId,decimalprecision,groupseparator,decimalseparator);
            break;
        case "percentage" :         
            $(component).closest("div.item-inner").removeClass("requiredIcon");
            percentageFormat(elementId,decimalprecision,decimalseparator);
            break;
        case "default" :         
            $(component).closest("div.item-inner").removeClass("requiredIcon");
            NumericFormat(elementId,groupseparator); 
            break;
        case "checkbox" :            
            $(component).closest("label.label-checkbox").removeClass("requiredIcon");
            break; 
    } 
    //textbox

    //combobox
    //$(component).siblings("div.item-inner").removeClass("requiredIcon");
    
}

function requiredFormComponent(formToDataId){
       var i; 
    var indexToSelect=1;
    var isValid = true;
    var textBox=$(formToDataId).find("div.requiredItem.textbox input");
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
    var dateOnly=$("form div.requiredItem.dateonly input" );
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
    var comboBox=$(".combobox.requiredItem .item-input");
    for (i = 0; i < comboBox.length; i++)
    {
        if($(comboBox[i]).find("select").find("option:selected").val()==="")
        {
            $(comboBox[i]).addClass("requiredIcon");
            isValid=false;
        }
        else
        {
            $(comboBox[i]).removeClass("requiredIcon");
        }            
    }
    var checkBox=$("form div.requiredItem.checkbox label.label-checkbox");
    for (i = 0; i < checkBox.length; i++)
    {
        if($(checkBox[i]).find("input").is(":checked")===false)
        {
            $(checkBox[i]).addClass("requiredIcon");
            isValid=false;
        }
        else
        {
            $(checkBox[i]).removeClass("requiredIcon");
        }
    }
    return isValid;
   
}
/*
function DateFormat(elementId,dateFormat)
{
     var element = document.getElementById(elementId); 
     var output;
     var value=element.value;
    if(value!="")
        {
            var mydate = new Date(value);
             var day = mydate.getDate();
            var monthIndex = mydate.getMonth();
            var year = mydate.getFullYear();
            if(dateFormat.charAt(0)==='M')
              output=monthIndex+"/"+day+"/"+year;
            else
                output=day+"/"+monthIndex+"/"+year;
            element.value= output;   
        }
       
       
}
*/  