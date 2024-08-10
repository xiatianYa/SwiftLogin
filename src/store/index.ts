import { useGloBalStore } from "./global";
export default function () {
  return {
    globalStore: useGloBalStore(),
  };
}
