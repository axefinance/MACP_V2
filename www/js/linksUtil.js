var LinkSourceTag;
var mainItemIdForLink;
var mainItemForLink;

function OpenReportWindowFromLink(reportpath,fileType)
{
    generateDocument(reportpath, divId, fileType);
}
function OpenRelatedItemFromLink(property,relatedtype,sourcetag,parentItemId,parentItem)
{
   isRelatedFromLink="true";
    divId=sourcetag;
    itemRef=parentItemId+".AUTO GENERATED";
    engine="classicre";
    RelatedItemType=relatedtype;
     mainItemIdForRelatedScreen=parentItemId;
     mainItemForRelatedScreen=parentItem;
     mainItemIdForLink=parentItemId;
     mainItemForLink=parentItem;
    mainView.router.load({url: 'relatedScreen.html',reload:false,ignoreCache:true});
}
function OpenInformativeGridFromLink(sourcetag)
{ 
    myApp.alert("informative");      
}   