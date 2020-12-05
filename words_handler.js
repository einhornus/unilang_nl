let dict = null

let history = []
let poses = []
let nietpushen = false

let pics = null
let plainwordlist = []


function handleback() {
    if (history.length <= 1) {

    } else {
        history.pop()
        nietpushen = true
        hndwrd(history[history.length - 1])
        document.documentElement.scrollTop = poses[history.length - 1]
    }

    if (poses <= 1) {

    } else {
        document.documentElement.scrollTop = poses[poses.length - 1]
        console.log("active", poses)
        poses.pop()
    }
}



document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
    } else if (e.keyCode == '40') {
        // down arrow
    } else if (e.keyCode == '37') {
        handleback()
    } else if (e.keyCode == '39') {
        // right arrow
    }
}


read_dictionary()
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const input = urlParams.get('input')

if (input != undefined) {
    window.location.href = "linkify.html";
    //document.getElementById("text").value = input
    //f();
}

function reload_cookies(){
    __mt = getCookie_("mt")
    if(__mt == ""){
        setCookie_("mt", "1", 1000)
    }

    __inf = getCookie_("inf")
    if(__inf == ""){
        setCookie_("inf", "0", 1000)
    }

    __rt = getCookie_("rt")
    if(__rt == ""){
        setCookie_("rt", "0", 1000)
    }

    __un = getCookie_("un")
    if(__un == ""){
        setCookie_("un", "0", 1000)
    }

    __syn = getCookie_("syn")
    if(__syn == ""){
        setCookie_("syn", "0", 1000)
    }

    __rel = getCookie_("rel")
    if(__rel == ""){
        setCookie_("rel", "0", 1000)
    }

    __der = getCookie_("der")
    if(__der == ""){
        setCookie_("der", "0", 1000)
    }
}


function rus(a) {
    punctuation = [
        '<',
        '>',
        '!',
        ',',
        ' ',
        '?',
        ';',
        ':',
        '"',
        '&',
        '*',
        '\'',
        '.',
        '%',
        '[',
        ']',
        '(',
        ')',
        '{',
        '}',
        '\n',
        '\r',
        '…',
        '«',
        '»',
        '=',
        '’',
        '‘',
        '/',
        '-',
        '“',
        '”',
        ' ',
        '–',
        String.fromCharCode(160)
    ]

    if (punctuation.includes(a)) {
        return false
    } else {
        return true
    }
    return false
}

function upperfy(w, u) {
    if (u) {
        return w[0].toUpperCase() + w.substr(1, w.length - 1)
    } else {
        return w
    }
}


function lowerfy(w, u) {
    if (u) {
        return w[0].toLowerCase() + w.substr(1, w.length - 1)
    } else {
        return w
    }
}


function f() {
    var inputVal = document.getElementById("text").value;
    var p = document.getElementById("p")
    putText(inputVal)
    p.innerHTML = handleText(inputVal);
    //sc.hidden = true
}


function handleText(text) {

    res = ""
    words = []
    last = ""

    for (let i = 0; i < text.length; i++) {

        if (rus(text[i])) {
            last += text[i]
        } else {
            words.push(last)
            if (text[i] == "\n" || text[i] == "\r") {
                words.push("<br>")
            } else {
                words.push(text[i])
            }
            last = ""
        }

    }
    words.push(last);


    for (let i = 0; i < words.length; i++) {
        if (words[i].length > 0) {
            //res += words[i]

            word = words[i]

            if(word.length > 0) {
                let stress = null;

                if(word.indexOf("́")!=-1){
                    stress = word
                    word = word.replaceAll("́", "")
                }

                let isUpper = word[0].toUpperCase() == word[0]
                let lowercase = lowerfy(word, true)
                let uppercase = upperfy(lowercase, isUpper)

                let images = []
                let defImage = ""
                let remainCased = false

                if (lowercase in dict) {
                    for (let j = 0; j < dict[lowercase].length; j++) {
                        if(!images.includes(dict[lowercase][j][0])){
                            images.push(dict[lowercase][j][0]);
                            defImage = dict[lowercase][j][0];
                        }
                    }
                }

                if (uppercase in dict) {
                    for (let j = 0; j < dict[uppercase].length; j++) {
                        if(!images.includes(dict[uppercase][j][0])){
                            images.push(dict[uppercase][j][0])
                            defImage = dict[uppercase][j][0]
                            if(!remainCased){
                                remainCased = true;
                            }
                        }
                    }
                }


                if(images.length == 0){
                    res += words[i];
                }
                else{
                    let imageUppercase = upperfy(defImage, isUpper);

                    //console.log("stress", stress)

                    if(stress != null){
                        imageUppercase = stress;
                        uppercase = stress;
                    }

                    if(images.length > 1){
                        if(remainCased){
                            res += "<a href=#  onclick=hndwrd(\'" + uppercase + "\');>" + uppercase + "</a>"
                        }
                        else{
                            res += "<a href=#  onclick=hndwrd(\'" + lowercase + "\');>" + uppercase + "</a>"
                        }
                    }
                    else{
                        if(remainCased){
                            res += "<a href=#  onclick=hndwrd(\'" + uppercase + "\');>" + imageUppercase + "</a>"
                        }
                        else{
                            res += "<a href=#  onclick=hndwrd(\'" + lowercase + "\');>" + imageUppercase + "</a>"
                        }
                    }
                }
            }
        }
    }

    return res
}

