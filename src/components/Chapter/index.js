import React from 'react';
import { makeStyles } from '@mui/styles';
import Verse from '../Verse';
import { getChapter } from '../../bibles/CUV';

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
  heading: {
  	// background: 'silver',
  	fontWeight: 'bold',
  	padding: 4,
  },
}));

const Chapter = ({ name, data, onShow }) => {
	const classes = useStyles();
	const handleShow = (data) => {
		console.log('[1]', data);
		onShow(data)
	}
	if (!data.book) return (<div className={classes.root}></div>);
	const chapterData = getChapter(data.book, data.chapter)
	let heading = '';
	return <div className={classes.root}>
		<div className={classes.header}>
		 { '' }
		</div>
		<div className={classes.content}>
		{
			chapterData.verses.map((verse) => (
				<React.Fragment  key={verse.verse}>
					{heading===verse.heading ? null : (
						<div className={classes.heading}>{heading = verse.heading}</div>
					)}
					<div>
						<Verse name={name} data={verse} onShow={handleShow}/>
					</div>
				</React.Fragment>
			))
		}
		</div>
	</div>
};

export default Chapter;