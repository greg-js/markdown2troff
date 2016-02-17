'use strict';

module.exports = convert;

/**
 * Takes a markdown string and returns a troff string
 * @param {String} md
 * @returns {String} troff
 **/
function convert(md, opts) {
  var lines = md.split('\n');

  var result = [];

  var options = {
    name: opts.name || '',
    section: opts.section || 1,
    description: opts.description || '',
    date: opts.date || (new Date()).toISOString(),
    version: opts.version || '1',
    manual: opts.manual || '',
  };

  var codeOpen = false;

  // header
  result.push(
    '.TH "' + options.name + '" "' + options.section + '" "' + options.date + '" "' + options.version + '" "' + options.manual + '"\n'
  );

  // top
  result.push(
    '.SH "NAME"\n'
  );

  result.push(
    '\\fB' + opts.name + '\\fR\n.P'
  );

  // parse the markdown file
  lines.forEach(function walkThroughMd(line) {

    if (/^#{2} (.+)/.test(line)) {       // section headers
      result.push(line.replace(/^## (.+)/, function makeSH(re, title) {
        return '.SH "' + title.toUpperCase() + '"\n';
      }));
    } else if (/^#{3,6} (.+)/.test(line)) {      // subsection headers
      result.push(line.replace(/^#{3,6} (.+)/, '.RS 0\n.SS "$1"\n'));
    } else if (/^$/.test(line)) {      // newlines
      result.push('.P\n');
    } else if (/^( *)?\* {3}\[(\d.+?)\]\((.+?)\)$/.test(line)) {    // TOC
      result.push(line.replace(/^( *)?\* {3}\[(.+?) (.+?)\]\((.+?)\)$/, '$1\\fB$2\\fR  $3\n.br'));
    } else if (/^```/.test(line)) {
      if (!codeOpen) {
        result.push('.RS 2');
        result.push('.nf');
      } else {
        result.push('.fi');
        result.push('.RE');
      }
      codeOpen = !codeOpen;
    } else if (/^\* {3}(.+)/.test(line)) {         // unordered lists
      result.push(line.replace(/^\* {3}(.+)$/, '.RS 0\n.IP \\(bu 4\n$1'));
    } else if (/^\d\. {2}(.+)/.test(line)) {       // ordered lists
      result.push(line.replace(/^\d\. {2}(.+)/, '.RS 0\n.IP \\[->] 4\n$1'));
    } else {
      if (codeOpen) {
        result.push('NOREPLACE' + line);
      } else {
        result.push(line);
      }
    }
  });

  return result.map(function inlineReplace(line) {
    var cur;

    if (/^NOREPLACE/.test(line)) {
      cur = line.replace(/^NOREPLACE(.+)$/, '$1').replace(/\\/g, '\\[rs]');
    } else {
      // get rid of links and images
      cur = line.replace(/\[(.+?)\]\((.+?)\)/g, '\\fB$1\\fR').replace(/!\[.+?\]\((.+?)\)/g, '');

      // escape backslashes and dashes
      cur = cur.replace(/\\/g, '\\').replace(/\-/g, '\-');

      // inline code
      cur = cur.replace(/`(.+?)`/g, '\\fB$1\\fR');

      // bold
      cur = cur.replace(/\*\*(.+?)\*\*/g, '\\fB$1\\fR');

      // italics  TODO: change the underlying markdown to use * instead of _
      cur = cur.replace(/\*{1}([^ ]+?)\*{1}/g, '\\fI$1\\fR');
    }

    return cur;
  }).join('\n');
}