function putText(text){
    handled = handleText(text)
    var p = document.getElementById("p")
    p.innerHTML = handled;

    /*
    if (!nietpushen) {
        history.push(handled)

        if (history.length > 1) {
            poses.push(document.documentElement.scrollTop)
        }
    }

    nietpushen = false
     */
}

function getPic(wrd){
    if(pics == null) {
        all = readTextFile2("pics.txt")
        lines = all.split('\n')
        pics = {}

        for(let i = 0; i<lines.length; i++){
            split = lines[i].split(' ')
            if(split.length == 2){
                pics[split[0]] = split[1]
            }
        }
    }

    if(wrd in pics){
        res = "<img src=\"images\\"+pics[wrd]+"\" width=\"150\" height=\"150\">"
        return res
    }
    else{
        return ""
    }
}

function langtable(pc, word){
    get_langs()
    picstuff = searchmean(word, true)
    if(!(picstuff == "No results found")) {
        if(getCookie_("mt") != "2") {
            pc.innerHTML = handleText(picstuff);
        }
        else{
            pc.innerHTML = "";
        }
    }
}

function put_info(link){
    reload_cookies();

    var content1 = document.getElementById("content")
    var prono = document.getElementById("prono_part")
    var ety = document.getElementById("ety_part")

    prono.innerHTML = "";
    ety.innerHTML = "";


    cont = ___api_get_article_(link)

    //cont = cont.replaceAll("!<<!", "")
    //cont = cont.replaceAll("!>>!", "")


    _parts = cont.split("|||||")

    let ppp2 = _parts[2]

    let newppp2 = ""

    let ooo = true

    for(let i = 0; i<ppp2.length; i++){
        if(i < ppp2.length - 5 && ppp2[i+0] == '<' && ppp2[i+1] == '$' && ppp2[i+2] == '!' && ppp2[i+3] == '$' && ppp2[i+4] == '!'){
            indl = ppp2[i+5]

            if(indl == "e" && __inf == "2"){
                ooo = false
            }

            if(indl == "u" && __un == "2"){
                ooo = false
            }

            if(indl == "s" && __syn == "2"){
                ooo = false
            }

            if(indl == "r" && __rel == "2"){
                ooo = false
            }

            if(indl == "d" && __der == "2"){
                ooo = false
            }
        }

        if(i < ppp2.length - 4 && ppp2[i] == '$' && ppp2[i+1] == '!' && ppp2[i+2] == '$' && ppp2[i+3] == '$'){
            ooo = true
        }

        if(ooo){
            newppp2 += ppp2[i]
        }
    }

    newppp2 = newppp2.replaceAll("<$!$!e>", "")
    newppp2 = newppp2.replaceAll("<$!$!e>", "")
    newppp2 = newppp2.replaceAll("<$!$!s>", "")
    newppp2 = newppp2.replaceAll("<$!$!d>", "")
    newppp2 = newppp2.replaceAll("<$!$!r>", "")
    newppp2 = newppp2.replaceAll("<$!$!u>", "")

    newppp2 = newppp2.replaceAll("$!$$", "")


    if(__der == "0"){
        newppp2 = newppp2.replaceAll("class = \"DerivedTerms\"", "class = \"DerivedTerms\" open")
    }

    if(__rel == "0"){
        newppp2 = newppp2.replaceAll("class = \"RelatedTerms\"", "class = \"RelatedTerms\" open")
    }

    if(__syn == "0"){
        newppp2 = newppp2.replaceAll("class = \"Synonyms\"", "class = \"Synonyms\" open")
    }

    if(__un == "0"){
        newppp2 = newppp2.replaceAll("class = \"UsageNotes\"", "class = \"UsageNotes\" open")
    }

    if(__inf == "0"){
        newppp2 = newppp2.replaceAll("class = \"Etymology\"", "class = \"Etymology\" open")
    }

    _parts[4] = _parts[4].replaceAll("<br />", ", ")
    _parts[4] = _parts[4].replaceAll("<br />", ", ")

    if(__rt == "0"){
        content1.innerHTML += newppp2;
    }

    if(__rt == "1"){

        let asd = _parts[3];
        let ssdf = "<table class=\"center\"><tbody><tr><td>"+newppp2 +"</td><td>";
        ssdf += asd;
        ssdf +="</td></tr></tbody></table>"

        content1.innerHTML +=ssdf;
        content1.innerHTML ="<body>"+content1.innerHTML+"</body>";

    }

    if(__rt == "2"){
        content1.innerHTML += _parts[3];
    }


    //content1.innerHTML += _parts[3];

    _parts[4] =  _parts[4].replaceAll("float:right; ", "")

    prono.innerHTML = _parts[0];
    ety.innerHTML = _parts[4];
}

