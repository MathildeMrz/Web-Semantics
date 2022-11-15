function rechercher2() {
    var researchedPlanet = window.location.search;
    researchedPlanet = researchedPlanet.slice(1);
    var lien_infos = "<http://dbpedia.org/resource/"+researchedPlanet+">";
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
    SELECT ?description
    WHERE { `+lien_infos +` dbo:abstract ?description }`;

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           var results = JSON.parse(this.responseText);
           var source;
           results["results"]["bindings"].forEach(element => {
            if(element.description["xml:lang"]=="en"){
                source = element.description.value;

            }});
            document.getElementById("planetDescription2").innerText = source;

        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
async function chargerInformations(){
    var researchedPlanet = window.location.search;
    researchedPlanet = researchedPlanet.slice(1);
    //Charger image
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
        var source;
        if(stringifiedJson.includes(researchedPlanet+"\",\"missing"))
        {
            alert("Image non trouvée");
            source = "assets/notFound.jpg";
        }
        else
        {
            source = stringifiedJson.split("source\":\"")[1];
            source = source.split("\"}}}}")[0];
        }

        document.getElementById("planetImage").setAttribute("src",source);
    }
    });

    rechercher(researchedPlanet);
    document.getElementById("planetName").innerHTML = researchedPlanet;

    //Charger données
    /*var lien_infos = "<http://dbpedia.org/resource/"+researchedPlanet+">";
    var query = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX : <http://dbpedia.org/resource/>
    PREFIX dbpedia2: <http://dbpedia.org/property/>
    PREFIX dbpedia: <http://dbpedia.org/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT ?surface ?meanTemperature ?rotationPeriod ?name ?abstract ?knownFor
    WHERE
    { 
        {`+lien_infos +` dbp:surfaceArea ?surface}
     
        UNION

        {`+lien_infos +` dbo:meanTemperature ?meanTemperature}

        UNION

        {`+lien_infos +` dbo:rotationPeriod ?rotationPeriod}

        UNION

        {`+lien_infos +` dbp:name ?name}

        UNION

        {`+lien_infos +` dbo:abstract ?abstract}

        UNION

        {?knownFor dbo:knownFor` +lien_infos+`}

    }`;
    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(query) + "&format=json";
    getJSON(url,function(err, data) {
    if (err !== null) {
        alert('Something went wrong: ' + err);
    }
    else {
        const stringifiedJson = JSON.stringify(data);
        var surfaceArea = stringifiedJson.split("surface\":{\"type\":\"typed-literal\",\"datatype\":\"http://www.w3.org/2001/XMLSchema#double\",\"value\":\"")[1];
        surfaceArea = surfaceArea.split("\"}}")[0];
        var meanTemperature = stringifiedJson.split("meanTemperature\":{\"type\":\"typed-literal\",\"datatype\":\"http://www.w3.org/2001/XMLSchema#double\",\"value\":\"")[1];
        meanTemperature = meanTemperature.split("\"}}")[0];
        var rotationPeriod = stringifiedJson.split("rotationPeriod\":{\"type\":\"typed-literal\",\"datatype\":\"http://www.w3.org/2001/XMLSchema#double\",\"value\":\"")[1];
        rotationPeriod = rotationPeriod.split("\"}}")[0];
        var knownFor = stringifiedJson.split("knownFor\":{\"type\":\"uri\",\"value\":\"")[1];
        knownFor = knownFor.split("\"}}]}}")[0];
        var name  = stringifiedJson.split("name\":{\"type\":\"literal\",\"xml:lang\":\"en\",\"value\":\"")[1];
        name = name.split("\"}}")[0];
        var abstract  = stringifiedJson.split("\abstract\":{\"type\":\"literal\",\"xml:lang\":\"ca\",\"value\":\"")[1];

        //TODO : VOIT COMMENT FAIRE S IL EXISTE PLUSIEURS RESULTATS
        document.getElementById("dbo:surfaceArea").innerHTML = surfaceArea;
        document.getElementById("dbo:meanTemperature").innerHTML = meanTemperature;
        document.getElementById("dbo:rotationPeriod").innerHTML = rotationPeriod;
        document.getElementById("dbo:knownFor").innerHTML = knownFor;
        document.getElementById("planetName").innerHTML = name;
        document.getElementById("planetDescription2").innerHTML = abstract;
    }
    });*/
}

function rechercher(researchedPlanet) {
    var lien_infos = "<http://dbpedia.org/resource/"+researchedPlanet+">";
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
SELECT ?propertyName ?hasValue ?isValueOf 
WHERE {
  { `+lien_infos +` ?property ?hasValue.
    ?property rdfs:label ?propertyName
  }
  UNION
  { ?isValueOf ?property`+lien_infos +`.
  ?property rdfs:label ?propertyName
    }

  FILTER((langMatches(lang(?hasValue),"FR") || langMatches(lang(?hasValue),"EN")) || datatype(?hasValue) = xsd:integer || datatype(?hasValue) = xsd:double)
}
`;

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

    // Requête HTTP et affichage des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            console.log(results)
            afficherResultats(results);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  // Affichage des résultats dans un tableau
  function afficherResultats(data)
  {
    // Tableau pour mémoriser l'ordre des variables ; sans doute pas nécessaire
    // pour vos applications, c'est juste pour la démo sous forme de tableau
    var index = [];

    var contenuTableau = "<tr>";

    data.head.vars.forEach((v, i) => {
      contenuTableau += "<th>" + v + "</th>";
      index.push(v);
    });

    data.results.bindings.forEach(r => {
      contenuTableau += "<tr>";

      index.forEach(v => {

        if (r[v])
        {
          if (r[v].type === "uri")
          {
            contenuTableau += "<td><a href='" + r[v].value + "' target='_blank'>" + r[v].value + "</a></td>";
          }
          else {
            contenuTableau += "<td>" + r[v].value + "</td>";
          }
        }
        else
        {
          contenuTableau += "<td></td>";
        }
        
      });


      contenuTableau += "</tr>";
    });


    contenuTableau += "</tr>";

    document.getElementById("resultats").innerHTML = contenuTableau;

  }