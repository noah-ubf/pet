const defaultConfig = {
  dockbox: {
    mode: 'horizontal',
    children: [
      {
        tabs: [
          {id: 'library', title: 'Library'},
          {id: 'words_stats', title: 'Stats'},
          {id: 'experiment', title: 'Experiment'},
        ]
      },
      {
        tabs: [
          {id: 'default', title: 'Reading'},
        ],
      },
    ]
  }
};

export default defaultConfig;