function crop_table(content){
    if(content.indexOf("Пр. действ.")){
        let __bef
    }
    else{
        return content
    }
}

function hndwrd(wrd)
{
    let old_scroll = document.documentElement.scrollTop;

    if (!(wrd == undefined))
    {
        if (!nietpushen)
        {
            history.push(wrd)

            if (history.length > 1)
            {
                poses.push(document.documentElement.scrollTop)
            }
        }

        var prono = document.getElementById("prono_part")
        var ety = document.getElementById("ety_part")
        prono.innerHTML = "";
        ety.innerHTML = "";


        var content1 = document.getElementById("content")
        //var pc = document.getElementById("guide")
        //pc.innerHTML = ""

        content1.innerHTML = "";

        dw = dict[wrd]

        if (dw.length == 1)
        {
            langtable(content1, dw[0][1])

            if (dw[0][1][0] == dw[0][1][0].toUpperCase())
            {

                put_info(dw[0][1])
            }
            else
            {
                put_info(dw[0][1])
            }
            //pc.innerHTML = getPic(wrd)

            //content1.innerHTML += cont;
        }
        else
        {
            let stop = false
            let st = 0
            cont = "<h1>Disambiguation</h1> <br> <ol>"
            for (let j = 0; j < dw.length; j++)
            {
                console.log(dw[j])
                cont += "<li>" + dw[j][0] + " is a form of <a href=\"#\" onclick=\"hndwrd('" + dw[j][1] + "')\">" + dw[j][1] + "</a></li>"
                if (dw[j][1] == wrd)
                {
                    stop = true
                    st = j
                }
            }
            cont += "<ul>"
            content1.innerHTML = cont;

            if (!stop)
            {
                content1.innerHTML = cont;
            }
            else
            {
                content1.innerHTML = "";
                langtable(content1, dw[st][1])
                if (dw[st][1][0] == dw[st][1][0].toUpperCase())
                {
                    put_info(dw[st][1])
                }
                else
                {
                    put_info(dw[st][1])
                }
            }

        }

        var limit = Math.max( document.body.scrollHeight, document.body.offsetHeight,
            document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );


        document.body.scrollTop = Math.min(limit, old_scroll);
        console.log("Scroll", document.body.scrollTop, limit, old_scroll)
        nietpushen = false
    }
}

function read_dictionary() {
    dict = {}
    plainwordlist = []
    var rawFile = new XMLHttpRequest();

    ___vc = !this.window.document.location.href.includes("vocabulary_test");

    rawFile.open("GET", "dictionary_simple.txt", ___vc);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;

                let lines = allText.split(/\r?\n/);
                //console.log(lines);

                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i].split(";");
                    if (line.length == 3) {

                        //line[0] = line[0].replaceAll("́ё", 'ё')
                        //line[1] = line[1].replaceAll("́ё", 'ё')


                        if(dict[line[0]] == undefined){
                            dict[line[0]] = []
                        }

                        dict[line[0]].push([line[1], line[2]])

                        if(plainwordlist.length == 0 || (plainwordlist.length > 0 && line[2] != plainwordlist[plainwordlist.length - 1])){
                            plainwordlist.push(line[2])
                        }
                    }
                }
            }
        }
    }

    rawFile.send(null);
}