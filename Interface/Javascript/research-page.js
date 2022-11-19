
  function rechercher(deity, language, satelliteOf) {
    var searchedPlanet = document.getElementById("search").value;
    window.location.replace("../Src/search-page.html?"+searchedPlanet+"?"+language+"?"+deity+"?"+satelliteOf);
  }