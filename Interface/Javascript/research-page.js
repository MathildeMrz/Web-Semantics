
  function rechercher() {
    var searchedPlanet = document.getElementById("search").value;
    window.location.replace("../Src/search-page.html?"+searchedPlanet);
  }