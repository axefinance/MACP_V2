var LinkSourceTag;

function OpenReportWindowFromLink(reportpath,fileType)
{
    generateDocument(reportpath, divId, fileType);
}
function OpenRelatedItemFromLink(property,sourcetag)
{
    LinkSourceTag=sourcetag;
    divId=sourcetag;
    engine="classicre";
    mainView.router.load({url: 'relatedScreen.html',reload:false,ignoreCache:true});
}
function OpenInformativeGridFromLink(sourcetag)
{
    myApp.alert("informative");   
}  