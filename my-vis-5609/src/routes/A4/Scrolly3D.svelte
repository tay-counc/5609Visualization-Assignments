<script lang="ts">
    import { onMount } from "svelte";
    import { Scroll } from "$lib";
    import * as THREE from "three";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    import * as d3 from "d3";
  
    let progress: number = $state(0);
    let container: HTMLElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let mixers: THREE.AnimationMixer[] = [];
    let clock = new THREE.Clock();
    let clouds: THREE.Group[] = [];
    let flamingos: THREE.Object3D[] = [];
  
    let topGenres: { name: string; count: number }[] = $state([]);
  
    onMount(async () => {
      const genreData = await loadGenreData();
      topGenres = Object.entries(genreData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([name, count]) => ({ name, count }));
  
      initScene();
      animate();
    });
  
    async function loadGenreData() {
      const data = await d3.csv("summer_movies.csv");
      const counts: { [genre: string]: number } = {};
      data.forEach((row: any) => {
        const genres = row.genres?.split(",") || [];
        genres.forEach((genre: string) => {
          const clean = genre.trim();
          if (clean) counts[clean] = (counts[clean] || 0) + 1;
        });
      });
      return counts;
    }
  
    function getComparisonText(index: number): string {
      const current = topGenres[index];
      const previous = topGenres[index - 1];
  
      if (index === 0) {
        return `Summer movies in this genre: ${current.count}`;
      }
  
      const diff = Math.abs(current.count - previous.count);
      const direction = current.count > previous.count ? "more" : "less";
  
      return `Summer movies in this genre: ${current.count} — that's ${diff} ${direction} than ${previous.name}`;
    }
  
    function initScene() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87CEEB);
  
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
      camera.position.set(-100, 100, 600);
  
      renderer = new THREE.WebGLRenderer({ antialias: true });
      const availableWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
      renderer.setSize(availableWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
  
      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
  
      const directional = new THREE.DirectionalLight(0xffffff, 0.8);
      directional.position.set(1, 1, 1);
      scene.add(directional);
  
      createBackgroundClouds();
      createGenreClouds();
      addFlamingos();
  
      window.addEventListener("resize", onWindowResize);
    }
  
    function createBackgroundClouds() {
      for (let i = 0; i < 15; i++) {
        const cloud = createCloud(30 + Math.random() * 40, 0xffffff);
        cloud.position.set(
          Math.random() * 1200 - 750,
          Math.random() * 300 + 100,
          -300 - Math.random() * 200
        );
        scene.add(cloud);
      }
    }
  
    function createGenreClouds() {
      const maxCount = Math.max(...topGenres.map(g => g.count));
  
      topGenres.forEach((genre, index) => {
        const sizeRatio = (genre.count / maxCount) * 0.7 + 0.3;
        const cloudSize = 50 + sizeRatio * 100;
        const cloudGroup = new THREE.Group();
        const cloud = createCloud(cloudSize, 0xffffff);
        cloudGroup.add(cloud);
  
        const canvas = document.createElement('canvas');
        const size = 700;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
  
        if (ctx) {
          ctx.fillStyle = 'rgba(0,0,0,0)';
          ctx.fillRect(0, 0, size, size);
          ctx.fillStyle = 'black';
          ctx.font = 'bold 80px Verdana';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(genre.name.toUpperCase(), size/2, size/2);
          ctx.fillText(`${genre.count}`, size / 2, size / 2 + 90);
  
          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
  
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            alphaTest: 0.1
          });
  
          const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(cloudSize, cloudSize),
            material
          );
  
          plane.position.z = cloudSize / 2 + 80;
          cloudGroup.add(plane);
        }
  
        cloudGroup.position.set(
          (Math.random() * 400 - 300),
          800,
          100 - index * 40
        );
  
        scene.add(cloudGroup);
        clouds.push(cloudGroup);
      });
    }
  
    function createCloud(size: number, color: number) {
      const group = new THREE.Group();
      const geometry = new THREE.SphereGeometry(1, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: 0x111111,
        shininess: 10,
        transparent: true,
        opacity: 0.9
      });
  
      const numPuffs = Math.floor(size / 10);
  
      for (let i = 0; i < numPuffs; i++) {
        const puff = new THREE.Mesh(geometry, material);
        const puffSize = (size / 2) * (0.6 + Math.random() * 0.6);
  
        puff.position.set(
          (Math.random() - 0.5) * size * 0.8,
          (Math.random() - 0.5) * size * 0.5,
          (Math.random() - 0.5) * size * 0.6
        );
  
        puff.scale.set(puffSize, puffSize, puffSize);
        group.add(puff);
      }
  
      return group;
    }
  
    function addFlamingos() {
      const loader = new GLTFLoader();
  
      for (let i = 0; i < 8; i++) {
        loader.load("/3d/Flamingo.glb", (gltf) => {
          const flamingo = gltf.scene;
          flamingo.scale.set(0.3, 0.3, 0.3);
          flamingo.position.set(
            -900 - Math.random() * 500,
            Math.random() * 300 + 100,
            Math.random() * 400 - 200
          );
  
          flamingo.userData = {
            speed: 0.5 + Math.random() * 1.5,
            yOffset: Math.random() * 100,
            ySpeed: 0.2 + Math.random() * 0.5,
            zOffset: Math.random() * 50
          };
  
          flamingo.rotation.y = Math.PI / 2;
  
          scene.add(flamingo);
          flamingos.push(flamingo);
  
          const mix = new THREE.AnimationMixer(flamingo);
          gltf.animations.forEach((clip) => mix.clipAction(clip).play());
          mixers.push(mix);
        });
      }
    }
  
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      mixers.forEach(m => m.update(delta));
  
      const section = Math.floor(progress / (100 / (topGenres.length + 1))) - 1;
  
      clouds.forEach((cloud, i) => {
        const targetY = i === section ? 200 : 800;
        cloud.position.y += (targetY - cloud.position.y) * 0.05;
        cloud.position.y += Math.sin(clock.getElapsedTime() * 0.5 + i) * 0.3;
        cloud.rotation.z = Math.sin(clock.getElapsedTime() * 0.2 + i) * 0.02;
  
        if (cloud.children.length > 1) {
          const textPlane = cloud.children[1];
          textPlane.lookAt(camera.position);
        }
      });
  
      flamingos.forEach((flamingo) => {
        const { speed, yOffset, ySpeed, zOffset } = flamingo.userData;
        flamingo.position.x += speed;
        flamingo.position.y = 150 + yOffset + Math.sin(clock.getElapsedTime() * ySpeed) * 20;
        flamingo.position.z = zOffset + Math.sin(clock.getElapsedTime() * 0.3) * 10;
  
        if (flamingo.position.x > 700) {
          flamingo.position.x = -900 - Math.random() * 200;
          flamingo.position.y = Math.random() * 300 + 100;
          flamingo.position.z = Math.random() * 400 - 200;
        }
      });
  
      renderer.render(scene, camera);
    }
  
    function onWindowResize() {
      const availableWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
      camera.aspect = availableWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(availableWidth, window.innerHeight);
    }
  </script>
  
  <Scroll bind:progress>
    <div class="scrollySection">
      <h2>Summer Movie Genres</h2>
      <p>Scroll down to explore 12 most popular movie genres released during summer months!</p>
    </div>
  
    {#each topGenres as genre, i}
      <div class="scrollySection">
        <h3>{genre.name}</h3>
        <p>{getComparisonText(i)}</p>
        <p>Scroll to see the next popular genre.</p>
      </div>
    {/each}
  
    <div class="scrollySection">
      <h2>Thanks for exploring summer movie genres!</h2>
      <p>Which genres do you enjoy watching during summer? 🍿</p>
    </div>
  
    <svelte:fragment slot="viz">
      <div bind:this={container} class="scene"></div>
    </svelte:fragment>
  </Scroll>
  
  <style>
    .scrollySection {
      height: 100vh;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.7);
      margin: 0 2rem;
      border-radius: 1rem;
      max-width: 200px;
    }
    .scene {
      width: 80%;
      height: 100vh;
    }
    h2, h3 {
      margin: 0 0 1rem;
    }
  </style>
  