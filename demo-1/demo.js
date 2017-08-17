// author: Kai Garrott <kai@lyradevelopment.com>

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').insertBefore(renderer.domElement, document.getElementById('overlay'));

var scene = new THREE.Scene();
var lightingFinished = false;

var fov = 75;
var aspect = window.innerWidth / window.innerHeight;
var nearClippingPlane = 0.1;
var farClippingPlane = 5000;
var camera = new THREE.PerspectiveCamera( fov, aspect, nearClippingPlane, farClippingPlane );
camera.position.set( 0, 0, 3000 );

var stats = new Stats();
document.body.appendChild( stats.dom );

var particles = 50000;
var positions = new Float32Array(particles * 3);
var geometry = new THREE.BufferGeometry();

for ( var i = 0; i < positions.length; i += 3 ) {

    var randomDirection = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();

    randomDirection.multiplyScalar(500);

    positions[ i ]     = randomDirection.x;
    positions[ i + 1 ] = randomDirection.y;
    positions[ i + 2 ] = randomDirection.z;

}

geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

var loader = new THREE.TextureLoader();
var particleMap = loader.load('circle.png');

var material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 8,
    map: particleMap,
    blending: THREE.AdditiveBlending,
    transparent: true
});

particleSystem = new THREE.Points( geometry, material );
scene.add( particleSystem );

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

var backdrop;
var yRotationSpeed = -0.3;
var approachSpeed = 17;

function animate() {
    requestAnimationFrame(animate);

    particleSystem.rotation.z += yRotationSpeed;
    particleSystem.rotation.y += yRotationSpeed;

    if(camera.position.z >= 800) {
        camera.position.z -= approachSpeed;

    }
    if (camera.position.z >= 1700 && camera.position.z <= 1900) {
        var vecs = geometry.attributes.position.array;
        for(var i = 0; i < vecs.length; i ++) {
            vecs[i] *= 1.1;
        }
        yRotationSpeed *= .63;
        geometry.attributes.position.needsUpdate = true;
    }

    if(camera.position.z <= 1700 && !backdrop) {
        var backdropMaterial = new THREE.MeshLambertMaterial({color: 0x555555});
        backdrop = new THREE.Mesh(new THREE.PlaneGeometry(9000, 5000), backdropMaterial);
        backdrop.position.z = -2000;
        var lighting = new THREE.PointLight(0x86fdff/*0x89E3FF*/, 0.1, 0);
        lighting.name = 'lighting';
        scene.add(backdrop, lighting);
    }

    if(camera.position.z <= 1700 && !lightingFinished) {

        lighting = scene.getObjectByName('lighting');

        if(lighting && (lighting.intensity < 0.7)) {
            lighting.intensity += 0.005;
        }

        if(lighting && (lighting.intensity >= 0.7)) {
            lightingFinished = true;
        }
    }

    if(camera.position.z < 950 && camera.position.z > 800 && approachSpeed > 1) {
        approachSpeed *= .9;
    }

    renderer.render(scene, camera);
    stats.update();
}

animate();
