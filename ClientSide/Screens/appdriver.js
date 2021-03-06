/**
 * Created by Kobi on 14/11/2015.
 */
"use strict";



var msgArr=[];
var index=0;

var displayAllMsgs = function(screenID)
{
    //Flow: Check if we have msgs -> get the msg html template file -> for each text in msgs append it to body ->
    // for each img in msgs append it to body -> load msg css file -> increment index.
    if(msgArr[index]!=undefined && msgArr[index]!=null)
    {
       // alert("Im here");
        for (var tfIndex=0; tfIndex<msgArr[index].timeFrames.length;  tfIndex++) {
            console.log((msgArr[index]).timeFrames[tfIndex].display());
            if ((msgArr[index]).timeFrames[tfIndex].display())
            {

                $.get('http://127.0.0.1:8080/'+"ClientsCSSAndTemplates/"+(msgArr[index]).getTemplateURL()+".html", {}, function (data) {

                    $("body").html(data).fadeOut(1).fadeIn(1000);
                    var text = "";
                    var img="";
                    for (var j=0; j<msgArr[index].texts.length; j++) {
                        if( ((msgArr[index]).texts[j])!=undefined &&  ((msgArr[index]).texts[j])!=null) {
                            var id2 = "#txt"+j;
                            text = "<br>" + msgArr[index].texts[j] + "</br>";
                            $("#txt"+j).html(text);
                        }
                    }
                    for (j=0; j<msgArr[index].imgs.length; j++) {
                        if( msgArr[index].imgs[j]!=undefined && msgArr[index].imgs[j]!=null) {
                            var id2 = "#img"+j;
                            img = "<img src='";
                            img += ((msgArr[index]).imgs[j]) + "'>";
                            $(id2).html(img);
                        }
                    }
                    $("#msg-header").html("Message: "+(index+1)+"(debug until final version)");
                    //Afetr we have al msg/advertisment data in ram we need to bring the msg css file
                    //We allow not to have CSS file, it wont affect anyone.
                    loadCSS("ClientsCSSAndTemplates/CSS/"+(msgArr[index]).getTemplateURL()+".css");
                    console.log("msgArr.length(): "+msgArr.length);
                    console.log("Old index: "+index);
                    console.log("Round is:"+(index+1)%msgArr.length)
                    index = (index+1)%msgArr.length;
                    console.log("New index: "+index);
                    var timeOut =setTimeout(function() {
                        displayAllMsgs(msgArr);
                    },(msgArr[index]).seconds*1000);
                });
            }
        }
    }
    else {
        setTimeout(function() {connectToServerAsScreen(screenID);},0);
    }
};


/**
 * function to load a given css file
 * href represent the css file name without extension!!
 */
var loadCSS = function(href) {
    var cssLink = $("<link rel='stylesheet' type='text/css' href='"+href+"'>");
    $("head").html(cssLink);
};



/**
 * This method will connect to screens server as a specific screen and will start running the app via displayAllMsgs method.
 * @param dataAsObject represent a JSON object of all msgs
 * @param index represent the first msg to display
 * @param screenID represent the id of the client screen.
 * @param onFirstTime represent a flag if its an update or first time
 */
var buildMsgsAndStartApp = function(dataAsObject,index,screenID,onFirstTime)
{//Parsing the object and build an array of msgs/advertisement to display
    var finalMsgsToDisplay = [];
    for (var i = 0; i < dataAsObject.length; i++) {
        var screenArr = dataAsObject[i].screenArr;
        var name = dataAsObject[i].name;
        var texts = dataAsObject[i].texts;
        var imgs = dataAsObject[i].imgs;
        var templateURL = dataAsObject[i].templateURL;
        var seconds = dataAsObject[i].seconds;
        var times = dataAsObject[i].timeFrames;
        var timfs = [];
        for (var j = 0; j < times.length; j++) {
            var startDate = times[j].startDate;
            var endDate = times[j].endDate;
            var daysArr = times[j].daysArr;
            var startTime = times[j].startTime;
            var endTime = times[j].endTime;
            timfs[j] = new TimeFrame(startDate, endDate, daysArr, startTime, endTime);
        }
        finalMsgsToDisplay[i] = new Message(screenArr, name, texts, imgs, templateURL, timfs, seconds);
    }
    //After we have all the msgs, lets start the app:
    //If this is the first time we are building msgArray we also need to start the method that displays msgArray (displayAllMsgs)
    //If this is not the first time, it means that displayAllMsgs is running, so update msgArr
    msgArr = finalMsgsToDisplay;
    if(onFirstTime)
    {
        console.log("First time!");
        console.log(screenID);
        displayAllMsgs(screenID);
    }
};


/**
 * This method connecting to the server as a specific screen
 * @param screenID represent the screen number
 */
function connectToServerAsScreen(screenID) {
    try
    {
        window.location.reload(true);
    }
    catch(err)
    {
        console.error("ERROR: "+err.message);
    }
};