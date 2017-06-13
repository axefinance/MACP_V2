var ForematUtils_JSFlag;

function createPopup(popupContainer,popupToolbar,top,left,width,height){
     myApp.popup('<div class="popup macp-popup" style=" background : #f1f1f1 !important;top : '+top+' !important; left : '+left+' !important; width : '+width+' !important; height : '+height+' !important; " ><div class="popup-container">' +popupContainer+'</div><div  class="popup-toolbar">'+popupToolbar+'</div></div>', true);
}


var dateFormat = function () {
        var    token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };
    
        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = dateFormat;
    
            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }
    
            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date();
            if (isNaN(date)) throw SyntaxError("invalid date");
    
            mask = String(dF.masks[mask] || mask || dF.masks["default"]);
    
            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }
    
            var    _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:    d,
                    dd:   pad(d),
                    ddd:  dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m:    m + 1,
                    mm:   pad(m + 1),
                    mmm:  dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   pad(H % 12 || 12),
                    H:    H,
                    HH:   pad(H),
                    M:    M,
                    MM:   pad(M),
                    s:    s,
                    ss:   pad(s),
                    l:    pad(L, 3),
                    L:    pad(L > 99 ? Math.round(L / 10) : L),
                    t:    H < 12 ? "a"  : "p",
                    tt:   H < 12 ? "am" : "pm",
                    T:    H < 12 ? "A"  : "P",
                    TT:   H < 12 ? "AM" : "PM",
                    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };
    
            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();
    
    // Some common format strings
dateFormat.masks = {
        "default":      "ddd mmm dd yyyy HH:MM:ss",
        shortDate:      "m/d/yy",
        mediumDate:     "mmm d, yyyy",
        longDate:       "mmmm d, yyyy",
        fullDate:       "dddd, mmmm d, yyyy",
        shortTime:      "h:MM TT",
        mediumTime:     "h:MM:ss TT",
        longTime:       "h:MM:ss TT Z",
        isoDate:        "yyyy-mm-dd",
        isoTime:        "HH:MM:ss",
        isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };
    
    // Internationalization strings
dateFormat.i18n = {
        dayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]
    };
    
Date.prototype.format = function (mask, utc) {
        return dateFormat(this, mask, utc);
    };

Date.prototype.addDays = function (value) {
    return this.addMilliseconds(value * 86400000); 
 };
Date.prototype.addMilliseconds = function (value) {
    this.setMilliseconds(this.getMilliseconds() + value); return this; 
};


Date.prototype.monthDays= function(){
    var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
};
Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + parseInt(value));
    this.setDate(Math.min(n, this.monthDays()));
    return this;
};
    
