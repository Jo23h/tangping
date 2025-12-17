import React from 'react';
import { parseMemoText } from './memoTextParser';

function MemoPreview({ memo }) {
  if (!memo) return null;

  return (
    <div className='memo-preview' style={{ display: 'block' }}>
      {parseMemoText(memo).map((part, index) => {
        if (part.type === 'tag') {
          return (
            <span key={index} className='memo-tag'>
              {part.content}
            </span>
          );
        } else {
          return <span key={index} style={{ whiteSpace: 'pre-wrap' }}>{part.content}</span>;
        }
      })}
    </div>
  );
}

export default MemoPreview;
