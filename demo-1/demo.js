var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var fov = 75;
var aspect = window.innerWidth / window.innerHeight;
var nearClippingPlane = 0.1;
var farClippingPlane = 1000;

var camera = new THREE.PerspectiveCamera( fov, aspect, nearClippingPlane, farClippingPlane );

camera.position.set( 0, 0, 1000 );
/*
var geometry = new THREE.SphereGeometry(50, 50, 50);

//var loader = new THREE.TextureLoader();
//loader.crossOrigin = 'anonymous';
//var texture = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/crate.gif');

var material = new THREE.LineBasicMaterial( {
    color: 0xff4400,
} );

var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

var ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(0, 10, 0);
scene.add(directionalLight);
*/
/*
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
*/



var particles = 50000;
var positions = new Float32Array(particles * 3);
var geometry = new THREE.BufferGeometry();

var colors = new Float32Array( particles * 3 );

var color = new THREE.Color();
//var rad = geometry.radius;
/*
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
*/
for ( var i = 0; i < positions.length; i += 3 ) {



    // positions

    var randomDirection = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    var magnitudeFactor = Math.random() * 500;
    var particleLocation = randomDirection.multiplyScalar(magnitudeFactor);

    positions[ i ]     = randomDirection.x;
    positions[ i + 1 ] = randomDirection.y;
    positions[ i + 2 ] = randomDirection.z;

    // colors

    var vx = 255;
    var vy = 69;
    var vz = 0;

    color.setRGB(0xff4500);

    colors[ i ]     = color.r;
    colors[ i + 1 ] = color.g;
    colors[ i + 2 ] = color.b;

}

geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

var loader = new THREE.TextureLoader();
var particleMap = loader.load('particle2.png');

var material = new THREE.PointsMaterial({
    color: 0xffffff,
     size: 5,
     map: particleMap
  });

particleSystem = new THREE.Points( geometry, material );
scene.add( particleSystem );
function animate() {
    requestAnimationFrame(animate);

    particleSystem.rotation.x += 0.01;
    particleSystem.rotation.y += 0.01;
    particleSystem.rotation.z += 0.01;

    renderer.render(scene, camera);
}

animate();
