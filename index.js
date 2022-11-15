/*!
 * Fairy Dust Cursor.js
 * - 90's cursors collection
 * -- https://github.com/tholman/90s-cursor-effects
 * -- https://codepen.io/tholman/full/jWmZxZ/
 */

(function fairyDustCursor() {
  
    var possibleColors = ["#D51BE5", "#FA1DA1", "#AC26CD"]
    var width = window.innerWidth;
    var height = window.innerHeight;
    var cursor = {x: width/2, y: width/2};
    var particles = [];
    
    function init() {
      bindEvents();
      loop();
    }
    
    // Bind events that are needed
    function bindEvents() {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchstart', onTouchMove);
      
      window.addEventListener('resize', onWindowResize);
    }
    
    function onWindowResize(e) {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    
    function onTouchMove(e) {
      if( e.touches.length > 0 ) {
        for( var i = 0; i < e.touches.length; i++ ) {
          addParticle( e.touches[i].clientX, e.touches[i].clientY, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
        }
      }
    }
    
    function onMouseMove(e) {    
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      
      addParticle( cursor.x, cursor.y, possibleColors[Math.floor(Math.random()*possibleColors.length)]);
    }
    
    function addParticle(x, y, color) {
      var particle = new Particle();
      particle.init(x, y, color);
      particles.push(particle);
    }
    
    function updateParticles() {
      
      // Updated
      for( var i = 0; i < particles.length; i++ ) {
        particles[i].update();
      }
      
      // Remove dead particles
      for( var i = particles.length -1; i >= 0; i-- ) {
        if( particles[i].lifeSpan < 0 ) {
          particles[i].die();
          particles.splice(i, 1);
        }
      }
      
    }
    
    function loop() {
      requestAnimationFrame(loop);
      updateParticles();
    }
    
    /**
     * Particles
     */
    
    function Particle() {
  
      this.character = "*";
      this.lifeSpan = 120; //ms
      this.initialStyles ={
        "position": "absolute",
        "display": "block",
        "pointerEvents": "none",
        "z-index": "10000000",
        "fontSize": "16px",
        "will-change": "transform"
      };
  
      // Init, and set properties
      this.init = function(x, y, color) {
  
        this.velocity = {
          x:  (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
          y: 1
        };
        
        this.position = {x: x + 5, y: y +12};
        this.initialStyles.color = color;
  
        this.element = document.createElement('span');
        this.element.innerHTML = this.character;
        applyProperties(this.element, this.initialStyles);
        this.update();
        
        document.querySelector('.container').appendChild(this.element);
      };
      
      this.update = function() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.lifeSpan--;
        
        this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px, 0) scale(" + (this.lifeSpan / 120) + ")";
      }
      
      this.die = function() {
        this.element.parentNode.removeChild(this.element);
      }
      
    }
    
    /**
     * Utils
     */
    
    // Applies css `properties` to an element.
    function applyProperties( target, properties ) {
      for( var key in properties ) {
        target.style[ key ] = properties[ key ];
      }
    }
    
    init();
  })();

  function rechercher() {
    var searchedPlanet = document.getElementById("search").value;
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
        SELECT (?p as ?lien) (GROUP_CONCAT(?l; separator="/") as ?noms) WHERE {
    ?p a dbo:Planet.
    ?p rdfs:label ?l .
    FILTER(langMatches(lang(?l),"FR") || langMatches(lang(?l),"EN"))
    FILTER(regex(lcase(str(?l)), ".*`
    +searchedPlanet + `.*"))
    }
    GROUP BY ?p
    `;
        // Encodage de l'URL à transmettre à DBPedia
        var url_base = "http://dbpedia.org/sparql";
        var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";

        // Requête HTTP et affichage des résultats
        var xmlhttp = new XMLHttpRequest();
        var results;
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                results = JSON.parse(this.responseText);
                console.log(results);
            }
        };

        document.getElementById("searchedResults").innerText = results;

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
  }