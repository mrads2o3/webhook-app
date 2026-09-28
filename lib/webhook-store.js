let webhooks = [];

export function createId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

export function addWebhook(item) {
    webhooks.unshift(item);

    // Batasi jumlah data agar memory tidak terus bertambah
    if (webhooks.length > 100) {
        webhooks = webhooks.slice(0, 100);
    }

    return item;
}

export function getWebhooks() {
    return webhooks;
}

export function getWebhook(id) {
    return webhooks.find((item) => item.id === id) || null;
}

export function deleteWebhook(id) {
    const index = webhooks.findIndex((item) => item.id === id);

    if (index === -1) {
        return false;
    }

    webhooks.splice(index, 1);

    return true;
}

export function clearWebhooks() {
    webhooks = [];
}