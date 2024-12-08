'use client'; 

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import React, { useRef, useEffect } from "react";
// import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';


export default function SecondBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();



    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    
    
    camera.position.set(2, 2, 10);
    

    const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const BoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const box = new THREE.Mesh(BoxGeometry, BoxMaterial);
    scene.add(box);

    function animate() {
      requestAnimationFrame(animate);
      box.rotation.x += 0.01;
      box.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }} />;
}