// import http from "k6/http";
// import { sleep } from "k6";

// export let options = {
//   vus: 1,
//   iterations: 1,
// };

// export default function () {
//   let res = http.get("http://localhost:4000/api/v1/product");
//   console.log(`Status: ${res.status}`);
//   sleep(1);
// }
import http from "k6/http";
import { sleep } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 100 },
    { duration: "1m", target: 500 },
    { duration: "30s", target: 1000 },
    { duration: "30s", target: 0 },
  ],
};

export default function () {
  http.get("http://localhost:4000/api/v1/product");
  sleep(1);
}
