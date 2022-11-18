function rechercher(deity, language) {
  //console.log("deity : "+deity);
  //console.log("language : "+language);
  var searchedPlanet = document.getElementById("search").value;
  //console.log("searchedPlanet : "+searchedPlanet);
  window.location.replace("../Src/search-page.html?"+searchedPlanet+"?"+language+"?"+deity);
}