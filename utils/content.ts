import { Product, PriceItem, GalleryItem } from '../types';

export interface ContentData {
  homeTitle: string;
  homeDescription: string;
  aboutText: string;
  products: Product[];
  prices: PriceItem[];
  photos: GalleryItem[];
}

const DEFAULT_CONTENT: ContentData = {
  homeTitle: 'DreamPrintUA',
  homeDescription: 'Створюємо мрії з якістю та любов\'ю',
  aboutText: 'Ми спеціалізуємося на персоналізованому друці та handmade виробах',
  products: [],
  prices: [],
  photos: [],
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

  console.log('[syncContentToGitHub] Starting sync...');
  console.log('[syncContentToGitHub] Config:', { username, repo, filePath });
  console.log('[syncContentToGitHub] Content to sync:', {
    homeTitle: content.homeTitle,
    products: content.products.length,
    prices: content.prices.length,
    photos: content.photos.length,
  });

  try {
    // Отримуємо SHA
    console.log('[syncContentToGitHub] Fetching current SHA from:', apiUrl);
    const getResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    console.log('[syncContentToGitHub] GET response status:', getResponse.status);

    let sha: string | null = null;
    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
      console.log('[syncContentToGitHub] Found existing file, SHA:', sha);
    } else if (getResponse.status !== 404) {
      // Якщо це не 404 (файл не існує), то це помилка
      const errorText = await getResponse.text();
      console.error('[syncContentToGitHub] GitHub GET error:', errorText);
      throw new Error(`GitHub API error: ${getResponse.status}`);
    } else {
      console.log('[syncContentToGitHub] File does not exist (404), creating new');
    }
    // Якщо 404 - файл новий, sha залишиться null

    // Кодуємо вміст
    console.log('[syncContentToGitHub] Encoding content...');
    const contentString = JSON.stringify(content, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(contentString)));
    console.log('[syncContentToGitHub] Encoded content length:', encodedContent.length);

    const body: any = {
      message: `chore: Update site content via admin panel - ${new Date().toLocaleString()}`,
      content: encodedContent,
      branch: 'main',
    };

    if (sha) {
      body.sha = sha;
    }

    console.log('[syncContentToGitHub] Sending PUT request with:', {
      hasMessage: !!body.message,
      hasContent: !!body.content,
      hasSha: !!body.sha,
    });

    const putResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(body),
    });

    console.log('[syncContentToGitHub] PUT response status:', putResponse.status);

    if (!putResponse.ok) {
      const errorText = await putResponse.text();
      console.error('[syncContentToGitHub] GitHub PUT error:', errorText);
      throw new Error(`GitHub API error: ${putResponse.status}`);
    }

    const result = await putResponse.json();
    console.log('[syncContentToGitHub] Sync successful! Commit SHA:', result.commit?.sha);
    return result;
  } catch (error) {
    console.error('[syncContentToGitHub] Sync failed:', error);
    throw error;
  }
};
