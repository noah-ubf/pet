import React, { useCallback, useMemo, useRef, useState, layoutRef } from 'react';
import { makeStyles } from '@mui/styles';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { parseDescriptor } from '../../../utils/descriptor';
import { getVerses } from '../../../bibles/CUV';
import Verse from '../../Verse';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    width: '100%',
    height: '100%',
  },
  heading: {
  	// background: 'silver',
  	fontWeight: 'bold',
  	padding: 4,
  },
}));

const ScriptureList = ({onShow}) => {
	const classes = useStyles();
  const [sample, setSample] = useState('');
	const [value, setValue] = useState('');

	const result = useMemo(() => {
		console.log({value}, parseDescriptor(value))
		const parsed = parseDescriptor(value);
		return parsed
			.map((item) => getVerses(item.book, item.chapter, item.verses))
			.reduce((acc, item) => [...acc, ...item], []);
	}, [value]);

	const handleShow = useCallback(() => {}, []);

	let heading = '';
	let book = '';
	let chapter = '';

	const renderChapter = (verse) => {
		if (book===verse.book && chapter===verse.chapter) return null;
		book = verse.book;
		chapter = verse.chapter;
		if (!book || !chapter) return null;
		return <div className={classes.heading}>{book}.{chapter}</div>;
	}

	const renderHeading = (verse) => {
		if (heading===verse.heading) return null;
		return <div className={classes.heading}>{heading = verse.heading}</div>;
	}

	return <div className={classes.root}>
		<div>
			<TextField onChange={(e) => setValue(e.target.value)}	/>
		</div>
		<div>
		{
			result.map((verse) => (
				<React.Fragment key={verse.verse}>
					{ renderChapter(verse) }
					{ renderHeading(verse) }
					<div>
						<Verse name={'-'} data={verse} onShow={handleShow}/>
					</div>
				</React.Fragment>
			))
		}
		</div>
	</div>
}

export default ScriptureList;