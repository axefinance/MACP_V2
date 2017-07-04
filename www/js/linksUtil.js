var LinkSourceTag;


function OpenReportWindowFromLink(reportpath,fileType)
{
    generateDocument(reportpath, divId, fileType);
}
function OpenRelatedItemFromLink(property,relatedtype,sourcetag)
{
   isRelatedFromLink="true";
    console.log("OpenRelatedItemFromLink isRelatedFromLink",isRelatedFromLink);
    divId=sourcetag;
    engine="classicre";
    RelatedItemType=relatedtype;
    mainView.router.load({url: 'relatedScreen.html',reload:false,ignoreCache:true});
}
function OpenInformativeGridFromLink(sourcetag)
{ 
    myApp.alert("informative");      
}  