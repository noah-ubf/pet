import React, { useMemo } from 'react';
import { makeStyles } from '@mui/styles';
import Verse from '../Verse';
import { TVerse } from '../../types';
import { getBookName } from '../../bibles/CUV';

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

type TScriptureListProps = {
	onShow: (string) => void
	verses: TVerse[]
	filters?: string[]
	highlights?: string[]
	showHeaders?: boolean
	showChapter?: boolean
	chapterLink?: boolean
};

const filterVerses = (verses, filters) => {
	if (!filters || filters.length === 0) return verses;
	return verses.filter((verse) => {
		const text = verse.fragments.filter((f) => f.text).map((f) => f.text).join(' ').toLowerCase();
		return filters.some((filter) => text.includes(filter.toLowerCase()));
	});
}

const ScriptureList = ({
	filters,
	highlights,
	onShow,
	verses,
	showHeaders,
	showChapter,
	chapterLink,
}: TScriptureListProps) => {
	const classes = useStyles();

	const versesToShow = useMemo(() => filterVerses(verses, filters), [verses, filters]);
	if (!versesToShow) return (<div className={classes.root}></div>);

	let heading = '';
	let book = '';
	let chapter = '';

	const renderChapter = (verse) => {
		if (!showChapter) return null;
		const verseBookName = getBookName(verse.book);
		if (book===verseBookName && chapter===verse.chapter) return null;
		book = verseBookName;
		chapter = verse.chapter;
		if (!book || !chapter) return null;
		const handler = (book, chapter) => () => onShow(`${book}.${chapter}`);
		if (chapterLink) {
			return <button className={classes.heading} onClick={handler(book, chapter)}>
				{book}.{chapter}
			</button>;
		}
		return <div className={classes.heading}>{book}.{chapter}</div>;
	}

	const renderHeading = (verse) => {
		if (!showHeaders || heading===verse.heading) return null;
		return <div className={classes.heading}>{heading = verse.heading}</div>;
	}

	return <div className={classes.root}>
		<div className={classes.header}>
		 { '' }
		</div>
		<div className={classes.content}>
		{
			versesToShow.map((verse) => (
				<React.Fragment  key={verse.descriptor}>
					{renderChapter(verse)}
					{renderHeading(verse)}
					<div>
						<Verse name={''} data={verse} highlights={highlights} onShow={onShow}/>
					</div>
				</React.Fragment>
			))
		}
		</div>
	</div>

}

export default ScriptureList;