var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var fov = 75;
var aspect = window.innerWidth / window.innerHeight;
var nearClippingPlane = 0.1;
var farClippingPlane = 5000;

var camera = new THREE.PerspectiveCamera( fov, aspect, nearClippingPlane, farClippingPlane );

camera.position.set( 0, 0, 3000 );


var stats = new Stats();
document.body.appendChild( stats.dom );
var particles = 10000;
var positions = new Float32Array(particles * 3);
var geometry = new THREE.BufferGeometry();
geometry.dynamic = true;

var colors = new Float32Array( particles * 3 );

var color = new THREE.Color();

for ( var i = 0; i < positions.length; i += 3 ) {

    var randomDirection = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    var magnitudeFactor = Math.random() * 500;
    var particleLocation = randomDirection.multiplyScalar(magnitudeFactor);

    positions[ i ]     = randomDirection.x;
    positions[ i + 1 ] = randomDirection.y;
    positions[ i + 2 ] = randomDirection.z;

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
    size: 10,
    map: particleMap,
    blending: THREE.AdditiveBlending,
    transparent: true
});

particleSystem = new THREE.Points( geometry, material );
scene.add( particleSystem );

yRotationSpeed = 0.1;
function animate() {
    requestAnimationFrame(animate);

    //particleSystem.rotation.x += 0.01;
    particleSystem.rotation.y += yRotationSpeed;
    //particleSystem.rotation.z += 0.01;
    if(camera.position.z >= 500) {
        camera.position.z -= 10;
        if(yRotationSpeed > 0.01) {
            yRotationSpeed -= 0.00015;
        }
    }

    if (camera.position.z === 2500) {
        var vecs = geometry.attributes.position.array;
        // need to transform everything here
        for(var i = 0; i < vecs.length; i += 3) {
            vecs[i] *= 2;
            vecs[i + 1] *= 2;
            vecs[i + 2] *= 2;

        }console.log(vecs.length);
        geometry.attributes.position.array = vecs;
        geometry.attributes.position.needsUpdate = true;
        geometry.computeBoundingSphere();
    }

    renderer.render(scene, camera);
    stats.update();
}

animate();
