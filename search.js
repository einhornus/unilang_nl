let vocabs = null;
let std_langs = ["en", "es", "de", "fr", "ru", "pt", "it", "nl", "sv"]
let existing_langs = [1, 0, 0, 0, 1, 0, 0, 0, 0]
let main_lang = 4
let reverse_links = {}

get_langs()

function dosearch(index) {
    word = document.getElementById("searchfield").value
    if (word[0] == word[0].toUpperCase()) {
        word = "_" + word;
    }

    stuff = ""
    //if (fileExists("articles//" + word + ".html")) {
    //    stuff = word
    //} else {
    if (index == 1) {
        stuff = dosearchmean(word);
    } else {
        stuff = dosearchsim(word)
    }
    //}

    if (stuff != "No results found") {
        stuff = "Search results\n" + stuff;
    }

    console.log("Stuff = ", stuff)
    putText(stuff)
}


function fileExists(url) {
    if (url) {
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status == 200;
    } else {
        return false;
    }
}

function readTextFile3() {
    let file = "dictionaries//all"
    vocabs = []
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;

                let lines = allText.split(/\r?\n/);
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i] != undefined) {
                        lines[i] = lines[i].replaceAll("́", '')
                        let line = lines[i].split("|");


                        if (line.length == 13) {
                            index = parseInt(line[3])
                            pos = line[2]
                            def = line[0] + "; " + line[1]

                            let exists = false
                            let all_words = []
                            for (let q = 0; q < std_langs.length; q++) {
                                all_words[q] = []
                            }


                            for (let q = 0; q < std_langs.length; q++) {
                                if (existing_langs[q] == 1) {
                                    if (line[4 + q].length > 0) {
                                        words = line[4 + q].split(', ')
                                        all_words[q] = words
                                        exists = true
                                    }
                                }
                            }

                            if (exists) {
                                if (all_words[main_lang].length == 0) {
                                    exists = false
                                }
                            }

                            if (exists) {
                                vocabs.push([[def, pos, index], all_words])
                            }
                        }
                    }
                }


                for (let i = 0; i < vocabs.length; i++) {
                    good = false
                    set = vocabs[i][1][4]

                    for(let j = 0; j<set.length; j++){
                        w = set[j]

                        if (reverse_links[w] == undefined) {
                            reverse_links[w] = []
                        }
                        reverse_links[w].push(i)
                    }
                }


                console.log(vocabs)
            }
        }

    }


    rawFile.send(null);
}


function searchlevenstein(word, maxcnt) {
    if (searchvocab.length == 0) {
        readTextFile5("searchlist.txt")
    }

    res = []
    cnt = 0
    for (let qq = 0; qq < searchvocab.length; qq++) {
        key = searchvocab[qq]
        if (key.length >= 1) {
            dst = levenshteinDistance2(key, word)
            dst /= key.length
            //console.log(dst, key)

            //if(dst == 0){
            //    return [[0, key]]
            //}

            if (res.length < maxcnt) {
                //console.log("1", dst, key, word, res.length)
                res.push([dst, key])
            } else {
                //console.log("2", dst, key, word, res.length)
                res.sort(function (a, b) {
                    return a[0] - b[0]
                });
                if (dst < res[maxcnt - 1][0]) {
                    res[maxcnt - 1] = [dst, key]
                }
            }
            cnt += 1
        }
        if (cnt > 10000) {
            //return res
        }
    }

    console.log("Search Lev = ", res)
    return res
}

function get_english_transes(wrd){
    __res = []

    let ri = reverse_links[wrd]

    if(ri != undefined){
        for(let i = 0; i<ri.length; i++){
            www = vocabs[ri[i]][1][0][0]

            let exi = false
            for(let j = 0; j<__res.length; j++){
                if(__res[j] == www){
                    exi = true
                    break
                }
            }

            if(!exi){
                __res.push(www)
            }
        }
    }
    return __res;
}

function dosearchsim(word) {
    if (word.length > 0) {
        leven = searchlevenstein(word, 10)
        console.log("Leven ", leven)

        newval = "<ul>"
        for (let i = 0; i < leven.length; i++) {
            tr = get_english_transes(leven[i][1])
            if(tr.length > 0) {
                newval += "<li><b>" + leven[i][1] + "</b> &#8212 " + get_english_transes(leven[i][1]).join(", ") + "</li>"
            }
            else{
                newval += "<li><b>" + leven[i][1] + "</b>" + "</li>"

            }
        }
        newval += "</ul>"

        if (leven.length == 0) {
            newval = "No results found"
        }
    }

    return newval
}

function get_langs() {
    existing_langs[4] = 1;

    if (navigator.languages != undefined) {
        for (let j = 0; j < std_langs.length; j++) {
            for (let i = 0; i < navigator.languages.length; i++) {
                let lng = navigator.languages[i];
                if (lng.indexOf(std_langs[j]) != -1) {
                    existing_langs[j] = 1;
                    break
                }
            }
        }
    }

    console.log()
}

