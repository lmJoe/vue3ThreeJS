<template>
	<div ref="threeRef"></div>
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
		MeshBasicMaterial,
		Mesh,
		BoxGeometry,
		SphereGeometry,
	} from "three";
	export default defineComponent({
		setup() {
			const threeRef = ref();
			function init() {
				const scene = new Scene();

				const axes = new AxesHelper(20);
				scene.add(axes);

				const planeGeometry = new PlaneGeometry(60, 20);
				const planeMaterial = new MeshBasicMaterial({ color: 0xcccccc });
				const plane = new Mesh(planeGeometry, planeMaterial);

				// 旋转
				plane.rotation.x = -0.5 * Math.PI;

				plane.position.x = 0;
				plane.position.y = 0;
				plane.position.z = 0;

				scene.add(plane);

				const cubeGeometry = new BoxGeometry(4, 4, 4);
				const cubeMaterial = new MeshBasicMaterial({
					color: 0xff0000,
					wireframe: true,
				});
				const cube = new Mesh(cubeGeometry, cubeMaterial);

				cube.position.x = 2;
				cube.position.y = 2;
				cube.position.z = 2;

				scene.add(cube);

				const sphereGeometry = new SphereGeometry(4, 20, 20);
				const sphereMaterial = new MeshBasicMaterial({
					color: 0x7777ff,
					wireframe: true,
				});
				const sphere = new Mesh(sphereGeometry, sphereMaterial);
				sphere.position.x = -10;
				sphere.position.y = 4;
				sphere.position.z = 2;
				scene.add(sphere);

				const renderer = new WebGLRenderer();
				renderer.setClearColor(new Color(0xeeeeee));
				renderer.setSize(window.innerWidth, window.innerHeight);

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

				threeRef.value.appendChild(renderer.domElement);
				renderer.render(scene, camera);
			}
			onMounted(() => {
				init();
			});
			return {
				threeRef,
			};
		},
	});
</script>
