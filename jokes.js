jokes = []

function parsejokes()
{
    jokes = []
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "jokes.txt", false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;

                let lines = allText.split(/\r?\n/);
                prev = ""
                for (let i = 0; i < lines.length; i++) {
                    line = lines[i]
                    if(line != undefined) {
                        if (line.length > 0) {
                            if (line.indexOf("***") == -1) {
                                prev += line
                            } else {
                                jokes.push(prev)
                                prev = ""
                            }
                        }
                    }
                }
            }
        }
    }

    rawFile.send(null);
}


function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

function randomjoke(){
    if(jokes.length === 0){
        parsejokes()
    }

    res = jokes[randomInt(0, jokes.length - 1)]

    console.log(res)
    return res
}