export function navigate(path) {
    window.history.pushState({}, '', path);
    // Disparamos un evento personalizado para que main.js sepa que cambió la ruta
    window.dispatchEvent(new Event('locationchange'));
}

export const getPath = () => window.location.pathname;