import { writable } from 'svelte/store';
import Cookies from 'js-cookie';

// Cookieにuidがあれば初期設定
const uid = Cookies.get('uid');
export const userId = writable(uid ? uid : null)