Date.prototype.addDays = function (value) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + value);
  return dat;
}; 



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
     if(value!=="")
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
function NumericFormat(elementId,groupSeparator)
{
    var element = document.getElementById(elementId); 
    var value=element.value;
    if(value!="")
         {            
             var output;
             if(groupSeparator===",")
        output=accounting.formatNumber(value);
             else
          output=accounting.formatNumber(value,""," ");        
    element.value= output;
         }
};     

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
    var dateOnly=$(formToDataId).find(" div.requiredItem.dateonly input" );

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
    var comboBox=$(formToDataId).find(".combobox.requiredItem .item-input");
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
    var checkBox=$(formToDataId).find("div.requiredItem.checkbox label.label-checkbox");
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
function ManagePricingCnditionComponents() {
    var myDateFormat=sessionStorage.getItem("dateFormat");
    var existFirstPaymentDate = false;
    var useOfTenorUnit = false;
    /*DATA*/
    var firstPaymentDateValue = '';
    var amortizationTypeSelectedValue = '';
    var amortizationTonorValue = '';

    var endDateValue = '';
    if (document.getElementById('h__transaction_condition__tenor_unit') != null) {
        useOfTenorUnit = true;
    }
    if (document.getElementById('f__transaction_condition__first_payment_date') != null) {
        existFirstPaymentDate = true;
        document.getElementById('f__transaction_condition__first_payment_date').addEventListener("change", function () {
            var tenorUnit = '';
            firstPaymentDateValue = $('#f__transaction_condition__first_payment_date').val();
            console.log("amortizationType", $('#h__conditionEntity__amortization_type_id').find("select").find("option:selected").val());
            if ($('#h__conditionEntity__amortization_type_id').find("select").find("option:selected").val() != undefined && $('#h__conditionEntity__amortization_type_id').find("option:selected").val() != '') {
                amortizationTypeSelectedValue = $('#h__conditionEntity__amortization_type_id').find("option:selected").val().split('__')[1];
            }

            console.log("tenorUnit", tenorUnit);
            if (document.getElementById('h__transaction_condition__tenor_unit') != null && $("#h__transaction_condition__tenor_unit").find("option:selected").val() != "")
                tenorUnit = $("#h__transaction_condition__tenor_unit").find("option:selected").val();
            else
                tenorUnit = "month";
            console.log("tenorUnitValue", tenorUnit);
            console.log("tenorUnitValue", tenorUnit);
            if (firstPaymentDateValue != '') {
                console.log("firstPaymentDate", firstPaymentDateValue);
                if (document.getElementById("n__transaction_condition__tenor") != null && $('#n__transaction_condition__tenor').val() != undefined) {
                    amortizationTonorValue = $('#n__transaction_condition__tenor').val();
                    console.log("amortizationTonorValue", amortizationTonorValue);
                    if (amortizationTonorValue != '' && $('#h__transaction_condition__tenor_unit').val() != '') {
                        var firstPaymentDate = new Date(firstPaymentDateValue);
                        var date;
                        var amortizationFrequencySelectedValue = $('#h__transaction_condition__amortization_frequency').find("option:selected").val();
                        if (document.getElementById('h__transaction_condition__amortization_frequency') != null && amortizationFrequencySelectedValue != undefined && amortizationFrequencySelectedValue.indexOf("daily") == 0 || $('#h__conditionEntity__amortization_type_id').find("option:selected").val() == "short_term" || tenorUnit == 'day') {
                            date = firstPaymentDate.addDays(amortizationTonorValue - 1);
                            console.log("DATE2", date);
                            console.log("amortizationFrequencySelectedValue", amortizationFrequencySelectedValue);
                        }
                        else {
                            console.log("month")
                            date = firstPaymentDate.addMonths(amortizationTonorValue - 1);
                        }
                        if (document.getElementById('f__transaction_condition__end_date') != null) {


                            console.log("Day", date.getDate());
                            console.log("Day", date.getMonth());
                            calendarDateFormat(myDateFormat.toLowerCase(), "f__transaction_condition__end_date", date.getFullYear(), date.getMonth(), date.getDate());

                        }


                    }
                }

            }


        });
    }

    else {
        existFirstPaymentDate = false;
        if (document.getElementById('f__transaction_condition__start_date') != null && $('#f__transaction_condition__start_date') != undefined) {
            document.getElementById('f__transaction_condition__start_date').addEventListener("change", function () {
                var startDate = $('#f__transaction_condition__start_date').val();
                var amortizationType = '';
                var tenorUnitSelectedValue = '';
                if (document.getElementById('h__transaction_condition__amortization_type_id') != null && $('#h__transaction_condition__amortization_type_id').find("option:selected").val() != undefined) {
                    amortizationType = $('#h__transaction_condition__amortization_type_id').find("option:selected").val().split('__')[1];
                    console.log("amortizationType", amortizationType);
                }
                if (document.getElementById('h__transaction_condition__tenor_unit') != null) {
                    if ($('#h__transaction_condition__tenor_unit').find("option:selected").val() != undefined)
                        tenorUnitSelectedValue = $('#h__transaction_condition__tenor_unit').find("option:selected").val();
                    console.log("tenorUnitSelectedValue", tenorUnitSelectedValue);
                }
                else {
                    tenorUnit = 'month';
                }

                if (startDate != '') {
                    if (document.getElementById('n__transaction_condition__tenor') != null && $('#n__transaction_condition__tenor') != undefined) {
                        console.log("transaction condition tenor", $('#n__transaction_condition__tenor').val())

                        if ($('#n__transaction_condition__tenor').val() != undefined && $('#n__transaction_condition__tenor').val() != '') {

                            var startPaymentDate = new Date(startDate);
                            var date;
                            if (document.getElementById('h__transaction_condition__amortization_frequency') != null && $('#h__transaction_condition__amortization_frequency').find("option:selected").val() != undefined
                            && ($('#h__transaction_condition__amortization_frequency').find("option:selected").val().indexOf('daily') == 0) || amortizationType == "short_term" || tenorUnitSelectedValue == 'day') {
                                date = startPaymentDate.addDays($('#n__transaction_condition__tenor').val() - 1);
                            }
                            else {

                                date = startPaymentDate.addMonths($('#n__transaction_condition__tenor').val() - 1);
                            }
                            if (document.getElementById('f__transaction_condition__end_date') != null && $('#f__transaction_condition__end_date') != undefined) {
                                // $('#f__transaction_condition__end_date').text(date.format(GetDateFormat("mm/dd/yyyy").toString()));
                                calendarDateFormat(myDateFormat.toLowerCase(), "f__transaction_condition__end_date", date.getFullYear(), date.getMonth(), date.getDate());
                            }
                        }

                    }
                }

            });
        }
    }



    if (existFirstPaymentDate == true) {
        if (document.getElementById('n__transaction_condition__tenor') != null) {
            document.getElementById('n__transaction_condition__tenor').addEventListener('change', function () {
                var NewValue = $('#n__transaction_condition__tenor').val();
                var amortizationType = '';
                var tenorUnit = '';
                if (useOfTenorUnit) {
                    if ($('#h__transaction_condition__tenor_unit').find("option:selected").val() != undefined)
                        tenorUnit = $('#h__transaction_condition__tenor_unit').find("option:selected").val();
                }
                else {
                    tenorUnit = 'month';
                }
                if (document.getElementById('h__transaction_condition__amortization_type_id') != null
                && $('#h__transaction_condition__amortization_type_id').find("option:selected").val() != null) {
                    amortizationType = $('#h__transaction_condition__amortization_type_id').find("option:selected").val().split('__')[1];
                }
                if ((NewValue != '') &&
                document.getElementById('f__transaction_condition__first_payment_date') != null
                && $('#f__transaction_condition__first_payment_date').find("option:selected").val() != undefined && $('#f__transaction_condition__first_payment_date').find("option:selected").val() != '') {
                    var firstPaymentDate = new Date($('#f__transaction_condition__first_payment_date').find("option:selected").val());
                    var date;
                    //Daily Case 
                    if (document.getElementById('h__transaction_condition__amortization_frequency') != null
                    && $('#h__transaction_condition__amortization_frequency').find("option:selected").val() != null
                    && ($('#h__transaction_condition__amortization_frequency').find("option:selected").val().indexOf('daily') == 0) || amortizationType == "short_term" || tenorUnit == 'day') {
                        date = firstPaymentDate.addDays($('#n__transaction_condition__tenor').val() - 1);
                    }
                        //Others
                    else {
                        date = date.addMonths($('#n__transaction_condition__tenor').val() - 1);
                    }
                    if (document.getElementById('f__transaction_condition__end_date') != null && document.getElementById('f__transaction_condition__end_date') != undefined) {
                        //  document.getElementById('f__transaction_condition__end_date').text(date.format(GetDateFormat("mm/dd/yyyy").toString()));
                        calendarDateFormat(myDateFormat.toLowerCase(), "f__transaction_condition__end_date", date.getFullYear(), date.getMonth(), date.getDate());
                    }
                }
            });

        }
        else {
            if (document.getElementById('n__transaction_condition__tenor') != null) {
                document.getElementById('n__transaction_condition__tenor').addEventListener('change', function () {
                    var NewValue = $('#n__transaction_condition__tenor').val();
                    var amortizationType = '';
                    var tenorUnit = '';
                    if (useOfTenorUnit) {
                        if ($('h__transaction_condition__tenor_unit').find("option:selected").val() != null)
                            tenorUnit = $('h__transaction_condition__tenor_unit').find("option:selected").val();
                    }
                    else {
                        tenorUnit = 'month';
                    }
                    if (document.getElementById('h__transaction_condition__amortization_type_id') != null && $('#h__transaction_condition__amortization_type_id').find("option:selected").val() != null) {
                        amortizationType = $('#h__transaction_condition__amortization_type_id').find("option:selected").val().split('__')[1];
                    }
                    if (NewValue != '' && document.getElementById('f__transaction_condition__start_date') != null && document.getElementById('f__transaction_condition__start_date') != undefined
                    && $('#f__transaction_condition__start_date').val() != '') {
                        var startDate = new Date($('#f__transaction_condition__start_date').val());
                        var date;
                        if (document.getElementById('h__transaction_condition__amortization_frequency') != null
                        && $('h__transaction_condition__amortization_frequency').find("option:selected").val() != undefined
                        && (currentFrame.Ext.getCmp('h__transaction_condition__amortization_frequency').find("option:selected").val().indexOf('daily') == 0)
                            || amortizationType == "short_term"
                            || tenorUnit == 'day') {
                            date = startDate.addDays($('#n__transaction_condition__tenor').val());
                        }
                            //Others
                        else {
                            date = startDate.addMonths($('#n__transaction_condition__tenor').val());
                        }
                        if (document.getElementById('f__transaction_condition__end_date') != null && document.getElementById('f__transaction_condition__end_date') != undefined) {
                            // document.getElementById('f__transaction_condition__end_date').text(date.format(GetDateFormat("mm/dd/yyyy").toString()));
                            calendarDateFormat(myDateFormat.toLowerCase(), "f__transaction_condition__end_date", date.getFullYear(), date.getMonth(), date.getDate());
                        }
                    }
                });
            }
        }
        if (existFirstPaymentDate == true) {
            document.getElementById('h__transaction_condition__tenor_unit').addEventListener('change', function () {
                var NewValue = $('#h__transaction_condition__tenor_unit').val();
                if (NewValue != '' && $('#f__transaction_condition__first_payment_date').val() != null && $('#f__transaction_condition__first_payment_date').val() != ''
                    && $('#n__transaction_condition__tenor').val() != null
                    && $('#n__transaction_condition__tenor').val() != '') {
                    var firstPaymentDate = new Date($('#f__transaction_condition__first_payment_date').val());
                    var date;
                    //Daily Case 
                    if (NewValue == 'day') {
                        date = firstPaymentDate.addDays($('#n__transaction_condition__tenor').val() - 1);
                    }
                        //Others
                    else {
                        date = firstPaymentDate.addMonths($('#n__transaction_condition__tenor').val() - 1);
                    }
                    if (document.getElementById('f__transaction_condition__end_date') != null && $('#f__transaction_condition__end_date') != undefined) {
                        // $('f__transaction_condition__end_date').text(date.format(GetDateFormat("mm/dd/yyyy").toString()));
                        calendarDateFormat(myDateFormat.toLowerCase(), "f__transaction_condition__end_date", date.getFullYear(), date.getMonth(), date.getDate());
                    }
                }

            });

        }
            /*#######Start Date Use: Setting handler on tenor CHange*/
        else {
            if (useOfTenorUnit == true) {
                document.getElementById('h__transaction_condition__tenor_unit').addEventListener('change', function (tenor, NewValue, OldValue) {
                    if (NewValue != ''
                        && $('#f__transaction_condition__start_date').val() != null
                        && $('#f__transaction_condition__start_date').val() != ''
                        && $('#n__transaction_condition__tenor').val() != null
                        && $('#n__transaction_condition__tenor').val() != '') {
                        var startDate = new Date(document.getElementById('f__transaction_condition__start_date').val());
                        var date ;
                        //Daily Case 
                        if (NewValue == 'day') {
                            date = startDate.addDays($('#n__transaction_condition__tenor').val() - 1);
                        }
                            //Others
                        else {
                            date = startDate.addMonths($('#n__transaction_condition__tenor').val() - 1);
                        }
                        if (document.getElementById('f__transaction_condition__end_date') != null
                        && document.getElementById('f__transaction_condition__end_date') != undefined) {
                            calendarDateFormat(myDateFormat, "f__transaction_condition__end_date", date.getFullYear(), date.getMonth(), date.getDate());
                        }
                    }

                });
            }

        }
    }
}	