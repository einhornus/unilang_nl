vocab = []

function fileExists(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
}

function readTextFile3(file)
{
    vocab = []
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;

                let lines = allText.split(/\r?\n/);
                //console.log(lines);

                let prevIndex = 0
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i].split(";");
                    index = parseInt(line[3])
                    pos = line[2]
                    word = line[0]
                    def = line[1]

                    if(index != prevIndex) {
                        vocab.push([])
                        prevIndex = index
                    }

                    vocab[vocab.length - 1].push([word, def, pos, index])
                }
            }
        }
    }

    rawFile.send(null);
}

function searchmean(word, count){
    if(vocab.length == 0){
        readTextFile3("vocab.txt")
    }

    lst = []
    for(let i = 0; i<vocab.length-1; i++){
        power = 0.0
        for(let j = 0; j<vocab[i].length; j++){
            w = vocab[i][j][0]
            def = vocab[i][j][1]
            index = vocab[i][j][3]
            def2 = " "+def

            if(def2.indexOf(word+" ")!=-1 || def2.indexOf(" "+ word)!=-1){
                score1 = 1.0 / (1+index);

                score2 = Math.pow(word.length / def2.length, 1)

                console.log(w, score1, score2, def2)
                power += score2*score1
            }
        }
        if(power>0){
            lst.push([power, vocab[i][0][0]])
        }
    }
    lst.sort((a,b) => b[0]-a[0])

    console.log(lst)

    newlst = []
    for(let i = 0; i<Math.min(lst.length, count); i++){
        newlst.push(lst[i])
    }
    return newlst
}

function dosearchmean(){
    var inputVal = document.getElementById("text").value;
    var p = document.getElementById("p")

    word = inputVal

    if(false){//fileExists("articles//"+word+".html")){
        cont = readTextFile2("articles//"+word+".html")
        var content1 = document.getElementById("content")
        content1.innerHTML = cont;
    }
    else {
        if (word.length > 0) {
            leven = searchmean(word, 50)
            newval = ""
            for (let i = 0; i < leven.length; i++) {
                newval += leven[i][1] + " "
                if((i+1)%10 == 0){
                    newval+="\n"
                }
            }

            if (newval.length == 0) {
                newval = "No results found"
            }

            p.innerHTML = handleText(newval);
        }
    }
}

