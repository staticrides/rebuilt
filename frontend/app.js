const form = document.querySelector('#lookup-form');
const input = document.querySelector('#username');
const status = document.querySelector('#status');
const result = document.querySelector('#result');
const button = form.querySelector('button');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = input.value.trim();
  if (!username) {
    status.textContent = 'Enter a username first.';
    input.focus();
    return;
  }

  button.disabled = true;
  status.textContent = 'Looking up account…';
  result.hidden = true;
  result.replaceChildren();

  try {
    const response = await fetch(`/api/user/${encodeURIComponent(username)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Lookup failed.');

    const heading = document.createElement('h2');
    heading.textContent = data.mode === 'demo' ? 'Demo result' : 'Account details';
    const pre = document.createElement('pre');
    pre.textContent = JSON.stringify(data, null, 2);
    result.append(heading, pre);
    result.hidden = false;
    status.textContent = data.mode === 'demo' ? 'Shown using demo data.' : 'Lookup complete.';
  } catch (error) {
    status.textContent = error.message || 'Could not complete the lookup.';
  } finally {
    button.disabled = false;
  }
});
