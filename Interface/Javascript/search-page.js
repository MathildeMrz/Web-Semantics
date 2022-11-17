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
    var searchedPlanet = window.location.search;
    searchedPlanet = searchedPlanet.slice(1);
    document.getElementById("search").value = searchedPlanet;
    var contenu_requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX : <http://dbpedia.org/resource/>
    PREFIX dbpedia2: <http://dbpedia.org/property/>
    PREFIX dbpedia: <http://dbpedia.org/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT ?p GROUP_CONCAT(?l; separator="/") as ?label WHERE {
        ?p a dbo:Planet.
        ?p dbp:name ?l .
        FILTER(langMatches(lang(?l),"FR") || langMatches(lang(?l),"EN"))
        FILTER(regex(lcase(str(?l)), lcase(str(".*`
        +searchedPlanet + `.*"))))
        }
    GROUP BY ?p `;
        // Encodage de l'URL à transmettre à DBPedia
        var url_base = "http://dbpedia.org/sparql";
        var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

        // Requête HTTP et affichage des résultats
        var xmlhttp = new XMLHttpRequest();
        var results;
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                results = JSON.parse(this.responseText);
                results.results.bindings.forEach((p, i) => {
                    var str = p.label.value.replace(/ /g, "_");
                    document.getElementById("listPlanetes").innerHTML +=
                    '<div class="card" id="'+(i+1)+'" onclick=afficherInformations('+JSON.stringify(p.label.value)+')>'
                    +'<img id="img'+(i+1)+'" src="../../assets/notFound.jpg" alt="" style="width:90%;">'
                    +'<div id="name'+(i+1)+'" class="name">'+p.label.value+'</div>'
                    +'</div>';
                    chercherImages(str, ("img"+(i+1)));
                });
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
  }

  function afficherInformations(planet) {
    window.location.replace("../Src/infos.html?"+planet);
  }