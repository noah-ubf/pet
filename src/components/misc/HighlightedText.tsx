import React, {useMemo} from 'react';

function getHighlightedText(text: string, highlights: string[]) {
  const hlower = highlights.map(s => s.toLowerCase());
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

const HighlightedText = ({ text, highlights }) => {  
  const ret = useMemo(() => getHighlightedText(text, highlights), [text, highlights]);
  return ret;
}

export default HighlightedText;