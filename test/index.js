// import {Scanner, validate} from "../dist/veli.js";
import { createWatch, VeliConfig } from "../dist/veli.js";
// const field = document.getElementById("f");
// document.getElementById("n").addEventListener("click", (e) => {
//   e.preventDefault();
//   const value = field.value;
//   const v = validate(
//     [
//       {
//         value: value,
//         rules: {
//           name: "f",
//           type: "text",
//           minWord: "2@@please enter first and second name.",
//         },
//         context: "text",
//       },
//     ],
//     {
//       scanner: {
//         scanners: "xss",
//       },
//     }
//   );
//   console.log(v);
//   // const scanner = new Scanner({
//   //   includeValueInResponse: true,
//   //   //strictMode: true
//   // });
//   // const result2 = scanner.scan(
//   //   [
//   //     {
//   //       name: "comment",
//   //       value: value,
//   //       type: "text",
//   //     },
//   //   ],
//   //   "sqlInjection"
//   // );

//   // console.log(result2);
// });

VeliConfig({
  colors: {
    error: "yellow"
  }
})
document.getElementById("submit").addEventListener("click", (e) => {
  e.preventDefault();
  console.log(w.isValid());
});

const w = createWatch("registerForm");
w.isValid()
w.on("dirty", () => {
  console.log("Form is dirty");

});
w.on("clean", () => {
  console.log("Form is clean");

});


