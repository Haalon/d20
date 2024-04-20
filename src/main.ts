import App from "./App.svelte";
import { DRV } from "./DRV/DRV";
import { add } from "./DRV/operations/combine";
import { max } from "./DRV/operations/max";
import { min } from "./DRV/operations/min";
import "./app.css";

window.DRV = DRV;
window.min = min;
window.max = max;
window.add = add;

window.d4 = DRV.Die(4);
window.d6 = DRV.Die(6);
window.d8 = DRV.Die(8);
window.d10 = DRV.Die(10);
window.d12 = DRV.Die(12);
window.d20 = DRV.Die(20);

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
