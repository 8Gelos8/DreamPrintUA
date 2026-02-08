import { Product, PriceItem } from '../types';

export interface ContentData {
  homeTitle: string;
  homeDescription: string;
  aboutText: string;
  products: Product[];
  prices: PriceItem[];
}

const DEFAULT_CONTENT: ContentData = {
  homeTitle: 'DreamPrintUA',
  homeDescription: 'Створюємо мрії з якістю та любов\'ю',
  aboutText: 'Ми спеціалізуємося на персоналізованому друці та handmade виробах',
  products: [],
  prices: [],
};

export const saveContent = (content: ContentData) => {
  localStorage.setItem('siteContent', JSON.stringify(content));
};

export const getContent = (): ContentData => {
  const stored = localStorage.getItem('siteContent');
  return stored ? JSON.parse(stored) : DEFAULT_CONTENT;
};

export const syncContentToGitHub = async (
  content: ContentData,
  token: string,
  username: string,
  repo: string
) => {
  const filePath = 'src/content.json';
  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`;

  try {
    // Отримуємо SHA
    const getResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    let sha: string | null = null;
    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
    }

    // Кодуємо вміст
    const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));

    const body: any = {
      message: `chore: Update site content via admin panel - ${new Date().toLocaleString()}`,
      content: encodedContent,
      branch: 'main',
    };

    if (sha) {
      body.sha = sha;
    }

    const putResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(body),
    });

    if (!putResponse.ok) {
      throw new Error(`GitHub API error: ${putResponse.status}`);
    }

    return await putResponse.json();
  } catch (error) {
    console.error('Failed to sync to GitHub:', error);
    throw error;
  }
};
