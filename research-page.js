
  function rechercher() {
    var searchedPlanet = document.getElementById("search").value;
    window.location.replace("/search-page.html?"+searchedPlanet);
  }