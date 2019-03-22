var check = 0;

$(document).ready(function(){
    $.ajax({
        //this retrieves the supported languages from the server
        url: "https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=en&key=trnsl.1.1.20190312T203236Z.0b8cd82697e99ad0.60ad6c537ddb42128b819afad99fecdde65279b8",
        type: 'POST',
        success: function(result){
            console.log(result);
            createList(result);
        }
    });
    //makeTwitter()
    //somehow get it to automatically input MichelleObama as an example
});

//this function serves to create a list of the supported languages for the client to choose from
function createList(data){
    for(i in data.langs){
        var opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = data.langs[i];
        $("#langs").append(opt);
    }
}

function checkUser(user){
    //checks if a user was entered
    if(user.length < 1){
        alert('Please type in a twitter username');
    }

    //check for @ symbol or blank spaces which is not necessary
    for(var i = 0; i < user.length; i++){
        if(user[i] === "@"){
            alert('Please type in the username without any symbols');
        }
        if(user[i] === " "){
            alert('Make sure to enter the username without spaces');
        }
    }
}

function makeTwitter(){
    var user = $("#twtuser").val();
    checkUser(user);
    $.ajax({
        url: "https://twitter-relay.herokuapp.com/twitterAPI?user=" + user,
        dataType: 'JSON',
        success: function(result){
            console.log(result);
            if(result.statuses.length === 0) {
                check++;
                alert("Twitter username doesn't exist, user is private, or user has no recent activity. Please " +
                    "try with a different user");
            }else{
                makeProfile(result);
                makeTweets(result);
                $("#profile").css("visibility", "visible");
                $(".all-tweets").click(function (){
                    var tweet = result.statuses[this.id].edit;
                    translateTweet(tweet);
                });
            }
        }
    });
}

function translateTweet(tweet){
    var lang = $("#langs").val();
    if(check === 0){
        $.ajax({
            url: "https://translate.yandex.net/api/v1.5/tr.json/translate?lang=" + lang + "&key=trnsl.1.1.20190312T203236Z.0b8cd82697e99ad0.60ad6c537ddb42128b819afad99fecdde65279b8&text=" + tweet,
            type: 'POST',
            success: function(result){
                console.log(result);
                var trans = $("#translation");
                trans.empty();
                trans.append(result.text[0]);
            },
            error: function () {
                alert('Please choose a language for translation!');
            }
        });
    }
}

function makeProfile(data){
    var div = $("#profile");
    div.empty();
    div.append('<img class="inbl" id="pfp" src="' + data.statuses[0].user.profile_image_url + '">');
    div.append('<div class="inbl" id="dn">' + data.statuses[0].user.name + '<br><div id="at"> @' +
        data.statuses[0].user.screen_name + '</div>' + '</div>');
}

function makeTweets(data){
    var div = $("#tweets");
    div.empty();

    for(var i = 0; i < data.statuses.length; i++){
        var text = data.statuses[i].full_text;
        var media = text.includes("https");
        // var RT = text.includes("RT @");
        var urlLocate = text.search(" https");
        var date = data.statuses[i].created_at.substring(0,10);

        var quote = "";
        var reply = "";
        var vid = "";
        var img = "";

        //check if tweet is a quote tweet
        if(data.statuses[i].is_quote_status === true){
            if(data.statuses[i].hasOwnProperty('quoted_status')){
                quote = '<div class="quote">@' + data.statuses[i].quoted_status.user.screen_name +
                    ': "' + data.statuses[i].quoted_status.full_text + '"</div>';
                text = data.statuses[i].full_text.slice(0, urlLocate);
            }
        }else{
            //check if tweet involves media
            if(media === true) {
                if (data.statuses[i].hasOwnProperty('extended_entities') === true) {
                    var type = data.statuses[i].extended_entities.media[0].type;
                    if (type === "photo") {
                        img = '<img class="media" src=' + data.statuses[i].extended_entities.media[0].media_url + '><br>';
                        text = data.statuses[i].full_text.slice(0, urlLocate);
                    }
                    if (type === "video") {
                        var testArray = [];

                        //collects all four variants bitrates and pushes them into an array
                        for(var x = 0; x < 4; x++){
                            testArray.push(data.statuses[i].extended_entities.media[0].video_info.variants[x].bitrate);
                        }

                        //checks which index is the one with the high bitrate which means it holds the best video quality
                        for(var n = 0; n < 4; n++){
                            if(testArray[n] === 2176000){
                                var videoURL = n;
                            }
                        }

                        vid = '<video class="media" controls muted loop autoplay><source src=' +
                            data.statuses[i].extended_entities.media[0].video_info.variants[videoURL].url + '></video><br>';
                         text = data.statuses[i].full_text.slice(0, urlLocate);
                    }
                }
            }
        }

        //check if tweet is a reply
        if(data.statuses[i].in_reply_to_screen_name !== null){
            reply = '<div class="reply">in reply to @' + data.statuses[i].in_reply_to_screen_name + '</div>';
        }

        //check if tweet is a retweet which is irrelevant to translate
        if(data.statuses[i].hasOwnProperty('retweeted_status') === true){
            var x  = text.indexOf(":");
            text = text.slice(x + 2, text.length);

            reply = '<div class="rt">RT @' + data.statuses[i].retweeted_status.user.screen_name + '</div>'

        }

        div.append('<div class="all-tweets" id="'+ i + '">' + reply + quote + '<p>' + text + '</p>'
                + img + vid + date + '</div>');

        //add the edited tweet as a property to tweet object
        data.statuses[i].edit = encodeURIComponent(text);
    }
}

function makeTransTweet(){}