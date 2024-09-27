// Run the export function as soon as the popup loads
(async () => {
  const outputElement = document.getElementById('output');

  // Get all open tabs in the current window
  const tabs = await chrome.tabs.query({ currentWindow: true });

  // Group tabs by domain name
  const tabsByDomain = tabs.reduce((group, tab) => {
    const url = new URL(tab.url);
    const domain = url.hostname;
    if (!group[domain]) {
      group[domain] = [];
    }
    group[domain].push(tab);
    return group;
  }, {});

  // Build Markdown output
  let markdown = '';
  for (const [domain, tabs] of Object.entries(tabsByDomain)) {
    markdown += `### ${domain}\n`;
    tabs.forEach(tab => {
      markdown += `- [${tab.title}](${tab.url})\n`;
    });
    markdown += '\n';
  }

  // Display the result in the popup
  outputElement.textContent = markdown;
})();

