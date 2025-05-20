import React, {useMemo} from 'react';

function getHighlightedText(text: string, highlights: string[], highlightWholeWords) {
  const hlower = highlights.map(s => s.toLowerCase());
  // Split text on whitespace, include term itself into parts, ignore case
  const parts = highlightWholeWords
    ? text.split(/\b|(?=\s)|(?<=\s)|(?=[,.?!"])|(?<=[,.?!"])/gi)
    : text.split(new RegExp(`(${highlights.join('|')})`, 'gi'));
  console.log({ hlower, parts, text })
  return <>
    {
      parts.map(
        (part, i) => (
          <React.Fragment key={i}>
          {
            hlower.includes(part.toLowerCase())
              ? <span className='highlighted'>{part}</span>
              : part
          }
          </React.Fragment>)
      )
    }
  </>;
}

const HighlightedText = ({ text, highlights, highlightWholeWords=false }) => {  
  const ret = useMemo(
    () => getHighlightedText(text, highlights, highlightWholeWords),
    [text, highlights, highlightWholeWords]
  );
  return ret;
}

export default HighlightedText;