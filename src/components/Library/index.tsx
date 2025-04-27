import { useState, useCallback } from 'react';
import { makeStyles } from '@mui/styles';
import bibleDataRaw from '../../bibles/CUV/bible.json';
import bookNamesRaw from '../../bibles/CUV/names.json';
import { TBibleData } from '../../types';
import ChapterButton from './ChapterButton';

const bibleData: TBibleData = bibleDataRaw as TBibleData;
const bookNames: Record<string, string[] | undefined> = bookNamesRaw;

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
  book: {
  	border: '1px solid black',
  	cursor: 'pointer',
  	margin: 1,
  	'&:hover': {
  		background: 'grey',
  	}
  },
  chapters: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'stretch',
    // justifyContent: 'stretch',
    width: '100%',
    flexWrap: 'wrap',
  },
  chapter: {
  	display: 'inline-block',
  	padding: 2,
  	margin: 2,
  	border: '1px solid black',
  	cursor: 'pointer',
  	fontSize: '80%',
  	width: 22,
  	textAlign: 'center',
  	'&:hover': {
  		background: 'grey',
  	}
  },
}));

const defaultBook = bibleData.bookNames[0];
const defaultBookData = bibleData.books.find((b) => b.book === defaultBook);

const Library = ({ dockRef, onShow, onDragChapter }) => {
	const classes = useStyles();
	const [book, setBook] = useState(defaultBook);
	const [bookData, setBookData] = useState(defaultBookData);
	// const [chapter, setChapter] = useState(1);

	const handleSelectBook = useCallback((newBook) => {
		setBook(newBook);
		// setChapter(1);
		setBookData(bibleData.books.find((b) => b.book === newBook));
	}, []);

	const handleSelectChapter = useCallback((e, newChapter) => {
		// setChapter(newChapter);
		onShow?.(book, newChapter, null, { newTab: e.shiftKey || e.ctrlKey || e.altKey });
	}, [ onShow, book ]);

	return <div className={classes.root}>
		<header className={classes.header}>CUV</header>
		<div className={classes.content}>
			<div>
			{
				bibleData.bookNames.map((item) => (
					<div key={item}>
						<div
							className={classes.book}
							onClick={() => handleSelectBook(item)}
						>
							{ bookNames[item][0] }
						</div>
						{
							item === book ? (
								<div className={classes.chapters}>
								{
									bookData.chapters.map((item) => (
										<ChapterButton
										 	key={item.chapter}
										 	dockRef={dockRef}
											data = {{book, chapter: item.chapter}}
											onClick={(e) => handleSelectChapter(e, item.chapter)}
											onDragStart={onDragChapter}
										/>
									))
								}
								</div>
							) : null
						}
					</div>
				))
			}
			</div>
		</div>
	</div>;
}

export default Library;