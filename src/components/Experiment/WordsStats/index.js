import React, { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { makeStyles } from '@mui/styles';
import { DividerBox } from 'rc-dock';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import { BooksInput } from '../../BooksInput';
import { getBookName, getWordsBySample, getWordsDetails, getWordsHash } from '../../../bibles/CUV';
import WordButton from './WordButton';

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
}));

const getDisplayName = (name) =>
	name.split('.', 2)[1]

const Experiment = ({onShow}) => {
	const classes = useStyles();
	const [books, setBooks] = useState([]);
	const [search, setSearch] = useState('');
	const [filteredWords, setFilteredWords] = useState([]);
	const [filteredDetails, setFilteredDetails] = useState({});
	const [word, setWord] = useState('');

	useEffect(() => {
		const sample = search.toLowerCase().replace('ʼ', "'");
			const filteredWords = getWordsBySample(sample, books).filter((_, i) => i < 50);
			setFilteredWords(filteredWords);

			const wordsDetails = getWordsDetails(filteredWords, books);
			setFilteredDetails(wordsDetails);
	}, [search, books]);

	const occurences = useMemo(() => {
		const [total, local] = [wordsHash, filteredDetails].map((source) => {
			return filteredWords
				.map((item) => source[item]?.occurences?.length)
				.reduce((partialSum, a) => partialSum + a, 0);
		});
		return { total, local };
	}, [filteredWords, filteredDetails]);

	const handleBooksChange = (e) => {
		setBooks(e.map(({key}) => key));
	}

	const handleFilter = (e) => {
		const value = e.target.value ?? '';
		setSearch(value)
	}

	const handleDetails = (word) => {
		setWord(word);
	}

	const handleRemove = (word) => {
		setFilteredWords(filteredWords.filter((w) => w !== word));
	}

	const details = useMemo(() => filteredDetails[word]?.occurences ?? [], [filteredDetails, word]);

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
			<TextField size={'small'} onChange={handleFilter} />
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
				filteredWords.map((word) => <div key={word} className={classes.wordWrapper}>
					<WordButton
						onClick={handleDetails}
						title={word}
						occurences={wordsHash[word]?.occurences}
						filteredOccurences={filteredDetails[word]?.occurences}
					/>
					<DeleteIcon fontSize={'small'} onClick={() => handleRemove(word)} />
				</div>)
			}
			</div>
			<div className={classes.linkList}>
				<strong>{word}</strong>
				<div className={classes.scrollable}>
				{
					details.map((caseRef, i) => (
						<React.Fragment key={i}>
							{renderBook(caseRef)}
							{ caseRef !== wordsHash[word].occurences[i-1] &&
								<button onClick={() => onShow(caseRef)}>
									{getDisplayName(caseRef)}
								</button>
							}
						</React.Fragment>
					))
				}
				</div>
			</div>
		</DividerBox>
		
	</div>
}

export default Experiment;