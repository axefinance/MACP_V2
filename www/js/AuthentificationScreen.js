
function onClickLoginButton(){
      try {
          var login = document.getElementById('userName').value;
          var password = document.getElementById('password').value;
          if(login==="")
              login='""';
          if(password==="")
              password='""';
          myApp.showPreloader();
           var url ='http://'+ sessionStorage.getItem('Ip_config')+':'+sessionStorage.getItem('Ip_port')+'/MobileAPI.svc/Authentication/' + login + '/' + password;
          parseDataGet(url);   
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

                     /*
                  sessionStorage.setItem("userId", result['user_id']);
                  sessionStorage.setItem('userName', result['user_name']);
                  sessionStorage.setItem('userShortName', result['user_shortName']);   
                  sessionStorage.setItem('language',result['culture_language']);
                  sessionStorage.setItem('InternalEntities',result['InternalEntities']);
                  sessionStorage.setItem('InternalEntitiesShortname',result['InternalEntitiesShortname']);
                  sessionStorage.setItem('ProfilesList',result['ProfilesList']);  
                  sessionStorage.setItem('AccessRightUserList',result['AccessRightUserList']);   
                  sessionStorage.setItem('GroupsList',result['GroupsList']);        
                  sessionStorage.setItem('HomePageConfig',result['HomePageConfig']);  
                  */
                  mainView.router.load({url: 'homePage.html',ignoreCache: true,reload: true});
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

function parseDataGet(url) {
    var dataToReturn = 'null';
    $.ajax({
        type: 'GET',
        url: url, 
        contentType: "text/plain",
        dataType: 'json',
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
