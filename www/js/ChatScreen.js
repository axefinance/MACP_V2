var prevScrollpos =0;
var isShown = true;

function getRecipients(recipientsList, isNotification){
    $("#reciepientsView").html('');
    if(isShown === false)
    {
        document.getElementById("selectedUsers").style.top = "0%";
        isShown=true;
    }
    recipientsList.forEach(function(item,index,array)
    {
        var res = item.split("__");
         var chip = "<div id='chip__"+item+"' class='chip' style='margin-right:10px;padding:10px;height30px;' onclick=\"removeChip('chip__"+item+"')\">"+
         "<div class='chip-label'style='font-size:20px;'>"+res[2]+"</div><a href='#'";
          if(!isNotification)
          chip+="class='chip-delete'";
           chip+="style='width:16px;height:16px;background-size:16px 16px;margin-left:5px;'></a></div>";
         $("#reciepientsView").append(chip);
    });
}

function createChip(item){
    var res =item.split('__');
    var parentDiv = document.getElementById("reciepientsView");
    //test if user exist in chipcontaner
    var pt='chip__';
    var ids = pt.concat(item);
    var childChip =  document.getElementById(ids);

  if (parentDiv.contains(childChip) )
//    if (parentDiv.querySelector(childChip) != null)
     {
     myApp.alert('This recipient is already selected','MACP');
    }else {
        //if not exist add user
    var part1 = '<div class="chip" id="chip__';
    var part2 = '" onclick="removeChip(this.id);" style="margin-left: 5px;" ><div class="chip-label">';
    var part3 = '</div><a href="#" class="chip-delete"></a></div>';
    var dyn_chip = part1.concat(item, part2, res[2], part3);
    document.querySelector('#reciepientsView').insertAdjacentHTML('beforeend',dyn_chip);
    }
}

function removeChip(id){
    myApp.confirm('Do you want to remove this recipient?','MACP', function () {
        document.getElementById(id).remove();
    });
}
function createtoggle(item){
    $(('.son').concat(item)).toggle();
    }

function onMessageViewScroll(hide, show) {
    var currentScroll = document.getElementById("messagesList").scrollTop;
    if(currentScroll>prevScrollpos)
        if(isShown === false)
        {
            document.getElementById("selectedUsers").style.top = show;
            isShown=true;
        }
    if(currentScroll<prevScrollpos)
        if(isShown === true)
        {
            document.getElementById("selectedUsers").style.top = hide;
            isShown=false
        }
    prevScrollpos = currentScroll;
}




function sendCommunication(){
var contacts ="[";
myApp.showPreloader();

    var chipContact="[";
    $("#reciepientsView").children().each(function(){
    var res = $(this).attr('id').split("__");
        contacts += "{\"id\":\""+res[1]+"\",\"type\":\""+res[2]+"\"},";
        chipContact+= "'"+res[1]+"__"+res[2]+"__"+res[3]+"',";
    });
    contacts=contacts.slice(0,-1);
    chipContact=chipContact.slice(0,-1);
    chipContact+="]";
    contacts+="]";

messageContent = $("#messageContent").val();
     var data="{"+
        "\"screenName\":\""+gScreenName+"\","+
        "\"contacts\":"+contacts+","+
        "\"chipContact\":\""+chipContact+"\","+
        "\"messageContent\":\""+messageContent+"\","+
        "\"mainItemId\":\""+gMainItemId+"\","+
        "\"userData\":"+sessionStorage.getItem("userData")+"}";
             var url= "http://" + sessionStorage.getItem('Ip_config') + ":" + sessionStorage.getItem('Ip_port') + "/MobileAPI.svc/SendMsg";
        $.ajax({
                type: 'POST',
                url: url,
                contentType: "text/plain",
                dataType: "json",
                data: data,
                success: function(data) {
                    initiateSignalR(contacts, messageContent);
                    $("#messagesView").append(data.msgBox);
                    $("#reciepientsView").html('');
                    $("#messageContent").val('');
                    myApp.hidePreloader();
                },
                error: function(e) {
                    myApp.hidePreloader();
                    errorMessage(e.message);
                }
            });
}



