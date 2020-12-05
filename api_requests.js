function ___api_get_article_(word)
{
    res = ""
    var rawFile = new XMLHttpRequest();
    rawFile.open("POST", "http://188.166.92.235:8080/api/article?lang=ru&word="+word, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                res = allText
                return res
            }
        }
    }
    rawFile.send(null);
    return res
}
