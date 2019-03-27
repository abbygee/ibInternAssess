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
});

//this function serves to create a list of the supported languages for the client to choose from
function createList(data){
    for(var i in data.langs){
        var opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = data.langs[i];
        $("#langs").append(opt);
    }
}

//checks multiple aspects of user's input for the twitter user
function checkUser(user){
    //checks if a user was entered
    if(user.length < 1){
        alert('Please type in a twitter username');
        return false;
    }

    //check for @ symbol or blank spaces which is not necessary
    for(var i = 0; i < user.length; i++){
        if(user[i] === "@"){
            alert('Please type in the username without any symbols');
            return false;
        }
        if(user[i] === " "){
            alert('Make sure to enter the username without spaces');
            return false;
        }
    }
}

//runs necessary function to create the twitter timeline
function makeTwitter(){
    var user = $("#twtuser").val();
    if(checkUser(user) !== false){
        $.ajax({
            url: "https://twitter-relay.herokuapp.com/twitterAPI?user=" + user,
            dataType: 'JSON',
            success: function(result){
                console.log(result);
                if(result.statuses.length === 0) {
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
}

//passes tweet to translation api
function translateTweet(tweet){
    var lang = $("#langs").val();
    $.ajax({
        url: "https://translate.yandex.net/api/v1.5/tr.json/translate?lang=" + lang + "&key=trnsl.1.1.20190312T203236Z.0b8cd82697e99ad0.60ad6c537ddb42128b819afad99fecdde65279b8&text=" + tweet,
        type: 'POST',
        success: function(result){
            var trans = $("#translation");
            trans.empty();
            trans.append(result.text[0]);
            trans.css("visibility", "visible");
        },
        error: function (){
            alert('Please choose a language for translation!');
        }
    });
}

//creates twitter profile header
function makeProfile(data){
    var div = $("#profile");
    div.empty();
    div.append('<img class="inbl" id="pfp" src="' + data.statuses[0].user.profile_image_url + '">');
    div.append('<div class="inbl" id="dn">' + data.statuses[0].user.name + '<br><div id="at"> @' +
        data.statuses[0].user.screen_name + '</div>' + '</div>');
}

//creates all tweets accessible from user
function makeTweets(data){
    var div = $("#tweets");
    div.empty();

    for(var i = 0; i < data.statuses.length; i++){
        var text = data.statuses[i].full_text;
        var media = text.includes("https");
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
        //else statement bc a quote tweet can't include media
        }else{
            //check if tweet involves media
            if(media === true && data.statuses[i].hasOwnProperty('extended_entities') === true) {
                var type = data.statuses[i].extended_entities.media[0].type;

                if (type === "photo") {
                    //for loop for when tweet contains more than 1 photo,
                    if(data.statuses[i].extended_entities.media.length > 1){
                        img += '<div class="images">';
                        for(var m = 0; m < data.statuses[i].extended_entities.media.length; m++){
                            img += '<div class="cell"><img src=' + data.statuses[i].extended_entities.media[m].media_url + '></div>';
                            text = data.statuses[i].full_text.slice(0, urlLocate);
                        }
                        img += '</div><br>';
                    }else{
                        //single image
                        img = '<img class="media" src=' + data.statuses[i].extended_entities.media[0].media_url + '><br>';
                        text = data.statuses[i].full_text.slice(0, urlLocate);
                    }
                }

                if (type === "video") {
                    var testArray = [];
                    var variants = data.statuses[i].extended_entities.media[0].video_info.variants;

                    //collects all of the variants bitrates and pushes them into an array
                    for(var f = 0; f < variants.length; f++){
                        if(variants[f].hasOwnProperty('bitrate')){
                            testArray.push(variants[f].bitrate);
                        }
                    }

                    //checks which index is the one with the highest bitrate which means it holds the best video quality
                    var max = Math.max(...testArray);
                    for(var n = 0; n < variants.length; n++){
                        if(variants[n].bitrate === max){
                            var videoURL = n;
                        }
                    }

                    vid = '<video class="media" controls muted loop autoplay><source src=' +
                        variants[videoURL].url + '></video><br>';
                    text = data.statuses[i].full_text.slice(0, urlLocate);
                }
            }
        }

        //check if tweet is a reply
        if(data.statuses[i].in_reply_to_screen_name !== null){
            reply = '<div class="reply">in reply to @' + data.statuses[i].in_reply_to_screen_name + '</div>';
        }

        //check if tweet is a retweet
        if(data.statuses[i].hasOwnProperty('retweeted_status') === true){
            //deletes the rt beginning within the text
            var x  = text.indexOf(":");
            text = text.slice(x + 2, text.length);

            reply = '<div class="rt">RT @' + data.statuses[i].retweeted_status.user.screen_name + '</div>'

        }

        div.append('<div class="all-tweets" id="'+ i + '">' + reply + quote + '<p>' + text + '</p>'
                + img + vid + date + '</div>');

        //add the edited tweet (without the extra urls) as a property to tweet object
        data.statuses[i].edit = encodeURIComponent(text);
    }
}