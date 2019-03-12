var text = $("#word").val();
$.ajax({
    //this should retrieve the supported languages from the server
    url: "https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=en&key=trnsl.1.1.20190312T203236Z.0b8cd82697e99ad0.60ad6c537ddb42128b819afad99fecdde65279b8",
    type: 'POST',
    success: function(result){
        console.log(result);
        createList(result)
    },
    error: function () {
        alert('Failed!');
    }
});


function translate(text){
    var lang = $("#langs").val();
    $.ajax({
        url: "https://translate.yandex.net/api/v1.5/tr.json/translate?word=" + text + "&lang=" + lang + "&key=trnsl.1.1.20190312T203236Z.0b8cd82697e99ad0.60ad6c537ddb42128b819afad99fecdde65279b8",
        type: 'POST',
        success: function(result){
            console.log(result);
        },
        error: function () {
            alert('Failed!');
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