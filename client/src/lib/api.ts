const API_BASE = '/api';

async function postAnalyze(body: Record<string, string>) {
  const token = localStorage.getItem('sb-token');

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach server. Make sure the backend is running on port 5000.');
  }

  if (!res.ok) {
    let message = `Server error (${res.status})`;
    try {
      const err = await res.json();
      message = err.error || message;
    } catch {
      if (res.status === 502 || res.status === 503 || res.status === 504) {
        message = 'Cannot reach server. Make sure the backend is running on port 5000.';
      }
    }
    throw new Error(message);
  }

  return res.json();
}

export function analyzeContent(content: string, keyword: string, industry: string) {
  return postAnalyze({ content, keyword, industry });
}

export function analyzeWebsite(url: string, keyword: string, industry: string) {
  return postAnalyze({ url, keyword, industry });
}

export async function getReports() {
  const token = localStorage.getItem('sb-token');
  const res = await fetch(`${API_BASE}/reports`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}

export async function getReport(id: string) {
  const token = localStorage.getItem('sb-token');
  const res = await fetch(`${API_BASE}/reports/${id}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) throw new Error('Failed to fetch report');
  return res.json();
}

export async function deleteReport(id: string) {
  const token = localStorage.getItem('sb-token');
  const res = await fetch(`${API_BASE}/reports/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) throw new Error('Failed to delete report');
  return res.json();
}
