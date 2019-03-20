var check = 0;


$.ajax({
    //this retrieves the supported languages from the server
    url: "https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=en&key=trnsl.1.1.20190312T203236Z.0b8cd82697e99ad0.60ad6c537ddb42128b819afad99fecdde65279b8",
    type: 'POST',
    success: function(result){
        console.log(result);
        createList(result);
    }
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
            }
        }
    });
}

function translateWord(){

    if(check === 0){
        var lang = $("#langs").val();
        $.ajax({
            url: "https://translate.yandex.net/api/v1.5/tr.json/translate?text=" + "hello" + "&lang=" + lang + "&key=trnsl.1.1.20190312T203236Z.0b8cd82697e99ad0.60ad6c537ddb42128b819afad99fecdde65279b8",
            type: 'POST',
            success: function(result){
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
    div.append('<div class="inbl" id="dn">' + data.statuses[0].user.name + '<br><div id="at"> @' + data.statuses[0].user.screen_name + '</div>' + '</div>');
}

//user, text, entities, ifQuote, quote, date, index

function makeTweets(data){
    var div = $("#tweets");
    div.empty();

    for(var i = 0; i < data.statuses.length; i++){
        var date = data.statuses[i].created_at.substring(0,9);


        if(data.statuses[i].is_quote_status === true){
            div.append('<div class="all-tweets" id="' + i + '"><div id="quote">@' + data.statuses[i].quoted_status.user.screen_name
                + ': "' + data.statuses[i].quoted_status.full_text + '"</div><p>' + data.statuses[i].full_text + '</p>'
                + date +'</div>');
        }else{
            if(data.statuses[i].entities.user_mentions.length > 0){
                div.append('<div class="all-tweets" id="' + i + '"><div id="reply">in reply to @' +
                    data.statuses[i].entities.user_mentions[0].screen_name + '</div><p>' + data.statuses[i].full_text + '</p>'
                    + date +'</div>');

            }else{
                div.append('<div class="all-tweets" id="'+ i + '"><p>' + data.statuses[i].full_text + '</p>'
                    + date + '</div>')
            }
        }
    }
}