import { useState, useCallback, ComponentType } from 'react';
import { makeStyles } from '@mui/styles';
import classname from 'classname';
import Tooltip from '@mui/material/Tooltip';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Verse from './index';
import VerseContent from './VerseContent';

const useStyles = makeStyles((theme) => ({
  italic: {
  	fontStyle: 'italic',
  },
	strong: {
		fontWeight: 'bold',
	},
	lordsName: {
		fontWeight: 'bold',
		textTransform: 'uppercase',
		fontSize: '78%',
		color: 'maroon',
	},
}));

type Props = {
	data: any,
  onShow: (string) => {},
};

const Fragment: ComponentType<Props> = ({data, onShow}: Props) => {
	const classes = useStyles();
	const textClasses = classname({
		[classes.italic]: data.italic || data.inserted,
		[classes.strong]: data.strong,
		[classes.lordsName]: data.lordsName,
	});

	if (data.href) return <button onClick={() => onShow?.(data.href)}>{data.text}</button>;
	if (data.tag === 'BR') {
		return <br/>;
	}
	if (data.text) {
		return <span className={textClasses}>{data.text}</span>;
	}
	if (data.note) return <Tooltip title={<VerseContent data={data.note} onShow={onShow} />}>
		<LightbulbIcon fontSize='small' color='info'/>
	</Tooltip>;

	return <></>;
};

export default Fragment;