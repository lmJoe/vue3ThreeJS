/*
 * @Author: 寒云 <1355081829@qq.com>
 * @Date: 2022-02-18 21:40:02
 * @LastEditTime: 2022-03-12 21:32:54
 * @LastEditors: 寒云
 * @Description:
 * @FilePath: \vue3-threejs\src\env.d.ts
 * @QQ: 大前端QQ交流群: 976961880
 * @QQ2: 大前端QQ交流群2: 777642000
 * @公众账号: 乐编码
 * 善始者实繁 , 克终者盖寡
 * Copyright (c) 2022 by 最爱白菜吖, All Rights Reserved.
 */
/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
