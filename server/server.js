const express = require('express');
const path = require('node:path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const port = Number(process.env.PORT) || 3000;
const frontendDir = path.join(__dirname, '..', 'frontend');

app.use(express.static(frontendDir));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/user/:username', async (req, res) => {
  const username = req.params.username.trim();
  if (!username || username.length > 20 || !/^[A-Za-z0-9_]+$/.test(username)) {
    return res.status(400).json({ error: 'Enter a username containing 1–20 letters, numbers, or underscores.' });
  }

  const apiKey = process.env.API_KEY?.trim();
  if (!apiKey) {
    return res.json({
      mode: 'demo',
      message: 'No API_KEY is configured. This is sample data, not a live Roblox lookup.',
      user: { name: username, displayName: username }
    });
  }

  try {
    const upstream = await fetch('https://apis.roblox.com/users/v1/users', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
      signal: AbortSignal.timeout(10000)
    });

    const data = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: 'The Roblox user service rejected the request.',
        details: data?.errors?.[0]?.message || `Upstream status ${upstream.status}`
      });
    }

    const user = data?.data?.[0];
    if (!user) {
      return res.status(404).json({ error: 'No user was found for that username.' });
    }
    return res.json({ mode: 'live', user });
  } catch (error) {
    const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? 'The Roblox request timed out. Try again.' : 'Could not reach the Roblox user service.'
    });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Rebuilt app listening at http://localhost:${port}`);
});
