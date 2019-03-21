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
                    var tweet = result.statuses[this.id].full_text;
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
            url: "https://translate.yandex.net/api/v1.5/tr/detect?key=trnsl.1.1.20190312T203236Z.0b8cd82697e99ad0.60ad6c537ddb42128b819afad99fecdde65279b8&text=" + tweet,
            type: 'POST',
            success: function(result) {
                console.log(result);
            }
        });


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

        var date = data.statuses[i].created_at.substring(0,9);


        if(data.statuses[i].is_quote_status === true){
            div.append('<div class="all-tweets" id="' + i + '"><div class="quote">@' + data.statuses[i].quoted_status.user.screen_name
                + ': "' + data.statuses[i].quoted_status.full_text + '"</div><p>' + data.statuses[i].full_text + '</p>'
                + date +'</div>');
        }else{
            if(data.statuses[i].entities.user_mentions.length > 0){
                div.append('<div class="all-tweets" id="' + i + '"><div class="reply">in reply to @' +
                    data.statuses[i].entities.user_mentions[0].screen_name + '</div><p>' + data.statuses[i].full_text + '</p>'
                    + date +'</div>');

            }else{
                //fix this media thing to also consider other urls outside of photos and videos
                if(media === true){
                    if(data.statuses[i].extended_entities.media.length > 0){
                        var type = data.statuses[i].extended_entities.media[i].type;
                        if(type === "photo"){
                            div.append('<div class="all-tweets" id="' + i + '"><p>' + data.statuses[i].full_text +
                                '</p><img class="media" src="' + data.statuses[i].extended_entities.media[i].media_url + '"></div>');
                        }
                        if(type === "video"){
                        div.append('<div class="all-tweets" id="' + i + '"><p>' + data.statuses[i].full_text +
                            '</p><video class="media" controls muted loop autoplay ><source src="'+
                            data.statuses[i].extended_entities.media[i].video_info.variants[2].url +'"></video></div>');
                        }
                    }
                }else{
                    div.append('<div class="all-tweets" id="'+ i + '"><p>' + data.statuses[i].full_text + '</p>'
                        + date + '</div>')
                }
            }
        }
    }
}

