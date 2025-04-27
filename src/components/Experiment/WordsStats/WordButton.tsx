import { makeStyles } from '@mui/styles';	

const useStyles = makeStyles((theme) => ({
  word: {
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  	cursor: 'pointer',
  	width: 140,
  },
}));

const WordButton = ({title, occurences, filteredOccurences, onClick}) => {
	const classes = useStyles();
	return (
		<button className={classes.word} onClick={() => onClick?.(title)}>
			<strong>{title}</strong>
			<div>
			{
				filteredOccurences?.length === occurences?.length
				? occurences?.length
				: `${filteredOccurences?.length}/${occurences?.length}`
			}
			</div>
		</button>
	);
}

export default WordButton;