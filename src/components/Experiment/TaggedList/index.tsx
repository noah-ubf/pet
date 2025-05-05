import { useState } from "react"
import Verse from "../../Verse";
import { makeStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Container, TextField } from "@mui/material";
import { TVerse } from "../../../types";
import { getVerses } from "../../../bibles/CUV";
import { parseScripture } from "../../Layout/helpers";
import { generatePdf } from "./generatePdf";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    flexGrow: 2,
    height: '100%',
    overflow: 'auto',
  },
}));

type TItem = {
  tag: string
  scripture: string
  verses: TVerse[]
};

const TaggedList = () => {
	const classes = useStyles();
  const [items, setItems] = useState<TItem[]>([]);
  const [newData, setNewData] = useState<string>('');

  const handleNewDataChange = (e) => {
    setNewData(e.target.value);
  }

  const handleAdd = () => {
    const blocks = newData.split('\n\n').map((v) => v.trim()).filter((v) => v.length > 0);

    const newItems = [];

    blocks.forEach((block) => {
      const parts = block.split('\n');
      const tag = parts[0];
      const scriptures = parts.slice(1);

      scriptures.forEach((scripture) => {
        console.log({ scripture });
        const { book, chapter, verses } = parseScripture(scripture);
        if (!book || !chapter || !verses) {
          console.error('Invalid verse format');
          return;
        }
        newItems.push({
          tag,
          scripture,
          verses: getVerses(book, chapter, verses)
        });
      });
    });

    setItems([...items, ...newItems]);
  };

  const handleGeneratePdf = () => {
    generatePdf(items)
  }

  return <div className={classes.root}>
    {
      items.map((item, index) => (
        <div key={index}>
          <Container>
            <span>[{item.tag}] </span>
            <span>{item.scripture}</span>
            <DeleteIcon
              onClick={() => {
                const newItems = items.filter((_, i) => i !== index);
                setItems(newItems);
              }}
            />
          </Container>
          <div>
            {item.verses.map((verse, i) => (
              <Verse
                key={i}
                name={''}
                data={verse}
                onShow={undefined}
              />
            ))}
          </div>
        </div>
      ))
    }
    <div>
      <TextField
        fullWidth
        onChange={handleNewDataChange}
        defaultValue={''}
        multiline
        rows={10}
      />
      <Button onClick={handleAdd}>Add</Button>
    </div>
    <Button onClick={handleGeneratePdf}>Generate</Button>
    </div>;
}

export default TaggedList