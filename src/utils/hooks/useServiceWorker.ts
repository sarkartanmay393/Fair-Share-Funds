import { useEffect } from "react";
import { registerSW } from "virtual:pwa-register";

const useServiceWorker = () => {
  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        console.log("On need refresh");
        const prompt = document.createElement("div");
        prompt.style.position = "fixed";
        prompt.style.bottom = "0";
        prompt.style.width = "100%";
        prompt.style.backgroundColor = "#333";
        prompt.style.color = "#fff";
        prompt.style.textAlign = "center";
        prompt.style.padding = "1em";
        prompt.innerText = "New version available. Click to update.";
        prompt.style.cursor = "pointer";

        prompt.addEventListener("click", () => {
          updateSW(true);
        });

        document.body.appendChild(prompt);
      },
      onOfflineReady() {
        console.log("The application is ready to work offline");
      },
    });
  }, []);
};

export default useServiceWorker;
