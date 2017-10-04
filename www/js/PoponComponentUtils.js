var PoponComponentItem;
var ComponentId;
var DisplayProperty;
var FormId;

function GetPoponComponentScreenContent() {
    myApp.showPreloader();
    var url = "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GenerateSearchOnPoponScreen";
    var data = "{" +
      "\"item\":\"" + PoponComponentItem + "\"," +
      "\"userData\":" + sessionStorage.getItem("userData") + "}";
    $.ajax({
        type: 'POST',
        url: url,
        contentType: "text/plain",
        dataType: "json",
        dataType: "json",
        data: data,
        success: function (data) {
            document.getElementById("poponComponentForm").innerHTML = data.content;
            myApp.hidePreloader();
        },
        error: function (e) {
            myApp.hidePreloader();
        }
    });
}

function searchOnPoponButtonEvent() {

    var url = 'http://' + sessionStorage.getItem('Ip_config') + ':' + sessionStorage.getItem('Ip_port') + '/MobileAPI.svc/GetSearchResultPage';
    myApp.showPreloader();
    var formData = myApp.formToData('#my-poponComponent-form');
    gCurrentSearchItem = PoponComponentItem;
    gCurrentSearchType = "searchOnPoponResult";
    lunchSearchResult(gCurrentSearchItem,JSON.stringify(formData));
}
function poponComponentClick(item, idComponent,formId, displayproperty) {
    var items = item.split(",");
     ComponentId = idComponent;
     FormId=formId;
      DisplayProperty = displayproperty;
    if (items.length === 1) {
        PoponComponentItem = item;
        mainView.router.load({ url: "poponComponentScreen.html", reload: false });
        myApp.showPreloader();
        var url = "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GenerateSearchOnPoponScreen"; 
        var data = "{" +
          "\"item\":\"" + PoponComponentItem + "\"," +
          "\"userData\":" + sessionStorage.getItem("userData") + "}";
        $.ajax({
            type: 'POST',
            url: url,
            contentType: "text/plain",
            dataType: "json",
            dataType: "json",
            data: data,
            success: function (data) {
                document.getElementById("poponComponentForm").innerHTML = data.content;
                myApp.hidePreloader();
            },
            error: function (e) {
                myApp.hidePreloader();
            }
        }); 
    }
    else {
        var Htmllist = "";
        for (var i = 0 ; i < items.length; i++) {
            var item=items[i].replace(" ","");
            Htmllist = Htmllist + '<li  onclick="handle();"><label class="label-radio item-content">' +
                  '<input type="radio" name="my-radio" value="' + item + '">' +
        '<div class="item-inner">' +
              '<div class="item-title">' + item + '</div>' +
            '</div>' +
          '</label>' +
        '</li>';
        }
        var modal = myApp.modal({
            title: '',
            text: '',
            afterText: '<div style="width: auto; margin:5px -15px -15px">' +
                          '<form id="searchOnPopon-choicItem-form" class="list-block">' +
                          '<div class="list-block">'+
                      '<ul>' +
                     Htmllist +
                     '</ul>' +
                     '</div>'+
                     '</form>'+
                     '</div>'
            
        });

       

    }
}
function handle() {
   
    var formToData=JSON.stringify(myApp.formToData("#searchOnPopon-choicItem-form"));
    obj = JSON.parse(formToData);
     myApp.closeModal();
    PoponComponentItem=obj["my-radio"]; 
    mainView.router.load({ url: "poponComponentScreen.html", reload: false });
        myApp.showPreloader();
        var url = "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GenerateSearchOnPoponScreen";
        var data = "{" +
          "\"item\":\"" + PoponComponentItem + "\"," +
          "\"userData\":" + sessionStorage.getItem("userData") + "}";
        $.ajax({
            type: 'POST',
            url: url,
            contentType: "text/plain",
            dataType: "json",
            dataType: "json",
            data: data,
            success: function (data) {
                document.getElementById("poponComponentForm").innerHTML = data.content;
                myApp.hidePreloader();
            },
            error: function (e) {
                myApp.hidePreloader();
            }
        
        });
    
}


function poponInfoClick(screenName,idComponent) 
{
    
    gPageTitleContent=document.getElementById(idComponent+"__Value").value;
    gMainItemId=document.getElementById(idComponent).value;
    if (gMainItemId != "" || gMainItemId != undefined)
    {  
        gScreenName=screenName; 
        loadEditScreen(true,gMainItemId);
    }
    else
        myApp.alert("null");
            
}  
  
function selectItem(itemId,itemShortName)
{ 
    
  $('#'+FormId).find('#'+ComponentId+"__Value").val(itemShortName);  
  $('#'+FormId).find('#'+ComponentId).val(itemId);
  $("#poponInfoButton_"+ComponentId).removeAttr("disabled");
   myApp.closeModal();
   mainView.router.back();  
    
}