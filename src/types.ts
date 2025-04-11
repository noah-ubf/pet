export type TScripture = {
  book: string,
  chapter: string,
  verses?: string[]
};

export type TView = {
  title: string | JSX.Element,
  content: JSX.Element,
  closable: boolean,
  data?: any,
};

export type TViews = Record<string, TView>;

export type TOptions = Record<'newTab', boolean>;

//------------------

export type TRef = {
    href: string
    text: string
};

export type TFragment = {
    ref: string
    href: string
    text: string
    inserted: boolean
    lordsName: boolean
    strong: boolean
    italic: boolean
};

export type TVerse = {
    book: string
    chapter: string
    verse: number
    heading?: string
    parallel?: TRef[]
    fragments: TFragment[]
};

export type TChapter = {
    chapter: string
    verses: TVerse[]
};

export type TBook = {
    book: string
    chapters: TChapter[]
};

export type TBibleData = {
    version: string
    bookNames: string[]
    books: TBook[]
};

//------------------

export type TBookNames = Record<string, string[]>;

export type TOccurences = string[];

export type TWordRecord = {
  word: string,
  occurences: TOccurences,
};

export type TWordsHash = Record<string, TWordRecord>;