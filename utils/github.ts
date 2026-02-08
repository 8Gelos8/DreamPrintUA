export interface GitHubConfig {
  token: string;
  username: string;
  repo: string;
}

export const saveGitHubConfig = (config: GitHubConfig) => {
  localStorage.setItem('githubConfig', JSON.stringify(config));
};

export const getGitHubConfig = (): GitHubConfig | null => {
  const stored = localStorage.getItem('githubConfig');
  return stored ? JSON.parse(stored) : null;
};

export const commitToGitHub = async (
  message: string,
  filePath: string,
  content: string,
  config: GitHubConfig
) => {
  const { token, username, repo } = config;
  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`;

  try {
    // Спочатку отримаємо SHA поточного файлу
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

    // Кодуємо вміст в base64
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    const body: any = {
      message,
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
    console.error('Failed to commit to GitHub:', error);
    throw error;
  }
};
