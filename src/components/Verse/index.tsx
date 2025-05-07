import { makeStyles } from '@mui/styles';
import Tooltip from '@mui/material/Tooltip';
import LinkIcon from '@mui/icons-material/Link';
import Fragment from './Fragment';
import VerseContent from './VerseContent';

const useStyles = makeStyles((theme) => ({
  Verse: {
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
  error: {
  	color: 'red',
  	border: 'solid red 1px',
  },
}));

const Verse = ({ name, data, highlights=undefined, onShow }) => {
	const classes = useStyles();
	const elId = `V_CUV_${data.descriptor?.replace?.(/[:().]/g, '_') ?? ''}`;
	if (data.error) return (
		<div className={classes.error}>{data.text}</div>
	);
	return <div className={classes.Verse} id={elId}>
		<div className={classes.content}>
			{!!data.verse && <span className={classes.verseNumber}>{data.verse}</span>}
			{!!data.parallel &&
				<Tooltip title={<VerseContent data={{fragments: data.parallel}} onShow={onShow} />} >
					<LinkIcon fontSize='small' color='info' />
				</Tooltip>
			}
			{!!data.verse && ' '}
			{
				data.fragments.map((fragment, i) => (
					<Fragment key={i} onShow={onShow} data={fragment} highlights={highlights} />
				))
			}
		</div>
	</div>
};

export default Verse;