import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';	
import classnames from 'classnames';
import CancelIcon from '@mui/icons-material/Cancel';

const useStyles = makeStyles((theme) => ({
	chapters: {
    lineHeight: '1em',
  },
	chapter: {
		display: 'inline-block',
    backgroundColor: '#eef',
		border: '1px solid #ccc',
		width: 15,
		height: 15,
		fontSize: 8,
		overflow: 'hidden',
	},
  active: {
		backgroundColor: '#8f8',
  },
}));

const ChapterSelector = ({chapters, count, onChange}) => {
  const classes = useStyles();
  const [choice, setChoice] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  const chapterList = useMemo(() => [...Array(count).keys()].map((i) => i + 1), [count]);

  useEffect(() => {
    if (chapters[0] && chapters[1]) {
      setStart(chapters[0]);
      setEnd(chapters[1]);
    } else if (chapters[0]) {
      setStart(chapters[0]);
      setEnd(chapters[0]);
    } else {
      setStart(0);
      setEnd(0);
    }
  }, [chapters[0], chapters[1]]);

  const handleDown = (e, chapter) => {
    e.preventDefault();
    setStart(chapter);
    setEnd(chapter);
    setChoice(true);
  };

  const handleOver = (e, chapter) => {
    e.preventDefault();
    if (choice) setEnd(chapter);
  };

  const handleUp = (e) => {
    e.preventDefault();
    setChoice(false);
    if (start === 0 || end === 0) {
      onChange([]);
      return;
    }
    if (start > end) {
      onChange([end, start]);
      return;
    }
    onChange([start, end]);
  };

  const handleClear = (e) => {
    e.preventDefault();
    setStart(0);
    setEnd(0);
    onChange([]);
  }

  const isActive = (chapter) => {
    if (start > end) {
      return chapter >= end && chapter <= start;
    }
    return chapter >= start && chapter <= end;
  }

  if (count > 0) {
    return <Box>
      {'розділи: '}
      <div className={classes.chapters} onMouseLeave={handleUp}>
        { chapterList.map((chapter) => (
          <div
            key={chapter}
            className={classnames(classes.chapter, {[classes.active]: isActive(chapter)})}
            onMouseDown={(e) => handleDown(e, chapter)}
            onMouseUp={handleUp}
            onMouseOver={(e) => handleOver(e, chapter)}
          >
            {chapter}
          </div>
        ))}
        <CancelIcon fontSize='small' onClick={handleClear}/>
      </div>
    </Box>
  }
  return null;
}

export default ChapterSelector;