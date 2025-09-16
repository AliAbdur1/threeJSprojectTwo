import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import SphereImageSource from '/src/images/Rock052_1K-JPG/Rock052_1K-JPG_Color.jpg';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

function Shapes() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Debug GUI
    const gui = new GUI({
      title: 'Debug UI Settings',
      width: 300,
      closeFolders: true
    });
    gui.close();

    const toggleGUI = (event) => {
      if (event.key === 'h') {
        gui.show(gui._hidden); // toggle debug UI
      }
    };
    window.addEventListener('keydown', toggleGUI);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.z = 3;
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // textureloader
    const textureLoader = new THREE.TextureLoader();

    // Example geometry (so something shows up)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cubecolortexture = textureLoader.load('/src/images/11-materials/static/textures/door/color.jpg');
    const cubealphatexture = textureLoader.load('/src/images/11-materials/static/textures/door/alpha.jpg');
    const cubeambienttexture = textureLoader.load('/src/images/11-materials/static/textures/door/ambientOcclusion.jpg');
    const cubeheighttexture = textureLoader.load('/src/images/11-materials/static/textures/door/height.jpg');
    const cubemetalnessTexture = textureLoader.load('/src/images/11-materials/static/textures/door/metalness.jpg');
    const cubenormaltexture = textureLoader.load('/src/images/11-materials/static/textures/door/normal.jpg');
    const cuberoughnesstexture = textureLoader.load('/src/images/11-materials/static/textures/door/roughness.jpg');
    const cubematcaptexture = textureLoader.load('/src/images/11-materials/static/textures/matcaps/1.png');
    const cubegradtexture = textureLoader.load('/src/images/11-materials/static/textures/gradients/3.jpg');
    // MeshPhysicalMaterial for better texture stuff. and different map names
    const material = new THREE.MeshPhysicalMaterial({ 
        map: cubecolortexture,
        alphaMap: cubealphatexture,
        aoMap: cubeambienttexture,
        displacementMap: cubeheighttexture,
        displacementScale: 0.1,
        metalnessMap: cubemetalnessTexture,
        normalMap: cubenormaltexture,
        roughnessMap: cuberoughnesstexture
        

     });
     
     material.colorSpace = THREE.SRGBColorSpace;
    const cube = new THREE.Mesh(geometry, material);
    

    // Sphere with texture
    const sphereTexture = textureLoader.load(SphereImageSource);
    sphereTexture.center.set(0.5, 0.5);
    sphereTexture.colorSpace = THREE.SRGBColorSpace;

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ map: sphereTexture });
    sphereMaterial.transparent = true;
    sphereMaterial.opacity = 0.5;
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 2; // move it so it doesn’t overlap the cube

    
    

    const torusTexture = textureLoader.load('/src/images/Onyx002_1K-JPG/Onyx002_1K-JPG_Color.jpg');
    const torusDisplacement = textureLoader.load('/src/images/Onyx002_1K-JPG/Onyx002_1K-JPG_Displacement.jpg');
    const torusNormal = textureLoader.load('/src/images/Onyx002_1K-JPG/Onyx002_1K-JPG_NormalDX.jpg');
    const torusRoughness = textureLoader.load('/src/images/Onyx002_1K-JPG/Onyx002_1K-JPG_Roughness.jpg');
    torusTexture.center.set(0.5, 0.5);
    torusTexture.colorSpace = THREE.SRGBColorSpace;
    torusDisplacement.center.set(0.5, 0.5);
    torusDisplacement.colorSpace = THREE.SRGBColorSpace;
    torusNormal.center.set(0.5, 0.5);
    torusNormal.colorSpace = THREE.SRGBColorSpace;
    torusRoughness.center.set(0.5, 0.5);
    torusRoughness.colorSpace = THREE.SRGBColorSpace;

    const torusGeometry = new THREE.TorusGeometry(.7, 0.2, 15, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({ map: torusTexture });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.x = -2;
    scene.add(torus, sphere, cube);

    // Debug controls
const cubeParams = {
  color: material.color.getHex(),
  spin: () => {
    const speed = cubeParams.rotationSpeed; // rotations per second
    const duration = speed > 0 ? 1 / speed : 9999; // avoid divide by zero
    gsap.to(cube.rotation, {
      y: cube.rotation.y + Math.PI * 2,
      duration,
      ease: "power1.inOut"
    });
  },
  rotationSpeed: 0.5 // default
};

const cubeFolder = gui.addFolder('Cube');
cubeFolder.addColor(cubeParams, 'color').onChange((val) => {
  material.color.set(val);
});
cubeFolder.add(cube.position, 'x').min(-3).max(3).step(0.01).name('posX');
cubeFolder.add(cube.position, 'y').min(-3).max(3).step(0.01).name('posY');
cubeFolder.add(cube.position, 'z').min(-3).max(3).step(0.01).name('posZ');
cubeFolder.add(cubeParams, 'rotationSpeed').min(0.1).max(5).step(0.1).name('rot/sec');
cubeFolder.add(cubeParams, 'spin');


    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 5);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(light, ambientLight);

    // Resize handler
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      console.log('window is resized');
    };
    window.addEventListener('resize', handleResize);

    // Fullscreen toggle
    const handleDblClick = () => {
      const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;

      if (!fullscreenElement) {
        if (canvasRef.current.requestFullscreen) {
          canvasRef.current.requestFullscreen();
        } else if (canvasRef.current.webkitRequestFullscreen) {
          canvasRef.current.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
      console.log('double clicked');
    };
    window.addEventListener('dblclick', handleDblClick);

    // Animation loop
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Example animation
    //   cube.rotation.y = elapsedTime;
    //   cube.rotation.x = elapsedTime * 0.5;

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();


    // Cleanup
    return () => {
      gui.destroy();
      window.removeEventListener('keydown', toggleGUI);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('dblclick', handleDblClick);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="shapesOnScreen"
        id="shapes_canvas"
      ></canvas>
    </div>
  );
}

export default Shapes;
