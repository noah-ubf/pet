import React, { useMemo, useState } from 'react';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import { BooksInput } from '../BooksInput';
import { searchVerses } from '../../bibles/CUV';
import ScriptureList from '../ScriptureList';

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
  content: {
  	flexGrow: 100,
  	overflow: 'auto',
  },
}));

const Search = ({ onShow }) => {
	const classes = useStyles();
	const [books, setBooks] = useState([]);
	const [search, setSearch] = useState('');
	const searchParts = useMemo(() => search
		.split(' ')
		.map((s) => s.trim())
		.filter((word) => word.length >= 3)
	, [search]);

	const [scriptures, verses] = useMemo(
		() => searchVerses(searchParts, books),
		[searchParts, books]
	);

	const handleBooksChange = (e) => {
		setBooks(e.map(({key}) => key));
	}

	const handleFilter = (e) => {
		const value = e.target.value ?? '';
		setSearch(value)
	}

	return <div className={classes.root}>
		<div>
			<BooksInput onChange={handleBooksChange} />
		</div>
		<div>
			<TextField fullWidth onChange={handleFilter}	/>
		</div>
		<div className={classes.content}>
			<ScriptureList
				verses={verses}
				highlights={searchParts}
				onShow={onShow}
				showChapter={true}
			/>
		</div>
	</div>
}

export default Search;