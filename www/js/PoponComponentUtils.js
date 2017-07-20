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


function poponInfoClick(item,idComponent) {
        
    itemRef=document.getElementById(idComponent+"__Value").value;
    itemId=document.getElementById(idComponent).value;
    if (itemId != "" || itemId != undefined)
    {
        var items = item.split(",");  
        currentItem=item;    
        var newPageContent = '<div class="navbar">'+
  '<div class="navbar-inner">'+
     '<div class="left theme-gray">'+
        '<a id="backButton" href="#" class="back link">'+
             '<i class="icon icon-back"></i>'+
             '<span>Back</span>'+
          '</a>'+
           '<a class="navbarUserIcon navbarButton link create-profile-links-editScreen" id="userName_label_editScreen__'+itemId+'" aria-hidden="true">'+
           'User</a>'+
     '</div>'+ 
     '<div id="title_editScreen__'+itemId+'" class="center sliding">Search</div>'+
      
    '<div class="right">'+
            '<a id="lng_label_editScreen__'+itemId+'" class="navbarGlobeIcon link create-language-links-editScreen__'+itemId+' navbarButton" aria-hidden="true">'+
           'EN</a>'+
     '<a href="#" class="link icon-only open-panel navbarWestMenuIcon"></a>'+
    '</div>'+
  '</div>'+
'<div class="pages">'+
  '<div data-page="editScreen" class="page" >'+ 
   
   '<div class="page-content" >'+
        '<div id="editScreenForm" class="newPage">'+
          '<div id=id="dynamic__'+itemId+'" ></div>'+    
       '</div>'+      
          '</div>'+      
         '<div class="toolbar">'+
'<div id="edit-toolbarContent__'+itemId+'" class="toolbar-inner" style="align-parent:rigth !important" >'+

       
    '</div>'+  
       '</div>'+
  '</div>'+               
'</div>';
            mainView.router.loadContent(newPageContent);
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