function make_table(word, simple) {
    word = word.replace("ё", "е")
    word = word.toLowerCase()

    if (word[0] == "_") {
        word = word[1].toUpperCase() + word.substr(2)
    }

    if (vocabs == null) {
        readTextFile3();
    }

    let indexes = []
    if (simple) {
        indexes = reverse_links[word]
        if (indexes == undefined) {
            indexes = []
        }
    } else {
        for (let i = 0; i < vocabs.length; i++) {
            good = false
            for (let j = 0; j < vocabs[j][1].length; j++) {
                set = vocabs[i][1][j]
                if (set.includes(word)) {
                    good = true
                    break
                }
            }
            if (good) {
                indexes.push(i)
            }
        }
    }

    let table_width = 0;
    let table_height = indexes.length;

    if(table_height == 0){
        return null
    }

    for (let i = 0; i < existing_langs.length; i++) {
        if (existing_langs[i] == 1) {
            table_width++;
        }
    }

    let table = new Array(table_width);
    for (var i = 0; i < table.length; i++) {
        table[i] = new Array(table_height);

        for (var j = 0; j < table_height; j++) {
            table[i][j] = "-";
        }
    }

    let lang_inds = []
    for(let i = 0; i<std_langs.length; i++){
        if(existing_langs[i] == 1){
            lang_inds.push(i)
        }
    }

    for (var i = 0; i < table_width; i++) {
        for (var j = 0; j < table_height; j++) {
            let index = indexes[j]
            let voc = vocabs[index]
            let p1 = voc[0]
            let p2 = voc[1]

            def = p1[0]
            pos = p1[1].toLowerCase()

            if(simple){
                console.log()
            }

            if (i == 0) {
                def = def.replace(p2[0]+";", "<b>"+p2[0]+"</b>, "+pos+" &#8212 <br>")

                table[i][j] = def
            } else {
                enu = p2[lang_inds[i]]
                table[i][j] = enu.join(", ")
            }
        }
    }

    return table
}


function searchmean(word, simple) {
    table = make_table(word, simple)

    let langs_with_en = []
    for(let i = 0; i<std_langs.length; i++){
        if(existing_langs[i] == 1){
            langs_with_en.push(std_langs[i])
        }
    }

    if (table == null) {
        return "No results found";
    }

    let lim = 1000

    if(__mt == "1" && simple){
        lim = 2
    }

    let detailed = table[0].length > lim

    let full = "<table class='searchtable'>"
    if (!detailed || !simple) {
        full += "<tr>"
    }

    let short = "<table class='searchtable'>"
    short += "<tr>"

    widths = []
    widths[0] = Math.max(30, 50 - (langs_with_en.length - 1) * 10)
    for (let i = 1; i < langs_with_en.length + 1; i++) {
        widths[i] = Math.round((100 - widths[0]) / (langs_with_en.length))
    }

    for (let i = 0; i < langs_with_en.length; i++) {
        if (!detailed || !simple) {
            full += "<td style='text-align: center; width:" + widths[i] + "%'>" + get_flag(langs_with_en[i]) + "</td>"
        }
        short += "<td style='text-align: center;width:" + widths[i] + "%''>" + get_flag(langs_with_en[i]) + "</td>"
    }

    for (let i = 0; i < table[0].length; i++) {
        if (i < lim) {
            short += "<tr>"
            for (let j = 0; j < table.length; j++) {
                if (simple) {
                    //table[j][i] = table[j][i].replace("<br>", "");
                }
                short += "<td>" + table[j][i] + "</td>"
            }
            short += "</tr>"
        }
        if (i >= lim || !detailed) {
            full += "<tr>"
            for (let j = 0; j < table.length; j++) {
                if (simple) {
                    //table[j][i] = table[j][i].replace("<br>", "");
                }
                full += "<td style='width:" + widths[j] + "%'>" + table[j][i] + "</td>"
            }
            full += "</tr>"
        }
    }

    short += "</table>"
    full += "</table>"

    let html = ""

    if (detailed && simple) {
        html += "<details>\n"

        html += "<summary>\n"
        html += short
        html += "</summary>\n"

        html += full
        html += "</details>\n"
    } else {
        html += full
    }

    return html
}

function get_flag(lang) {
    return "<img src=\"images/flags/" + lang + ".svg\" style=\"width:30px;height:30px;\">"
}

function do_ruby(text, lang) {
    return "<ruby>" + text + "<rt>" + get_flag(lang) + "</rt></ruby>"
}

function dosearchmean(word) {
    if (word.length > 0) {
        res = searchmean(word, false)
        return res
    }

    return newval
}

