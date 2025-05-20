import React, {useMemo} from 'react';

function getHighlightedText(text: string, highlights: string[], highlightWholeWords) {
  const hlower = highlights.map(s => s.toLowerCase());
  if (highlightWholeWords) {
    // Split text on whitespace, include term itself into parts, ignore case
    const parts = text.split(/\b|(?=\s)|(?<=\s)/);
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
  // Split text on highlight term, include term itself into parts, ignore case
  const parts = text.split(new RegExp(`(${highlights.join('|')})`, 'gi'));
  return <>
    {
      parts.map(
        (part, i) => (
          <React.Fragment key={i}>
          {
            hlower.includes(part.toLowerCase()) ? <span className='highlighted'>{part}</span> : part
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