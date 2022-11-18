
  function rechercher(deity, language, satelliteOf) {
    var searchedPlanet = document.getElementById("search").value;
    console.log("searchedPlanet : "+searchedPlanet);
    window.location.replace("../Src/search-page.html?"+searchedPlanet+"?"+language+"?"+deity+"?"+satelliteOf);
  }