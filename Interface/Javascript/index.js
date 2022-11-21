function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

function getBestDiscoverers(){

  var query = `PREFIX bd: <http://www.bigdata.com/rdf#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX wd: <http://www.wikidata.org/entity/>
  PREFIX wdt: <http://www.wikidata.org/prop/direct/>
  PREFIX wikibase: <http://wikiba.se/ontology#>
  
  SELECT
     ?image ?discoverer ?discovererLabel
      (COUNT(DISTINCT ?planet) as ?count)
      
  WHERE
  {
      ?ppart wdt:P279* wd:Q634 .
      ?planet wdt:P31 ?ppart .
      ?planet wdt:P61 ?discoverer .
      ?discoverer wdt:P18 ?image .
   
      SERVICE wikibase:label {
          bd:serviceParam wikibase:language "en" .
          ?discoverer rdfs:label ?discovererLabel .
          ?planet rdfs:label ?planetLabel .
          ?image rdfs:label ?imageLabel
      }
  }
  GROUP BY ?image ?discoverer ?discovererLabel
  ORDER BY DESC(?count)
  LIMIT 6`;

   
  // Encodage de l'URL à transmettre à wikidata
  var url_base = "https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=";
  var url = url_base + encodeURIComponent(query) + "&format=json";

  // RequÃƒÂªte HTTP et affichage des rÃƒÂ©sultats
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var results = JSON.parse(this.responseText);
          console.log(results);
          for(var i = 0; i< results.results.bindings.length; i++)
            {
              console.log(results.results.bindings[i]["discovererLabel"]["value"]);
              console.log(results.results.bindings[i]["image"]["value"]);
              var contenu = "<div class=\"discoverer\"><img src=\"";
              contenu += results.results.bindings[i]["image"]["value"];
              contenu += "\" class=\"discoverer-image\"> <div class=\"discoverer-name\">";
              contenu += results.results.bindings[i]["discovererLabel"]["value"];
              contenu +="</div>  <div style=\"color:white;\">"
              contenu += results.results.bindings[i]["count"]["value"]
              contenu +=" planets</div> </div>"
             
              console.log(contenu);
              document.getElementById("list-discoverers").innerHTML += contenu;
            }
      }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}