$.ajax({
    //this retrieves the supported languages from the server
    url: "https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=en&key=trnsl.1.1.20190312T203236Z.0b8cd82697e99ad0.60ad6c537ddb42128b819afad99fecdde65279b8",
    type: 'POST',
    success: function(result){
        console.log(result);
        createList(result);
        console.log($('p.timeline-Tweet-text').text);
    }
});


function translateWord(){
    var text = $("#word").val();
    var lang = $("#langs").val();
    $.ajax({
        url: "https://translate.yandex.net/api/v1.5/tr.json/translate?text=" + text + "&lang=" + lang + "&key=trnsl.1.1.20190312T203236Z.0b8cd82697e99ad0.60ad6c537ddb42128b819afad99fecdde65279b8",
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

//this function serves to create a list of the supported languages for the client to choose from
function createList(data){
    for(i in data.langs){
        var opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = data.langs[i];
        $("#langs").append(opt);
    }

}

!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
function extractTweets() {
    var tweets = $('#tweetHolder iframe').contents().find('li.tweet');
    var tweetObjects = [];
    for (var i=0; i < tweets.length; ++i) {
        var cur = $(tweets[i]);

        var tweet = {};
        tweet.authorFullName = cur.find("span.full-name span.p-name").html();
        tweet.authorUserName = cur.find("span.p-nickname b").html();
        tweet.date = cur.find("a.u-url").attr("data-datetime");
        tweet.id = cur.attr("data-tweet-id");
        tweet.text = $.trim(cur.find("p.e-entry-title").html());
        tweetObjects.push(tweet);
    }
    console.log(tweetObjects);
}
