import { expect, test } from 'vitest'
import { collate } from './collate'

const SHORT_LIST = ['ä', 'B', 'ø', 'A', 'a', 'æ', 'Z', '_x']

const LONG_LIST = [
  'Pink Floyd',
  'AC/DC',
  'The Beatles',
  'Daft Punk',
  'The Rolling Stones',
  'Bob Marley',
]

const KANJI_LIST = ['日本語', '仮名', 'ひらがな', 'カタカナ', '漢字']

test('sorts lists in a locale-sensitive manner', () => {
  const shortDE = collate(SHORT_LIST, 'de-DE')
  const shortSE = collate(SHORT_LIST, 'sv-SE')
  const kanji = collate(KANJI_LIST, 'ja-JP')
  const long = collate(LONG_LIST, 'en-US')

  expect(shortDE).toEqual(['_x', 'a', 'A', 'ä', 'æ', 'B', 'ø', 'Z'])
  expect(shortSE).toEqual(['_x', 'a', 'A', 'B', 'Z', 'ä', 'æ', 'ø'])
  expect(kanji).toEqual(['カタカナ', 'ひらがな', '仮名', '漢字', '日本語'])
  expect(long).toEqual([
    'AC/DC',
    'Bob Marley',
    'Daft Punk',
    'Pink Floyd',
    'The Beatles',
    'The Rolling Stones',
  ])
})

test('accepts various locale expressions', () => {
  const shortEN = collate(SHORT_LIST, 'en-US')

  const shortJapaneseJPAlternativeCalendar = collate(SHORT_LIST, 'ja-JP-u-ca-japanese')
  const shortBadLocaleWithFallback = collate(SHORT_LIST, ['bad-locale', 'en-US'])
  const shortMixedLocale = collate(SHORT_LIST, 'en-SE')

  expect(shortEN).toEqual(['_x', 'a', 'A', 'ä', 'æ', 'B', 'ø', 'Z'])
  expect(shortJapaneseJPAlternativeCalendar).toEqual(['_x', 'a', 'A', 'ä', 'æ', 'B', 'ø', 'Z'])
  expect(shortBadLocaleWithFallback).toEqual(['_x', 'a', 'A', 'ä', 'æ', 'B', 'ø', 'Z'])
  expect(shortMixedLocale).toEqual(['_x', 'a', 'A', 'ä', 'æ', 'B', 'ø', 'Z'])
})

test('modifies output with varying configurable options', () => {
  const shortENUpper = collate(SHORT_LIST, 'en-US', { caseFirst: 'upper' })
  const shortENBase = collate(SHORT_LIST, 'en-US', { sensitivity: 'base' })
  const shortENNoPunctuation = collate(SHORT_LIST, 'en-US', { ignorePunctuation: true })

  expect(shortENUpper).toEqual(['_x', 'A', 'a', 'ä', 'æ', 'B', 'ø', 'Z'])
  expect(shortENBase).toEqual(['_x', 'ä', 'A', 'a', 'æ', 'B', 'ø', 'Z'])
  expect(shortENNoPunctuation).toEqual(['a', 'A', 'ä', 'æ', 'B', 'ø', '_x', 'Z'])
})
