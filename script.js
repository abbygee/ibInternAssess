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

// function checkUser(){
//     var user = $("#twtuser").val();
//     //checks if a user was entered
//     if(user.length < 1){
//         alert('Please type in a twitter username');
//         return false;
//     }
//
//     //check for @ symbol or blank spaces which is not necessary
//     for(var i = 0; i < user.length; i++){
//         if(user[i] === "@"){
//             alert('Please type in the username without any symbols');
//             return false;
//         }
//         if(user[i] === " "){
//             alert('Make sure to enter the username without spaces');
//             return false;
//         }
//     }
//
//     //check if entered username exists
//     $.ajax({
//         url: "https://twitter-relay.herokuapp.com/twitterAPI?user=" + user,
//         dataType: 'JSON',
//         success: function(result){
//             console.log(result);
//             //checkReal(result);
//         }
//     });
// }


// function checkReal(data){
//     if(data.statuses.length === 0) {
//         alert('Please enter a real existing twitter username');
//         return false;
//     }
// }

function translateWord(){
    var user = $("#twtuser").val();
    $.ajax({
        url: "https://twitter-relay.herokuapp.com/twitterAPI?user=bts_twt",
        dataType: 'JSON',
        success: function (result) {
            console.log(result);
        }
    });

    //if((checkUser() !== false) && (checkReal() !== false)){
        var container = $("#reset");
        container.empty();
        container.append('<a id=\"timeline\" class=\"twitter-timeline\" data-width=\"600\" data-height=\"660\" data-link-color=\"#2B7BB9\" href=\"https://twitter.com/' + user + '"></a><script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>');


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
    //}
}