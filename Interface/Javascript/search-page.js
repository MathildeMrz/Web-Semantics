async function chercherImages(researchedPlanet, id){
    var getJSON = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
        };
        xhr.send();
    };
    var url = "https://en.wikipedia.org/w/api.php?action=query&titles="+researchedPlanet+"&prop=pageimages&format=json&origin=*";
    getJSON(url,function(err, data) {
    if (err !== null) {
        alert('Something went wrong: ' + err);
    }
    else {
        const stringifiedJson = JSON.stringify(data);
        var source = stringifiedJson.split("source\":\"")[1];
        source = source.split("\"}}}}")[0];
        var secondsource = source.split("50px");
        var secondsource1 = secondsource[0];
        var secondsource2 = secondsource[1];
        var finalsource = secondsource1 + "300px" + secondsource2;
        document.getElementById(id).setAttribute("src",finalsource);
    }
    });
}

  function rechercher_liste_planete() {
    var url = window.location.search;
    url = decodeURI(url);
    url = url.slice(1);

    var start = 0;
    var end = (url.indexOf("?"));

    var searchedPlanet = url.substring(start, end);
    url = url.substring(end+1, url.length);
   
    end = (url.indexOf("?"));  
    var language = url.substring(start, end);
    url = url.substring(end+1, url.length);
    
    end = (url.indexOf("?"));  
    var deity = url.substring(start, end);
    url = url.substring(end+1, url.length);

    var satelliteOf = url.substring(start, url.length);

    var query;
    if(satelliteOf == "true")
    {
        query = `SELECT str(?sat) ?lsat1 GROUP_CONCAT(distinct ?lsat2; separator=" -- ") as ?autresnoms   WHERE {
            ?p1 a dbo:Planet. 
            ?p1 rdfs:label ?l. 
            ?sat dbp:satelliteOf ?p1. 
?p1 rdfs:label ?l1. 
?sat rdfs:label ?lsat1.
?sat rdfs:label ?lsat2.
            ?p1 rdfs:label ?l1. 
            FILTER(langMatches(lang(?lsat1),"`+language+`") && !(langMatches(lang(?lsat2),"`+language+`"))) `;
    }
    else {
        query = `SELECT str(?p) ?l GROUP_CONCAT(distinct ?l1; separator=" -- ") as ?autresnoms WHERE {
            ?p a dbo:Planet. 
            ?p rdfs:label ?l. 
            ?p rdfs:label ?l1. 
            FILTER(langMatches(lang(?l),"`+language+`") && !(langMatches(lang(?l1),"`+language+`")))`;
        if(deity != "")
        {
            //TODO
            //deity = decodeURI(deity);
            
            //FILTER(langMatches(lang(?l),"en"))
            //query += `dbr:`+deity+` dbp:planet ?p. dbr:`+deity+` a dbo:Deity `
            query += `?x dbp:planet ?p.
            ?x a dbo:Deity.
            ?x rdfs:label ?label.
            FILTER(contains(?label,"`+deity+`"))
            FILTER(langMatches(lang(?label),"en")).`
        }
    }

    if(searchedPlanet != "")
    {
        query += `FILTER(regex(lcase(str(?l)), lcase(str(".*`+searchedPlanet + `.*"))) ||regex(lcase(str(?l1)), ".*`+searchedPlanet+`.*" ))
        `
    }


    document.getElementById("search").value = searchedPlanet;
    document.getElementById("deity").value = deity;
    if(satelliteOf == "true"){
        document.getElementById("satelliteOf").checked = true;
    }
    if(language == "fr"){
        document.getElementById('radio-button-french').checked = true;
    }

    if(satelliteOf == "true")
    {
        var contenu_requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX : <http://dbpedia.org/resource/>
        PREFIX dbpedia2: <http://dbpedia.org/property/>
        PREFIX dbpedia: <http://dbpedia.org/>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>` +query + `FILTER(regex(lcase(str(?l)), lcase(str(".*Uranus.*"))) ||regex(lcase(str(?l1)), ".*Uranus.*" ))} GROUP BY ?sat ?lsat1 Order By ?lsat1`;
    console.log(contenu_requete);
    }
    else
    {var contenu_requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX : <http://dbpedia.org/resource/>
    PREFIX dbpedia2: <http://dbpedia.org/property/>
    PREFIX dbpedia: <http://dbpedia.org/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>`
    
    +query+
    `} GROUP BY ?p ?l
    Order By ?l`;}

    if(searchedPlanet == "")
    {
        contenu_requete += ` LIMIT 200
        `
    }

        // Encodage de l'URL Ãƒ  transmettre Ãƒ  DBPedia
        var url_base = "http://dbpedia.org/sparql";
        var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

        // RequÃƒÂªte HTTP et affichage des rÃƒÂ©sultats
        var xmlhttp = new XMLHttpRequest();
        var results;
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                results = JSON.parse(this.responseText);

                if(results.results.bindings.length == 0)
                {
                    window.location.assign("../Src/pageNotFound.html");
                }
                else
                {
                    for (var i = 0; i < results.results.bindings.length; i++) {
                        var name0 = (results.results.bindings[i]["callret-0"].value).split("resource/")[1];
                        if(satelliteOf == "true")
                        {
                            var name = (results.results.bindings[i]["lsat1"].value)
                        }else{var name = (results.results.bindings[i]["l"].value)}
                        var autres_noms = (results.results.bindings[i]["autresnoms"].value)
                        var str = name0.replace(/ /g, "_");
                        document.getElementById("listPlanetes").innerHTML +=
                        '<div class="card" id="'+(i+1)+'" onclick=afficherInformations('+JSON.stringify(name0)+',' + JSON.stringify(language)+')>'
                        +'<img id="img'+(i+1)+'" src="../../assets/notFound.jpg" alt="" style="width:90%;">'
                        +'<div id="name'+(i+1)+'" class="name"><strong>'+name+'</strong></div>'
                        +'<div id="autresnoms'+(i+1)+'" class="autresnoms"><h1>'+autres_noms+'</h1></div>'
                        +'</div>';
                        chercherImages(str, ("img"+(i+1)));
                    }
                }
    
                /*results.results.bindings.forEach((p, i) => {
                    //console.log(p[i].callret-0.value);
                    console.log(p);
                    console.log(p[i]["callret-0"].value);
                    var name = (p.label.value).split("/")[0]; //AJOUTE
                    console.log(name);
                    var str = name.replace(/ /g, "_");
                    document.getElementById("listPlanetes").innerHTML +=
                    '<div class="card" id="'+(i+1)+'" onclick=afficherInformations('+JSON.stringify(name)+')>'
                    +'<img id="img'+(i+1)+'" src="../../assets/notFound.jpg" alt="" style="width:90%;">'
                    +'<div id="name'+(i+1)+'" class="name">'+name+'</div>'
                    +'</div>';
                    chercherImages(str, ("img"+(i+1)));
                });*/
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
  }

  function afficherInformations(planet, lang) {
    window.location.assign("../Src/infos.html?"+planet+"?"+lang);
  }