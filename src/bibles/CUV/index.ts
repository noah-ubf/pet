import bibleDataRaw from './bible.json';
import bookNamesRaw from './names.json';
import wordsHashRaw from './words.data.json';
import wordsSortedRaw from './words.json';
import { parseScripture } from '../../components/Layout/helpers';
import { TBibleData, TBookNames, TChapter, TVerse, TWordsHash } from '../../types';
import levenshtein from '../../utils/levenshtein';

const bibleData: TBibleData = {
	...bibleDataRaw,
	books: bibleDataRaw.books.map((book) => ({
		...book,
		chapters: book.chapters.map((chapter) => ({
			...chapter,
			descriptor: `${book.book}.${chapter.chapter}`,
			verses: chapter.verses.map((verse) => ({
				...verse,
				descriptor: `${book.book}.${chapter.chapter}:${verse.verse}`,
				book: book.book,
				chapter: chapter.chapter,
			}))
		}))
	}))
} as TBibleData;
const bookNames: TBookNames = bookNamesRaw;
const wordsHash: TWordsHash = wordsHashRaw as TWordsHash;
const wordsSorted: string[] = wordsSortedRaw;

export function getBookName(shortName: string): string {
	if (!bookNames.names.includes(shortName)) return '';
	return bookNames[shortName]?.[0];
}

export function getBookNames(): TBookNames {
	return bookNames;
}

export function getChapter(book, chapter): TChapter {
	const bookData = bibleData.books.find((item) => book === item.book);
	const chapterData = bookData.chapters.find((item) => `${chapter}` === item.chapter);
	return chapterData;
}

export function getPrevChapter(data) {
  if (!data.book) return null;
  if (+data.chapter > 1) {
    return { ...data, chapter: `${+data.chapter - 1}`};
  }
	const bookIndex = bookNames.names.indexOf(data.book);
	if (bookIndex > 0) {
		const newBook = bookNames.names[bookIndex - 1]
		const bookData = bibleData.books.find((item) => item.book === newBook);
		const chapter = bookData.chapters.length;
		return { book: newBook, chapter };
	}
	return null;
};

export function getNextChapter(data) {
  if (!data.book) return null;
	const bookData = bibleData.books.find((item) => item.book === data.book);
	if (data.chapter < bookData.chapters.length) {
		return { ...data, chapter: `${+data.chapter + 1}`};
	}
	const bookIndex = bookNames.names.indexOf(data.book);
	if (bookIndex < bookNames.names.length - 1) {
		const newBook = bookNames.names[bookIndex + 1]
		return { book: newBook, chapter: "1" };
	}
	return null;
};


export function getVersesByScripture(scriptureList: string[]): TVerse[] {
	return scriptureList.map((scripture) => {
		const {book, chapter, verses} = parseScripture(scripture);
		return getVerses(book, chapter, verses);
	}).reduce((acc, item) => [...acc, ...item], []);
}

const getVerseError = (text) => ({
	error: true,
    descriptor: '',
	fragments: [{
	    ref: null,
	    href: null,
	    text,
	    inserted: false,
	    lordsName: false,
	    strong: false,
	    italic: false,
	}],
    book: '',
    chapter: '',
    verse: null,
});

export function getVerses(book, chapter, verses): TVerse[] {
	const bookData = bibleData.books.find((item) => book === item.book);
	if (!bookData) return [getVerseError(`Cannot find ${book}.${chapter}:${verses.join('-')}`)]
	const chapterData = bookData.chapters.find((item) => chapter === item.chapter);
	const vStart = verses[0] ?? '1';
	const vEnd = verses[1] ?? verses[0];
	const verseList = chapterData.verses.filter((v) => v.verse >= vStart && v.verse <= vEnd);
	return verseList;
}

const occurencesWithBooknames = (books) => (scripture) => {
	if (books.length === 0) return true;
	const bookName = scripture.split('.')[0];
	return books.includes(bookName);
}

export function getWordsHash() {
	return wordsHash;
}

export function getWordsBySample(sample, books = []) {
	return wordsSorted
		.filter((w) => w.replace('’', "'").indexOf(sample) !== -1)
		.filter((w) => {
			if (sample === '' || books.length === 0) return true;
			return wordsHash[w].occurences.some(occurencesWithBooknames(books));
		})
}

export function getClosestWord(word: string): string {
	const closest = wordsSorted
		.filter((w) => w.replace('’', "'").indexOf(word) !== -1)
		.map((w) => ({w, distance: levenshtein(word, w)}))
		.filter((item) => item.distance < 3)
		.sort((a, b) => a.distance - b.distance)
		.map((item) => item.w);

	if (closest[0]) return closest[0];
	return word;
}

export function getWordsDetails(words: string[], books: string[]): Record<string, { occurences: string[] }> {
	const details = {};
	words.forEach((w) => {
		const occurences = wordsHash[w]?.occurences ?? [];
		details[w] = { occurences: occurences.filter(occurencesWithBooknames(books)) };
	});
	return details;
}


const intersection = (setA: Set<string>, setB: Set<string>): Set<string> => {
	const result = new Set<string>();
	setA.forEach((value) => {
		if (setB.has(value)) {
			result.add(value);
		}
	});
	return result;
};

export function searchVerses(searchParts: string[], books: string[]): [string[], TVerse[]] {
		const occurencesLists = searchParts
			.map((word) => {
				const wlower = word.replace('’', "'").toLowerCase();
				const words = wordsSorted.filter((w) => w.indexOf(wlower) !== -1);
				const details = getWordsDetails(words, books);
				const occurences = Object.values(details)
					.reduce((acc, item) => [...acc, ...item.occurences], []);
				return Array.from(new Set<string>(occurences));
			});

		const scriptureSets: Set<string>[] = occurencesLists
			.map((occurences) => new Set(occurences));

		const ret = scriptureSets
			.reduce((acc: Set<string> | null, item: Set<string>) =>
				acc === null ? item : intersection(acc, item), null) ?? [];

		const scriptures: string[] = Array.from(ret);

		return [scriptures, getVersesByScripture(scriptures)];
	}
