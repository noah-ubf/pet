import { makeStyles } from '@mui/styles';
import Fragment from './Fragment';

const useStyles = makeStyles((theme) => ({
  VerseContent: {
    fontSize: '1rem',
  },
  content: {
		'& .highlighted': {
			background: 'yellow',
		},
		'& .highlighted:hover': {
			background: 'orange',
		},
  },
  verseNumber: {
  	display: 'inline-block',
  	color: 'blue',
  	textAlign: 'right',
  	width: 30,
  },
}));

const VerseContent = ({ data, onShow }) => {
	const classes = useStyles();
	return <div className={classes.VerseContent}>
		<div className={classes.content}>
			{!!data.verse && <span className={classes.verseNumber}>{data.verse}</span>}
			{!!data.verse && ' '}
			{
				data.fragments
				.filter((fragment) => !data.note)
				.map((fragment, i) => <Fragment key={i} data={fragment} onShow={onShow} />)
			}
		</div>
	</div>
};

export default VerseContent;