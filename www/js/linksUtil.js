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
    gEngine="classicre";
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
function OpenAttachmentFromLink(mainItemId, sourceTag, relatedtype){
    gMainItemId = mainItemId;
    gScreenName = sourceTag;
    itemRef=mainItemId+".AUTO GENERATED";
    RelatedItemType=relatedtype;
    gEngine = "attachmentFromLink";
    mainView.router.load({url: 'attachmentScreen.html',reload:false,ignoreCache:true});

   /* isRelatedFromLink="true";
    gScreenName = sourceTag;
    engine = "attachment";
    mainView.router.load({url: 'relatedScreen.html',reload:false,ignoreCache:true});*/

}