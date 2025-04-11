import Library from '../Library';
import WordsStats from '../Experiment/WordsStats';
import ScriptureList from '../Experiment/ScriptureList';
import Chapter from '../Chapter';
import { TScripture, TViews } from '../../types';
import bookNames from '../../bibles/CUV/names.json';

export const removeProperty = (dyProp: string) => ({ [dyProp]: _, ...rest }: any) => rest;

export const activateTab = (layout, activateId) => {
  const doIt = (node) => {
    if (node.tabs && node.tabs.find((tab) => tab.id === activateId)) { // TabBlock
      return { ...node, activeId: activateId };
    } else if (node.children) { // PanelBlock
      return { ...node, children: node.children.map(doIt) };
    }
    return node;
  }
  const newLayout = {
    ...layout,
    dockbox: doIt(layout.dockbox),
    floatbox: doIt(layout.floatbox),
  };
  return newLayout;
}

export const insertTab = (node, tab) => {
  if (node.tabs) {
    return { ...node, activeId: tab.id, tabs: [...node.tabs, tab] };
  }
  if (node.children?.length) {
    return {
      ...node,
      children: node.children.map((child, i) => {
        if (i === 0) return insertTab(child, tab);
        else return child;
      })
    };
  }

  return node;
};

export const parseScripture = (scripture: string): TScripture => {
  const parts = scripture?.split?.('-');
  const [book, chapter, verse1] = parts[0].split(/[.:]/);
  const verses = [verse1];
  if (parts[1]) {
    const [book2, chapter2, verse2] = parts[1].split('.');
    verses.push(verse2)
    console.log('***', {parts, book, chapter, verse1, book2, chapter2, verse2})
  }
  else console.log('***', {parts, book, chapter, verse1})
  return { book, chapter, verses };
};

export const parseHref = (href: string): TScripture => {
  const parts1 = href.split('/CUV/')[1].split('/')[0];
  const parts2 = href.split('?hl=')[1];
  return parseScripture(parts2 ?? parts1);
};

export const getId = ({ book, chapter }) => `(CUV)${book}.${chapter}`

export const viewFabric = (id, dockRef, handleRef, data: any = {}) => {
  if (id === 'library') {
    return {
      id,
      title: 'Library',
      content: <Library
        dockRef={dockRef}
        onShow={(book, chapter, verses, options) => handleRef.current.show({book, chapter, verses}, options)}
        onDragChapter={(e, data, buttonRef) => handleRef.current.drag(e, data, buttonRef)}
      />,
      closable: false
    };
  } else if (id === 'words_stats') {
    return {
      id,
      title: 'Stats',
      content: <WordsStats onShow={(scripture) => {
        handleRef.current.show(parseScripture(scripture), { newTab: true });
      }
      }/>,
      closable: false
    };
  } else if (id === 'experiment') {
    return {
      id,
      title: 'Experiment',
      content: <ScriptureList onShow={(scripture) => {
        handleRef.current.show(parseScripture(scripture), { newTab: true });
      }
      }/>,
      closable: false
    };
  } else if (id === 'default') {
    return {
      id,
      data,
      title: data.book ? `${bookNames[data.book][0]}.${data.chapter}` : 'Default',
      content: (
        <Chapter
          name={data.book ? `(CUV)${data.book}.${data.chapter}` : ''}
          data={data}
          onShow={(href) => handleRef.current.show(parseHref(href), { newTab: true })}
        />
      ),
      closable: false,
    };
  } else {
    return {
      id,
      data,
      title: `${bookNames[data.book][0]}.${data.chapter}`,
      content: (
        <Chapter
          name={id}
          data={data}
          onShow={(href)=>handleRef.current.show(parseHref(href), { newTab: true })}
        />
      ),
      closable: true,
    };
  }
}

export const prepareViewsToSave = (views: TViews) => {
  const preparedViews = {};
  for (const [id, view] of Object.entries(views)) { // eslint-disable-line
    preparedViews[id] = removeProperty('content')(view);
  }
  return JSON.stringify(preparedViews);
};

export const prepareViewsToLoad = (views: string, dockRef, handleRef) => {
  const restoredViews = JSON.parse(views) as TViews;
  for (const [id, view] of Object.entries(restoredViews)) { // eslint-disable-line
    restoredViews[id] = {
      ...view,
      ...viewFabric(id, dockRef, handleRef, view.data),
    };
  }
  // console.log('prepareViewsToLoad', restoredViews);
  return restoredViews;
};
