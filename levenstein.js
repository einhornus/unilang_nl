let searchvocab = []

function readTextFile5(file)
{
    searchvocab = []
    res = ""
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

                for (let i = 0; i < lines.length; i++) {
                    line = lines[i]
                    if(line.length > 0){

                        good = true
                        for(let i = 0; i<line.length; i++){
                            if(letter(line[i])){
                                break
                            }
                            else{
                                good = false
                            }
                        }

                        if(good) {
                            console.log('aaa', line)
                            searchvocab.push(line)
                        }
                    }
                }
            }
        }
    }
    rawFile.send(null);
    return res
}

function levenshteinDistance (s, t) {
    if (!s.length) return t.length;
    if (!t.length) return s.length;

    return Math.min(
        levenshteinDistance(s.substr(1), t) + 1,
        levenshteinDistance(t.substr(1), s) + 1,
        levenshteinDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
    ) + 1;
}

function levenshteinDistance2 (a, b){
    if(a.length == 0) return b.length;
    if(b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
        for(j = 1; j <= a.length; j++){
            if(b.charAt(i-1) == a.charAt(j-1)){
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                    Math.min(matrix[i][j-1] + 1, // insertion
                        matrix[i-1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
};




function searchlevenstein(word, maxcnt){
    if(searchvocab.length == 0){
        readTextFile5("searchlist.txt")
    }

    res = []
    cnt = 0
    for (let qq = 0; qq<searchvocab.length; qq++) {
        key = searchvocab[qq]
        if(key.length >= 1) {
            dst = levenshteinDistance2(key, word)
            dst /= key.length
            //console.log(dst, key)

            if(dst == 0){
                return [[0, key]]
            }

            if(res.length < maxcnt) {
                //console.log("1", dst, key, word, res.length)
                res.push([dst, key])
            }
            else{
                //console.log("2", dst, key, word, res.length)
                res.sort(function(a, b){return a[0]-b[0]});
                if(dst < res[maxcnt - 1][0]){
                    res[maxcnt - 1] = [dst, key]
                }
            }
            cnt+=1
        }
        if (cnt > 10000){
            //return res
        }
    }
    return res
}



function dosearchsim(){
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
            leven = searchlevenstein(word, 50)
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
