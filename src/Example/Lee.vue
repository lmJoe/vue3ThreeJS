<!--
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-03-12 21:04:53
 * @LastEditTime: 2022-03-12 22:44:14
 * @LastEditors: 寒云
 * @Description: 
 * @FilePath: \vue3-threejs\src\Example\Lee.vue
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ2: 大前端QQ交流群2: 777642000
 * @公众账号: 乐编码
 * 善始者实繁 , 克终者盖寡
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved. 
-->
<template>
	<ul>
		<li v-for="user in userList" :key="user.id">
			<input :value="user.name" :data-id="user.id" @input="change" />
		</li>
		{{
			userList
		}}
	</ul>
</template>
    <script lang="ts">
	import { defineComponent, ref, onMounted } from "vue";
	interface User {
		id: number;
		name: string;
	}
	export default defineComponent({
		setup() {
			const userList = ref<User[]>([]);
			for (let i = 1; i < 10; i++) {
				userList.value.push({
					id: i,
					name: "name" + i,
				});
			}
			const change = (e: Event) => {
				const target = e.target as HTMLInputElement;
				const targetId = target.getAttribute("data-id");
				for (let u of userList.value) {
					if (u.id === Number(targetId)) {
						u.name = target.value;
					}
				}
			};
			return {
				change,
				userList,
			};
		},
	});
</script>
    