import axios from 'axios';
import { Chain } from '@block-hash/common';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_URL,
});

export const fetchVolume = async (chain: Chain) => {
    const res = await api.get(`/analytics/${chain}/volume`);
    return res.data.data;
};

export const fetchWhales = async (chain: Chain) => {
    const res = await api.get(`/analytics/${chain}/whale-movements`);
    return res.data.data;
};
