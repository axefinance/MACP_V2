
function onClickLoginButton(){
      try {
          var login = document.getElementById('userName').value;
          var password = document.getElementById('password').value;
          myApp.showPreloader();
          var url ='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/Authentication';
          parseDataGet(url,login,password);   
          }
          catch(e){}
}
   
function manageAuthentifaction(result)
{
       
    switch (result["status"]) {   
              case "error":
                 myApp.alert(result["message"],'MACP');
                 myApp.hidePreloader(); 
                  break;
              case "ok":
                 {  
                   sessionStorage.setItem("userData",JSON.stringify(result.userData));  
                    if(!checkInternetConnection())                                                   
                        myApp.alert("please check your internet connection");
                    else 
                        mainView.router.load({url: 'homePage.html',ignoreCache: true,reload: true});
                   sessionStorage.setItem("dateFormat",result.dateFormat);
                     break;
                 }
                   
          }
}  
   
                     

$$('.Auth-confirm-ok-cancel').on('click', function () {
    myApp.confirm('Are you sure want to exit from App?', 'MACP',
      function () {
       navigator.app.exitApp();
      },
      function () {
      }  
    );
});

function parseDataGet(url,login,password) {
    var dataToReturn = 'null';
    var data = "{" +
        "\"login\":\"" + login + "\","+
        "\"password\":\"" + password + "\"}";
    $.ajax({
        type: 'POST',
        url: url, 
        contentType: "text/plain",
        dataType: 'json', 
        data : data,
        success: function(data) {
             manageAuthentifaction(data);
        },
        error: function(e) {
           // if(e.status===0)
             myApp.hidePreloader();    
             errorMessage();   
        }
    });

}
