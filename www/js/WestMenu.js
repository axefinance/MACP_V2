function westMenuItem(item,title,screenName){ 
    if(isScreenInCache(screenName))
        {
        mainView.history=["#homePage"];
        document.getElementById("title_"+screenName.replace(".html","")).remove(); 
        document.getElementById("userName_label_"+screenName.replace(".html","")).remove(); 
        document.getElementById("lng_label_"+screenName.replace(".html","")).remove(); 
        $$('.view-main .page-on-left').remove(screenName);
        }
      currentItem=item;
      pageTitleContent=title;
      if(!checkInternetConnection())                                                   
          myApp.alert("please check your internet connection");
      else 
          mainView.router.load({url: screenName,reload:true});   
}; 


