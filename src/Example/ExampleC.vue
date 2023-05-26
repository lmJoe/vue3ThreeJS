<template>
	<div
		ref="threeRef"
		:style="{ position: 'absolute', left: 0, top: 0 }"
	></div>
	<div ref="statsDivRef"></div>
</template>
<script lang="ts">
	import { defineComponent, nextTick, onMounted, ref } from "vue";
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
		AmbientLight,
	} from "three";
	import States from "stats.js";
	import * as dat from "dat.gui";
	export default defineComponent({
		setup() {
			const threeRef = ref<HTMLDivElement>();
			const statsDivRef = ref<HTMLDivElement>();
			const statsRef = ref<States>();
			const guiRef = ref<dat.GUI>();
			const cameraRef = ref<PerspectiveCamera>();
			const rendererRef = ref<WebGLRenderer>();
			const initRef = ref(false);
			function initStats() {
				statsRef.value = new States();
				statsRef.value.showPanel(0);
				statsDivRef.value?.appendChild(statsRef.value.dom);
			}

			function init() {
				initStats();

				const scene = new Scene();
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
				const ambientLight = new AmbientLight(0x0c0c0c);
				scene.add(ambientLight);
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

				rendererRef.value = new WebGLRenderer();
				rendererRef.value.setClearColor(new Color(0xeeeeee));
				rendererRef.value.setSize(window.innerWidth, window.innerHeight);
				rendererRef.value.shadowMap.enabled = true;

				cameraRef.value = new PerspectiveCamera(
					45,
					window.innerWidth / window.innerHeight,
					0.1,
					1000
				);
				cameraRef.value.position.x = -30;
				cameraRef.value.position.y = 40;
				cameraRef.value.position.z = 30;
				cameraRef.value.lookAt(scene.position);
				if (!threeRef.value?.hasChildNodes()) {
					threeRef.value?.appendChild(rendererRef.value.domElement);
				}
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
						scene.remove(scene.children[scene.children.length - 1]);
						this.numberOfObjects = scene.children.length;
					},
					numberOfObjects: scene.children.length,
				};
				guiRef.value = new dat.GUI();
				guiRef.value.add(controls, "rotationSpeed", 0, 0.5);
				guiRef.value.add(controls, "bouncingSpeed", 0, 0.5);
				guiRef.value.add(controls, "addCube");
				guiRef.value.add(controls, "removeCube");
				guiRef.value.add(controls, "numberOfObjects").listen();
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

					rendererRef.value!.render(scene, cameraRef.value!);
				}
			}
			function onResize() {
				cameraRef.value!.aspect = window.innerWidth / window.innerHeight;
				cameraRef.value!.updateProjectionMatrix();
				rendererRef.value!.setSize(window.innerWidth, window.innerHeight);
			}
			onMounted(() => {
				clear();
				init();
				window.addEventListener("resize", onResize, false);
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
