import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { getChapter } from '../../bibles/CUV';
import ScriptureList from '../ScriptureList';
import { Button, Stack, TextField } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    width: '100%',
    height: '100%',
  },
  header: {
    flexShrink: '0',
    flexGrow: '0',
    height: 'auto',
  },
  content: {
    flexGrow: '100',
    padding: 10,
    overflowY: 'auto',
  },
}));

const Chapter = ({ name, data, onShow }) => {
  const [search, setSearch] = useState('');
	const classes = useStyles();
	if (!data.book) return (<div className={classes.root}></div>);
	const chapterData = getChapter(data.book, data.chapter)
  const prev = data.chapter - 1;
  const next = data.chapter + 1;
  const prevChapter = prev > 0 ? `${data.book}.${prev}` : null;
  const nextChapter = next > `${data.book}.${next}`;
  const handlePrev = () => {
    onShow(prevChapter);
  };
  const handleNext = () => {
    onShow(nextChapter);
  };
	return <div className={classes.root}>
		<Stack spacing={2} direction="row" className={classes.header}>
      {/* <Button onClick={handlePrev} disabled={!prevChapter}><ArrowLeft/></Button>
      <Button onClick={handleNext} disabled={!nextChapter}><ArrowRight/></Button> */}
      <TextField
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        value={search}
      />
		</Stack>
		<div className={classes.content}>
			<ScriptureList
        highlights={search.split(' ')}
        filters={search.split(' ')}
				verses={chapterData.verses}
				showHeaders={true}
				onShow={onShow}
			/>
		</div>
	</div>
};

export default Chapter;