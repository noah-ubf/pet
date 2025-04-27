import { useState } from 'react';
// import { makeStyles } from '@mui/styles';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import levenshtein from '../../utils/levenshtein';
import bookNames from '../../bibles/CUV/names.json';

// const useStyles = makeStyles((theme) => ({

// }));

const bibleOptions = Object.keys(bookNames).map((key) => ({
	key,
	variants: bookNames[key],
	title: bookNames[key][0],
}));

const BooksInput = ({ onChange }) => {
	// const classes = useStyles();
	const [value, setValue] = useState([]);
	const filterBooks = (options, sample) => {
		const nums = options
			.map((item) => {
				return {
					...item,
					weight: Math.min(...item.variants.map((s) => levenshtein(sample, s.toLowerCase?.())))
				};
			});
		const minVal = Math.min(...nums.map((n) => n.weight));
		const acceptable = nums.filter((n) => n.weight === minVal);
		return acceptable;
	}

	return <Autocomplete
	      multiple
	      id="fixed-tags-demo"
	      value={value}
	      onChange={(event, newValue) => {
	        setValue(newValue);
	        onChange?.(newValue);
	      }}
	      options={bibleOptions}
	      isOptionEqualToValue={(a, b) => a.key === b.key}
	      getOptionLabel={(option) => option.title}
	      renderTags={
	      	(tagValue, getTagProps) => {
		        return tagValue.map((option, index) => {
		          const { key, ...tagProps } = getTagProps({ index });
		          return (
		            <Chip
		              key={key}
		              label={option.title}
		              {...tagProps}
		            />
		          );
		        })
		      }
	      }
	      filterOptions={(options, {inputValue}) => {
	      	return filterBooks(options, inputValue.toLowerCase());
	      }}
	      style={{ width: '100%' }}
	      size={'small'}
	      renderInput={(params) => (
	        <TextField {...params} placeholder="" />
	      )}
	    />
}

export default BooksInput;