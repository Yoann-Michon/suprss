import type { Feed } from "../pages/ManageFeed";


export const exportFeedData = (feeds: Feed[], format: 'json' | 'csv' | 'opml') => {
  const fileName = `feeds_export.${format}`;
  let content = '';

  if (format === 'json') {
    content = JSON.stringify(feeds, null, 2);
  } 
   if (format === 'csv') {
    const headers = ['title', 'url', 'tags', 'frequency', 'description'];
    const rows = feeds.map(feed => headers.map(h => `"${(feed as any)[h]}"`).join(','));
    content = [headers.join(','), ...rows].join('\n');
  } 
  
  if (format === 'opml') {
    content = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>Feed Export</title>
  </head>
  <body>
    ${feeds.map(feed => `
    <outline 
      text="${feed.name}" 
      title="${feed.name}" 
      type="rss" 
      xmlUrl="${feed.url}" 
      description="${feed.description}" 
      category="${feed.tags}" 
    />`).join('\n')}
  </body>
</opml>`;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};
