var ForematUtils_JSFlag;
var InfoButton_ItemId;

function createPopup(popupContainer,popupToolbar,top,left,width,height){
    var popupHtml='<div class="popup macp-popup" style="padding-top:10px !important; overflow-y: hidden; border-radius: 15px; background : #f1f1f1 !important;top : '+top+' !important; left : '+left+' !important; width : '+width+' !important; height : '+height+' !important;';
    if(popupToolbar==="")
    {
    popupHtml=popupHtml+' padding-bottom:10px !important;';
    }
    popupHtml=popupHtml+'" ><div class="popup-container">' +popupContainer+'</div>';
    if(popupToolbar!=="")
        popupHtml=popupHtml+'<div  class="popup-toolbar">'+popupToolbar+'</div>';
    popupHtml=popupHtml+'</div>';
    myApp.popup(popupHtml, true);
    
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
function errorMessage(message){
 var connectionState=checkInternetConnection();
    if(!connectionState)                                                   
        myApp.alert("please check your internet connection");

   else if(connectionState && message.readyState!==null)
            myApp.alert("please check your internet connection");
    else
        {
            if(message ===undefined ||message == "")                
                myApp.alert("error occured","Error"); 
            else
                myApp.alert(message,"Error");                                 
        }
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
function calendarDateFormat(cssClass,idComponent,year,month,day, formId){
    if(month ===-1)
    {

        myApp.calendar({    
            input: $('#'+formId).find('#'+idComponent),    
            dateFormat: cssClass,
            closeOnSelect : false,
            value : []
        }); 
    }else{
        myApp.calendar({    
            input: $('#'+formId).find('#'+idComponent),
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
function percentageFormat(elementId,decimalprecision,decimalseparator){
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
function NumericFormat(elementId,groupSeparator){
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
    var textArea=$(formToDataId).find("div.requiredItem.textarea textarea");
    for (i = 0; i < textArea.length; i++) 
    {
        if($(textArea[i]).val()==="")
        {
            $(textArea[i]).closest("div.item-inner").addClass("requiredIcon");
            isValid=false;            
        }
        else
        {
            $(textArea[i]).closest("div.item-inner").removeClass("requiredIcon");
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
function ManagePricingCnditionComponents(formId) {
    var myDateFormat = sessionStorage.getItem("dateFormat");
    var existFirstPaymentDate = false;
    var useOfTenorUnit = false;    
    /*DATA*/
    var firstPaymentDateValue = ''; 
    var amortizationTypeSelectedValue = '';
    var amortizationTonorValue = '';

    var endDateValue = '';
    if ($('#'+formId).find('#h__transaction_condition__tenor_unit') != null) {
        useOfTenorUnit = true;
    }
    if ($('#'+formId).find('#f__transaction_condition__first_payment_date') != null) {
        existFirstPaymentDate = true;
        $('#'+formId).find('#f__transaction_condition__first_payment_date').change(function () {
            var tenorUnit = '';
            firstPaymentDateValue = $('#'+formId).find('#f__transaction_condition__first_payment_date').val();
            if ($('#'+formId).find('#h__conditionEntity__amortization_type_id').find("select").find("option:selected").val() != undefined && $('#'+formId).find('#h__conditionEntity__amortization_type_id').find("option:selected").val() != '') {
                amortizationTypeSelectedValue = $('#'+formId).find('#h__conditionEntity__amortization_type_id').find("option:selected").val().split('__')[1];
            }

            if ($('#'+formId).find('#h__transaction_condition__tenor_unit') != null && $('#'+formId).find("#h__transaction_condition__tenor_unit").find("option:selected").val() != "")
                tenorUnit = $('#'+formId).find("#h__transaction_condition__tenor_unit").find("option:selected").val();
            else
                tenorUnit = "month";
            if (firstPaymentDateValue != '') {
                if ($('#'+formId).find("n__transaction_condition__tenor") != null && $('#'+formId).find('#n__transaction_condition__tenor').val() != undefined) {
                    amortizationTonorValue = $('#'+formId).find('#n__transaction_condition__tenor').val();
                    if (amortizationTonorValue != '' && $('#'+formId).find('#h__transaction_condition__tenor_unit').val() != '') {
                        var firstPaymentDate = new Date(firstPaymentDateValue);
                        var date;
                        var amortizationFrequencySelectedValue = $('#'+formId).find('#h__transaction_condition__amortization_frequency').find("option:selected").val();
                        if ($('#'+formId).find('#h__transaction_condition__amortization_frequency') != null && amortizationFrequencySelectedValue != undefined && amortizationFrequencySelectedValue.indexOf("daily") == 0 || $('#'+formId).find('#h__conditionEntity__amortization_type_id').find("option:selected").val() == "short_term" || tenorUnit == 'day') {
                            date = firstPaymentDate.addDays(amortizationTonorValue - 1);
                        }
                        else {
                            date = firstPaymentDate.addMonths(amortizationTonorValue - 1);
                        }
                        if ($('#'+formId).find('#f__transaction_condition__end_date') != null) {
                            calendarDateFormat(myDateFormat.toLowerCase(), "f__transaction_condition__end_date", date.getFullYear(), date.getMonth(), date.getDate(), formId);

                        }


                    }
                }

            }


        });
    }

    else {
        existFirstPaymentDate = false;
        if ($('#'+formId).find('#f__transaction_condition__start_date') != null && $('#'+formId).find('#f__transaction_condition__start_date') != undefined) {
            $('#'+formId).find('#f__transaction_condition__start_date').change(function () {
                var startDate = $('#'+formId).find('#f__transaction_condition__start_date').val();
                var amortizationType = '';
                var tenorUnitSelectedValue = '';
                if ($('#'+formId).find('#h__transaction_condition__amortization_type_id') != null && $('#'+formId).find('#h__transaction_condition__amortization_type_id').find("option:selected").val() != undefined) {
                    amortizationType = $('#'+formId).find('#h__transaction_condition__amortization_type_id').find("option:selected").val().split('__')[1];
                }
                if ($('#'+formId).find('#h__transaction_condition__tenor_unit') != null) {
                    if ($('#'+formId).find('#h__transaction_condition__tenor_unit').find("option:selected").val() != undefined)
                        tenorUnitSelectedValue = $('#'+formId).find('#h__transaction_condition__tenor_unit').find("option:selected").val();
                }
                else {
                    tenorUnit = 'month';
                }

                if (startDate != '') {
                    if ($('#'+formId).find('#n__transaction_condition__tenor') != null && $('#'+formId).find('#n__transaction_condition__tenor') != undefined) {
                        if ($('#'+formId).find('#n__transaction_condition__tenor').val() != undefined && $('#'+formId).find('#n__transaction_condition__tenor').val() != '') {

                            var startPaymentDate = new Date(startDate);
                            var date;
                            if ($('#'+formId).find('#h__transaction_condition__amortization_frequency') != null && $('#'+formId).find('#h__transaction_condition__amortization_frequency').find("option:selected").val() != undefined
                            && ($('#'+formId).find('#h__transaction_condition__amortization_frequency').find("option:selected").val().indexOf('daily') == 0) || amortizationType == "short_term" || tenorUnitSelectedValue == 'day') {
                                date = startPaymentDate.addDays($('#'+formId).find('#n__transaction_condition__tenor').val() - 1);
                            }
                            else {

                                date = startPaymentDate.addMonths($('#'+formId).find('#n__transaction_condition__tenor').val() - 1);
                            }
                            if ($('#'+formId).find('#f__transaction_condition__end_date') != null && $('#'+formId).find('#f__transaction_condition__end_date') != undefined) {
                                // $('#f__transaction_condition__end_date').text(date.format(GetDateFormat("mm/dd/yyyy").toString()));
                                calendarDateFormat(myDateFormat.toLowerCase(), "f__transaction_condition__end_date", date.getFullYear(), date.getMonth(), date.getDate(), formId);
                            }
                        }

                    }
                }

            });
        }
    }



    if (existFirstPaymentDate == true) {
        if ($('#'+formId).find('#n__transaction_condition__tenor') != null) {
            $('#'+formId).find('#n__transaction_condition__tenor').change(function () {
                var NewValue = $('#'+formId).find('#n__transaction_condition__tenor').val();
                var amortizationType = '';
                var tenorUnit = '';
                if (useOfTenorUnit) {
                    if ($('#'+formId).find('#h__transaction_condition__tenor_unit').find("option:selected").val() != undefined)
                        tenorUnit = $('#'+formId).find('#h__transaction_condition__tenor_unit').find("option:selected").val();
                }
                else {
                    tenorUnit = 'month';
                }
                if ($('#'+formId).find('#h__transaction_condition__amortization_type_id') != null
                && $('#'+formId).find('#h__transaction_condition__amortization_type_id').find("option:selected").val() != null) {
                    amortizationType = $('#'+formId).find('#h__transaction_condition__amortization_type_id').find("option:selected").val().split('__')[1];
                }
                if ((NewValue != '') &&
                $('#'+formId).find('#f__transaction_condition__first_payment_date') != null
                && $('#'+formId).find('#f__transaction_condition__first_payment_date').find("option:selected").val() != undefined && $('#'+formId).find('#f__transaction_condition__first_payment_date').find("option:selected").val() != '') {
                    var firstPaymentDate = new Date($('#'+formId).find('#f__transaction_condition__first_payment_date').find("option:selected").val());
                    var date;
                    //Daily Case 
                    if ($('#'+formId).find('#h__transaction_condition__amortization_frequency') != null
                    && $('#'+formId).find('#h__transaction_condition__amortization_frequency').find("option:selected").val() != null
                    && ($('#'+formId).find('#h__transaction_condition__amortization_frequency').find("option:selected").val().indexOf('daily') == 0) || amortizationType == "short_term" || tenorUnit == 'day') {
                        date = firstPaymentDate.addDays($('#'+formId).find('#n__transaction_condition__tenor').val() - 1);
                    }
                        //Others
                    else {
                        date = date.addMonths($('#'+formId).find('#n__transaction_condition__tenor').val() - 1);
                    }
                    if ($('#'+formId).find('#f__transaction_condition__end_date') != null && $('#'+formId).find('#f__transaction_condition__end_date') != undefined) {
                        //  $('#'+formId).find('#f__transaction_condition__end_date').text(date.format(GetDateFormat("mm/dd/yyyy").toString()));
                        calendarDateFormat(myDateFormat.toLowerCase(), "f__transaction_condition__end_date", date.getFullYear(), date.getMonth(), date.getDate(), formId);
                    }
                }
            });

        }
        else {
            if ($('#'+formId).find('#n__transaction_condition__tenor') != null) {
                $('#'+formId).find('#n__transaction_condition__tenor').change(function () {
                    var NewValue = $('#'+formId).find('#n__transaction_condition__tenor').val();
                    var amortizationType = '';
                    var tenorUnit = '';
                    if (useOfTenorUnit) {
                        if ($('#'+formId).find('h__transaction_condition__tenor_unit').find("option:selected").val() != null)
                            tenorUnit = $('#'+formId).find('h__transaction_condition__tenor_unit').find("option:selected").val();
                    }
                    else {
                        tenorUnit = 'month';
                    }
                    if ($('#'+formId).find('#h__transaction_condition__amortization_type_id') != null && $('#'+formId).find('#h__transaction_condition__amortization_type_id').find("option:selected").val() != null) {
                        amortizationType = $('#'+formId).find('#h__transaction_condition__amortization_type_id').find("option:selected").val().split('__')[1];
                    }
                    if (NewValue != '' && $('#'+formId).find('#f__transaction_condition__start_date') != null && $('#'+formId).find('#f__transaction_condition__start_date') != undefined
                    && $('#f__transaction_condition__start_date').val() != '') {
                        var startDate = new Date($('#'+formId).find('#f__transaction_condition__start_date').val());
                        var date;
                        if ($('#'+formId).find('#h__transaction_condition__amortization_frequency') != null
                        && $('#'+formId).find('h__transaction_condition__amortization_frequency').find("option:selected").val() != undefined
                        && (currentFrame.Ext.getCmp('h__transaction_condition__amortization_frequency').find("option:selected").val().indexOf('daily') == 0)
                            || amortizationType == "short_term"
                            || tenorUnit == 'day') {
                            date = startDate.addDays($('#'+formId).find('#n__transaction_condition__tenor').val());
                        }
                            //Others
                        else {
                            date = startDate.addMonths($('#'+formId).find('#n__transaction_condition__tenor').val());
                        }
                        if ($('#'+formId).find('#f__transaction_condition__end_date') != null && $('#'+formId).find('#f__transaction_condition__end_date') != undefined) {
                            // $('#'+formId).find('#f__transaction_condition__end_date').text(date.format(GetDateFormat("mm/dd/yyyy").toString()));
                            calendarDateFormat(myDateFormat.toLowerCase(), "f__transaction_condition__end_date", date.getFullYear(), date.getMonth(), date.getDate(), formId);
                        }
                    }
                });
            }
        }
        if (existFirstPaymentDate == true) {
            $('#'+formId).find('#h__transaction_condition__tenor_unit').change(function () {
                var NewValue = $('#'+formId).find('#h__transaction_condition__tenor_unit').val();
                if (NewValue != '' && $('#'+formId).find('#f__transaction_condition__first_payment_date').val() != null && $('#'+formId).find('#f__transaction_condition__first_payment_date').val() != ''
                    && $('#'+formId).find('#n__transaction_condition__tenor').val() != null
                    && $('#'+formId).find('#n__transaction_condition__tenor').val() != '') {
                    var firstPaymentDate = new Date($('#'+formId).find('#f__transaction_condition__first_payment_date').val());
                    var date;
                    //Daily Case 
                    if (NewValue == 'day') {
                        date = firstPaymentDate.addDays($('#'+formId).find('#n__transaction_condition__tenor').val() - 1);
                    }
                        //Others
                    else {
                        date = firstPaymentDate.addMonths($('#'+formId).find('#n__transaction_condition__tenor').val() - 1);
                    }
                    if ($('#'+formId).find('#f__transaction_condition__end_date') != null && $('#'+formId).find('#f__transaction_condition__end_date') != undefined) {
                        // $('f__transaction_condition__end_date').text(date.format(GetDateFormat("mm/dd/yyyy").toString()));
                        calendarDateFormat(myDateFormat.toLowerCase(), "f__transaction_condition__end_date", date.getFullYear(), date.getMonth(), date.getDate(), formId);
                    }
                }

            });

        }
            /*#######Start Date Use: Setting handler on tenor CHange*/
        else {
            if (useOfTenorUnit == true) {
                $('#'+formId).find('#h__transaction_condition__tenor_unit').change(function (tenor, NewValue, OldValue) {
                    if (NewValue != ''
                        && $('#'+formId).find('#f__transaction_condition__start_date').val() != null
                        && $('#'+formId).find('#f__transaction_condition__start_date').val() != ''
                        && $('#'+formId).find('#n__transaction_condition__tenor').val() != null
                        && $('#'+formId).find('#n__transaction_condition__tenor').val() != '') {
                        var startDate = new Date($('#'+formId).find('#f__transaction_condition__start_date').val());
                        var date;
                        //Daily Case 
                        if (NewValue == 'day') {
                            date = startDate.addDays($('#'+formId).find('#n__transaction_condition__tenor').val() - 1);
                        }
                            //Others
                        else {
                            date = startDate.addMonths($('#'+formId).find('#n__transaction_condition__tenor').val() - 1);
                        }
                        if ($('#'+formId).find('#f__transaction_condition__end_date') != null
                        && $('#'+formId).find('#f__transaction_condition__end_date') != undefined) {
                            calendarDateFormat(myDateFormat, "f__transaction_condition__end_date", date.getFullYear(), date.getMonth(), date.getDate(), formId);
                        }
                    }

                });
            }

        }
    }
}
function getGridonPoponsData(formdDataId){
    var grids=$(formdDataId).find("div.editableGridOnPopon");
    var myObject = {};
    for (i = 0; i < grids.length; i++) 
    {
       
        var id=$(grids[i]).attr("id");
        myObject[id] = GetGridData(id); 
    }
    return JSON.stringify(myObject); 
}
function ReinitGridOnPoponDataAfterSave(formDataId){
 var grids=$(formDataId).find("div.editableGridOnPopon");
    for (i = 0; i < grids.length; i++) 
    {
        var id=$(grids[i]).attr("id");
        var gridRows=$('#'+id+" li");  
        for(var i=0 ;i<gridRows.length;i++)
        {
          rowId=gridRows[i].getAttribute("id");  
          var existingGridDataRow=$("#"+rowId+" td");
          existingGridDataRow.removeAttr("class");          
        }
    }
}
function manageAutoCompleteComponent(formId,item){
    var screenName;
    
    var url= "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GenerateAutoCompleteSearchOnPoponElement";   
    if(formId==="my-search-form")
    {
        screenName="search"+item;    
    }
    else if(formId==="my-QIPopon-form")
    {
            screenName=item;
    }
    else
    {
        screenName=item.toLowerCase();
    }
    
    var autoCompleteElement=$("#"+formId).find(".autoComplete");
    for(var i=0 ;i<autoCompleteElement.length ; i++)
    {
        var GeneratedData=[];
        var lastQuery="";
        var seletedValue;
        var id = $(autoCompleteElement[i]).attr("id");  
        document.getElementById(id).addEventListener('change', function () {
                var elementValue = $('#'+id).val();
                 if(elementValue==="")
                 {
                 $("#poponInfoButton_"+id.replace("__Value",'')).attr("disabled", true);
                 document.getElementById(id.replace("__Value",'')).value="";
                 }
                 else
                {
                 $("#poponInfoButton_"+id.replace("__Value",'')).removeAttr("disabled");   
                }  
             });
        myApp.autocomplete({
            input: '#'+id,
            openIn: 'dropdown',
            source: function (autocomplete, query, render) {
            var results = [];   
                if (query.length === 0) {
                    render(results);
                    return;
                }
                var property=id.split('__')[2];
                if (query!=lastQuery && query.length>= 3)
                {
                    lastQuery=query;    
                    var data="{"+  
                        "\"screenName\":\""+screenName+"\","+
                        "\"property\":\""+property+"\","+
                        "\"searchCriteria\":\""+query+"\","+
                        "\"userData\":"+sessionStorage.getItem("userData")+"}";  
                    $.ajax({             
                        type: 'POST',                             
                        url: url,                                  
                        contentType: "text/plain",                                      
                        dataType: "json",                               
                        data: data,     
                        success: function(data) {  
                            for(var value in data) {
                                results.push(data[value]); 
                            }
                            GeneratedData=[];
                            render(results);
                            GeneratedData=data;
                        }, 
                        error: function(e) {  
                            myApp.hidePreloader();                  
                            errorMessage(e.message);
                        }
                    });  
                }
            },onChange: function (autocomplete, value) { 
                seletedValue=value;
                var itemId;
                for(var key in GeneratedData) 
                {
                    if(GeneratedData[key]===value)
                    {
                         document.getElementById(id).value=value;
                         document.getElementById(id.replace("__Value","")).value=key;
                         itemId=key;       
                    }
                }
            }
        });         
    }
}
function generateSaveCommentDeviationPopup(dataMessage,saveEventHendler){
    var popupContent='<div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">' + dataMessage + '</br></br><br><br></div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="deviationComment" onkeyup="enableSaveDeviationButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick='+saveEventHendler+' id="saveDeviationCommentButton" style="width:50%; margin-left:50%">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()" style="width:50%;">No</a></div></div>';
    createPopup(popupContent,"","25%","25%","50%","50%");
}


function generateCEHGridPopup(dataMessage,saveEventHendler,isWithDeviation, dataTitle){
var popupContent;
if(isWithDeviation)
    popupContent='<div class="content-block-title"><b>'+ dataTitle +'<b></div><div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">' + dataMessage + '</br></br><br><br></div><div class="list-block" ><ul><li class="align-top"><div class="item-content"><div class="item-media"></div><div class="item-inner"><div class="item-input"><textarea id="deviationComment" onkeyup="enableSaveDeviationButton(this)"></textarea></div></div></div></li></ul></<div><br><br><div class="row"><div class="col-50"><a href="#" class="button button-fill disabled" onclick='+saveEventHendler+' id="saveDeviationCommentButton" style="width:50%; margin-left:50%">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()" style="width:50%;">No</a></div></div>';
    else
        popupContent='<div class="content-block-title"><b>'+ dataTitle +'<b></div><div class="content-block-title" style="word-wrap: break-word !important;white-space : inherit !important;">' + dataMessage + '</br></br><br><br></div><br><br>'+
        '<div class="row"><div class="col-50"><a href="#" class="button button-fill" onclick='+saveEventHendler+' id="saveDeviationCommentButton" style="width:50%; margin-left:50%">Yes</a></div><div class="col-50"><a href="#" class="button button-fill active" onclick="myApp.closeModal()" style="width:50%;">No</a></div></div>';

    createPopup(popupContent,"","10%","10%","80%","80%");
}
function enableSaveDeviationButton(textarea){
    var saveDeviationCommentButton=document.getElementById("saveDeviationCommentButton");
    if(textarea.value.length!=0)
        {
            saveDeviationCommentButton.className ="button button-fill active";
        }
    else
       {
        saveDeviationCommentButton.className ="button button-fill disabled";
       }
}
function setScreenHeaderContent(screenName,title){
    createLanguagesList(screenName);
    createLogoutPopover(screenName);  
    setTemplate_HeaderData(screenName,title);
}
function createLanguagesList(screen){
    $$('.create-language-links-'+screen).on('click', function () {
        var clickedLink = this;
        var output="";        
        for(var i=0 ; i< gLanguagesList.LangsList.length ; i++)
        { 
            var display=gLanguagesList.LangsList[i].display;
            output=output+'<li><a href="#" class="item-link list-button" onclick="switchLanguage(\''+gLanguagesList.LangsList[i].property+'\')">'+display  +'</li>';
        }
        var popoverHTML = '<div id="language_popover" class="popover">'+
                            '<div class="popover-inner">'+
                              '<div class="list-block">'+
                                '<ul>'+
                                 output
        '</ul>'+
      '</div>'+
    '</div>'+
  '</div>';
        myApp.popover(popoverHTML, clickedLink); 
    });
}
function createLogoutPopover(screen){
    $$('.create-profile-links-'+screen).on('click', function () {
        var clickedLink = this;
        var output="";

        output=output+'<li><a href="#" onclick="logoutAction();" class="item-link list-button">Logout</li>';
        
        var popoverHTML = '<div class="popover">'+
                            '<div class="popover-inner">'+
                              '<div class="list-block">'+
                                '<ul>'+
                                 output
        '</ul>'+
      '</div>'+
    '</div>'+
  '</div>';
        myApp.popover(popoverHTML, clickedLink);
    });
} 
function setTemplate_HeaderData(screenName,title){
    var user = JSON.parse(sessionStorage.getItem('userData'));
    document.getElementById("userName_label"+"_"+screenName).textContent=user.user_name;
    document.getElementById("lng_label"+"_"+screenName).textContent=user.culture_language;
   var titleElement=document.getElementById("title_"+screenName);
    titleElement.textContent=title;
}

