var LinkSourceTag;
var mainItemIdForLink;
var mainItemForLink;

function OpenReportWindowFromLink(reportpath,fileType,screenName,mainItemId)
{
    generateDocument(reportpath, screenName, fileType,mainItemId);
}
function OpenRelatedItemFromLink(property,relatedtype,linkSourcetag,parentItemId,parentItem)
{
    gIsRelatedFromLink="true";
    gScreenName=linkSourcetag;
    gPageTitleContent=gPageTitleElement.textContent+" : "+relatedtype;
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
   // myApp.alert("informative");       
}   
function OpenAttachmentFromLink(mainItemId, attachmentSourceTag, relatedtype){
    gMainItemId = mainItemId;
    gScreenName = attachmentSourceTag;
    gPageTitleContent=mainItemId+".AUTO GENERATED";
    RelatedItemType=relatedtype;
    gEngine = "attachmentFromLink";
    mainView.router.load({url: 'attachmentScreen.html',reload:false,ignoreCache:true});

}