import bibleDataRaw from './bible.json';
import bookNamesRaw from './names.json';
import wordsHashRaw from './words.data.json';
import wordsSortedRaw from './words.json';
import { TBibleData, TBookNames, TWordsHash } from '../../types';

const bibleData: TBibleData = {
	...bibleDataRaw,
	books: bibleDataRaw.books.map((book) => ({
		...book,
		chapters: book.chapters.map((chapter) => ({
			...chapter,
			verses: chapter.verses.map((verse) => ({
				...verse,
				book: book.book,
				chapter: chapter.chapter,
			}))
		}))
	}))
};
const bookNames: TBookNames = bookNamesRaw;
const wordsHash: TWordsHash = wordsHashRaw;
const wordsSorted: string[] = wordsSortedRaw;

export function getBookName(shortName: string): string {
	return bookNames[shortName]?.[0];
}

export function getBookNames(): TBookNames {
	return bookNames;
}

export function getChapter(book, chapter) {
	const bookData = bibleData.books.find((item) => book === item.book);
	const chapterData = bookData.chapters.find((item) => chapter === item.chapter);
	return chapterData;
}

export function getVerses(book, chapter, verses) {
	const bookData = bibleData.books.find((item) => book === item.book);
	if (!bookData) return [{error: true, text: `Cannot find ${book}.${chapter}:${verses}`}]
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

export function getWordsDetails(words, books) {
	const details = {};
	words.forEach((w) => {
		const occurences = wordsHash[w]?.occurences ?? [];
		details[w] = {occurences: occurences.filter(occurencesWithBooknames(books))};
	});
	return details;
}

