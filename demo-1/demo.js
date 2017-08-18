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
var constellation;
var yRotationSpeed = -0.3;
var approachSpeed = 17;
var vecs = geometry.attributes.position.array;

function animate() {
    requestAnimationFrame(animate);

    particleSystem.rotation.z += yRotationSpeed;
    particleSystem.rotation.y += yRotationSpeed;

    if(camera.position.z >= 800) {
        camera.position.z -= approachSpeed;

    }
    if (camera.position.z >= 1700 && camera.position.z <= 1900) {

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
/*
        var constellationMap = loader.load('constellation-basic.png');
        var constellationMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, map: constellationMap, transparent: false});
        constellation = new THREE.Mesh(new THREE.PlaneGeometry(1000, 400), constellationMaterial);
        constellation.position.z = -1999;
        constellation.position.x = -1200;
        constellation.position.y = 900;
        constellation.rotation.z = 0.8;
*/
        var pointMap = particleSystem.geometry.attributes.position.array;

        var vector1 = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
        vector1.multiplyScalar(500);

        var vector2 = new THREE.Vector3(vector1.x + 30, vector1.y, vector1.z);
        var vector3 = new THREE.Vector3(vector2.x, vector2.y + 50, vector2.z);
        var vector4 = new THREE.Vector3(vector3.x + 30, vector3.y, vector3.z);
        var vector5 = new THREE.Vector3(vector4.x + 30, vector4.y + 20, vector4.z);

        var len = pointMap.length;
        pointMap[len - 15] = vector5.x;
        pointMap[len - 14] = vector5.y;
        pointMap[len - 13] = vector5.z;
        pointMap[len - 12] = vector4.x;
        pointMap[len - 11] = vector4.y;
        pointMap[len - 10] = vector4.z;
        pointMap[len - 9] = vector3.x;
        pointMap[len - 8] = vector3.y;
        pointMap[len - 7] = vector3.z;
        pointMap[len - 6] = vector2.x;
        pointMap[len - 5] = vector2.y;
        pointMap[len - 4] = vector2.z;
        pointMap[len - 3] = vector1.x;
        pointMap[len - 2] = vector1.y;
        pointMap[len - 1] = vector1.z;

        particleSystem.geometry.attributes.position.needsUpdate = true;

        var lighting = new THREE.PointLight(0x89E3FF, 0.1, 0);
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
