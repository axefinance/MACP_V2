

function saveConfiguration() {
    ip = document.getElementById('WSip').value;
    port = document.getElementById('WSport').value;
    updateFromDevice(ip,port);
    mainView.router.back();    
 }  


function updateFromEmulator(ip,port)
{
     sessionStorage.setItem('Ip_config', ip);
    sessionStorage.setItem('Ip_port', port);  
}

function updateFromDevice(ip, port)
{
      
   updateWsConfiguration(ip,port);
    sessionStorage.setItem('Ip_config', ip);
    sessionStorage.setItem('Ip_port', port);
}  
                                           
$$('.WS-confirm-ok-cancel').on('click', function () {
    mainView.router.back(true);
    /*
    myApp.confirm('Are you sure want to exit from App?', 'MACP',
      function () {
       navigator.app.exitApp();
      },
      function () {
      }
    );   
    */
});          