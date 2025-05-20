import React, { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { makeStyles } from '@mui/styles';
import { DividerBox } from 'rc-dock';
import TextField from '@mui/material/TextField';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { BooksInput } from '../../BooksInput';
import {
	orderScriptures,
	getBookName,
	getWordsBySample,
	getWordsDetails,
	getWordsHash,
	getBookChapterCount,
	getVerse,
} from '../../../bibles/CUV';
import WordButton from './WordButton';
import ChapterSelector from './ChapterSelector';
import { Switch } from '@mui/material';
import Verse from '../../Verse';

const wordsHash = getWordsHash();

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    flexGrow: 2,
    height: '100%',
    overflow: 'hidden',
  },
  panel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  wordList: {
  	whiteSpace: 'nowrap',
  	padding: 10,
  	overflowY: 'auto',
    flexGrow: 1,
  	minWidth: 160,
  },
  wordWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    flexGrow: 2,
    // height: '100%',
    overflow: 'hidden',
  },
  scrollable: {
  	overflowY: 'auto',
  	padding: 10,
  	flexGrow: 1,
  },
	stretched: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	wideInput: {
		flexGrow: 1,
		marginLeft: 20,
	},

}));

const getDisplayName = (name) =>
	name.split('.', 2)[1]

const Experiment = ({onShow}) => {
	const classes = useStyles();
	const [books, setBooks] = useState([]);
	const [chapters, setChapters] = useState([]);
	const [minWordLength, setMinWordLength] = useState(1);
	const [search, setSearch] = useState('');
	const [filteredWords, setFilteredWords] = useState([]);
	const [filteredDetails, setFilteredDetails] = useState({});
	const [words, setWords] = useState([]);
	const [showTexts, setShowTexts] = useState(false);

	useEffect(() => {
		const sample = search.toLowerCase().replace('ʼ', "'");
			const filteredWords = getWordsBySample(sample, books, chapters)
				.filter((w) => w.length >= minWordLength);

			const wordsDetails = getWordsDetails(filteredWords, books, chapters);
			setFilteredDetails(wordsDetails);
			setFilteredWords(filteredWords.sort((a, b) => {
				const aCount = wordsDetails[a]?.occurences?.length ?? 0;
				const bCount = wordsDetails[b]?.occurences?.length ?? 0;
				if (aCount === bCount) {
					return a.localeCompare(b);
				}
				return bCount - aCount;
			}));
	}, [search, books, chapters, minWordLength]);

	const occurences = useMemo(() => {
		const [total, local] = [wordsHash, filteredDetails].map((source) => {
			return filteredWords
				.map((item) => source[item]?.occurences?.length)
				.reduce((partialSum, a) => partialSum + a, 0);
		});
		return { total, local };
	}, [filteredWords, filteredDetails]);

	const chapterCount = useMemo(() => {
		if (books.length !== 1) return 0
		const book = books[0];
		return getBookChapterCount(book);
	}, [books]);

	const handleBooksChange = (e) => {
		setBooks(e.map(({key}) => key));
		setChapters([]);
	}

	const handleMinWordLength = (e) => {
		const value = e.target.value ?? '';
		const length = parseInt(value);
		if (length > 0) {
			setMinWordLength(length);
		} else {
			setMinWordLength(1);
		}
	}

	const handleFilter = (e) => {
		const value = e.target.value ?? '';
		setSearch(value)
	}

	const handleDetails = (word) => {
		setWords([word]);
	}

	const handleToggleWord = (word) => {
		if (words.includes(word)) {
			setWords(words.filter((item) => item !== word));
		} else {
			setWords([...words, word]);
		}
	}

	const handleChaptersChange = (e) => {
		console.log({e})
		setChapters(e);
	}

	const details = useMemo(() => {
		const occurences = words.reduce((acc, item) => {
			const occurences = filteredDetails[item]?.occurences ?? [];
			return [...acc, ...occurences];
		}, []);
		const vals = new Set(occurences).values();
		return [...vals].sort(orderScriptures);
	}, [filteredDetails, words]);

	let currBook = '';

	const renderBook = (name) => {
		const book = name.split('.', 2)[0];
		if (currBook !== book) {
			currBook = book;
			return <div><strong>{getBookName(book) ?? book}</strong></div>;
		}
		return null;
	}

	return <div className={classes.root}>
		<Box>
			<BooksInput onChange={handleBooksChange} />
			<ChapterSelector chapters={chapters} count={chapterCount} onChange={handleChaptersChange} />
			<Box className={classes.stretched}>
				{'фільтр: '}
				<TextField size={'small'} onChange={handleFilter} value={search} className={classes.wideInput}/>
			</Box>
			<Box className={classes.stretched}>
				{'мін. довжина слова: '}
				<TextField type='number' size={'small'} onChange={handleMinWordLength} value={minWordLength}/>
				<Box>{' '}</Box>
				{'показувати тексти:'}
				<Switch
					size='small'
					value={false}
					onChange={(e) => {
						setShowTexts(e.target.checked);
					}}
					checked={showTexts}
					inputProps={{ 'aria-label': 'controlled' }}
				/>
			</Box>
			<Badge>
				{'всього: '}
				{
					occurences.local===occurences.total
					? occurences.total
					: `${occurences.local}/${occurences.total}`
				}
			</Badge>
		</Box>
		<DividerBox mode='horizontal' style={{width: '100%', minWidth: 200, overflow: 'hidden'}}>
			<div className={classes.wordList}>
			{
				filteredWords.filter((_, i) => i < 150).map((word) => <div key={word} className={classes.wordWrapper}>
					<WordButton
						onClick={handleDetails}
						title={word}
						occurences={wordsHash[word]?.occurences}
						filteredOccurences={filteredDetails[word]?.occurences}
					/>
					{ words.length > 0 && (
							words.includes(word)
							? <CheckCircleIcon color='primary' fontSize={'small'} onClick={() => handleToggleWord(word)} />
							: <RadioButtonUncheckedIcon fontSize={'small'} onClick={() => handleToggleWord(word)} />
						)
					}
				</div>)
			}
			</div>
			<div className={classes.linkList}>
				<div>
					<strong>{words.join(', ')}</strong>
					{details.length > 0 && ` (${details.length})`}
				</div>
				<div className={classes.scrollable}>
				{
					details.filter((_, i) => i < 1000).map((scripture, i) => (
						<React.Fragment key={i}>
							{renderBook(scripture)}
							{ //scripture !== wordsHash[word].occurences[i-1] &&
								<button onClick={() => onShow(scripture)}>
									{getDisplayName(scripture)}
								</button>
							}
							{
								showTexts && (
									<Verse name={''} data={getVerse(scripture)} highlights={words} highlightWholeWords={true}/>
								)
							}
						</React.Fragment>
					))
				}
				{details.length > 1000 && <div>...</div>}
				</div>
			</div>
		</DividerBox>
		
	</div>
}

export default Experiment;