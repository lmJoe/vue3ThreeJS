<template>
	<div
		ref="threeRef"
		:style="{ position: 'absolute', left: 0, top: 0 }"
	></div>
	<div ref="statsDivRef"></div>
</template>
<script lang="ts">
	import { defineComponent, onMounted, ref } from "vue";
	import {
		Scene,
		PerspectiveCamera,
		Color,
		WebGLRenderer,
		AxesHelper,
		PlaneGeometry,
		MeshLambertMaterial,
		Mesh,
		BoxGeometry,
		SphereGeometry,
		SpotLight,
		Fog,
		FogExp2,
	} from "three";
	import States from "stats.js";
	import * as dat from "dat.gui";

	export default defineComponent({
		setup() {
			const threeRef = ref<HTMLDivElement>();
			const statsDivRef = ref<HTMLDivElement>();
			const statsRef = ref<States>();
			function initStats() {
				statsRef.value = new States();
				statsRef.value.showPanel(0);
				statsDivRef.value?.appendChild(statsRef.value.dom);
			}
			function init() {
				initStats();
				const scene = new Scene();
				// scene.fog = new Fog(0xffffff, 0.015, 100);
				scene.fog = new FogExp2(0xffffff, 0.015);
				const axes = new AxesHelper(20);
				scene.add(axes);
				const planeGeometry = new PlaneGeometry(60, 20);
				const planeMaterial = new MeshLambertMaterial({ color: 0xcccccc });
				const plane = new Mesh(planeGeometry, planeMaterial);
				plane.receiveShadow = true;

				// 旋转
				plane.rotation.x = -0.5 * Math.PI;

				plane.position.x = 0;
				plane.position.y = 0;
				plane.position.z = 0;

				scene.add(plane);

				const cubeGeometry = new BoxGeometry(4, 4, 4);
				const cubeMaterial = new MeshLambertMaterial({ color: 0xff0000 });
				const cube = new Mesh(cubeGeometry, cubeMaterial);
				cube.castShadow = true;

				cube.position.x = 2;
				cube.position.y = 2;
				cube.position.z = 2;

				scene.add(cube);

				const sphereGeometry = new SphereGeometry(4, 20, 20);
				const sphereMaterial = new MeshLambertMaterial({ color: 0x7777ff });
				const sphere = new Mesh(sphereGeometry, sphereMaterial);
				sphere.castShadow = true;

				sphere.position.x = -10;
				sphere.position.y = 4;
				sphere.position.z = 2;
				scene.add(sphere);

				const spotLight = new SpotLight(0xffffff);
				spotLight.position.set(-40, 60, 60);
				spotLight.castShadow = true;
				scene.add(spotLight);

				const renderer = new WebGLRenderer();
				renderer.setClearColor(new Color(0xeeeeee));
				renderer.setSize(window.innerWidth, window.innerHeight);
				renderer.shadowMap.enabled = true;

				const camera = new PerspectiveCamera(
					45,
					window.innerWidth / window.innerHeight,
					0.1,
					1000
				);
				camera.position.x = -30;
				camera.position.y = 40;
				camera.position.z = 30;
				camera.lookAt(scene.position);

				threeRef.value?.appendChild(renderer.domElement);
				var step = 0;
				// 通过gui修改参数
				const controls = {
					rotationSpeed: 0.02,
					bouncingSpeed: 0.03,
					addCube: function () {
						const cubeGeometry = new BoxGeometry(4, 4, 4);
						const cubeMaterial = new MeshLambertMaterial({
							color: 0xff0000,
						});
						const cube = new Mesh(cubeGeometry, cubeMaterial);
						cube.castShadow = true;
						cube.name = "cube-" + scene.children.length;
						cube.position.x =
							-30 +
							Math.round(
								Math.random() * planeGeometry.parameters.width
							);
						cube.position.y = Math.round(Math.random() * 5);
						cube.position.z =
							-20 +
							Math.round(
								Math.random() * planeGeometry.parameters.height
							);
						scene.add(cube);
						this.numberOfObjects = scene.children.length;
					},
					removeCube: function () {
						const meshList = scene.children.filter((e) =>
							e.name.startsWith("cube-")
						);
						scene.remove(meshList[meshList.length - 1]);
						this.numberOfObjects = scene.children.length;
					},
					numberOfObjects: scene.children.length,
				};
				const gui = new dat.GUI();
				gui.add(controls, "rotationSpeed", 0, 0.5);
				gui.add(controls, "bouncingSpeed", 0, 0.5);
				gui.add(controls, "addCube");
				gui.add(controls, "removeCube");
				gui.add(controls, "numberOfObjects").listen();
				renderScene();
				function renderScene() {
					statsRef.value?.begin();
					scene.traverse((e) => {
						if (e instanceof Mesh && e != plane) {
							e.rotation.x += controls.rotationSpeed;
							e.rotation.y += controls.rotationSpeed;
							e.rotation.z += controls.rotationSpeed;
						}
					});
					cube.rotation.x += controls.rotationSpeed;
					cube.rotation.y += controls.rotationSpeed;
					cube.rotation.z += controls.rotationSpeed;

					step += controls.bouncingSpeed;
					sphere.position.x = 2 + 10 * Math.cos(step);
					sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

					// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
					statsRef.value?.end();

					requestAnimationFrame(renderScene);
					renderer.render(scene, camera);
				}
			}
			onMounted(() => {
				clear();
				init();
			});
			function clear() {
				const dg = document.querySelector(".dg");
				if (dg) {
					dg.innerHTML = "";
				}
			}
			return {
				statsDivRef,
				threeRef,
			};
		},
	});
</script>
