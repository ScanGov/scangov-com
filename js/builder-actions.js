// Buttons on a generated document (policy generator, RFP builder). See
// _includes/builder-actions.html.
(function () {
  const bar = document.getElementById('builder-actions');
  const status = document.getElementById('copy-status');
  // The document is below this script, so look it up when a button is used.
  function documentNode() { return document.getElementById(bar.dataset.content); }
  for (const id of ['print-link', 'edit-link']) {
    const link = document.getElementById(id);
    if (link) link.href += location.search;
  }
  document.getElementById('copy-link').addEventListener('click', function () {
    navigator.clipboard.writeText(location.href).then(function () { status.textContent = 'Link copied.'; });
  });
  document.getElementById('copy-text').addEventListener('click', function () {
    const head = title();
    navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([headingHtml(head) + documentNode().innerHTML], { type: 'text/html' }),
        'text/plain': new Blob([head.title + '\n' + (head.subtitle ? head.subtitle + '\n' : '') + '\n' + documentNode().innerText], { type: 'text/plain' })
      })
    ]).then(function () { status.textContent = 'Copied.'; });
  });

  // Downloads. The document is read from the page, so it holds whatever the
  // answers produced.
  function text(node) { return node.textContent.replace(/\s+/g, ' ').trim(); }
  function inline(node) {
    let out = '';
    for (const child of node.childNodes) {
      if (child.nodeType === 3) out += child.textContent.replace(/\s+/g, ' ');
      else if (child.nodeName === 'STRONG' || child.nodeName === 'B') out += '**' + inline(child).trim() + '**';
      else if (child.nodeName === 'EM' || child.nodeName === 'I') out += '*' + inline(child).trim() + '*';
      else if (child.nodeName === 'A') out += '[' + inline(child).trim() + '](' + child.href + ')';
      else if (child.nodeName === 'BR') out += '  \n';
      else out += inline(child);
    }
    return out;
  }
  function blocks(root) {
    const list = [];
    (function walk(node) {
      for (const child of node.children) {
        const name = child.nodeName;
        if (/^H[1-6]$/.test(name)) list.push({ type: 'heading', level: Number(name[1]), text: text(child) });
        else if (name === 'P') list.push({ type: 'paragraph', text: text(child), markdown: inline(child).trim() });
        else if (name === 'UL' || name === 'OL') list.push({ type: 'list', ordered: name === 'OL', items: Array.from(child.children).map(function (item) { return { text: text(item), markdown: inline(item).trim() }; }) });
        else if (name === 'DL') {
          const items = [];
          for (const term of child.querySelectorAll('dt')) items.push({ text: text(term) + ': ' + text(term.nextElementSibling), markdown: '**' + text(term) + ':** ' + inline(term.nextElementSibling).trim() });
          list.push({ type: 'list', ordered: false, items: items });
        } else if (name === 'HR') list.push({ type: 'rule' });
        else if (name !== 'SCRIPT' && name !== 'STYLE') walk(child);
      }
    })(root);
    return list;
  }
  function headingHtml(head) {
    const escape = function (value) { return value.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    return '<h1>' + escape(head.title) + '</h1>' + (head.subtitle ? '<p>' + escape(head.subtitle) + '</p>' : '');
  }
  function title() {
    const heading = document.querySelector('h1');
    const lead = document.querySelector('.lead');
    return { title: heading ? text(heading) : document.title, subtitle: lead ? text(lead) : '' };
  }
  function toMarkdown() {
    const head = title();
    const lines = ['# ' + head.title, ''];
    if (head.subtitle) lines.push(head.subtitle, '');
    for (const block of blocks(documentNode())) {
      if (block.type === 'heading') lines.push('#'.repeat(block.level) + ' ' + block.text, '');
      else if (block.type === 'paragraph') lines.push(block.markdown, '');
      else if (block.type === 'rule') lines.push('---', '');
      else {
        block.items.forEach(function (item, index) { lines.push((block.ordered ? index + 1 + '. ' : '- ') + item.markdown); });
        lines.push('');
      }
    }
    return lines.join('\n').replace(/\n{3,}/g, '\n\n');
  }
  function toJson() {
    const head = title();
    const answers = {};
    for (const key of new URLSearchParams(location.search).keys()) answers[key] = new URLSearchParams(location.search).getAll(key);
    const sections = [];
    let section = { heading: null, level: 0, blocks: [] };
    for (const block of blocks(documentNode())) {
      if (block.type === 'heading') {
        if (section.heading || section.blocks.length) sections.push(section);
        section = { heading: block.text, level: block.level, blocks: [] };
      } else if (block.type === 'paragraph') section.blocks.push({ type: 'paragraph', text: block.text });
      else if (block.type === 'list') section.blocks.push({ type: 'list', ordered: block.ordered, items: block.items.map(function (item) { return item.text; }) });
    }
    sections.push(section);
    return JSON.stringify({ title: head.title, subtitle: head.subtitle, answers: answers, sections: sections }, null, 2);
  }
  function toHtml(word) {
    const head = title();
    const body = documentNode().cloneNode(true);
    for (const script of body.querySelectorAll('script')) script.remove();
    const open = word
      ? '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">'
      : '<!doctype html><html lang="en">';
    return open + '<head><meta charset="utf-8"><title>' + head.title + '</title></head><body>' + headingHtml(head) + body.innerHTML + '</body></html>';
  }
  const formats = {
    doc: { extension: 'doc', type: 'application/msword', build: function () { return toHtml(true); } },
    html: { extension: 'html', type: 'text/html', build: function () { return toHtml(false); } },
    md: { extension: 'md', type: 'text/markdown', build: toMarkdown },
    json: { extension: 'json', type: 'application/json', build: toJson }
  };
  for (const button of bar.querySelectorAll('[data-download]')) {
    button.addEventListener('click', function () {
      const format = formats[button.dataset.download];
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([format.build()], { type: format.type + ';charset=utf-8' }));
      link.download = bar.dataset.filename + '.' + format.extension;
      link.click();
      URL.revokeObjectURL(link.href);
      status.textContent = 'Downloaded ' + link.download + '.';
    });
  }
})();
