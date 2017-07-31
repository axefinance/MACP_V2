var PoponComponentItem;
var ComponentId;
var DisplayProperty;

function GetPoponComponentScreenContent() {
    myApp.showPreloader();
    var url = "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/GenerateSearchOnPoponScreen";
    var data = "{" +
      "\"item\":\"" + PoponComponentItem + "\"," +
      "\"userData\":" + sessionStorage.getItem("userData") + "}";
    console.log("SearchParams", data);
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
    currentSearchParams = JSON.stringify(formData);
    currentSearchItem = PoponComponentItem;
    currentSearchType = "searchOnPoponResult";
    lunchSearchResult();
}
function poponComponentClick(item, idComponent, displayproperty) {
    var items = item.split(",");
     ComponentId = idComponent;
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
            Htmllist = Htmllist + '<li  onclick="handle();"><label class="label-radio item-content">' +
                  '<input type="radio" name="my-radio" value="' + items[i] + '" checked="checked">' +
        '<div class="item-inner">' +
              '<div class="item-title">' + items[i] + '</div>' +
            '</div>' +
          '</label>' +
        '</li>';
        }
        var modal = myApp.modal({
            title: '',
            text: '',
            afterText: '<div style="width: auto; margin:5px -15px -15px">' +
                          '<form id="searchOnPopon-choicItem-form" class="list-block">' +
                      '<ul>' +
                     Htmllist +
                     '</ul>' +
                     '</form>' +
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


function poponInfoClick(subItem,idComponent) 
{
    
    itemRef=document.getElementById(idComponent+"__Value").value;
    gMainItemId=document.getElementById(idComponent).value;
    if (gMainItemId != "" || gMainItemId != undefined)
    {  
        gSubItem=subItem;    
        loadEditScreen(true);
    }
    else
        myApp.alert("null");
            
}  
  
function selectItem(itemId,itemShortName)
{ 
   var displayElement=document.getElementById(ComponentId+"__Value");
   var valueElement= document.getElementById(ComponentId); 
    displayElement.value=itemShortName;
    valueElement.value=itemId;
    $("#poponInfoButton_"+ComponentId).removeAttr("disabled");
   myApp.closeModal();
   mainView.router.back();  
    
}