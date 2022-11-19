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
        document.getElementById(id).setAttribute("src",source);
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
        query = `SELECT str(?satellite) WHERE {
            ?p a dbo:Planet. 
            ?p dbp:name ?l. 
            ?satellite dbp:satelliteOf ?p. `;
    }
    else {
        query = `SELECT str(?p) WHERE {
            ?p a dbo:Planet. 
            ?p dbp:name ?l. `;
        if(deity != "")
        {
            deity = decodeURI(deity);
            
            query+=`?x dbp:planet ?p.
                ?x a dbo:Deity.
                ?x rdfs:label ?label.
                FILTER (contains(?label,"+deity+") )
              `
        }
    }

    if(searchedPlanet != "")
    {
        query += `FILTER(langMatches(lang(?l),"en"))
        FILTER(regex(lcase(str(?l)), lcase(str(".*`
        +searchedPlanet + `.*"))))
        }`
    }
    else
    {
        query += `FILTER(langMatches(lang(?l),"`+language+`"))}`
    }

    console.log("queryyyyyyy : "+query);

    document.getElementById("search").value = searchedPlanet;
    document.getElementById("deity").value = deity;
    if(satelliteOf == "true"){
        document.getElementById("satelliteOf").checked = true;
    }
    if(language == "fr"){
        document.getElementById('radio-button-french').checked = true;
    }
    
    var contenu_requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
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
    `GROUP BY ?p `;
        // Encodage de l'URL Ã  transmettre Ã  DBPedia
        var url_base = "http://dbpedia.org/sparql";
        var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";
        console.log(url);

        // RequÃªte HTTP et affichage des rÃ©sultats
        var xmlhttp = new XMLHttpRequest();
        var results;
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                results = JSON.parse(this.responseText);
                console.log(results);
                console.log("bjr");
                console.log(results.results.bindings[0]["callret-0"].value);
                for (var i = 0; i < results.results.bindings.length; i++) {
                    console.log((results.results.bindings[i]["callret-0"].value).split("resource/")[0]);
                    console.log((results.results.bindings[i]["callret-0"].value).split("resource/")[1]);
                    var name = (results.results.bindings[i]["callret-0"].value).split("resource/")[1];
                    var str = name.replace(/ /g, "_");
                    document.getElementById("listPlanetes").innerHTML +=
                    '<div class="card" id="'+(i+1)+'" onclick=afficherInformations('+JSON.stringify(name)+')>'
                    +'<img id="img'+(i+1)+'" src="../../assets/notFound.jpg" alt="" style="width:90%;">'
                    +'<div id="name'+(i+1)+'" class="name">'+name+'</div>'
                    +'</div>';
                    chercherImages(str, ("img"+(i+1)));
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

  function afficherInformations(planet) {
    window.location.replace("../Src/infos.html?"+planet);
  }