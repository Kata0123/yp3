const API_URL = 'http://localhost:3001/api';

export async function getServices() {
    const res = await fetch(`${API_URL}/services`);
    if (!res.ok) throw new Error('Ошибка загрузки услуг');
    return await res.json();
}

export async function getCategories() {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error('Ошибка загрузки категорий');
    return await res.json();
}

export async function loginUser(email, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка авторизации');
    return data;
}

export async function registerUser(email, password) {
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');
    return data;
}

export async function createAppointment(userId, serviceId, date) {
    const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, serviceId, date })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка создания записи');
    return data;
}

export async function addCategory(name, role_id) {
    const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role_id })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка добавления категории');
    return data;
}