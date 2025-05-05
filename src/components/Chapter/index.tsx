import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { getChapter, getPrevChapter, getNextChapter } from '../../bibles/CUV';
import ScriptureList from '../ScriptureList';
import { Button, ButtonGroup, Stack, TextField } from '@mui/material';
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
  console.log({data})
	const chapterData = getChapter(data.book, data.chapter)
  const prevChapter = getPrevChapter(data);
  const nextChapter = getNextChapter(data);
  const handlePrev = () => {
    onShow(prevChapter, {newTab: false});
  };
  const handleNext = () => {
    onShow(nextChapter, {newTab: false});
  };
	return <div className={classes.root}>
		<Stack spacing={2} direction="row" className={classes.header}>
      <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button variant="outlined" onClick={handlePrev} disabled={!prevChapter}><ArrowLeft/></Button>
        <Button variant="outlined" onClick={handleNext} disabled={!nextChapter}><ArrowRight/></Button>
      </ButtonGroup>
      <TextField
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        value={search}
        size="small"
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