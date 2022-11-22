function rechercher2() {
    var infos_req = window.location.search;
    researchedPlanet = infos_req.split("?")[1];
    language = infos_req.split("?")[2];
    var lien_infos = "<http://dbpedia.org/resource/"+researchedPlanet+">";
    var contenu_requete_init = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX : <http://dbpedia.org/resource/>
    PREFIX dbpedia2: <http://dbpedia.org/property/>
    PREFIX dbpedia: <http://dbpedia.org/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT ?description ?label
    WHERE { `+lien_infos +` rdfs:comment ?description.
    `+lien_infos+`rdfs:label ?label.
    FILTER(langMatches(lang(?label),"`+language+`"))
    FILTER(langMatches(lang(?description),"`+language+`"))}`;
    var contenu_requete_secours = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX : <http://dbpedia.org/resource/>
    PREFIX dbpedia2: <http://dbpedia.org/property/>
    PREFIX dbpedia: <http://dbpedia.org/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT ?description ?label
    WHERE { `+lien_infos +` dbo:abstract ?description.
                `+lien_infos+`rdfs:label ?label.
                FILTER(langMatches(lang(?label),"`+language+`"}`;

    // Encodage de l'URL Ãƒ  transmettre Ãƒ  DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete_init) + "&format=json";

    // RequÃƒÂªte HTTP et affichage des rÃƒÂ©sultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           var results = JSON.parse(this.responseText);
           console.log(results);
           var source;
           var nom;
           results["results"]["bindings"].forEach(element => {
            source = element.description.value;
            nom = element.label.value;
        })
            document.getElementById("planetDescription2").innerText = source;
            document.getElementById("planetName").innerHTML = nom;
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
async function chargerInformations(){
    var infos_req = window.location.search;
    researchedPlanet = infos_req.split("?")[1];
    language = infos_req.split("?")[2];
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
            alert("Image non trouvÃƒÂ©e");
            source = "../../assets/notFound.jpg";
        }
        else
        {
            source = stringifiedJson.split("source\":\"")[1];
            source = source.split("\"}}}}")[0];
            var secondsource = source.split("50px");
            var secondsource1 = secondsource[0];
            var secondsource2 = secondsource[1];
            var finalsource = secondsource1 + "300px" + secondsource2;
        }

        document.getElementById("planetImage").setAttribute("src",finalsource);
    }
    });

    //document.getElementById("planetName").innerHTML = researchedPlanet;

    //Charger donnÃƒÂ©es

    var lien_infos = "<http://dbpedia.org/resource/"+researchedPlanet+">";
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
    SELECT ?surface ?meanTemperature ?rotationPeriod ?knownFor ?density
    WHERE
    { 
        {`+lien_infos +` dbp:surfaceArea ?surface}
     
        UNION

        {`+lien_infos +` dbo:meanTemperature ?meanTemperature}

        UNION

        {`+lien_infos +` dbo:rotationPeriod ?rotationPeriod}

        UNION

        {?knownFor dbo:knownFor` +lien_infos+`}

        UNION

        {`+lien_infos +` dbo:density ?density}

    }`;

     
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(query) + "&format=json";
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            for(var i = 0; i< results.results.bindings.length; i++)
            {
                var newDiv = document.createElement("div");
                var propertyName = JSON.stringify(Object.getOwnPropertyNames(results.results.bindings[i]));
                propertyName = propertyName.substring(2, propertyName.length -2);
                var value = results.results.bindings[i][propertyName].value;
                if(value != "")
                {
                    var contenuTableau = "<tr>";
                    contenuTableau += "<td>" + propertyName + "</td>";
                    contenuTableau += "<td>" + value + "</td>";
                    contenuTableau += "</tr>";
                    document.getElementById("informations").innerHTML += contenuTableau;
                }
            }
        }
        else
        {
            //alert("Something wrong happened")
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    
    rechercher(researchedPlanet);

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
    
        SELECT DISTINCT ?propertyName ?hasValue
        WHERE {
        {  `+lien_infos +`?property ?hasValue.
            ?property rdfs:label ?propertyName
        }
        FILTER((str(?propertyName) != "has abstract") && (str(?propertyName) != "image") && (langMatches(lang(?propertyName),"FR") || langMatches(lang(?propertyName),"EN")) && (((langMatches(lang(?hasValue),"FR") || langMatches(lang(?hasValue),"EN")) && (str(?hasValue) != "")) || datatype(?hasValue) = xsd:integer || datatype(?hasValue) = xsd:double))
        }
    `;

    // Encodage de l'URL Ãƒ  transmettre Ãƒ  DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";
    console.log(url);
    // RequÃƒÂªte HTTP et affichage des rÃƒÂ©sultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            console.log(results);
            afficherResultats(results);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  // Affichage des rÃƒÂ©sultats dans un tableau
  function afficherResultats(data)
  {
    // Tableau pour mÃƒÂ©moriser l'ordre des variables ; sans doute pas nÃƒÂ©cessaire
    // pour vos applications, c'est juste pour la dÃƒÂ©mo sous forme de tableau
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