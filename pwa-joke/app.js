const jokeText = document.getElementById("jokeText");
const newJokeBtn = document.getElementById("newJokeBtn");
const copyBtn = document.getElementById("copyBtn");
const statusText = document.getElementById("statusText");
const installBtn = document.getElementById("installBtn");

const JOKE_API_URL = "https://v2.jokeapi.dev/joke/Any?type=single&safe-mode";
let deferredPrompt = null;

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.style.color = isError ? "#fca5a5" : "#cbd5e1";
}

function renderJoke(joke) {
  jokeText.textContent = joke;
}

async function fetchRandomJoke() {
  setStatus("Cargando...");
  newJokeBtn.disabled = true;
  newJokeBtn.style.opacity = "0.7";

  try {
    const response = await fetch(JOKE_API_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("La API no respondió correctamente.");
    }

    const data = await response.json();

    if (data.error || !data.joke) {
      throw new Error("No se pudo obtener el chiste.");
    }

    renderJoke(data.joke);
    localStorage.setItem("lastJoke", data.joke);
    setStatus("¡Listo!");
  } catch (error) {
    const cachedJoke = localStorage.getItem("lastJoke");

    if (cachedJoke) {
      renderJoke(cachedJoke);
      setStatus("Usando chiste guardado");
    } else {
      renderJoke("No se pudo cargar el chiste. Inténtalo otra vez.");
      setStatus("Error de red", true);
    }
  } finally {
    newJokeBtn.disabled = false;
    newJokeBtn.style.opacity = "1";
  }
}

async function handleCopy() {
  const textToCopy = jokeText.textContent.trim();

  if (!textToCopy || textToCopy.includes("Toca el botón")) {
    setStatus("No hay chiste para copiar", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(textToCopy);
    setStatus("Chiste copiado");
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setStatus("Chiste copiado");
  }
}

newJokeBtn.addEventListener("click", fetchRandomJoke);
copyBtn.addEventListener("click", handleCopy);

window.addEventListener("load", () => {
  const savedJoke = localStorage.getItem("lastJoke");
  if (savedJoke) {
    renderJoke(savedJoke);
  }
  fetchRandomJoke();
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) {
    setStatus("La instalación no está disponible", true);
    return;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") {
    setStatus("Instalación aceptada");
  } else {
    setStatus("Instalación cancelada");
  }

  deferredPrompt = null;
  installBtn.classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      setStatus("Service worker no disponible", true);
    });
  });
}
