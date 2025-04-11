import { useRef } from 'react';
import { DragDropDiv } from 'rc-dock';
import { makeStyles } from '@mui/styles';
import { getId } from '../Layout/helpers';

const useStyles = makeStyles((theme) => ({
  root: {
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

const ChapterButton = ({data, dockRef, onClick, onDragStart}) => {
  const classes = useStyles();
  const buttonRef = useRef<DragDropDiv>(null);
  const handleDragStart = (e) => {
  	onDragStart(e, data, buttonRef);
  	// if (!buttonRef.current?.element) return;
    // console.log({data})
    // e.setData({
    //   tab: {id: getId(data), data},
    //   panelSize: [400, 300]
    // }, dockRef.current.getDockId());
    // e.startDrag(buttonRef.current?.element, buttonRef.current?.element);
  };

  return (
    <DragDropDiv ref={buttonRef} onDragStartT={handleDragStart}>
      <button
        className={classes.root}
        onClick={onClick}
      >
        { data.chapter }
      </button>
    </DragDropDiv>
  );
}

export default ChapterButton;