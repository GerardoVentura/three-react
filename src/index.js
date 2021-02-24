import React, { Component, useEffect } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

const style = {
  height: 500, // we can control scene size by setting container dimensions
};

function App() {
  let scene, camera, controls, cube, requestID, mount, renderer;

  useEffect(() => {
    sceneSetup();
    addCustomSceneObjects();
    startAnimationLoop();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.cancelAnimationFrame(requestID);
      controls.dispose();
    };
  });

  // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
  // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  const sceneSetup = () => {
    // get container dimensions and use them for scene sizing
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75, // fov = field of view
      width / height, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );
    camera.position.z = 9; // is used here to set some distance from a cube that is located at z = 0
    // OrbitControls allow a camera to orbit around the object
    // https://threejs.org/docs/#examples/controls/OrbitControls
    controls = new OrbitControls(camera, mount);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement); // mount using React ref
  };

  // Here should come custom code.
  // Code below is taken from Three.js BoxGeometry example
  // https://threejs.org/docs/#api/en/geometries/BoxGeometry
  const addCustomSceneObjects = () => {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true,
    });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);
  };

  const startAnimationLoop = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);

    // The window.requestAnimationFrame() method tells the browser that you wish to perform
    // an animation and requests that the browser call a specified function
    // to update an animation before the next repaint
    requestID = window.requestAnimationFrame(startAnimationLoop);
  };

  const handleWindowResize = () => {
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;

    // Note that after making changes to most of camera properties you have to call
    // .updateProjectionMatrix for the changes to take effect.
    camera.updateProjectionMatrix();
  };

  return <div style={style} ref={(ref) => (mount = ref)} />;
}

// class Container extends React.Component {
//   state = { isMounted: true };

//   render() {
//     const { isMounted = true } = state;
//     return (
//       <>
//         <button
//           onClick={() => setState((state) => ({ isMounted: !state.isMounted }))}
//         >
//           {isMounted ? "Unmount" : "Mount"}
//         </button>
//         {isMounted && <App />}
//         {isMounted && <div>Scroll to zoom, drag to rotate</div>}
//       </>
//     );
//   }
// }

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
