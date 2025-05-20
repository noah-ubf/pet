import { act, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from '@mui/styles';
import HomeIcon from '@mui/icons-material/Home';
import DockLayout, { LayoutBase } from 'rc-dock';
import 'rc-dock/dist/rc-dock.css';
import defaultConfig from './defaultConfig';
import { TView, TViews, TOptions } from '../../types';
import {
  getId,
  removeProperty,
  activateTab,
  insertTab,
  prepareViewsToLoad,
  prepareViewsToSave,
  viewFabric,
  getBookAbbr,
} from './helpers';

const useStyles = makeStyles((theme) => ({
  defaultTitle: {
    fontWeight: 'bold',
    '& svg': {
      verticalAlign: 'top',
    },
  },
}));

const gatherIds = (layout) => {
  const ids = [];
  const doIt = (node) => {
    if (node.tabs) {
      node.tabs.forEach((tab) => ids.push(tab.id));
    } else if (node.children) {
      node.children.forEach(doIt);
    }
  };
  doIt(layout.dockbox);
  doIt(layout.floatbox);
  doIt(layout.maxbox);
  doIt(layout.windowbox);
  return ids;
}

const MyLayout = () => {
  const classes = useStyles();
  const dockRef = useRef<DockLayout>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const handleRef = useRef({
    show: (book, chapter, verse=null, optins?: TOptions) => {},
    drag: (e, data, buttonRef) => {},
  });
  const defaultViews: TViews = useMemo<TViews>(() => {
    return {
      library: viewFabric('library', dockRef, handleRef),
      words_stats: viewFabric('words_stats', dockRef, handleRef),
      experiment: viewFabric('experiment', dockRef, handleRef),
      default: viewFabric('default', dockRef, handleRef),
      tagged_list: viewFabric('tagged_list', dockRef, handleRef),};
  }, [dockRef, handleRef]);
  const [views, setViews] = useState<TViews>(defaultViews);
  const [layout, setLayout] = useState<LayoutBase>(defaultConfig as LayoutBase);
  // const [pinnedId, setPinnedId] = useState<string | null>(null);

  const renderTitle = useCallback((data) => {
    return (
      <div
        className={data.id === 'default' ? classes.defaultTitle : null}
      >
        { data.id === 'default' && (<HomeIcon fontSize='small'/>) }
        { views[data.id]?.title ?? data.id }
      </div>
    );
  }, [views, classes.defaultTitle]);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      const savedLayout = window.localStorage.getItem('dock_layout');
      const savedViews = window.localStorage.getItem('views');
      console.log('LOAD!!!!!!!!!!!!!!!!!!!!!!!!!!!', {savedLayout, savedViews})
      if (savedLayout && savedViews) {
        const preparedViews = prepareViewsToLoad(savedViews, dockRef, handleRef);
        const preparedLayout = JSON.parse(savedLayout);
        const idsInLayout = gatherIds(preparedLayout);
        const missingInLayout = Object.keys(preparedViews).filter((id) => !idsInLayout.includes(id));
        console.log({preparedViews, idsInLayout, missingInLayout});
        if (missingInLayout.length > 0) {
          preparedLayout.dockbox.children.push({
            id: '+1000000',
            // x: 300,
            // y: 200,
            // w: 400,
            // h: 300,
            size: 200,
            // z: 1,
            activeId: missingInLayout[0],
            tabs: missingInLayout.map((id) => ({
              id,
              ...preparedViews[id],
              title: renderTitle(preparedViews[id]),
              content: preparedViews[id].content,
              closable: preparedViews[id].closable,
            })),
          });
        }
        console.log({preparedLayout});
        setViews(preparedViews);
        setLayout(preparedLayout);
        // console.log('Layout loaded', savedLayout);
      }
    } else {
      console.log('SAVE!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      window.localStorage.setItem('dock_layout', JSON.stringify(dockRef.current.saveLayout()));
      window.localStorage.setItem('views', prepareViewsToSave(views));
      // console.log('Layout updated', layout);
    }
  }, [loaded, layout, setLayout, setLoaded, setViews, views, handleRef, renderTitle]);

  useEffect(() => {
    const newTab = viewFabric('default', dockRef, handleRef, views.default.data);
    dockRef.current.updateTab('default', newTab, true);
  }, [views.default]);

  const handleShow = useCallback(({book, chapter, verses}, options) => {
    book = getBookAbbr(book);
    console.log('handleShow:', {book, chapter, verses, options});
    const id = getId({book, chapter});
    const { layout } = dockRef.current?.state ?? {};

    if (!options.newTab) {
      const newData = { book, chapter };
      setViews({
        ...views,
        default: {...views.default, ...viewFabric('default', dockRef, handleRef, newData)},
      });
      return;
    }

    if (!views[id]) {
      const newTab = { id };
      const newChildren = layout.dockbox.children.length < 2
        ? [ ...layout.dockbox.children, {
            activeId: id,
            tabs: [newTab],
          } ]
        : layout.dockbox.children.map((child, index) => {
            if (index === 1) {
              return insertTab(child, newTab);
            }
            return child;
          });
      const newLayout = {
        ...layout,
        dockbox: {
          ...layout.dockbox,
          children: newChildren
        }
      };
      setLayout(newLayout);
      setViews({
        ...views,
        [id]: viewFabric(id, dockRef, handleRef, { book, chapter }),
      })
    } else {
      console.log('TAB EXISTS!!!', id);

      const newLayout = activateTab(layout, id);
      setLayout(newLayout);
    }
    if (verses?.[0]) {
      setTimeout(() => {
        const verseEls = [];
        const chId = id.replace(/[:().]/g, '_');
        const vStart = +verses[0];
        const vEnd = +verses[verses.length - 1];
        const tabEl = document.querySelector(`#${id}`);
        console.log({id, tabEl})
        for (let verseNum  = vStart; verseNum <= vEnd; verseNum++) {
          try{
            const vId = `#V${chId}_${verseNum}`;
            const verseEl = tabEl.querySelector(vId);
            if (verseEl) verseEls.push(verseEl);
          } catch(e) {}
        }
        if (verseEls[0]) verseEls[0].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        if (verseEls.length > 0) {
          const range = document.createRange();
          range.setStart(verseEls[0], 0);
          range.setEnd(verseEls[verseEls.length - 1], 1);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }, 100);
    }
  }, [ views, setViews ]);

  const handleDragChapter = useCallback((e, data, buttonRef) => {
    if (!buttonRef.current?.element) return;
    console.log({data})

    const id = getId(data);
    setViews({
      ...views,
      [id]: viewFabric(id, dockRef, handleRef, data),
    })

    e.setData({
      tab: {id, data},
    }, dockRef.current.getDockId());
    e.startDrag(buttonRef.current?.element, buttonRef.current?.element);
  }, [views]);

  useEffect(() => {
    handleRef.current = { show: handleShow, drag: handleDragChapter };
  }, [handleShow, handleDragChapter]);

  const loadTab = useCallback((data): TView => {
    if (!views[data.id]) console.log(`NEMA ${data.id}`)
    return {
      ...data,
      title: renderTitle(data),
      content: views[data.id]?.content || 'Empty',
      closable: views[data.id]?.closable,
    };
  }, [views, renderTitle]);

  const onLayoutChange = useCallback((newLayout, currentTabId, direction) => {
    console.log(currentTabId, layout, newLayout, direction);
    if (!views[currentTabId]?.closable && direction === 'remove') {
      alert('removal of this tab is rejected');
    } else if (direction === 'remove') {
      setLayout(newLayout);
      setViews(removeProperty(currentTabId)({...views}))
    } else if (loaded) {
      setLayout(newLayout);
    }
  }, [views, setViews, layout, setLayout]);

  return (
    <DockLayout
      ref={dockRef}
      layout={layout}
      loadTab={loadTab}
      onLayoutChange={onLayoutChange}
      style={{position: 'absolute', left: 10, top: 10, right: 10, bottom: 10}}
    />
  );
}

export default MyLayout;
